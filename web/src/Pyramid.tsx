"use client"

import { SidebarLayout } from "./SidebarLayout"

type Level = {
    level: number,
    status: string,
    question: string,
    timeTaken: number
}
type PyramidLevelProps = { level: Level }

const PyramidLevel = ({ level }: PyramidLevelProps) => {
    const width = 15 / level.level;
    return (
        <div className={`flex flex-row border-2 overflow-hidden basis-10 max-w-${width}`}>
            <div className="flex-initial basis-1/6">
                Level {level.level}
            </div>
            <div className="flex-initial basis-1/6">
                {level.status}
            </div>
            <div className="flex-auto basis-3/6">
                {level.question}
            </div>
            <div className="flex-initial basis-1/6">
                {level.timeTaken} seconds
            </div>
        </div>
    )
}



const data: Level[] = [
    {
        level: 1,
        timeTaken: 316,
        status: "win",
        question: "ken99@yahoo.com",
    },
    {
        level: 2,
        timeTaken: 242,
        status: "win",
        question: "Abe45@gmail.com",
    },
    {
        level: 3,
        timeTaken: 173,
        status: "loss",
        question: "Monserrat44@gmail.com",
    },
    {
        level: 4,
        timeTaken: 874,
        status: "loss",
        question: "Silas22@gmail.com",
    },
    {
        level: 5,
        timeTaken: 721,
        status: "win",
        question: "carmella@hotmail.com",
    },
    {
        level: 6,
        timeTaken: 721,
        status: "win",
        question: "carmella@hotmail.com",
    },
    {
        level: 7,
        timeTaken: 721,
        status: "win",
        question: "carmella@hotmail.com",
    },
    {
        level: 8,
        timeTaken: 721,
        status: "win",
        question: "carmella@hotmail.com",
    },
    {
        level: 9,
        timeTaken: 721,
        status: "win",
        question: "carmella@hotmail.com",
    },
    {
        level: 10,
        timeTaken: 721,
        status: "win",
        question: "carmella@hotmail.com",
    },
    {
        level: 11,
        timeTaken: 721,
        status: "win",
        question: "carmella@hotmail.com",
    },
].reverse()

function Pyramid() {

    return (
        <div className="w-full flex flex-col">
            <div className="text-2xl">Pyramid</div>
            {data.map((level) => (<PyramidLevel level={level}></PyramidLevel>))}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    ... level(s) completed.
                </div>

            </div>
        </div>
    )
}

export default function PyramidPage() {
    return (
        <SidebarLayout>
            <Pyramid />
        </SidebarLayout>
    )
}
