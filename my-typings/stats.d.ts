declare interface AggregatedStats {
    totalNeutralMinionsKilled: number;
    totalMinionKills: number;
    totalChampionKills: number;
    totalAssists: number;
    totalTurretsKilled: number;
}

declare interface PlayerStatsSummary {
    playerStatSummaryType: string;
    aggregatedStats: AggregatedStats;
    losses: number;
    modifyDate: number;
    wins: number;
}

declare interface StatsResponse {
    playerStatSummaries: PlayerStatsSummary[];
    summonerId: number;
}
