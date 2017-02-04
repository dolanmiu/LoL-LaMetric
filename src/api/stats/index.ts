import { Request, Response, Router } from "express";
import * as request from "request";
import * as logger from "winston";
import { ChampDictionary } from "../../league/champ-dictionary";
import { ChampionFetcher } from "./champion-fetcher";
import { LaMetricFormatter } from "./lametric-formatter";
import { RecentGamesFetcher } from "./recent-games-fetcher";
import { StatsFetcher } from "./stats-fetcher";

export class StatsRouter {
    public router: Router;
    private champDictionary: ChampDictionary;
    private laMetricFormatter: LaMetricFormatter;
    private recentGamesFetcher: RecentGamesFetcher;
    private championFetcher: ChampionFetcher;
    private statsFetcher: StatsFetcher;

    constructor(private apiKey: string) {
        this.router = Router();
        this.init();
        this.champDictionary = new ChampDictionary(apiKey);
        this.laMetricFormatter = new LaMetricFormatter(this.champDictionary.fetch());
        this.recentGamesFetcher = new RecentGamesFetcher(apiKey);
        this.championFetcher = new ChampionFetcher(apiKey, this.champDictionary.fetch());
        this.statsFetcher = new StatsFetcher(apiKey);
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

                const summoner = JSON.parse(body)[name.replace(/\s/g, "").toLowerCase()] as Summoner;

                if (summoner === undefined) {
                    res.status(500).send("No summoner found");
                    logger.error("No summoner found");
                    logger.error(body);
                    return;
                }

                const statsPromise = this.statsFetcher.getStats(summoner.id, region);
                const champsPromise = this.championFetcher.getChamps(summoner.id, region);
                const previousChampsPromise = this.championFetcher.getChampsPreviousSeason(summoner.id, region);
                const lastGamePromise = this.recentGamesFetcher.fetchLast(summoner.id, region);

                Promise.all([statsPromise, champsPromise, previousChampsPromise, lastGamePromise]).then((stats) => {
                    this.laMetricFormatter.format(stats).then((laMetricOutput) => {
                        res.status(200).json(laMetricOutput);
                    });
                }).catch(() => {
                    res.status(500).json({
                        text: "Something went wrong with the server",
                    });
                });
            });
        });
    }
}
