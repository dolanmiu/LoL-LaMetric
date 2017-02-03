declare interface AggregatedChampStats {
    id: number;
    stats: {
        totalDeathsPerSession: number,
        totalSessionsPlayed: number,
        totalDamageTaken: number,
        totalQuadraKills: number,
        totalTripleKills: number,
        totalMinionKills: number,
        maxChampionsKilled: number,
        totalDoubleKills: number,
        totalPhysicalDamageDealt: number,
        totalChampionKills: number,
        totalAssists: number,
        mostChampionKillsPerSession: number,
        totalDamageDealt: number,
        totalFirstBlood: number,
        totalSessionsLost: number,
        totalSessionsWon: number,
        totalMagicDamageDealt: number,
        totalGoldEarned: number,
        totalPentaKills: number,
        totalTurretsKilled: number,
        mostSpellsCast: number,
        maxNumDeaths: number,
        totalUnrealKills: number
    };
    name?: string;
}

declare interface ChampSummary {
    favorite?: AggregatedChampStats[];
    summary?: AggregatedChampStats;
}

declare interface ChampsResponse {
    modifyDate: number;
    champions: AggregatedChampStats[];
    summonerId: number;
}
