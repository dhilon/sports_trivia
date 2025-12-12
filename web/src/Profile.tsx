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
import useSWR, { mutate } from "swr"
import { formatRelativeDate } from "./lib/dateUtils"
import { ChangeEvent, useRef, useState, useEffect } from "react"
import useEditUser from "./components/EditUser"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { currUser } from "./components/CurrUser"


const chartData = [
    { browser: "basketball", ranking: "#1", points: 0, fill: "var(--color-basketball)" },
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

// Generate a consistent color from a string (for initials)
const getColorFromString = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
};

function ChangeUsernameDialog({ onClose, onErrorMessage }: { onClose: () => void, onErrorMessage: (error: string) => void }) {
    const [newUsername, setNewUsername] = useState('');
    const { trigger: editUser, isMutating } = useEditUser();
    const { user, refresh } = currUser();

    const handleChangeUsername = async () => {
        if (!newUsername) {
            return;
        }
        try {
            await editUser({
                id: user?.id || 0,
                username: newUsername,
                pwd: "1",
                scores: {},
                friends: [],
                profile_picture: "",
            });
            // Only update cache after successful server response
            if (user?.id) {
                mutate(`/users/${user.id}`);
            }
            refresh();
            onErrorMessage("Username changed successfully");
            onClose();
        } catch (err: any) {
            onErrorMessage(err.response?.data?.error || "Failed to change username");
            onClose();
        }
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
            <Card className="w-full max-w-md rounded-xl bg-gray-100 border border-gray-300 shadow-lg mt-[120px]">
                <CardHeader className="rounded-t-xl bg-gray-100 border-b border-gray-200">
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900">Change Username</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <Input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        disabled={isMutating}
                        placeholder="Enter new username"
                        className="w-full"
                    />
                    <div className="flex gap-3 justify-end">
                        <Button
                            onClick={onClose}
                            disabled={isMutating}
                            variant="outline"
                            className="px-6 rounded-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleChangeUsername}
                            disabled={isMutating}
                            className="px-6 rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                        >
                            {isMutating ? "Changing..." : "Change"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function Profile() {
    const { user } = currUser();

    const { data, isLoading, error, mutate } = useSWR(user?.id ? `/users/${user.id}` : null);
    const { data: rankings, isLoading: rankingsLoading, error: rankingsError } = useSWR(user?.id ? `/rankings/${user.id}` : null);

    const { trigger: editUser, isMutating, error: editUserError } = useEditUser();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [showChangeUsername, setShowChangeUsername] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // Fetch leaderboard data for all sports to detect ties
    const { data: leaderboardData, isLoading: leaderboardLoading, error: leaderboardError } = useSWR('/leaderboard');

    // Clear success messages after 3 seconds
    useEffect(() => {
        if (errorMessage === 'Username changed successfully' || errorMessage === 'Profile picture updated successfully') {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    if (!data) return null;
    if (error || rankingsError || leaderboardError) return <div>Error: {error?.message || rankingsError?.message || leaderboardError?.message}</div>;
    if (isLoading || rankingsLoading || leaderboardLoading) return <div>loading...</div>

    chartData[0].points = data.scores.basketball ?? 0 //get onclick to view overall leaderboards for each sport
    chartData[1].points = data.scores.soccer ?? 0
    chartData[2].points = data.scores.football ?? 0  // football is at index 2
    chartData[3].points = data.scores.hockey ?? 0    // hockey is at index 3
    chartData[4].points = data.scores.tennis ?? 0
    chartData[5].points = data.scores.baseball ?? 0  // baseball is at index 5




    // Helper function to detect ties and format rank (same logic as Leaderboard)
    const formatRank = (sportName: string) => {
        const userScore = rankings?.[sportName]?.score ?? 0;
        const sportLeaderboard = leaderboardData?.[sportName];

        if (!sportLeaderboard) {
            return '#0';
        }

        // Convert leaderboard object to sorted array of {name, score}
        // Handle both number (legacy) and object (new format with {id, score}) formats
        const leaderboardArray = Object.entries(sportLeaderboard).map(([name, value]) => {
            const score = typeof value === 'number' ? value : (typeof value === 'object' && value !== null && 'score' in value ? (value as { score: number }).score : 0);
            return { name, score };
        }).sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.name.localeCompare(b.name);
        });

        // Find user's position
        const userIndex = leaderboardArray.findIndex(entry => entry.name === user?.username);
        if (userIndex === -1) {
            return '#0';
        }

        const rank = userIndex + 1;

        // Check if current score ties with previous score
        if (userIndex > 0 && leaderboardArray[userIndex].score === leaderboardArray[userIndex - 1].score) {
            // Find the rank of the first person with this score
            let tiedRank = rank;
            for (let i = userIndex - 1; i >= 0; i--) {
                if (leaderboardArray[i].score === userScore) {
                    tiedRank = i + 1;
                } else {
                    break;
                }
            }
            return 'T-' + tiedRank;
        }

        // Check if next person has same score (we're the first in a tie)
        if (userIndex < leaderboardArray.length - 1 && leaderboardArray[userIndex].score === leaderboardArray[userIndex + 1].score) {
            return 'T-' + rank;
        }

        return '#' + rank;
    };

    chartData[0].ranking = formatRank('basketball');
    chartData[1].ranking = formatRank('soccer');
    chartData[2].ranking = formatRank('football');  // football is at index 2
    chartData[3].ranking = formatRank('hockey');    // hockey is at index 3
    chartData[4].ranking = formatRank('tennis');
    chartData[5].ranking = formatRank('baseball');  // baseball is at index 5

    // Calculate total points from all sports
    const totalPoints = (data.scores.basketball ?? 0) +
        (data.scores.soccer ?? 0) +
        (data.scores.hockey ?? 0) +
        (data.scores.baseball ?? 0) +
        (data.scores.tennis ?? 0) +
        (data.scores.football ?? 0);

    const handleProfilePicChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const readAsDataUrl = (file: File) =>
            new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

        try {
            const dataUrl = await readAsDataUrl(file);

            // Optimistic update with data URL so it survives reload after persisting
            mutate({ ...data, rankings: rankings, profile_picture: dataUrl }, false);

            await editUser({
                id: data.id || 0,
                username: "",
                pwd: "",
                scores: {},
                friends: [],
                profile_picture: dataUrl,
            });

            // Revalidate to pick up server response
            mutate();
            setErrorMessage("Profile picture updated successfully");
        } catch (err: any) {
            // On failure, fall back to previous picture in cache
            mutate();
            setErrorMessage("Failed to update profile picture");
        }
    }



    if (isMutating || editUserError) return <div>Error: {editUserError?.message}</div>;
    if (isLoading || rankingsLoading || leaderboardLoading || isMutating) return <div>loading...</div>

    return (
        <div className="w-full">
            {/* Header Bar */}
            <div className="sticky top-0 z-2 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center px-4 sm:px-6 gap-3">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                        aria-label="Change profile picture"
                    >
                        {data.profile_picture && (data.profile_picture.startsWith('http') || data.profile_picture.startsWith('data:') || data.profile_picture.startsWith('/')) ? (
                            <img
                                src={data.profile_picture}
                                alt={data.username}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div
                                className="h-full w-full rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: getColorFromString(data.username || '') }}
                            >
                                {(data.username || '?').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        id="profile_picture"
                        name="profile_picture"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                    />
                    <h1 onClick={() => {
                        setErrorMessage('');
                        setShowChangeUsername(true);
                    }} className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 truncate">{data.username}'s Profile</h1>
                    {showChangeUsername && (
                        <ChangeUsernameDialog
                            onClose={() => {
                                setShowChangeUsername(false);
                            }}
                            onErrorMessage={setErrorMessage}
                        />
                    )}
                    {errorMessage !== '' && errorMessage !== 'Username changed successfully' && errorMessage !== 'Profile picture updated successfully' && <p className="text-red-500 mt-2 ml-2">{errorMessage}</p>}
                    {(errorMessage === 'Username changed successfully' || errorMessage === 'Profile picture updated successfully') && <p className="text-green-500 mt-2 ml-2">{errorMessage}</p>}
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl p-3">
                <Card className="border border-gray-200 bg-white shadow-sm rounded-xl max-h-[650px]">
                    <CardHeader className="border-b bg-gray-100/90 backdrop-blur rounded-t-xl py-3 sm:py-4">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 truncate">{data.username}'s Statistics</CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-gray-600">Member since {formatRelativeDate(data.created_at)}</CardDescription>
                    </CardHeader>
                    <CardContent className="items-center justify-center mt-3 sm:mt-8 max-h-[480px] overflow-y-auto px-2 sm:px-4">
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
                                        className="fill-gray-500"
                                        fontSize={12}
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm border-t bg-gray-50/50 rounded-b-xl py-4">
                        <div className="leading-none text-muted-foreground text-xs">
                            Total points for the last 6 months: {totalPoints}
                        </div>
                    </CardFooter>
                </Card>
            </div>
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