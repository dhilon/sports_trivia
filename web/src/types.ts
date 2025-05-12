export type Game = {
    gameId: string
    status: "win" | "loss" | "in progress"
    type: "around_the_horn" | "pyramid" | "rapid_fire"
    sport: "basketball" | "hockey" | "soccer" | "football" | "baseball" | "tennis"
    date: number
    players: number
    questions: Array<Question>
    time: number

    // …any others, e.g. numPlayers, length, etc.
}

export type Question = {
    id: number,
    text: string,
    answer: string,
    level?: number
}