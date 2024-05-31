import Breadcrumbs from '@/app/ui/common/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { getDeliveriesByJobId } from '@/app/lib/actions/jobs';
import JobDetailsTable from '@/app/ui/jobs/details-table';

export default async function Page({ params }: { params: { id: string } }) {

    const id = params.id;
    const [deliveries, customers] = await Promise.all([
        getDeliveriesByJobId(id),
        fetchCustomers()
    ])

    if (!deliveries) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'İşler', href: '/dashboard/jobs' },
                    {
                        label: 'Gönderiler',
                        href: `/dashboard/jobs/${id}`,
                        active: true,
                    },
                ]}
            />
            <JobDetailsTable job_id={id} deliveries={deliveries} />
        </main>
    );
}