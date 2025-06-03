"use client"

import { TrendingUp } from "lucide-react"
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
import { currUser } from './components/CurrUser'


const chartData = [
    { browser: "basketball", ranking: "#1", points: 0, fill: "var(--color-basketball)" }, //need to still fix ranking but points is good
    { browser: "hockey", ranking: "#2", points: 0, fill: "var(--color-hockey)" },
    { browser: "baseball", ranking: "#131", points: 0, fill: "var(--color-baseball)" },
    { browser: "tennis", ranking: "#34", points: 0, fill: "var(--color-tennis)" },
    { browser: "football", ranking: "#26", points: 0, fill: "var(--color-football)" },
    { browser: "soccer", ranking: "#26", points: 0, fill: "var(--color-soccer)" },
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
    hockey: {
        label: "Hockey",
        color: "hsl(var(--chart-2))",
    },
    baseball: {
        label: "Baseball",
        color: "hsl(var(--chart-3))",
    },
    tennis: {
        label: "Tennis",
        color: "hsl(var(--chart-4))",
    },
    football: {
        label: "Football",
        color: "hsl(var(--chart-5))",
    },
    soccer: {
        label: "Soccer",
        color: "hsl(var(--chart-6))",
    },
} satisfies ChartConfig

function Profile() {
    const { user: data, isLoading, isError, errorMessage } = currUser();

    if (isError) return <div>Error: {errorMessage}</div>;
    if (isLoading) return <div>loading...</div>

    if (!data) return null;

    chartData[0].points = data.scores.basketball ?? 0
    chartData[1].points = data.scores.hockey ?? 0
    chartData[2].points = data.scores.baseball ?? 0
    chartData[3].points = data.scores.tennis ?? 0
    chartData[4].points = data.scores.football ?? 0
    chartData[5].points = data.scores.soccer ?? 0

    return (
        <div className="flex items-center justify-center">
            <Card className="w-[550px] items-center space-x-4" >
                <CardHeader>
                    <CardTitle>{data.username}'s Profile</CardTitle>
                    <CardDescription>Created at {data.created_at}</CardDescription>
                </CardHeader>
                <CardContent>
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
                        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
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