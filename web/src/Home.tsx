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
import axios from "axios"
import useSWRMutation from "swr/mutation"

type CreateGamePayload = { id: number };
type CreateGameResponse = { id: number, sport: string, type: string };

function useCreateGame() {
    return useSWRMutation<
        CreateGameResponse,
        Error,
        "/games",
        CreateGamePayload
    >(
        "/games",
        async (_url, { arg: { id } }) => {
            const res = await axios.post<CreateGameResponse>(
                `http://localhost:5000/games/${id}`,
                { id: id },
                { withCredentials: true }
            );
            return res.data;
        }
    );
}

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
                throw new Error("Must be logged in to create game");
            }
            const { id, type, sport } = await createGame({ id: parseInt(inputValue) });
            navigate("/games/" + sport + "/" + type + "/" + id);
        } catch (error: any) {
            // 4) On 4xx/5xx, display message
            setErrMsg(error.message + " " + error.response.data.error + errorMessage)
        }

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