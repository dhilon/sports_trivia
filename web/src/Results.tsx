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
        <div className="flex flex-row items-center p-4 hover:bg-gray-50 transition-colors">
            <div className="flex-initial w-20 text-sm font-semibold text-gray-700">
                #{rank.rank}
            </div>
            <Link className="flex-initial w-32 text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline" href={("/profile/" + rank.id)}>
                {rank.name}
            </Link>
            <div className="flex-auto text-sm text-gray-600 px-4">
                {rank.amount} correct
            </div>
            <div className="flex-auto text-sm text-gray-600 px-4">
                {rank.time}s avg
            </div>
            <div className="flex-initial flex items-center gap-2 text-sm font-medium">
                {rank.points > 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                <span className={rank.points > 0 ? "text-green-600" : "text-red-600"}>{rank.points} pts</span>
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
        <div className="w-full">
            {/* Header Bar */}
            <div className="sticky top-0 z-2 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Game Results</h1>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl p-8">
                <Card className="border border-gray-200 bg-white shadow-sm rounded-xl">
                    <CardHeader className="border-b bg-gray-100/90 backdrop-blur rounded-t-xl py-4">
                        <CardTitle className="text-lg font-semibold text-gray-800">Scorecard</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-200">
                            {data.map((rank, index) => (
                                <ResultsRank key={rank.id || index} rank={rank} />
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm border-t bg-gray-50/50 rounded-b-xl py-4">
                        <div className="flex gap-2 font-medium leading-none text-gray-700">
                            {game.questions.length} total questions
                        </div>
                        <div className="leading-none text-muted-foreground text-xs">
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
