import * as request from "request";
import * as logger from "winston";
import { Utility } from "../../utility";
import { ChampsTransformer } from "./champs-transformer";

export class ChampionFetcher {
    private champTransformer: ChampsTransformer;

    constructor(private apiKey: string, champPromise: Promise<IChampTable>) {
        this.champTransformer = new ChampsTransformer(champPromise);
    }

    public getChamps(summonerId: number, region: string): Promise<ChampSummary> {
        return this.getChampsGeneric(`https://${region}.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summonerId}/ranked?api_key=${this.apiKey}`);
    }

    public getChampsPreviousSeason(summonerId: number, region: string): Promise<ChampSummary> {
        return this.getChampsGeneric(`https://${region}.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summonerId}/ranked?season=SEASON${Utility.currentRankedYear - 1}&api_key=${this.apiKey}`);
    }

    private getChampsGeneric(url: string): Promise<ChampSummary> {
        return new Promise<ChampSummary>((resolve, reject) => {
            request.get(url, {
                json: true,
            }, (error, response, champResponse: ChampsResponse) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                if (champResponse.champions === undefined) {
                    logger.error("No Champions found");
                    logger.error(champResponse.toString());
                    resolve();
                    return;
                }

                const champs = this.champTransformer.transform(champResponse.champions, (stats) => {
                    resolve(stats);
                });
            });
        });
    }
}
