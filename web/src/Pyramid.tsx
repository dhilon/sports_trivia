"use client"

import { useState } from "react"
import { SidebarLayout } from "./SidebarLayout"

type Level = {
    level: number,
    question: string,
    timeTaken: number
}
type PyramidLevelProps = { level: Level }

const PyramidLevel = ({ level }: PyramidLevelProps) => {
    const width = 60 / level.level + 25; //percent based rows
    const [isGreen, setIsGreen] = useState(false);

    const handleClick = () => {
        setIsGreen(!isGreen); // Toggle the state between true and false
    };
    return (
        <div className={`flex border-1 items-center overflow-hidden basis-10 p-4 cursor-pointer ${isGreen ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${width}%` }} onClick={handleClick}>
            <div className="flex-initial ml-2 basis-1/5">
                Level {level.level}
            </div>
            <div className="flex-auto flex items-center justify-center basis-3/5">
                {level.question}
            </div>
            <div className="flex-initial flex items-end mr-2 justify-end basis-1/5">
                {level.timeTaken} secs.
            </div>
        </div>
    )
}



const data: Level[] = [
    {
        level: 1,
        timeTaken: 316,
        question: "What's up?",
    },
    {
        level: 2,
        timeTaken: 242,
        question: "What's up?",
    },
    {
        level: 3,
        timeTaken: 173,
        question: "What's up?",
    },
    {
        level: 4,
        timeTaken: 874,
        question: "What's up?",
    },
    {
        level: 5,
        timeTaken: 721,
        question: "What's up?",
    },
    {
        level: 6,
        timeTaken: 721,
        question: "What's up?",
    },
    {
        level: 7,
        timeTaken: 721,
        question: "What's up?",
    },
    {
        level: 8,
        timeTaken: 721,
        question: "What's up?",
    },
    {
        level: 9,
        timeTaken: 721,
        question: "What's up?",
    },
    {
        level: 10,
        timeTaken: 721,
        question: "What's up?",
    },
    {
        level: 11,
        timeTaken: 721,
        question: "What's up?",
    },
].reverse()

function Pyramid() {

    return (
        <div>
            <div className="flex items-center justify-center text-2xl">Tower of Power</div>
            <div className="flex flex-col items-center ">
                {data.map((level) => (<PyramidLevel level={level}></PyramidLevel>))}
            </div>

            <div className="flex items-center space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    ... level(s) completed.
                </div>
                <div className="items-end ml-auto mr-10 flex gap-2 font-medium leading-none">
                    50 points gained
                </div>
                <div className="mb-4"></div>
                <div className="items-end ml-auto mr-10 leading-none text-muted-foreground">
                    700 points wagered
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
