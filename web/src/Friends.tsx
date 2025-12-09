"use client"

import { PlusCircleIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
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

    const chartData = []
    const { user, isLoading, isError, errorMessage } = currUser();
    const [showYou, setShowYou] = useState(false);

    for (let i = 0; i < (user?.friends?.length || 0); i++) {
        let sum = 0;
        for (let c = 0; c < 6; c++) {
            const scores = user?.friends[i]?.scores;
            if (!scores) continue;
            const scoreValues = Object.values(scores);
            sum += scoreValues[c] || 0;
        }
        chartData[i] = {
            name: user?.friends[i]?.username || "",
            points: sum,
            profile_picture: user?.friends[i]?.profile_picture || "/images/logo.png",
        }
    }
    if (showYou) {
        chartData.push({
            name: user?.username || "",
            points: (user?.scores.basketball || 0) + (user?.scores.soccer || 0) + (user?.scores.hockey || 0) + (user?.scores.football || 0) + (user?.scores.baseball || 0) + (user?.scores.tennis || 0),
            profile_picture: user?.profile_picture || "/images/logo.png",
        })
    }
    chartData.sort((a, b) => {
        const pointsA = (a as { points: number }).points || 0;
        const pointsB = (b as { points: number }).points || 0;
        return pointsB - pointsA;
    });

    const [inputValue, setInputValue] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const { trigger: createUser, isMutating } = useEditUser();

    const ProfilePicLabel = (props: any) => {
        const { x, y, height, width, value } = props;
        const size = 18;
        const padding = 8;
        const cx = x + (width ?? 0) + padding;
        const cy = y + height / 2 - size / 2;
        const href = value || "/images/logo.png";
        return (
            <image
                href={href}
                x={cx}
                y={cy}
                width={size}
                height={size}
                preserveAspectRatio="xMidYMid slice"
                clipPath="circle(50% at 50% 50%)"
            />
        );
    };

    if (isError) return <div>Error: {errorMessage}</div>;
    if (isLoading || isMutating) return <div>loading...</div>


    const handleClick = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || isMutating) return <div>Loading...</div>;
        try {
            await createUser({
                uName: user?.username || "",
                pwd: "",
                scores: user?.scores || {},
                friends: [inputValue],
                profile_picture: user?.profile_picture || ""
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

    const youClicked = () => {
        setShowYou(!showYou);
    }

    return (
        <div className="w-full">
            {/* Header Bar */}
            <div className="sticky top-0 z-2 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Friends</h1>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-3xl p-8">
                <Card className="border border-gray-200 bg-white shadow-sm rounded-xl max-h-[650px]">
                    <CardHeader className="border-b bg-gray-100/90 backdrop-blur rounded-t-xl py-3">
                        <CardTitle className="text-base font-semibold text-gray-800">Friends Leaderboard</CardTitle>
                        <CardDescription className="text-xs text-gray-600">Sorted by points</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-y-auto items-center justify-center mt-3 max-h-[400px]">
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
                                    opacity={0.91}
                                    onClick={(e) => navigate("/profile/" + e.payload.name)}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.name === user?.username ? "#32CD32" : "var(--color-points)"}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => navigate("/profile/" + entry.name)}
                                        />
                                    ))}
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
                                    <LabelList
                                        dataKey="profile_picture"
                                        position="right"
                                        content={ProfilePicLabel}
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-3 text-xs border-t bg-gray-50/50 rounded-b-xl py-3">
                        <div className="flex gap-2 font-medium leading-none">
                            <Button onClick={() => youClicked()} className={`rounded-lg text-xs h-8 ${showYou ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'}`}>
                                Show yourself! {showYou ? 'Yes' : 'No'}
                            </Button>
                        </div>
                        <div className="leading-none text-muted-foreground text-xs">
                            Showing total scores for all users
                        </div>
                        <div className="mt-2 flex w-full items-center space-x-3">
                            <form onSubmit={handleClick} className="flex w-full items-center space-x-2">
                                <Input
                                    placeholder="Add Friend..."
                                    className="flex-1 h-8 text-xs text-gray-800"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 active:scale-95 h-8 w-8 rounded-full p-0"
                                >
                                    <PlusCircleIcon className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                        {errMsg && (
                            <div className={`text-xs ${errMsg === "Friend added" ? 'text-green-600' : 'text-red-600'}`}>
                                {errMsg}
                            </div>
                        )}
                    </CardFooter>
                </Card>
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