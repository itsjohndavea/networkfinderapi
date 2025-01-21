import { NextResponse, NextRequest } from "next/server";
import { Data } from "../../../datamodel";

export async function GET(req: NextRequest) {
    const url = req.nextUrl;
    const countryCode = url.searchParams.get('countryCode'); // Correct way to get query parameter
    const mobileNumber = url.searchParams.get('mobileNumber'); // Correct way to get query parameter

    // Check if countryCode or mobileNumber is missing
    if (!countryCode || !mobileNumber) {
        return NextResponse.json(
            { message: "Missing required query parameters: countryCode and mobileNumber", error: true },
            { status: 400 }
        );
    }

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

        // Find the country data by countryCode
        const countryData = data.find(item => item.countryCode.toLowerCase() === countryCode.toLowerCase());

        if (!countryData) {
            return NextResponse.json(
                { message: `Country with code ${countryCode} not found`,status: 404, error: true },
                { status: 404 }
            );
        }

        // Loop through networks to find the operator for the mobile number
        let matchingOperator = null;
        for (const [operator, prefixes] of Object.entries(countryData.networks)) {
            // Check if the mobile number starts with any of the prefixes
            if (prefixes.some(prefix => mobileNumber.startsWith(prefix))) {
                matchingOperator = operator;
                break;
            }
        }

        if (!matchingOperator) {
            return NextResponse.json(
                { message: `No network found for mobile number ${mobileNumber} in ${countryCode}`,status: 404,  error: true },
                { status: 404 }
            );
        }

        // Respond with the operator found
        return NextResponse.json(
            { message: "Network found", status: 200, data: { networkName: matchingOperator } },
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
