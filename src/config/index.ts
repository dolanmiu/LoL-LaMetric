export enum EnvironmentType {
    Development, Production, Test,
}

export interface IConfig {
    port: number;
    apiKey: string;
}

export class Config implements IConfig {
    public port = process.env.PORT || 9000;
    public apiKey = process.env.RIOT_API_KEY;
}
