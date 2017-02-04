import * as request from "request";
import * as logger from "winston";
import { StatsTransformer } from "./stats-transformer";

export class SummonerFetcher {
    private statsTransformer: StatsTransformer;

    constructor(private apiKey: string) {
        this.statsTransformer = new StatsTransformer();
    }

    public getStats(name: string, region: string): Promise<Summoner> {
        return new Promise<Summoner>((resolve, reject) => {
            request.get(`https://${region}.api.pvp.net/api/lol/${region}/v1.4/summoner/by-name/${name}?api_key=${this.apiKey}`, {
                json: true,
            }, (error, response, body: { [name: string]: Summoner }) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(body);
                    logger.error(error);
                    return;
                }

                const summoner = body[name.replace(/\s/g, "").toLowerCase()];

                if (summoner === undefined) {
                    reject("No summoner found");
                    logger.error("No summoner found");
                    logger.error(body.toString());
                    return;
                }

                resolve(summoner);
            });
        });
    }
}
