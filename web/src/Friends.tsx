"use client"

import { PlusCircleIcon, TrendingUp } from "lucide-react"
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
import { SidebarLayout } from "./SidebarLayout"
import { Redirect, useParams } from "wouter"
import useSWR from "swr"
import { useState } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
const chartData = [
    { name: "bob", points: 186 },
]

const chartConfig = {
    points: {
        label: "Points",
        color: "hsl(var(--chart-1))",
    },
    label: {
        color: "hsl(var(--background))",
    },
} satisfies ChartConfig


function Friends() {



    const [uName, setUName] = useState('');
    const [sum, setSum] = useState(0);
    const [inputValue, setInputValue] = useState('');

    const params = useParams();
    const { data: user, error, isLoading } = useSWR(`/profile/` + params.name)

    if (error) return <Redirect to="/" />;
    if (isLoading) return <div>loading...</div>


    for (let i = 0; i < user.friends.length; i++) {
        chartData[i] = { name: user.friends[i], points: 186 }; //need to find a way to loop through data fetch to get summed score
    }




    const handleClick = () => {

    }

    return (
        <div className="ml-auto mr-auto lg:w-120 lg:h-120">
            <div>
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
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            Trending up by 5.2% this name <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Showing total visitors for the last 6 names
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div className="mt-5 flex items-center justify-center space-x-3">
                <Input
                    placeholder="Add Friend:"
                    className="w-100"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <Button
                    className="shadow-lg bg-green-600 cursor-pointer transition-all hover:bg-green-200 active:scale-95 w-10 h-10 rounded-full grid place-items-center"
                    onClick={() => handleClick()}
                >
                    <PlusCircleIcon />
                </Button>
            </div>

        </div>

    )
}

export default function FriendsPage() {
    return (
        <SidebarLayout>
            <Friends />
        </SidebarLayout>
    )
}