"use client"

import { PlusCircleIcon, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { mutate } from "swr"

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
import { useState } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { currUser } from "./components/CurrUser"
import useEditUser from "./components/EditUser"
const chartData = [
    {},
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


    const [inputValue, setInputValue] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const { user, isLoading, isError, errorMessage } = currUser();

    const { trigger: createUser, isMutating, error } = useEditUser();

    if (isError || error) return <div>Error: {errorMessage}</div>;
    if (isLoading || isMutating) return <div>loading...</div>

    for (let i = 0; i < (user?.friends?.length || 0); i++) {
        let sum = 0;
        for (let c = 0; c < 6; c++) {
            const scores = user?.friends[i]?.scores;
            if (!scores) continue;
            const scoreValues = Object.values(scores);
            sum += scoreValues[c] || 0;
        }
        chartData[i] = { name: user?.friends[i]?.username || "", points: sum }
    }

    chartData.sort((a, b) => {
        const pointsA = (a as { points: number }).points || 0;
        const pointsB = (b as { points: number }).points || 0;
        return pointsB - pointsA;
    });

    const handleClick = async () => {
        try {
            await createUser({
                uName: user?.username || "",
                pwd: "",
                scores: user?.scores || {},
                friends: [inputValue]
            });
            setErrMsg("Friend added");
            setInputValue(''); // Clear input after successful add
            // Revalidate user data with the correct URL
            mutate("http://localhost:5000/me/");
        } catch (error: any) {
            if (error?.response?.status === 400) {
                setErrMsg("Friend already added");
            }
            else if (error?.response?.status === 404) {
                setErrMsg("Friend not found");
            }
            else {
                setErrMsg("Failed to add friend");
            }
        }
    }

    return (
        <div className="flex flex-col h-full max-w-[900px] mx-auto">
            <div className="overflow-y-auto" style={{ maxHeight: '90vh' }}>
                <Card className="h-full">
                    <CardHeader className="sticky border-2 border-gray-200 top-0 rounded-xl bg-gray-300 z-1">
                        <CardTitle className="text-purple-500">Friends</CardTitle>
                        <CardDescription>Sorted by points</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-y-auto items-center justify-center mt-5">
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                accessibilityLayer
                                data={chartData}
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
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            Trending up by 5.2% this name <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Showing total scores for all users
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div className="mt-5 flex items-center justify-center space-x-3">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleClick();
                }} className="flex items-center space-x-3">
                    <Input
                        placeholder="Add Friend:"
                        className="w-100"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button
                        type="submit"
                        className="shadow-lg bg-green-600 cursor-pointer transition-all hover:bg-green-200 active:scale-95 w-10 h-10 rounded-full grid place-items-center"
                    >
                        <PlusCircleIcon />
                    </Button>
                </form>
            </div>
            <div className="flex flex-col items-center justify-center mx-auto space-y-2">
                <div className={`${errMsg === "Friend added" ? 'text-green-500' : 'text-red-500'}`}>
                    {errMsg}
                </div>
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