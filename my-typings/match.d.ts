declare type GameMode = "CLASSIC";
declare type GameType = "MATCHED_GAME";
declare const enum Team {
    Blue = 200, Red = 200
}
declare type WinLose = "Win" | "Fail";
declare type Tier = "BRONZE" | "SILVER" | "GOLD" | "PLAT" | "DIAMOND" | "CHALLENGER";

declare interface MatchParticipant {
    participantId: number,
    teamId: number,
    championId: number,
    spell1Id: number,
    spell2Id: number,
    masteries: [
        {
            masteryId: number,
            rank: number
        }
    ],
    runes: [
        {
            runeId: number,
            rank: number
        }
    ],
    highestAchievedSeasonTier: Tier,
    stats: {
        participantId: number,
        win: boolean,
        item0: number,
        item1: number,
        item2: number,
        item3: number,
        item4: number,
        item5: number,
        item6: number,
        kills: number,
        deaths: number,
        assists: number,
        largestKillingSpree: number,
        largestMultiKill: number,
        killingSprees: number,
        longestTimeSpentLiving: number,
        doubleKills: number,
        tripleKills: number,
        quadraKills: number,
        pentaKills: number,
        unrealKills: number,
        totalDamageDealt: number,
        magicDamageDealt: number,
        physicalDamageDealt: number,
        booleanDamageDealt: number,
        largestCriticalStrike: number,
        totalDamageDealtToChampions: number,
        magicDamageDealtToChampions: number,
        physicalDamageDealtToChampions: number,
        booleanDamageDealtToChampions: number,
        totalHeal: number,
        totalUnitsHealed: number,
        damageSelfMitigated: number,
        damageDealtToObjectives: number,
        damageDealtToTurrets: number,
        visionScore: number,
        timeCCingOthers: number,
        totalDamageTaken: number,
        magicalDamageTaken: number,
        physicalDamageTaken: number,
        booleanDamageTaken: number,
        goldEarned: number,
        goldSpent: number,
        turretKills: number,
        inhibitorKills: number,
        totalMinionsKilled: number,
        neutralMinionsKilled: number,
        neutralMinionsKilledTeamJungle: number,
        neutralMinionsKilledEnemyJungle: number,
        totalTimeCrowdControlDealt: number,
        champLevel: number,
        visionWardsBoughtInGame: number,
        sightWardsBoughtInGame: number,
        wardsPlaced: number,
        wardsKilled: number,
        firstBloodKill: boolean,
        firstBloodAssist: boolean,
        firstTowerKill: boolean,
        firstTowerAssist: boolean,
        firstInhibitorKill: boolean,
        firstInhibitorAssist: boolean,
        combatPlayerScore: number,
        objectivePlayerScore: number,
        totalPlayerScore: number,
        totalScoreRank: number
    },
    timeline: {
        participantId: number,
        creepsPerMinDeltas: {
            "30-end": number,
            "10-20": number,
            "20-30": number,
            "0-10": number
        },
        xpPerMinDeltas: {
            "30-end": number,
            "10-20": number,
            "20-30": number,
            "0-10": number
        },
        goldPerMinDeltas: {
            "30-end": number,
            "10-20": number,
            "20-30": number,
            "0-10": number
        },
        csDiffPerMinDeltas: {
            "30-end": number,
            "10-20": number,
            "20-30": number,
            "0-10": number
        },
        xpDiffPerMinDeltas: {
            "30-end": number,
            "10-20": number,
            "20-30": number,
            "0-10": number
        },
        damageTakenPerMinDeltas: {
            "30-end": number,
            "10-20": number,
            "20-30": number,
            "0-10": number
        },
        damageTakenDiffPerMinDeltas: {
            "30-end": number,
            "10-20": number,
            "20-30": number,
            "0-10": number
        },
        role: Role,
        lane: Lane
    }
}

declare interface MatchResponse {
    gameId: Number,
    platformId: Region,
    gameCreation: Number,
    gameDuration: Number,
    queueId: Number,
    mapId: Number,
    seasonId: Number,
    gameVersion: string,
    gameMode: GameMode,
    gameType: GameType,
    teams: [
        {
            teamId: Team,
            win: WinLose,
            firstBlood: boolean,
            firstTower: boolean,
            firstInhibitor: boolean,
            firstBaron: boolean,
            firstDragon: boolean,
            firstRiftHerald: boolean,
            towerKills: number,
            inhibitorKills: number,
            baronKills: number,
            dragonKills: number,
            vilemawKills: number,
            riftHeraldKills: number,
            dominionVictoryScore: number,
            bans: [
                {
                    championId: number,
                    pickTurn: number
                }
            ]
        }
    ],
    participants: MatchParticipant[],
    participantIdentities: [
        {
            participantId: number,
            player?: {
                platformId: Region,
                accountId: number,
                summonerName: string,
                summonerId: number,
                currentPlatformId: Region,
                currentAccountId: number,
                matchHistoryUri: string,
                profileIcon: number
            }
        }
    ]
}