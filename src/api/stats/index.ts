import { Request, Response, Router } from "express";
import * as request from "request";
import * as logger from "winston";

import { ChampDictionary } from "../../league/champ-dictionary";
import { RegionConverter } from "../region-converter";
import { LaMetricFormatter } from "./lametric-formatter";
import { RecentGamesFetcher } from "./recent-games-fetcher";
import { SummonerFetcher } from "./summoner-fetcher";

export class StatsRouter {
    public router: Router;
    private champDictionary: ChampDictionary;
    private laMetricFormatter: LaMetricFormatter;
    private recentGamesFetcher: RecentGamesFetcher;
    private summonerFetcher: SummonerFetcher;

    constructor(private apiKey: string) {
        this.router = Router();
        this.init();
        this.champDictionary = new ChampDictionary(apiKey);
        this.laMetricFormatter = new LaMetricFormatter(this.champDictionary.fetch());
        this.recentGamesFetcher = new RecentGamesFetcher(apiKey);
        this.summonerFetcher = new SummonerFetcher(apiKey);
    }

    public init(): void {
        this.router.get("/", (req: Request, res: Response) => {
            const name: string = req.query.name;
            const regionString: string = req.query.region;

            if (name === undefined || regionString === undefined) {
                res.status(400).send({
                    frames: [{
                        text: "name and region cannot be empty",
                    }],
                } as ILaMetricOutput);
                return;
            }

            let region;
            try {
                region = RegionConverter.convert(regionString);
            } catch (e) {
                res.status(400).send({
                    frames: [{
                        text: `Unknown region ${regionString}`,
                    }],
                } as ILaMetricOutput);
                return;
            }

            this.summonerFetcher.fetchSummoner(name, region).then((summoner) => {
                const lastGamePromise = this.recentGamesFetcher.fetchLast(summoner.accountId, region);

                Promise.all([lastGamePromise]).then((stats) => {
                    this.laMetricFormatter.format(stats).then((laMetricOutput) => {
                        res.status(200).json(laMetricOutput);
                    }).catch((err) => {
                        logger.error(err);
                    });
                }).catch((reason) => {
                    if (reason === "Private game") {
                        res.status(500).json({
                            frames: [{
                                text: "Sorry! Due to a new LoL update, the last game needs to be a Ranked Game for it to show stats!",
                            }],
                        } as ILaMetricOutput);
                        return;
                    }
                    res.status(500).json({
                        frames: [{
                            text: "Something went wrong with the server",
                        }],
                    } as ILaMetricOutput);
                });
            }).catch((reason) => {
                res.status(500).json({
                    frames: [{
                        text: `Cannot find ${name} in ${region}, or the server is down.`,
                    }],
                } as ILaMetricOutput);
            });
        });
    }
}
