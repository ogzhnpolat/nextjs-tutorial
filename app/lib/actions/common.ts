'use server';

import { auth } from "@/auth";
import { sql } from "@vercel/postgres";

export async function getUserId() {
    
    const session = await auth();

    if (!session) {
        return null;
    }

    const user = session.user;

    try {
        const query = await sql`
        SELECT id FROM users WHERE email = ${user?.email}`;
        return query.rows[0].id;
    } catch (error) {
        return null;
    }
}