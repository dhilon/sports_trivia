"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { SidebarLayout } from "./SidebarLayout"
import { Link } from "wouter"

type Rank = {
    rank: number,
    name: string,
    amount: number,
    points: number,
    time: number,
}
type ResultsRankProps = { rank: Rank }

const ResultsRank = ({ rank }: ResultsRankProps) => {
    return (
        <div className={`flex flex-row border-2 overflow-hidden basis-10 border-b`}>
            <div className="flex-initial basis-1/7 border-r">
                Rank {rank.rank}
            </div>
            <Link className="flex-initial basis-2/7 border-r" href={("/profile/" + rank.name)}>
                {rank.name}
            </Link>
            <div className="flex-auto basis-1/7 border-r">
                {rank.amount} correct
            </div>
            <div className="flex-auto basis-1/7 border-r">
                {rank.time} average time to answer
            </div>
            <div className="flex-initial basis-2/7 border-r">
                {rank.points} <TrendingUp />/<TrendingDown /> x points
            </div>
        </div>
    )
}



const data: Rank[] = [
    {
        rank: 1,
        points: 316,
        name: "Dhilon",
        amount: 99,
        time: 3.79
    },
    {
        rank: 2,
        points: 242,
        name: "Dhilon",
        amount: 78,
        time: 3.79
    },
    {
        rank: 3,
        points: 173,
        name: "Maya",
        amount: 77,
        time: 3.79
    },
    {
        rank: 4,
        points: 874,
        name: "Maya",
        amount: 54,
        time: 3.79
    },
    {
        rank: 5,
        points: 721,
        name: "Dhilon",
        amount: 41,
        time: 3.79
    },
    {
        rank: 6,
        points: 721,
        name: "Dhilon",
        amount: 31,
        time: 3.79
    },
    {
        rank: 7,
        points: 721,
        name: "Dhilon",
        amount: 10,
        time: 3.79
    },
    {
        rank: 11,
        points: 721,
        name: "Dhilon",
        amount: 0,
        time: 3.79
    },
]

function Results() {

    return (
        <div className="w-full flex">
            <div className="ml-auto mr-auto lg:w-200 ">
                <Card >
                    <CardHeader>
                        <CardTitle>Scorecard</CardTitle>
                        <CardDescription>Date, GameType, Amount of Players</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.map((rank) => (<ResultsRank rank={rank} ></ResultsRank>))}
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            56 total questions
                        </div>
                        <div className="leading-none text-muted-foreground">
                            45 total answered
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default function ResultsPage() {
    return (
        <SidebarLayout>
            <Results />
        </SidebarLayout>
    )
}
