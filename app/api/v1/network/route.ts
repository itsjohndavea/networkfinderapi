import { NextResponse } from 'next/server';

interface NetworkData {
    [operator: string]: string[];
}

interface CountryData {
    name: string;
    code: string;
    continent: string;
    region: string;
    NETWORK: NetworkData;
}

export async function GET() {
    const dataUrl = process.env.DATA_JSON_URL;

    if (!dataUrl) {
        return NextResponse.json(
            { message: "Environment variable DATA_JSON_URL not set", error: true },
            { status: 500 }
        );
    }

    try {
        // Fetch data from the URL
        const response = await fetch(dataUrl);

        if (!response.ok) {
            throw new Error("Error fetching data");
        }

        // Parse the JSON data
        const data:  CountryData  = await response.json();

        if (data != null) {
            return NextResponse.json(
                { message: "Data fetched successfully", status: 200, data },
                { status: 200 }
            );
        }
    } catch (e) {
        return NextResponse.json(
            { message: `Error processing data ${e}`, status: 500 },
            { status: 500 }
        );
    }
}
