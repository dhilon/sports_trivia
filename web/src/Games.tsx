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
import { Link, useParams } from "wouter"
import tower from "tower.jpeg"
import fire from "fire.jpeg"
import around from "around.jpeg"


function GameCard(
    { name, image, description, url, analogy }: { name: string, image: string, description: string, url: string, analogy: string }
) {
    const params = useParams();

    return (

        <Link className="shadow-lg cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 rounded-lg" href={"/games/" + params.sport + url + "2"}>
            <Card className="min-h-50 max-h-125 min-w-50 max-w-125 h-70 w-70" >
                <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <img src={image} alt="image" className="min-h-10 max-h-50 min-w-10 max-w-50 h-25 w-25" />
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        {analogy}
                    </div>
                    <div className="leading-none text-muted-foreground">
                        {description}
                    </div>
                </CardFooter>
            </Card>
        </Link>


    )
}

function Games() { //rapid fire and around the horn need to generate new games, will do later
    return (
        <div className="flex flex-wrap flex-row w-fit ml-auto mr-auto gap-10 ">
            <GameCard name="Tower of Power" image={tower} description="wow" url="/pyramid/" analogy="Funny analogy" />
            <GameCard name="Rapid Fire" image={fire} description="wow" url="/rapid_fire/" analogy="Funny analogy" />
            <GameCard name="Around the Horn" image={around} description="wow" url="/around_the_horn/" analogy="Funny analogy" />

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