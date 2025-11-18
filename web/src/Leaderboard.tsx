"use client"

import { useState, useEffect } from "react"
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

// Custom label component to truncate long names
const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    const maxLength = Math.floor(width / 7); // Approximate character width
    const displayValue = value.length > maxLength && maxLength > 3
        ? value.slice(0, maxLength - 3) + '...'
        : value;

    return (
        <text
            x={x + 8}
            y={y + height / 2}
            dominantBaseline="middle"
            fill="currentColor"
            fontSize={12}
            textAnchor="start"
            style={{ pointerEvents: "none" }}
        >
            {displayValue}
        </text>
    );
};

function LeaderboardCard(
    { sport }: { sport: string }
) {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { leaders, isLoading, isError } = leaderboard();

    const { user, isLoading: isLoadingUser, isError: isErrorUser } = currUser();

    const chartData = []

    for (let i = 0; i < (Object.keys(leaders?.[sport as keyof Leaderboard] || {}).length || 0); i++) {
        chartData[i] = { name: Object.keys(leaders?.[sport as keyof Leaderboard] || {})[i], points: leaders?.[sport as keyof Leaderboard]?.[Object.keys(leaders?.[sport as keyof Leaderboard] || {})[i]] || 0 }
    }
    chartData.sort((a, b) => b.points - a.points);

    // Limit to top 10 scores and add rankings with tie detection
    const top10 = chartData.slice(0, 10);
    const top10Data = top10.map((item, index) => {
        let rank = index + 1;
        let rankText = '';

        // Check if current score ties with previous score
        if (index > 0 && item.points === top10[index - 1].points) {
            // Find the rank of the first person with this score
            let tiedRank = rank;
            for (let i = index - 1; i >= 0; i--) {
                if (top10[i].points === item.points) {
                    tiedRank = i + 1;
                } else {
                    break;
                }
            }
            rankText = 'T-' + tiedRank;
        } else {
            // Check if next person has same score (we're the first in a tie)
            if (index < top10.length - 1 && item.points === top10[index + 1].points) {
                rankText = 'T-' + rank;
            } else {
                rankText = '#' + rank;
            }
        }

        return {
            name: item.name,
            points: item.points,
            rank: rankText
        };
    });

    if (isLoading || isLoadingUser) return <div>Loading...</div>;
    if (isError || isErrorUser) return <div>Error loading leaderboard</div>;

    return (
        <div className="flex flex-col w-full overflow-hidden">
            <Card className="w-full h-auto min-h-[300px] sm:min-h-[400px] md:min-h-[500px] rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <CardHeader className="sticky top-0 z-2 rounded-t-xl border-b bg-gray-100/90 backdrop-blur supports-[backdrop-filter]:bg-gray-100/80 py-2 sm:py-3">
                    <CardTitle className="text-sm sm:text-base font-semibold text-gray-800">{sport.charAt(0).toUpperCase() + sport.slice(1)}</CardTitle>
                </CardHeader>
                <CardContent className="mt-3 sm:mt-5 px-1 sm:px-5 overflow-hidden">
                    <ChartContainer config={chartConfig} className="h-[250px] sm:h-[320px] md:h-[420px] w-full overflow-hidden">
                        <BarChart
                            accessibilityLayer
                            data={top10Data}
                            layout="vertical"
                            margin={{
                                top: 10,
                                right: windowWidth < 640 ? 2 : windowWidth < 1024 ? 15 : 30,
                                left: windowWidth < 640 ? 2 : 10,
                                bottom: 10,
                            }}
                            barCategoryGap={windowWidth < 640 ? "3%" : "1%"}
                            maxBarSize={windowWidth < 640 ? 30 : undefined}

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
                            <XAxis
                                dataKey="points"
                                type="number"
                                hide
                                domain={[0, 'dataMax']}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Bar dataKey="points" layout="vertical" radius={4}>
                                {top10Data.map((entry, index) => (
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
                                    content={CustomLabel}
                                    className="fill-foreground"
                                />
                                {windowWidth >= 640 && (
                                    <LabelList
                                        dataKey="rank"
                                        position="right"
                                        offset={8}
                                        className="fill-gray-500"
                                        fontSize={12}
                                        style={{ pointerEvents: "none" }}
                                    />
                                )}
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
                <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center px-4 sm:px-6">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Leaderboard</h1>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 sm:p-6 lg:p-8">
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