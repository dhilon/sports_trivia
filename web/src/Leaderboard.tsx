"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SidebarLayout } from "./SidebarLayout"
import useSWR from "swr";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Cell } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./components/ui/chart";
import { navigate } from "wouter/use-browser-location";
import { currUser } from "./components/CurrUser";


export interface Leaderboard {
    basketball: { [key: string]: number };
    soccer: { [key: string]: number };
    football: { [key: string]: number };
    baseball: { [key: string]: number };
    hockey: { [key: string]: number };
    tennis: { [key: string]: number };
    total: { [key: string]: number };
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

    const { user, isLoading: isLoadingUser, isError: isErrorUser } = currUser();

    const chartData = []

    for (let i = 0; i < (Object.keys(leaders?.[sport as keyof Leaderboard] || {}).length || 0); i++) {
        chartData[i] = { name: Object.keys(leaders?.[sport as keyof Leaderboard] || {})[i], points: leaders?.[sport as keyof Leaderboard]?.[Object.keys(leaders?.[sport as keyof Leaderboard] || {})[i]] || 0 }
    }
    chartData.sort((a, b) => b.points - a.points);
    for (let i = 0; i < (chartData.length || 0); i++) {
        chartData[i] = { name: chartData[i].name, points: chartData[i].points, rank: '#' + (i + 1) }
    }

    if (isLoading || isLoadingUser) return <div>Loading...</div>;
    if (isError || isErrorUser) return <div>Error loading leaderboard</div>;

    return (
        <div className="flex flex-col">
            <Card className="w-[280px] h-[540px] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardHeader className="sticky top-0 z-2 rounded-t-xl border-b bg-gray-100/90 backdrop-blur supports-[backdrop-filter]:bg-gray-100/80 py-3">
                    <CardTitle className="text-base font-semibold text-gray-800">{sport.charAt(0).toUpperCase() + sport.slice(1)}</CardTitle>
                </CardHeader>
                <CardContent className="mt-5">
                    <ChartContainer config={chartConfig} style={{ height: '460px' }}>

                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{
                                right: 600,
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
                            <Bar dataKey="points" layout="vertical" radius={4}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.name === user?.username ? "#32CD32" : "var(--color-points)"}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate("/profile/" + entry.name)}
                                        height={20}
                                    />
                                ))}
                                <LabelList
                                    dataKey="name"
                                    position="insideLeft"
                                    offset={8}
                                    className="fill-foreground"
                                    fontSize={12}
                                    style={{ pointerEvents: "none" }}
                                />
                                <LabelList
                                    dataKey="rank"
                                    position="right"
                                    offset={8}
                                    className="fill-foreground"
                                    fontSize={12}
                                    style={{ pointerEvents: "none" }}
                                />
                            </Bar>
                        </BarChart>

                    </ChartContainer>


                </CardContent>
            </Card>
        </div >

    )
}

function Leaderboard() {
    return (
        <div className="w-full">
            {/* Header Bar */}
            <div className="sticky top-0 z-2 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Leaderboard</h1>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-16 gap-y-12 p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <LeaderboardCard sport="basketball" />
                <LeaderboardCard sport="soccer" />
                <LeaderboardCard sport="football" />
                <LeaderboardCard sport="hockey" />
                <LeaderboardCard sport="tennis" />
                <LeaderboardCard sport="baseball" />
                <LeaderboardCard sport="total" />
            </div>
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