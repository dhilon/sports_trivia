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
import { useParams } from "wouter"
import { SidebarLayout } from "./SidebarLayout"
const chartData = [
    { browser: "basketball", desktop: "#1", visitors: 187, fill: "var(--color-basketball)" },
    { browser: "hockey", desktop: "#2", visitors: 200, fill: "var(--color-hockey)" },
    { browser: "baseball", desktop: "#131", visitors: 275, fill: "var(--color-baseball)" },
    { browser: "tennis", desktop: "#34", visitors: 173, fill: "var(--color-tennis)" },
    { browser: "football", desktop: "#26", visitors: 90, fill: "var(--color-football)" },
    { browser: "soccer", desktop: "#26", visitors: 90, fill: "var(--color-soccer)" },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    visitors: {
        label: "Visitors",
    },
    basketball: {
        label: "Basketba",
        color: "hsl(var(--chart-1))",
    },
    hockey: {
        label: "hockey",
        color: "hsl(var(--chart-2))",
    },
    baseball: {
        label: "baseball",
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
    const params = useParams();
    return (
        <div className="flex items-center justify-center">
            <Card className="w-[550px] items-center space-x-4" >
                <CardHeader>
                    <CardTitle>{params.name}'s Profile</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
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
                                dataKey="visitors"
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
                                    dataKey="desktop"
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
                        Showing total visitors for the last 6 months
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