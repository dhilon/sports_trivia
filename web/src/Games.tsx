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
import { useParams } from "wouter"
import tower from "tower.jpeg"
import fire from "fire.jpeg"
import around from "around.jpeg"

import { useState } from "react"
import axios from "axios";
import useSWRMutation from "swr/mutation";
import { navigate } from "wouter/use-browser-location"

type CreateGamePayload = { type: string; sport: string };
type CreateGameResponse = { id: number };

function useCreateGame() {
    return useSWRMutation<
        CreateGameResponse,
        Error,
        "/games",
        CreateGamePayload
    >(
        "/games",
        async (_url, { arg: { type, sport } }) => {
            const res = await axios.post<CreateGameResponse>(
                "http://localhost:5000/games/",
                { type: type, sport: sport },
                { withCredentials: true }
            );
            return res.data;
        }
    );
}

type Params = { sport: string };


function GameCard(
    { name, image, description, url, analogy }: { name: string, image: string, description: string, url: string, analogy: string }
) {
    const params = useParams();
    const { sport } = useParams<Params>();
    const [isLoading, setIsLoading] = useState(false);
    const { trigger: createGame, isMutating } = useCreateGame();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        // 2) Send credentials to Flask
        try {
            const id = (await createGame({ type: name, sport })).id;
            navigate("/games/" + params.sport + url + id);
        } catch (error: any) {
            // 4) On 4xx/5xx, display message
            const serverMsg = error.response?.data?.error;
        } finally {
            setIsLoading(false);
        }



    }

    return (

        <button className="shadow-lg cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 rounded-lg" onClick={(e) => (handleSubmit(e))}>
            <Card className="min-h-50 max-h-125 min-w-50 max-w-125 h-70 w-70" >
                <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>"{analogy}"</CardDescription>
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
        </button>


    )
}

function Games() { //rapid fire and around the horn need to generate new games, will do later
    return (
        <div className="flex flex-wrap flex-row w-fit ml-auto mr-auto gap-10 ">
            <GameCard name="Tower of Power" image={tower} description="Can you take on every single level of this timed pyramid and not lose all your points?" url="/pyramid/" analogy="It's like scaling Mount Fuji" />
            <GameCard name="Rapid Fire" image={fire} description="Which one of your friends can answer correctly first?" url="/rapid_fire/" analogy="Just don't be last" />
            <GameCard name="Around the Horn" image={around} description="Answer your question whenever you can, but don't be the one to flame out. Circles are endless" url="/around_the_horn/" analogy="Duck duck and you're the goose" />

        </div>

    )
}



export default function GamesPage() { //images generated using Gemini
    return (
        <SidebarLayout>
            <Games />
        </SidebarLayout>
    )
}