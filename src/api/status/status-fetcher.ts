import * as request from "request";
import * as logger from "winston";

export class StatusFetcher {

    constructor(private apiKey: string) {
    }

    public fetch(region: string): Promise<ServerStatus> {
        return new Promise<ServerStatus>((resolve, reject) => {
            request(`https://${region}.api.pvp.net/lol/status/v1/shard?api_key=${this.apiKey}`, {
                json: true,
            }, (error, response, body: ServerStatus) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                resolve(body);
            });
        });
    }
}
