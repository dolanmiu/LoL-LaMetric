export class StatsTransformer {

    public transform(stats: StatsResponse): AggregatedStats {
        const aggregatedStats: AggregatedStats = {
            totalNeutralMinionsKilled: 0,
            totalMinionKills: 0,
            totalChampionKills: 0,
            totalAssists: 0,
            totalTurretsKilled: 0,
        };

        for (const summary of stats.playerStatSummaries) {
            if (summary.aggregatedStats.totalAssists !== undefined) {
                aggregatedStats.totalAssists += summary.aggregatedStats.totalAssists;
            }

            if (summary.aggregatedStats.totalChampionKills !== undefined) {
                aggregatedStats.totalChampionKills += summary.aggregatedStats.totalChampionKills;
            }

            if (summary.aggregatedStats.totalMinionKills !== undefined) {
                aggregatedStats.totalMinionKills += summary.aggregatedStats.totalMinionKills;
            }

            if (summary.aggregatedStats.totalNeutralMinionsKilled !== undefined) {
                aggregatedStats.totalNeutralMinionsKilled += summary.aggregatedStats.totalNeutralMinionsKilled;
            }

            if (summary.aggregatedStats.totalTurretsKilled !== undefined) {
                aggregatedStats.totalTurretsKilled += summary.aggregatedStats.totalTurretsKilled;
            }
        }

        return aggregatedStats;
    }
}
