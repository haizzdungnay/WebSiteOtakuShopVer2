import { NextResponse } from 'next/server';
import { getSwaggerSpec } from '@/lib/swagger';

export async function GET() {
    const spec = getSwaggerSpec();

    return NextResponse.json(spec, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Content-Type': 'application/json',
        },
    });
}
