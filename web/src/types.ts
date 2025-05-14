import { ClassDictionary } from "clsx"

export type Game = {
    gameId: string
    status: "win" | "loss" | "in progress"
    type: "around_the_horn" | "pyramid" | "rapid_fire"
    sport: "basketball" | "hockey" | "soccer" | "football" | "baseball" | "tennis"
    date: number
    players: Array<string>
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

export type User = {
    created_at: Date,
    username: string,
    password: string,
    friends: Array<User>,
    scores: ClassDictionary
}