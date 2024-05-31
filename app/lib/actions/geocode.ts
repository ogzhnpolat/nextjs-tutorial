'use server';

import { sql } from '@vercel/postgres';

// google geocoding api url
var googleGeocodingApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

/* Geocoding Actions */
export async function geocode(address: string) {

    const cleanedAddress = cleanString(address);
    const encodedAddress = encodeURIComponent(cleanedAddress);

    const url = `${googleGeocodingApiUrl}?address=${encodedAddress}&key=${process.env.GOOGLE_GEOCODING_API_KEY}&language=tr&region=tr`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        }
    });

    const data = await response.json();

    const { lat, lng } = data.results[0].geometry.location;


    return { lat, lng };
}

export async function checkIfGeocodeExists(receiver: string, address: string) {

    const geocode = await sql`
    SELECT * FROM geocodes WHERE receiver_name = ${receiver} AND address = ${address}`;

    if (geocode.rows.length > 0) {
        return geocode.rows[0];
    } else {
        return false;
    }
}

export async function saveGeocode(receiver: string, address: string, latitude: number, longitude: number) {
    try {
        await sql`
    INSERT INTO geocodes (receiver_name, address, latitude, longitude)
    VALUES (${receiver}, ${address}, ${latitude}, ${longitude})`;

        return true;
    } catch (error) {
        return false;
    }
}

function cleanString(input: string) {
    var output = "";
    // remove .
    output = input.replace(/\./g, '');

    return output;
}