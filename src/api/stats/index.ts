import { Request, Response, Router } from "express";
import * as request from "request";
import * as logger from "winston";
import { StatsTransformer } from "../../league/stats-transformer";

export class StatsRouter {
    public router: Router;
    private statsTransformer: StatsTransformer;

    constructor(private apiKey: string) {
        this.router = Router();
        this.init();
        this.statsTransformer = new StatsTransformer();
    }

    public init(): void {
        this.router.get("/:region/:name", (req: Request, res: Response) => {
            request.get(`https://euw.api.pvp.net/api/lol/${req.params.region}/v1.4/summoner/by-name/${req.params.name}?api_key=${this.apiKey}`, (error, response, body) => {
                if (error && response.statusCode !== 200) {
                    res.status(500).send(error);
                    return;
                }

                const summoner = JSON.parse(body)[req.params.name] as Summoner;
                this.getStats(summoner.id, req.params.region, (statsBody) => {
                    res.status(200).json(statsBody);
                }, (err) => {
                    res.status(500).send(err);
                });
            });
        });
    }

    private getStats(summonerId: number, region: string, callback: (body: Object) => void, errCallback: (error: Object) => void): void {
        request.get(`https://euw.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summonerId}/summary?&api_key=${this.apiKey}`, (error, response, body) => {
            if (error && response.statusCode !== 200) {
                callback(error);
                logger.error(error);
                return;
            }

            const stats = this.statsTransformer.transform(JSON.parse(body));
            callback(stats);
        });
    }
}
