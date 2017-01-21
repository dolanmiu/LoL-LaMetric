export enum EnvironmentType {
    Development, Production, Test,
}

export interface IConfig {
    port: number;
    apiKey: string;
}

export class Config implements IConfig {
    public port = 9000;
    public apiKey = "enter here";
}
