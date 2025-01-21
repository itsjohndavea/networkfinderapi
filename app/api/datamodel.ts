interface NetworkData {
    [operator: string]: string[];
}

export interface Data {
    id: number;
    continent: string;
    region: string;
    countryName: string;
    countryCode: string;
    code: string;
    networks: NetworkData;
}
