"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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
import { navigate } from "wouter/use-browser-location"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { NavSidebar } from "./NavSidebar"
const chartData = [
    { month: "Bob", desktop: 186, mobile: 80 },
    { month: "Jeff", desktop: 305, mobile: 200 },
    { month: "Dhilon", desktop: 237, mobile: 120 },
    { month: "Maya", desktop: 73, mobile: 190 },
    { month: "Sue", desktop: 209, mobile: 130 },
    { month: "Chad", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
    label: {
        color: "hsl(var(--background))",
    },
} satisfies ChartConfig

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <NavSidebar />
            <main className='flex flex-col relative'>
                <SidebarTrigger />
                <div className='w-full'>{children}</div>

            </main>
        </SidebarProvider>
    )
}

function Friends() {
    return (
        <div className="w-[500px] h-[200px]">
            <Card >
                <CardHeader>
                    <CardTitle>Friends</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{
                                right: 16,
                            }}
                        >
                            <CartesianGrid horizontal={false} />
                            <YAxis
                                dataKey="month"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                                hide
                            />
                            <XAxis dataKey="desktop" type="number" hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Bar
                                dataKey="desktop"
                                layout="vertical"
                                fill="var(--color-desktop)"
                                radius={4}
                                onClick={() => navigate("/leaderboard/" + chartData[0].month)} //only goes to first name in list
                            >
                                <LabelList
                                    dataKey="month"
                                    position="insideLeft"
                                    offset={8}
                                    className="fill-[--color-label]"
                                    fontSize={12}
                                />
                                <LabelList
                                    dataKey="desktop"
                                    position="right"
                                    offset={8}
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

export default function FriendsPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SidebarLayout>
                    <Friends />
                </SidebarLayout>

            </div>
        </div>
    )
}