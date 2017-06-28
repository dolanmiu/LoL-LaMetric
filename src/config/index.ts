export enum EnvironmentType {
    Development, Production, Test,
}

export interface IConfig {
    port: number;
    apiKey: string;
}

export class Config implements IConfig {
    public port = parseInt(process.env.PORT, 10) || 9000;
    public apiKey = process.env.RIOT_API_KEY;
}
