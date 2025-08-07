"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { SidebarLayout } from "./SidebarLayout"
import { Link, useParams } from "wouter"
import useSWR from "swr"

type Rank = {
    id: number,
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
                {rank.points > 0 ? <TrendingUp color="green" /> : <TrendingDown color="red" />}
                {rank.points} points
            </div>
        </div>
    )
}



function Results() {

    const params = useParams();
    const { data: game, error, isLoading } = useSWR(`/games/` + params.id)

    const data: Rank[] = []
    for (const player of game?.players ?? []) {
        data.push({
            id: player.id,
            rank: 0,
            points: game.scores[player.id] * 20 - 50,
            name: player.username,
            amount: game.scores[player.id],
            time: game.time,
        })
    }

    data.sort((a, b) => b.points - a.points)
    for (let i = 0; i < data.length; i++) {
        data[i].rank = i + 1;
    }

    let qAnswered = 0
    for (const player of game?.players ?? []) {
        qAnswered += game.scores[player.id]
    }


    if (isLoading) return <div>loading...</div>
    if (error) return <div>error</div>
    return (
        <div className="w-full flex">
            <div className="ml-auto mr-auto lg:w-200 ">
                <Card >
                    <CardHeader>
                        <CardTitle>Scorecard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.map((rank, index) => (
                            <ResultsRank key={rank.id || index} rank={rank} />
                        ))}
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            {game.questions.length} total questions
                        </div>
                        <div className="leading-none text-muted-foreground">
                            {qAnswered} total answered
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
