import * as request from "request";
import * as logger from "winston";

export class StatusFetcher {

    constructor(private apiKey: string) {
    }

    public fetch(region: Region): Promise<ServerStatus> {
        return new Promise<ServerStatus>((resolve, reject) => {
            const url = `https://${region}.api.riotgames.com/lol/status/v3/shard-data?api_key=${this.apiKey}`;
            request(url, {
                json: true,
            }, (error, response, body: ServerStatus & RiotError) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                if (body.status !== undefined) {
                    reject(body);
                    logger.error(JSON.stringify(body.status.message));
                    return;
                }

                resolve(body);
            });
        });
    }
}
