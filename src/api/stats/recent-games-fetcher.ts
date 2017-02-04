import * as request from "request";
import * as logger from "winston";

export class RecentGamesFetcher {

    constructor(private apiKey: string) {
    }

    public fetchLast(summonerId: number, region: string): Promise<Game> {
        return new Promise<Game>((resolve, reject) => {
            request(`https://${region}.api.pvp.net/api/lol/${region}/v1.3/game/by-summoner/${summonerId}/recent?api_key=${this.apiKey}`, {
                json: true,
            }, (error, response, body: GamesResponse) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                resolve(body.games[0]);
            });
        });
    }
}
