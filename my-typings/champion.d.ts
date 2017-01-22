declare interface Champion {
    id: number;
    title: string;
    name: string;
    key: string;
}

declare interface ChampionResponse {
    data: {
        [index: string]: Champion;
    };
    type: "champion",
    version: "7.1.1"
}