'use server';
import { revalidatePath, unstable_noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { checkIfGeocodeExists, geocode, saveGeocode } from './geocode';
import { optimizeRoute } from './routeServices';
import { getUserId } from './common';
import { Job } from '../definitions';

// This is temporary until @types/react-dom is updated
export type State = {
    errors?: {
        team?: string[];
        title?: string[];
        member?: string[];
        file?: string[];
    };
    message?: string | null;
};

const ITEMS_PER_PAGE = 10;

/* Jobs Actions */
const JobFormSchema = z.object({
    id: z.string(),
    title: z.string(),
    team: z.string(),
    member: z.string(),
    file: z.object({
        name: z.string(),
        type: z.string(),
        size: z.number(),
    }),
});

const CreateJob = JobFormSchema.omit({ id: true });

// TODO Get origin and destination from the user
var origin = { lat: 41.328676, lng: 36.294753 };
var destination = { lat: 41.328676, lng: 36.294753 };

export async function createJob(prevState: State, formData: FormData) {
    const validatedFields = CreateJob.safeParse({
        title: formData.get('title'),
        team: formData.get('team'),
        member: formData.get('member'),
        file: formData.get('file') as File
    })

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Job.',
        };
    }

    const user_id = await getUserId();

    const { title, team, member } = validatedFields.data;

    const file = formData.get('file') as File;

    const dateCreated = new Date().toISOString();
    const status = 'active';

    const { parse } = require('csv-parse');
    const iconv = require('iconv-lite');

    // handle csv file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = iconv.decode(Buffer.from(arrayBuffer), 'iso-8859-9');

    const records: {
        name: string;
        address: string;
        phone: string;
        latitude: number;
        longitude: number;
        barcode: string;
    }[] = [];

    parse(buffer, {
        trim: true,
        skip_empty_lines: true,
        columns: true
    })
        // Use the readable stream api
        .on('readable', async function (this: any) {
            let record; while ((record = this.read()) !== null) {

                const response: any = await checkIfGeocodeExists(record.AliciUnvan, record.AliciAdres);
                if (response) {
                    record['latitude'] = response?.latitude;
                    record['longitude'] = response?.longitude;
                } else {
                    const { lat, lng } = await geocode(record.AliciAdres);
                    record['latitude'] = lat;
                    record['longitude'] = lng;
                    await saveGeocode(record.AliciUnvan, record.AliciAdres, lat, lng);
                }
                records.push({
                    name: record.AliciUnvan,
                    address: record.AliciAdres,
                    phone: record.AliciTelefon,
                    latitude: record.latitude,
                    longitude: record.longitude,
                    barcode: record.BarkodNo
                });
            }
        })
        .on('end', async function () {

            // insert job to database
            const job_id = await insertJob(title, team, user_id, member, dateCreated, status);

            // insert deliveries to database
            await insertDeliveries(job_id, records);

            const insertedDeliveries = await getDeliveriesByJobId(job_id);

            const optimizedRoute = await optimizeRoute({
                start: origin,
                end: destination,
                waypoints: insertedDeliveries
            });

            // update deliveries order
            await updateDeliveriesOrder(optimizedRoute.routes[0].steps);

        });


    revalidatePath('/dashboard/jobs');
    redirect('/dashboard/jobs');

}

export async function insertJob(title: string, team: string, from_user: string, to_user: string, date_created: string, status: string) {
    try {
        const query = await sql`
        INSERT INTO jobs (title, team, from_user, to_user, date_created, status)
        VALUES (${title}, ${team}, ${from_user}, ${to_user}, ${date_created}, ${status})
        RETURNING id`;

        // return the inserted job id
        return query.rows[0].id;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Job.'
        }
    }
}

export async function deleteJob(id: string) {
    try {
        await sql`DELETE FROM jobs WHERE id = ${id}`;
        revalidatePath('/dashboard/jobs');
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Job.'
        }
    }
}

export async function insertDeliveries(job_id: string, records: any[]) {
    try {
        for (const record of records) {
            await sql`
            INSERT INTO deliveries (job_id, name, address, phone, latitude, longitude, barcode)
            VALUES (${job_id}, ${record.name}, ${record.address}, ${record.phone}, ${record.latitude}, ${record.longitude}, ${record.barcode})`;
        }
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Deliveries.'
        }
    }
}

export async function getDeliveriesByJobId(job_id: string) {
    try {
        const query = await sql`
        SELECT * FROM deliveries WHERE job_id = ${job_id} ORDER BY sort_order ASC`;
        return query.rows;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Get Deliveries.'
        }
    }
}

export async function updateDeliveriesOrder(deliveries: any[]) {
    try {
        var i = 1;
        for (const delivery of deliveries) {

            if (delivery.type === 'start' || delivery.type === 'end') continue;

            await sql`
            UPDATE deliveries
            SET sort_order = ${i}
            WHERE id = ${delivery.description}`;

            i++;
        }
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Deliveries Order.'
        }
    }
}

export async function updateDeliveryStatus(id: string, job_id: string, status: string) {
    try {
        await sql`
        UPDATE deliveries
        SET status = ${status}
        WHERE id = ${id}`;
        
        revalidatePath(`/dashboard/jobs/${job_id}`);
        redirect(`/dashboard/jobs/${job_id}`);
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Delivery Status.'
        }
    }
}

export async function fetchFilteredJobs(query: string, team: string, currentPage: number) {
    unstable_noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const jobs = await sql<Job>`
        SELECT * FROM jobs
        WHERE title ILIKE ${`%${query}%`} AND team = ${team}
        ORDER BY date_created DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;

        return jobs.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch jobs.');
    }
}

export async function fetchJobsPages(query: string, team: string) {
    unstable_noStore();
    try {
        const count = await sql`
        SELECT COUNT(*)
        FROM jobs
        WHERE title ILIKE ${`%${query}%`} AND team = ${team}`;

        const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of jobs.');
    }
}