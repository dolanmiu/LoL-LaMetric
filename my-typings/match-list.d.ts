declare type Lane = "BOTTOM" | "TOP" | "MID" | "SUPPORT" | "JUNGLE";
declare type Role = "DUO_CARRY" | "SOLO" | "NONE" | "DUO";

declare interface MatchListResponse {
    matches: [
        {
            lane: Lane,
            gameId: number,
            champion: number,
            platformId: Region,
            timestamp: number,
            queue: number,
            role: Role,
            season: number
        }
    ],
    endIndex: number,
    startIndex: number,
    totalGames: number
}
