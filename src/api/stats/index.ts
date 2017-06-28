import { Request, Response, Router } from "express";
import * as request from "request";
import * as logger from "winston";
import { ChampDictionary } from "../../league/champ-dictionary";
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
            const region: string = req.query.region;

            if (name === undefined || region === undefined) {
                res.status(400).send("name and region cannot be empty");
                return;
            }

            this.summonerFetcher.getStats(name, region).then((summoner) => {
                const lastGamePromise = this.recentGamesFetcher.fetchLast(summoner.id, region);

                    this.laMetricFormatter.format(stats).then((laMetricOutput) => {
                        res.status(200).json(laMetricOutput);
                    });
                }).catch(() => {
                    res.status(500).json({
                        text: "Something went wrong with the server",
                    });
                });
            }).catch((reason) => {
                res.status(500).json({
                    text: `Cannot find ${name} in ${region}, or the server is down.`,
                });
            });
        });
    }
}
