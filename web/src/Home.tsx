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

function JoinCard() {

    return (

        <Card className="min-h-50 max-h-125 min-w-50 max-w-125 h-70 w-70" >
            <CardHeader>
                <CardTitle>Join Game</CardTitle>
                <CardDescription>Enter Code</CardDescription>
            </CardHeader>
            <CardContent>
                <img src={together} alt="image" className="min-h-10 max-h-50 min-w-10 max-w-50 h-25 w-25" />
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    <Input placeholder="Code:"></Input>
                    <Link className="shadow-lg cursor-pointer h-6 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 rounded-lg" href={"/games/" + "basketball"}>
                        <SendHorizonalIcon></SendHorizonalIcon>
                    </Link>

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
                    <CardDescription>January - June 2024</CardDescription>
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
            <HomeCard image={soccer} description="Is it really futból?" sport="Soccer" />
            <HomeCard image={football} description="wow" sport="Football" />
            <HomeCard image={baseball} description="Is it really the hardest thing to do in pro sports?" sport="Baseball" />
            <HomeCard image={hockey} description="Can you skate?" sport="Hockey" />
            <HomeCard image={tennis} description="wow" sport="Tennis" />
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