"use client"

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, LabelList } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { SidebarLayout } from "./SidebarLayout"
import { useParams } from "wouter"
import useSWR from "swr"


const chartData = [
    { browser: "basketball", ranking: "#1", points: 0, fill: "var(--color-basketball)" }, //need to still fix ranking but points is good
    { browser: "soccer", ranking: "#2", points: 0, fill: "var(--color-soccer)" },
    { browser: "football", ranking: "#6", points: 0, fill: "var(--color-football)" },
    { browser: "hockey", ranking: "#3", points: 0, fill: "var(--color-hockey)" },
    { browser: "tennis", ranking: "#4", points: 0, fill: "var(--color-tennis)" },
    { browser: "baseball", ranking: "#5", points: 0, fill: "var(--color-baseball)" },
]

const chartConfig = {
    ranking: {
        label: "Ranking",
        color: "hsl(var(--chart-1))",
    },
    points: {
        label: "Points",
    },
    basketball: {
        label: "Basketball",
        color: "hsl(var(--chart-1))",
    },
    soccer: {
        label: "Soccer",
        color: "hsl(var(--chart-6))",
    },
    football: {
        label: "Football",
        color: "hsl(var(--chart-5))",
    },
    hockey: {
        label: "Hockey",
        color: "hsl(var(--chart-2))",
    },
    tennis: {
        label: "Tennis",
        color: "hsl(var(--chart-4))",
    },
    baseball: {
        label: "Baseball",
        color: "hsl(var(--chart-3))",
    },

} satisfies ChartConfig

function Profile() {
    const { name } = useParams();

    const { data, isLoading, error } = useSWR(`/users/${name}`);
    const { data: rankings, isLoading: rankingsLoading, error: rankingsError } = useSWR(`/rankings/${name}`);

    if (!data) return null;
    if (error || rankingsError) return <div>Error: {error?.message || rankingsError?.message}</div>;
    if (isLoading || rankingsLoading) return <div>loading...</div>

    chartData[0].points = data.scores.basketball ?? 0 //get onclick to view overall leaderboards for each sport
    chartData[1].points = data.scores.soccer ?? 0
    chartData[2].points = data.scores.hockey ?? 0
    chartData[3].points = data.scores.baseball ?? 0
    chartData[4].points = data.scores.tennis ?? 0
    chartData[5].points = data.scores.football ?? 0




    chartData[0].ranking = '#' + (rankings.basketball.position ?? 0)
    chartData[1].ranking = '#' + (rankings.soccer.position ?? 0)
    chartData[2].ranking = '#' + (rankings.hockey.position ?? 0)
    chartData[3].ranking = '#' + (rankings.baseball.position ?? 0)
    chartData[4].ranking = '#' + (rankings.tennis.position ?? 0)
    chartData[5].ranking = '#' + (rankings.football.position ?? 0)

    return (
        <div className="flex flex-col h-full max-w-[900px] mx-auto" style={{ maxHeight: '90vh' }}>
            <Card className="h-full border-3 border-gray-300" >
                <CardHeader className="sticky rounded-lg top-0 bg-gray-300 z-1">
                    <CardTitle className="text-purple-500">{data.username}'s Profile</CardTitle>
                    <CardDescription>Created at {data.created_at}</CardDescription>
                </CardHeader>
                <CardContent className="items-center justify-center mt-10">
                    <ChartContainer config={chartConfig}>
                        <BarChart accessibilityLayer data={chartData} margin={{
                            top: 20,
                        }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="browser"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) =>
                                    chartConfig[value as keyof typeof chartConfig]?.label
                                }
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="points"
                                strokeWidth={2}
                                radius={8}
                                activeIndex={2}
                                activeBar={({ ...props }) => {
                                    return (
                                        <Rectangle
                                            {...props}
                                            fillOpacity={0.8}
                                            stroke={props.payload.fill}
                                            strokeDasharray={4}
                                            strokeDashoffset={4}
                                        />
                                    )
                                }}
                            >
                                <LabelList
                                    dataKey="ranking"
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        Good job!
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing total points for the last 6 months
                    </div>
                </CardFooter>
            </Card>
        </div>

    )
}



export default function ProfilePage() {
    return (
        <SidebarLayout>
            <Profile />
        </SidebarLayout>
    )
}