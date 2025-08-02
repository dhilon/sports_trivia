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

        <div className="flex flex-col" style={{ maxHeight: '90vh' }}>
            <Card className="min-h-50 max-h-125 min-w-50 max-w-125 h-75 w-75 overflow-hidden border-3 border-gray-300" >
                <CardHeader className="sticky border-2 border-gray-200 top-0 rounded-lg bg-gray-300 z-1">
                    <CardTitle className="text-purple-500">Join Game</CardTitle>
                </CardHeader>
                <CardContent className="mt-10">
                    <CardDescription className="text-red-600">{errMsg}</CardDescription>
                    <img src={together} alt="image" className="min-h-10 max-h-50 min-w-10 max-w-50 h-25 w-25" />
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        <form onSubmit={handleClick} className="flex gap-2">
                            <Input placeholder="Code:" value={inputValue} onChange={(e) => setInputValue(e.target.value)}></Input>
                            <button type="submit" className="shadow-lg cursor-pointer h-6 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 rounded-lg">
                                <SendHorizonalIcon></SendHorizonalIcon>
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
        <div className="flex flex-col" style={{ maxHeight: '90vh' }}>
            <Link className="cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95" href={"/games/" + sport.toLowerCase()}>
                <Card className="min-h-50 max-h-125 min-w-50 max-w-125 h-75 w-75 overflow-hidden border-3 border-gray-300">
                    <CardHeader className="sticky border-2 border-gray-200 top-0 rounded-lg bg-gray-300 z-1">
                        <CardTitle className="text-purple-500">{sport}</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-10">
                        <img src={image} alt="image" className="min-h-10 max-h-50 min-w-10 max-w-50 h-25 w-25" />
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
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
        <div className="flex flex-wrap justify-center gap-10 mt-10">
            <HomeCard image={basketball} question="Is Michael Jordan the GOAT?" sport="Basketball" />
            <HomeCard image={soccer} question="Is it actually futból?" sport="Soccer" />
            <HomeCard image={football} question="Are the Lions ever winning the Super Bowl?" sport="Football" />
            <HomeCard image={hockey} question="Can you skate?" sport="Hockey" />
            <HomeCard image={tennis} question="Will the Big Three ever be topped?" sport="Tennis" />
            <HomeCard image={baseball} question="Is hitting a baseball really the hardest thing to do in pro sports?" sport="Baseball" />
            <JoinCard />

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