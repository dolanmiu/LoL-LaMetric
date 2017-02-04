/* tslint:disable */
import { Utility } from "../../utility";

interface ILaMetricOutput {
    frames: ILaMetricFrame[];
}

interface ILaMetricFrame {
    text: string;
    icon: string;
}

const LOGO_ICON_STRING_GOOD = "i7881";
const LOGO_ICON_STRING_BAD = "i7882";

export class LaMetricFormatter {
    public format(serverStatus: ServerStatus): ILaMetricOutput {
        const frames: ILaMetricFrame[] = [];

        for (const service of serverStatus.services) {
            frames.push({
                text: `${service.name} status: ${service.status}`,
                icon: service.status === "online" ? LOGO_ICON_STRING_GOOD : LOGO_ICON_STRING_BAD,
            });
        }

        return {
            frames,
        };
    }
}
