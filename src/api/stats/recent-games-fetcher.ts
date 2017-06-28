import * as request from "request";
import * as logger from "winston";

export class RecentGamesFetcher {

    constructor(private apiKey: string) {
    }

    public fetchLast(accountId: number, region: Region): Promise<MatchParticipant> {
        return new Promise<MatchParticipant>((resolve, reject) => {
            const url = `https://${region}.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}/recent?api_key=${this.apiKey}`;
            request(url, {
                json: true,
            }, (error, response, body: MatchListResponse & RiotError) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                if (body.status !== undefined) {
                    reject(body);
                    logger.error(JSON.stringify(body.status.message));
                    return;
                }

                if (body.matches.length === 0) {
                    const message = "No matches";
                    reject(message);
                    logger.error(message);
                    return;
                }

                this.fetchMatch(body.matches[0].gameId, accountId, region).then((participant) => {
                    resolve(participant);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }

    private fetchMatch(matchId: number, accountId: number, region: Region): Promise<MatchParticipant> {
        return new Promise<MatchParticipant>((resolve, reject) => {
            const url = `https://${region}.api.riotgames.com/lol/match/v3/matches/${matchId}?api_key=${this.apiKey}`;
            console.log(url);
            request(url, {
                json: true,
            }, (error, response, body: MatchResponse) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                if (body.participantIdentities[0].player === undefined) {
                    const message = "Private game";
                    reject(message);
                    logger.error(message);
                    return;
                }

                const participantIdentity = body.participantIdentities.find((p, index) => {
                    return p.player.accountId === accountId;
                });

                const participant = body.participants.find((p, index) => {
                    return p.participantId === participantIdentity.participantId;
                });

                resolve(participant);
            });
        });
    }
}
