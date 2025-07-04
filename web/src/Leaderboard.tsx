"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SidebarLayout } from "./SidebarLayout"
import useSWR from "swr";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./components/ui/chart";
import { navigate } from "wouter/use-browser-location";

export interface Leaderboard {
    basketball: { [key: string]: number };
    soccer: { [key: string]: number };
    football: { [key: string]: number };
    baseball: { [key: string]: number };
    hockey: { [key: string]: number };
    tennis: { [key: string]: number };
    //total: { [key: string]: number };
}

function leaderboard() {
    // SWR will GET /me once on mount
    const { data, error, isValidating, mutate } = useSWR<Leaderboard>(
        "http://localhost:5000/leaderboard/",
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    return {
        leaders: data || null,               // null until fetched or 401
        isLoading: isValidating,          // true while SWR hasn't resolved
        isError: !!error,                 // true if SWR got a non-2xx
        errorMessage: error?.response?.data?.error || "",
        refresh: () => mutate(),          // manually re-fetch
    };
}


const chartConfig = {
    points: {
        label: "Points",
        color: "hsl(var(--chart-1))",
    },
    label: {
        color: "hsl(var(--background))",
    },
} satisfies ChartConfig

function LeaderboardCard(
    { sport }: { sport: string }
) {

    const { leaders, isLoading, isError } = leaderboard();

    const chartData = []

    for (let i = 0; i < (Object.keys(leaders?.[sport as keyof Leaderboard] || {}).length || 0); i++) {
        chartData[i] = { name: Object.keys(leaders?.[sport as keyof Leaderboard] || {})[i], points: leaders?.[sport as keyof Leaderboard]?.[Object.keys(leaders?.[sport as keyof Leaderboard] || {})[i]] || 0 }
    }
    chartData.sort((a, b) => b.points - a.points);

    const visibleChartData = chartData.slice(0, 5);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading leaderboard</div>;

    return ( //TODO: need to fix the scrollbar
        <div className="flex flex-col items-center justify-center overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <Card className="min-h-50 max-h-125 min-w-50 max-w-125 h-75 w-75" >
                <CardHeader className="sticky border-2 border-gray-200 top-0 rounded-lg bg-gray-300 z-1">
                    <CardTitle className="text-purple-500">{sport.charAt(0).toUpperCase() + sport.slice(1)}</CardTitle>
                </CardHeader>
                <CardContent className="mt-5">
                    <div >
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                width={600}
                                height={300}
                                accessibilityLayer
                                data={visibleChartData}
                                layout="vertical"
                                margin={{
                                    right: 100,
                                }}
                            >
                                <CartesianGrid horizontal={false} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                    hide
                                />
                                <XAxis dataKey="points" type="number" hide />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Bar
                                    dataKey="points"
                                    layout="vertical"
                                    fill="var(--color-points)"
                                    radius={4}
                                    onClick={(e) => navigate("/profile/" + e.payload.name)}
                                >
                                    <LabelList
                                        dataKey="name"
                                        position="insideLeft"
                                        offset={8}
                                        className="fill-foreground"
                                        fontSize={12}
                                    />
                                    <LabelList
                                        dataKey="points"
                                        position="right"
                                        offset={8}
                                        className="fill-foreground"
                                        fontSize={12}
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>

    )
}

function Leaderboard() {
    return (
        <div className="flex flex-wrap justify-center gap-10 mt-10">
            <LeaderboardCard sport="basketball" />
            <LeaderboardCard sport="soccer" />
            <LeaderboardCard sport="football" />
            <LeaderboardCard sport="baseball" />
            <LeaderboardCard sport="hockey" />
            <LeaderboardCard sport="tennis" />
            <LeaderboardCard sport="total" />


        </div>

    )
}



export default function LeaderboardPage() { //images generated using Gemini
    return (
        <SidebarLayout>
            <Leaderboard />
        </SidebarLayout>
    )
}