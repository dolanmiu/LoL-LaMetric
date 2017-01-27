import { Request, Response, Router } from "express";
import * as request from "request";
import * as logger from "winston";
import { ChampDictionary } from "../../league/champ-dictionary";
import { ChampsTransformer } from "../../league/champs-transformer";
import { StatsTransformer } from "../../league/stats-transformer";
import { Utility } from "../../utility";
import { LaMetricFormatter } from "./lametric-formatter";
export class StatsRouter {
    public router: Router;
    private statsTransformer: StatsTransformer;
    private champTransformer: ChampsTransformer;
    private champDictionary: ChampDictionary;
    private laMetricFormatter: LaMetricFormatter;

    constructor(private apiKey: string) {
        this.router = Router();
        this.init();
        this.statsTransformer = new StatsTransformer();
        this.champDictionary = new ChampDictionary(apiKey);
        this.champTransformer = new ChampsTransformer(this.champDictionary.fetch());
        this.laMetricFormatter = new LaMetricFormatter();
    }

    public init(): void {
        this.router.get("/", (req: Request, res: Response) => {
            const name: string = req.query.name;
            const region: string = req.query.region;

            if (name === undefined || region === undefined) {
                res.status(400).send("name and region cannot be empty");
                return;
            }
            request.get(`https://${region}.api.pvp.net/api/lol/${region}/v1.4/summoner/by-name/${name}?api_key=${this.apiKey}`, (error, response, body) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    res.status(500).send(error);
                    logger.error(error);
                    return;
                }

                const summoner = JSON.parse(body)[name.toLowerCase()] as Summoner;

                if (summoner === undefined) {
                    res.status(500).send("No summoner found");
                    logger.error("No summoner found");
                    logger.error(body);
                    return;
                }

                const statsPromise = this.getStats(summoner.id, region);
                const champsPromise = this.getChamps(summoner.id, region);
                const previousChampsPromise = this.getChampsPreviousSeason(summoner.id, region);

                Promise.all([statsPromise, champsPromise, previousChampsPromise]).then((stats) => {
                    const laMetricOutput = this.laMetricFormatter.format(stats);
                    res.status(200).json(laMetricOutput);
                });
            });
        });
    }

    private getStats(summonerId: number, region: string): Promise<AggregatedStats> {
        return new Promise<AggregatedStats>((resolve, reject) => {
            request.get(`https://${region}.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summonerId}/summary?&api_key=${this.apiKey}`, (error, response, body) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
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
        return this.getChampsGeneric(`https://${region}.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summonerId}/ranked?api_key=${this.apiKey}`);
    }

    private getChampsPreviousSeason(summonerId: number, region: string): Promise<ChampSummary> {
        return this.getChampsGeneric(`https://${region}.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summonerId}/ranked?season=SEASON${Utility.currentRankedYear - 1}&api_key=${this.apiKey}`);
    }

    private getChampsGeneric(url: string): Promise<ChampSummary> {
        return new Promise<ChampSummary>((resolve, reject) => {
            request.get(url, (error, response, body) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                const champResponse = JSON.parse(body) as ChampsResponse;

                if (champResponse === undefined) {
                    reject("No Champions found");
                    logger.error("No Champions found");
                    logger.error(body);
                    return;
                }

                const champs = this.champTransformer.transform(champResponse.champions, (stats) => {
                    resolve(stats);
                });
            });
        });
    }
}
