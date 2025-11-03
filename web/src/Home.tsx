"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SidebarLayout } from "./SidebarLayout"
import { Link } from "wouter"

import basketball from "basketball.jpeg"
import soccer from "soccer.jpeg"
import baseball from "baseball.jpeg"
import hockey from "hockey.jpeg"
import football from "football.jpeg"
import tennis from "tennis.jpeg"
import { Input } from "./components/ui/input"
import { SendHorizonalIcon } from "lucide-react"
import together from "together.jpeg"
import { useState } from "react"
import { navigate } from "wouter/use-browser-location"
import { currUser } from "./components/CurrUser"
import useCreateGame from "./components/CreateGame"
import favicon from "../favicon.jpg"



function JoinCard() {

    const [inputValue, setInputValue] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const { user, isLoading, isError, errorMessage } = currUser();
    const { trigger: createGame, isMutating } = useCreateGame();

    const handleClick = async (e: React.FormEvent) => {
        e.preventDefault(); //prevent immediate link href

        if (isLoading || isMutating) return <div>Loading...</div>;

        try {
            if (!user?.username || isError) {
                throw new Error("Must be logged in to join game");
            }
            const { id, type, sport } = await createGame({ id: parseInt(inputValue), status: "", time: 0, score: 0, current_question: 0 });
            navigate("/games/" + sport + "/" + type + "/" + id);
        } catch (error: any) {
            // 4) On 4xx/5xx, display message
            setErrMsg(error.response.data.error + errorMessage)
        }

    };




    return (

        <div className="flex flex-col">
            <Card className="w-[280px] h-[220px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="sticky top-0 z-10 rounded-none border-b bg-gray-100/90 backdrop-blur supports-[backdrop-filter]:bg-gray-100/80 py-3">
                    <CardTitle className="text-base font-semibold text-gray-800">Join Game</CardTitle>
                </CardHeader>
                <CardContent className="mt-4 flex items-center justify-center">
                    <CardDescription className="absolute left-4 top-12 text-xs text-red-600">{errMsg}</CardDescription>
                    <img src={together} alt="image" className="h-20 w-20 rounded-md object-cover shadow" />
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-xs pb-4">
                    <div className="flex gap-2 font-medium leading-none w-full">
                        <form onSubmit={handleClick} className="flex gap-2 w-full">
                            <Input placeholder="Code:" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="h-8 text-xs" />
                            <button type="submit" className="h-8 rounded-lg bg-white px-2 shadow transition-all hover:bg-gray-100 active:scale-95 dark:bg-gray-900 dark:hover:bg-gray-800">
                                <SendHorizonalIcon className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </CardFooter>
            </Card>
        </div>



    )
}

function HomeCard(
    { image, sport, question }: { image: string, sport: string, question: string }
) {

    return (
        <div className="flex flex-col">
            <Link className="cursor-pointer transition-all active:scale-95" href={"/games/" + sport.toLowerCase()}>
                <Card className="w-[280px] h-[220px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <CardHeader className="sticky top-0 z-1 rounded-none border-b bg-gray-100/90 backdrop-blur supports-[backdrop-filter]:bg-gray-100/80 py-3">
                        <CardTitle className="text-base font-semibold text-gray-800">{sport}</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-4 flex items-center justify-center">
                        <img src={image} alt="image" className="h-20 w-20 rounded-md object-cover shadow" />
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pb-4">
                        <div className="flex gap-2 font-medium leading-snug">
                            {question}
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </div >


    )
}

function Home() {
    return (
        <div className="w-full">
            {/* Header Bar */}
            <div className="sticky top-0 z-2 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
                    <div className="flex items-center gap-3">
                        <img src={favicon} alt="favicon" className="h-10 w-10 rounded-lg" />
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">SportsQuiz</h1>
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-16 gap-y-12 p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <HomeCard image={basketball} question="Is Michael Jordan the GOAT?" sport="Basketball" />
                <HomeCard image={soccer} question="Is it actually futból?" sport="Soccer" />
                <HomeCard image={football} question="Are the Lions ever winning the Super Bowl?" sport="Football" />
                <HomeCard image={hockey} question="Can you skate?" sport="Hockey" />
                <HomeCard image={tennis} question="Will the Big Three ever be topped?" sport="Tennis" />
                <HomeCard image={baseball} question="Is hitting a baseball really the hardest thing to do in pro sports?" sport="Baseball" />
                <JoinCard />
            </div>
        </div>

    )
}



export default function HomePage() { //images generated using Gemini
    return (
        <SidebarLayout>
            <Home />
        </SidebarLayout>
    )
}