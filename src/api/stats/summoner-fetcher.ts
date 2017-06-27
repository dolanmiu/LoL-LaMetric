import * as request from "request";
import * as logger from "winston";
import { StatsTransformer } from "./stats-transformer";

export class SummonerFetcher {
    private statsTransformer: StatsTransformer;

    constructor(private apiKey: string) {
        this.statsTransformer = new StatsTransformer();
    }

    public getStats(name: string, region: Region): Promise<Summoner> {
        return new Promise<Summoner>((resolve, reject) => {
            const url = `https://${region}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${name}?api_key=${this.apiKey}`;
            request.get(url, {
                json: true,
            }, (error, response, body: Summoner) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(body);
                    logger.error(error);
                    return;
                }

                if (body === undefined) {
                    reject("No summoner found");
                    logger.error("No summoner found");
                    logger.error(body.toString());
                    return;
                }

                resolve(body);
            });
        });
    }
}
