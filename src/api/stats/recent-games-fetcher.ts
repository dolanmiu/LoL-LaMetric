import * as request from "request";
import * as logger from "winston";

export class RecentGamesFetcher {

    constructor(private apiKey: string) {
    }

    public fetchLast(summonerId: number, region: Region): Promise<Game> {
        return new Promise<Game>((resolve, reject) => {
            const url = `https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/${summonerId}/recent?api_key=${this.apiKey}`;
            request(url, {
                json: true,
            }, (error, response, body: MatchListResponse) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                if (body.matches.length === 0) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                return this.fetchMatch(body.matches[0].gameId, summonerId, region);
            });
        });
    }

    private fetchMatch(matchId: number, summonerId: number, region: Region): Promise<MatchParticipant> {
        return new Promise<MatchParticipant>((resolve, reject) => {
            const url = `https://euw1.api.riotgames.com/lol/match/v3/matches/${matchId}?api_key=${this.apiKey}`;
            request(url, {
                json: true,
            }, (error, response, body: MatchResponse) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                const participant = body.participants.find((p, index) => {
                    return p.participantId === summonerId;
                });

                resolve(participant);
            });
        });
    }
}
