"use client"

import { TrendingUp } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SidebarLayout } from "./SidebarLayout"

function GameCard(
    { name, image, description }: { name: string, image: string, description: string }
) {

    return (
        <Card className="min-h-50 max-h-125 min-w-50 max-w-125 h-70 w-70">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                {image}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    {description}
                </div>
            </CardFooter>
        </Card>
    )
}

function Games() {
    return (
        <div className="flex flex-wrap flex-row w-fit ml-auto mr-auto gap-10 ">
            <GameCard name="Tower of Power" image="image" description="wow" />
            <GameCard name="Rapid Fire" image="image" description="wow" />
            <GameCard name="Around the Horn" image="image" description="wow" />
        </div>

    )
}



export default function GamesPage() {
    return (
        <SidebarLayout>
            <Games />
        </SidebarLayout>
    )
}