interface ILaMetricOutput {
    frames: ILaMetricFrame[];
}

interface ILaMetricFrame {
    text: string;
    icon: string;
}

const LOGO_ICON_STRING = "i7386";

export class LaMetricFormatter {
    public format(data: [AggregatedStats, ChampSummary]): ILaMetricOutput {
        const frames: ILaMetricFrame[] = [];
        const aggregatedStats = data[0];

        frames.push({
            text: `Total Assists: ${aggregatedStats.totalAssists}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Champion Kills: ${aggregatedStats.totalChampionKills}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Minions Kills: ${aggregatedStats.totalMinionKills}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Jungle Mobs Kills: ${aggregatedStats.totalNeutralMinionsKilled}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Turret Takedowns: ${aggregatedStats.totalTurretsKilled}`,
            icon: LOGO_ICON_STRING,
        });

        return {
            frames,
        };
    }
}
