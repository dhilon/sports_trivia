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

import { navigate } from "wouter/use-browser-location"
import { currUser } from "./components/CurrUser"
import useNewGame from "./components/NewGame"



type Params = { sport: string };


function GameCard(
    { name, image, description, url, analogy }: { name: string, image: string, description: string, url: string, analogy: string }
) {
    const params = useParams();
    const { sport } = useParams<Params>();
    const { trigger: createGame, isMutating } = useNewGame();
    const { user, isLoading, isError, errorMessage } = currUser();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // 2) Send credentials to Flask
        try {
            if (!user?.username) {
                throw new Error("Must be logged in to create game");
            }
            const id = (await createGame({ type: name, sport })).id;
            navigate("/games/" + params.sport + url + id);
        } catch (error: any) {
            // 4) On 4xx/5xx, display message
            console.log(error.response?.data?.error);
        }



    }

    if (isLoading || isMutating) return <div>Loading...</div>;
    if (isError) return <div>Error: {errorMessage}</div>;

    return (

        <div className="flex flex-col" style={{ maxHeight: '90vh' }}>
            <button className="shadow-lg cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 rounded-lg" onClick={(e) => (handleSubmit(e))}>
                <Card className="min-h-50 max-h-125 min-w-50 max-w-125 h-70 w-70 overflow-hidden border-3 border-gray-300" >
                    <CardHeader className="sticky border-2 border-gray-200 top-0 rounded-lg bg-gray-300 z-1">
                        <CardTitle className="text-purple-500">{name}</CardTitle>
                        <CardDescription>"{analogy}"</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-5">
                        <img src={image} alt="image" className="min-h-10 max-h-50 min-w-10 max-w-50 h-25 w-25" />
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            {description}
                        </div>
                    </CardFooter>
                </Card>
            </button>
        </div>


    )
}

function Games() { //rapid fire and around the horn need to generate new games, will do later
    return (
        <div className="flex flex-wrap flex-row w-fit ml-auto mr-auto gap-10 mt-50">
            <GameCard name="Tower of Power" image={tower} description="Who wants to be a millionaire?" url="/tower_of_power/" analogy="It's like scaling Mount Fuji" />
            <GameCard name="Rapid Fire" image={fire} description="**NOT WORKING**" url="/rapid_fire/" analogy="... requires rapid response!" />
            <GameCard name="Around the Horn" image={around} description="**NOT WORKING**" url="/around_the_horn/" analogy="Duck duck goose!" />

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