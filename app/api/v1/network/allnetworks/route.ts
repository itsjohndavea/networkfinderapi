import { NextResponse } from "next/server";
import { Data } from "../../../datamodel";

// This will handle requests to the /api/v1/network/allnetworks endpoint
export async function GET() {
    const dataUrl = process.env.DATA_JSON_URL;

    if (!dataUrl) {
        return NextResponse.json(
            { message: "Environment variable DATA_JSON_URL not set", status: 500, error: true },
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
        const data: Data[] = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid data format. Expected an array.");
        }

        // Extract network names from each networkData object
        const networks = data.flatMap(item => Object.keys(item.networks));  // Extract network names from the 'networks' object

        // Use Set to ensure uniqueness
        const uniqueNetworks = [...new Set(networks)];

        // Respond with the list of unique network names
        return NextResponse.json(
            { message: "Networks fetched successfully", status: 200, networks: uniqueNetworks },
            { status: 200 }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json(
            { message: `Error processing data: ${errorMessage}`, status: 500, error: true },
            { status: 500 }
        );
    }
}
