import { NextResponse } from "next/server";

interface NetworkData {
    [operator: string]: string[];
}

export interface CountryData {
    continent: string;
    region: string;
    countryName: string;
    countryCode: string;
    code: string;
    networks: NetworkData;
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
        // Fetch the JSON data from the provided URL
        const response = await fetch(dataUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        // Parse the JSON data
        const data: CountryData[] = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid data format. Expected an array.");
        }

        // Respond with the data
        return NextResponse.json(
            { message: "Data fetched successfully", data },
            { status: 200 }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json(
            { message: `Error processing data: ${errorMessage}`, error: true },
            { status: 500 }
        );
    }
}
