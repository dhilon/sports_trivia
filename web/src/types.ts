import { ClassDictionary } from "clsx"

export type Game = {
    id: string
    status: "win" | "loss" | "in progress" | "finished"
    type: "around_the_horn" | "tower_of_power" | "rapid_fire"
    sport: "basketball" | "hockey" | "soccer" | "football" | "baseball" | "tennis"
    date: Date
    players: Array<User>
    questions: Array<Question>
    time: number
    current_question: number

    // …any others, e.g. numPlayers, length, etc.
}

export type Question = {
    difficulty: number
    id: number,
    text: string,
    answer: string,
    level?: number,
    num_answers: number
}

export type User = {
    id: number,
    created_at: Date,
    username: string,
    password: string,
    friends: Array<User>,
    scores: ClassDictionary
}