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
        const champStats = data[1];
        const currentYear = new Date().getFullYear();

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

        frames.push({
            text: `Games Played in Ranked ${currentYear}: ${champStats.summary.stats.totalSessionsPlayed}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `W/L Ratio in Ranked ${currentYear}: ${this.getRatio(champStats.summary.stats.totalSessionsWon, champStats.summary.stats.totalSessionsLost)}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Double Kills in Ranked ${currentYear}: ${champStats.summary.stats.totalDoubleKills}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Triple Kills in Ranked ${currentYear}: ${champStats.summary.stats.totalTripleKills}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Quadra Kills in Ranked ${currentYear}: ${champStats.summary.stats.totalQuadraKills}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Penta Kills in Ranked ${currentYear}: ${champStats.summary.stats.totalPentaKills}`,
            icon: LOGO_ICON_STRING,
        });
        return {
            frames,
        };
    }

    private getRatio(firstNumber: number, secondNumber: number): string {
        const rawRatio = firstNumber / secondNumber;

        if (isNaN(rawRatio)) {
            return "1.00";
        }
        return rawRatio.toFixed(2);
    }
}
