import { NextResponse, NextRequest } from "next/server";
import { Data } from "../../../datamodel";


// This will handle requests to the /api/v1/network/{id}) endpoint
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
        const data: Data[] = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid data format. Expected an array.");
        }
        const { id } = await params;

        // Find the data with the matching id
        const networkData = data.find((item) => item.id === Number(id));

        if (!networkData) {
            return NextResponse.json(
                { message: `Data with id ${id} not found`, status: 404, error: true },
                { status: 404 }
            );
        }

        // Respond with the specific network data
        return NextResponse.json(
            { message: "Data fetched successfully", status: 200, data: networkData },
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
