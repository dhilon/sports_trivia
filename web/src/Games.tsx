import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { NavSidebar } from "./NavSidebar"


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

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <NavSidebar />
            <main className='flex flex-col relative'>
                <SidebarTrigger />
                <div className='w-full'>{children}</div>

            </main>
        </SidebarProvider>
    )
}

function Games() {
    return (
        <div className="grid grid-cols-3 gap-10 w-[1000px] h-[400px]">
            <Card>
                <CardHeader>
                    <CardTitle>Tower of Power</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    Image
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing total visitors for the last 6 months
                    </div>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Rapid Fire</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    Image
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing total visitors for the last 6 months
                    </div>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Around the Horn</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    Image
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing total visitors for the last 6 months
                    </div>
                </CardFooter>
            </Card>
        </div>

    )
}



export default function GamesPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center md:p-10">
            <div className="w-full max-w-svh">
                <SidebarLayout>
                    <Games />
                </SidebarLayout>
            </div>
        </div>
    )
}