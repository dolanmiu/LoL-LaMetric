import * as request from "request";
import * as logger from "winston";
import { StatsTransformer } from "./stats-transformer";

export class StatsFetcher {
    private statsTransformer: StatsTransformer;

    constructor(private apiKey: string) {
        this.statsTransformer = new StatsTransformer();
    }

    public getStats(summonerId: number, region: string): Promise<AggregatedStats> {
        return new Promise<AggregatedStats>((resolve, reject) => {
            request.get(`https://${region}.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summonerId}/summary?&api_key=${this.apiKey}`, {
                json: true,
            }, (error, response, statsResponse: StatsResponse) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(statsResponse);
                    logger.error(error);
                    return;
                }

                const stats = this.statsTransformer.transform(statsResponse);
                resolve(stats);
            });
        });
    }
}
