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
    { name, image, description, url, analogy, disabled = false }: { name: string, image: string, description: string, url: string, analogy: string, disabled?: boolean }
) {
    const params = useParams();
    const { sport } = useParams<Params>();
    const { trigger: createGame, isMutating } = useNewGame();
    const { user, isLoading, isError, errorMessage } = currUser();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (disabled) return;

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

        <div className="flex flex-col">
            <button
                className={`transition-all ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer active:scale-95'}`}
                onClick={(e) => (handleSubmit(e))}
                disabled={disabled}
            >
                <Card className="w-[280px] h-[240px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <CardHeader className="sticky top-0 z-2 rounded-none border-b bg-gray-100/90 backdrop-blur supports-[backdrop-filter]:bg-gray-100/80 py-3">
                        <CardTitle className="text-base font-semibold text-gray-800">{name}</CardTitle>
                        <CardDescription className="text-xs italic text-gray-600">"{analogy}"</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4 flex items-center justify-center">
                        <img src={image} alt="image" className="h-20 w-20 rounded-md object-cover shadow" />
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pb-4">
                        <div className="flex gap-2 font-medium leading-snug">
                            {description}
                        </div>
                    </CardFooter>
                </Card>
            </button>
        </div>


    )
}

function Games() { //rapid fire and around the horn need to generate new games, will do later
    const params = useParams<Params>();
    const sportName = params.sport?.charAt(0).toUpperCase() + params.sport?.slice(1) || "Games";

    return (
        <div className="w-full">
            {/* Header Bar */}
            <div className="sticky top-0 z-2 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">{sportName} Games</h1>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-16 gap-y-12 p-8 sm:grid-cols-2 lg:grid-cols-3">
                <GameCard name="Tower of Power" image={tower} description="Who wants to be a millionaire?" url="/tower_of_power/" analogy="It's like scaling Mount Fuji" />
                <GameCard name="Rapid Fire" image={fire} description="Coming soon..." url="/rapid_fire/" analogy="... requires rapid response!" disabled={true} />
                <GameCard name="Around the Horn" image={around} description="Coming soon..." url="/around_the_horn/" analogy="Duck duck goose!" disabled={true} />
            </div>
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