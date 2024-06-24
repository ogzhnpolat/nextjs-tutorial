'use server';

import { describe } from "node:test";

// route objet
// {
//     origin: {lat: number, lng: number},
//     destination: {lat: number, lng: number},
//     waypoints: [{ description: string, lat: number, lng: number }]
// }


// example request
/* 
  method: 'POST',
  url: 'https://api.openrouteservice.org/optimization',
  body: '{
    "jobs":[
        {"id":1,"service":300,"delivery":[1],"location":[1.98465,48.70329],"skills":[1],"time_windows":[[32400,36000]]},
        {"id":2,"service":300,"delivery":[1],"location":[2.03655,48.61128],"skills":[1]},
        {"id":3,"service":300,"delivery":[1],"location":[2.39719,49.07611],"skills":[2]},
        {"id":4,"service":300,"delivery":[1],"location":[2.41808,49.22619],"skills":[2]},
        {"id":5,"service":300,"delivery":[1],"location":[2.28325,48.5958],"skills":[14]},
        {"id":6,"service":300,"delivery":[1],"location":[2.89357,48.90736],"skills":[14]}
    ],
    "vehicles":[
        {"id":1,"profile":"driving-car","start":[2.35044,48.71764],"end":[2.35044,48.71764],"capacity":[4],"skills":[1,14],"time_window":[28800,43200]},
        {"id":2,"profile":"driving-car","start":[2.35044,48.71764],"end":[2.35044,48.71764],"capacity":[4],"skills":[2,14],"time_window":[28800,43200]}
    ]}',
  headers: {
    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
    'Authorization': '***',
    'Content-Type': 'application/json; charset=utf-8'
*/

export async function optimizeRoute(data: any) {

    const url = process.env.OPTIMIZATION_API_URL;

    if (!url) {
        throw new Error("OPTIMIZATION_API_URL is not defined");
    }

    if (!process.env.OPENROUTESERVICE_API_KEY) {
        throw new Error("OPENROUTESERVICE_API_KEY is not defined");
    }

    const body = {
        jobs: [
            ...data.waypoints.filter((waypoint: any) => waypoint.longitude !== 0 && waypoint.latitude !== 0).map((waypoint: any, index: number) => {
                return { id: index, description: waypoint.id, location: [waypoint.longitude, waypoint.latitude] }
            }),
        ],
        vehicles: [
            {
                id: 1,
                profile: "driving-car",
                start: [data.start.lng, data.start.lat],
                end: [data.end.lng, data.end.lat],
            }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Authorization': process.env.OPENROUTESERVICE_API_KEY,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body)
    });

    const json = await response.json();

    return json;
}