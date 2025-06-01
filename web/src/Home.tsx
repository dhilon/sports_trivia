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
import { Link, Redirect } from "wouter"

import basketball from "basketball.jpeg"
import soccer from "soccer.jpeg"
import baseball from "baseball.jpeg"
import hockey from "hockey.jpeg"
import football from "football.jpeg"
import tennis from "tennis.jpeg"
import { Input } from "./components/ui/input"
import { SendHorizonalIcon } from "lucide-react"
import together from "together.jpeg"
import useSWR from "swr"
import { Game } from "./types"
import { useState } from "react"
import { navigate } from "wouter/use-browser-location"

function JoinCard() {

    const [inputValue, setInputValue] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const { data: game, error, isLoading } = useSWR<Game>(
        inputValue ? `/games/${inputValue}` : null,
    );

    const handleClick = (e: React.FormEvent) => {
        e.preventDefault(); //prevent immediate link href

        if (error) {
            setErrMsg("No Game with that ID Found")
            return <Redirect to="/" />
        }
        if (isLoading) return <div>loading...</div>

        navigate("/games/" + game?.sport + "/" + game?.type + "/" + inputValue); //could probably just remove the Link but idk

    };




    return (

        <Card className="min-h-50 max-h-125 min-w-50 max-w-125 h-70 w-70" >
            <CardHeader>
                <CardTitle>Join Game</CardTitle>
                <CardDescription className="text-red-600">{errMsg}</CardDescription>
            </CardHeader>
            <CardContent>
                <img src={together} alt="image" className="min-h-10 max-h-50 min-w-10 max-w-50 h-25 w-25" />
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    <Input placeholder="Code:" value={inputValue} onChange={(e) => setInputValue(e.target.value)}></Input>
                    <button className="shadow-lg cursor-pointer h-6 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 rounded-lg" onClick={(e) => (handleClick(e))}>
                        <SendHorizonalIcon></SendHorizonalIcon>
                    </button>

                </div>
            </CardFooter>
        </Card>


    )
}

function HomeCard(
    { image, description, sport }: { image: string, description: string, sport: string }
) {

    return (
        <Link className="shadow-lg cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 rounded-lg" href={"/games/" + sport.toLowerCase()}>
            <Card className="min-h-50 max-h-125 min-w-50 max-w-125 h-70 w-70" >
                <CardHeader>
                    <CardTitle>{sport}</CardTitle>
                    <CardDescription>A sport</CardDescription>
                </CardHeader>
                <CardContent>
                    <img src={image} alt="image" className="min-h-10 max-h-50 min-w-10 max-w-50 h-25 w-25" />
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        {description}
                    </div>
                </CardFooter>
            </Card>
        </Link>


    )
}

function Home() {
    return (
        <div className="flex flex-wrap justify-center gap-10 ">
            <HomeCard image={basketball} description="Is Michael Jordan the GOAT?" sport="Basketball" />
            <HomeCard image={soccer} description="Is it actually futból?" sport="Soccer" />
            <HomeCard image={football} description="Are the Lions ever winning the Super Bowl?" sport="Football" />
            <HomeCard image={baseball} description="Is hitting a baseball really the hardest thing to do in pro sports?" sport="Baseball" />
            <HomeCard image={hockey} description="Can you skate?" sport="Hockey" />
            <HomeCard image={tennis} description="Will the Big Three ever be topped?" sport="Tennis" />
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