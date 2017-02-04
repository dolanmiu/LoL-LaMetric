export enum EnvironmentType {
    Development, Production, Test,
}

export interface IConfig {
    port: number;
    apiKey: string;
}

export class Config implements IConfig {
    public port = process.env.PORT || 9000;
    public apiKey = "RGAPI-336a7447-5eca-4d95-b0e3-3487ac7cf033";
}
