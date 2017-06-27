export class RegionConverter {
    public static convert(region: string): Region {
        const regionLowercase = region.toLowerCase();

        switch (regionLowercase) {
            case "eune":
                return "EUN1";
            case "lan":
                return "LA1";
            case "ru":
                return "RU";
            case "na":
                return "NA1";
            case "tr":
                return "TR1";
            case "jp":
                return "JP1";
            case "kr":
                return "KR";
            case "br":
                return "BR1";
            case "oce":
                return "OC1";
            case "euw":
                return "EUW1";
            case "las":
                return "LA2";
            default:
                throw new Error(`Cannot find ${region}`);
        }
    }
}
