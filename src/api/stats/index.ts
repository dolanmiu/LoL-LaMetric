import { Request, Response, Router } from "express";
import * as request from "request";
import * as logger from "winston";
import { ChampDictionary } from "../../league/champ-dictionary";
import { ChampsTransformer } from "../../league/champs-transformer";
import { StatsTransformer } from "../../league/stats-transformer";

export class StatsRouter {
    public router: Router;
    private statsTransformer: StatsTransformer;
    private champTransformer: ChampsTransformer;
    private champDictionary: ChampDictionary;

    constructor(private apiKey: string) {
        this.router = Router();
        this.init();
        this.statsTransformer = new StatsTransformer();
        this.champDictionary = new ChampDictionary(apiKey);
        this.champTransformer = new ChampsTransformer(this.champDictionary.fetch());
    }

    public init(): void {
        this.router.get("/:region/:name", (req: Request, res: Response) => {
            request.get(`https://euw.api.pvp.net/api/lol/${req.params.region}/v1.4/summoner/by-name/${req.params.name}?api_key=${this.apiKey}`, (error, response, body) => {
                if (error && response.statusCode !== 200) {
                    res.status(500).send(error);
                    return;
                }

                const summoner = JSON.parse(body)[req.params.name] as Summoner;

                const statsPromise = this.getStats(summoner.id, req.params.region);
                const champsPromise = this.getChamps(summoner.id, req.params.region);

                Promise.all([statsPromise, champsPromise]).then((stats) => {
                    res.status(200).json({
                        general: stats[0],
                        champion: stats[1],
                    });
                });
            });
        });
    }

    private getStats(summonerId: number, region: string): Promise<AggregatedStats> {
        return new Promise<AggregatedStats>((resolve, reject) => {
            request.get(`https://euw.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summonerId}/summary?&api_key=${this.apiKey}`, (error, response, body) => {
                if (error && response.statusCode !== 200) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                const statsResponse = JSON.parse(body) as StatsResponse;

                const stats = this.statsTransformer.transform(statsResponse);
                resolve(stats);
            });
        });
    }

    private getChamps(summonerId: number, region: string): Promise<ChampSummary> {
        return new Promise<ChampSummary>((resolve, reject) => {
            request.get(`https://euw.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summonerId}/ranked?api_key=${this.apiKey}`, (error, response, body) => {
                if (error && response.statusCode !== 200) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                const champResponse = JSON.parse(body) as ChampsResponse;

                const champs = this.champTransformer.transform(champResponse.champions, (stats) => {
                    resolve(stats);
                });
            });
        });
    }
}
