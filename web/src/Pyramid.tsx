"use client"

import { useEffect, useState } from "react"
import { SidebarLayout } from "./SidebarLayout"
import { Input } from "@/components/ui/input"
import { HomeIcon, SendHorizonalIcon } from "lucide-react"
import { Button } from "./components/ui/button"
import { Redirect, useParams } from "wouter"
import useSWR from "swr"
import { Game, Question } from "./types"
import MyClock from "./Clock"




type PyramidLevelProps = { question: Question, isGreen: boolean }

const PyramidLevel = ({ question, isGreen }: PyramidLevelProps) => {
    const width = 60 / (question?.level ?? 0 + 1) + 25; //percent based rows

    return (
        <div className={`flex border-1 items-center overflow-hidden basis-10 p-4 cursor-pointer ${isGreen ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${width}%` }}>
            <div className="flex-initial ml-2 basis-1/5">
                Level {question?.level ?? 0}
            </div>
            <div className="flex-auto flex items-center justify-center basis-3/5">
                {question.text}
            </div>
        </div>
    )
}

function Pyramid() {


    const params = useParams();
    const { data: game, error, isLoading } = useSWR<Game>(`/games/${params.id}`)

    const [inputValue, setInputValue] = useState('');
    const [count, setCount] = useState(0);
    const [highlightedLevelId, setHighlightedLevelId] = useState(0);
    const [fail, setFail] = useState('');
    const [sendDisabled, setSendDisabled] = useState(false);

    const handleClockClick = () => {

    };

    const handleLevelClick = () => {
        console.log(inputValue)
        console.log(highlightedLevelId)
        if (inputValue === game?.questions[count - 1].answer) {
            setHighlightedLevelId(count - 1);
            setInputValue('');
            setCount(count - 1);
        }
        else {
            setFail("You failed the pyramid")
            setSendDisabled(true)
        }
    };

    useEffect(() => {
        setCount(game?.questions.length ?? 0)
        setHighlightedLevelId(game?.questions.length ?? 0)
    }, [game])

    if (error) return <Redirect to="/" />;
    if (isLoading) return <div>loading...</div>

    const gameWithLevels = {
        ...game,
        questions: game?.questions?.map((question, index) => ({
            ...question,
            // highest level = length, then down to 1
            level: (game.questions.length ?? 0) - index
        })) ?? []
    }


    return (
        <div>
            <div className="flex items-center justify-center text-2xl">Tower of Power</div>
            <div className="flex flex-col items-center ">
                {gameWithLevels?.questions.map((question, index) => (<PyramidLevel key={index}
                    question={question}
                    isGreen={question.level <= (game?.questions.length ?? 0) - highlightedLevelId}
                ></PyramidLevel>))}
            </div>

            <div className="flex items-center space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {(game?.questions.length ?? 0) - highlightedLevelId} level(s) completed.
                </div>
                <div className="flex items-center justify-center flex-3">
                    <Input placeholder="Enter Answer:" className="w-100" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    <Button className="shadow-lg bg-green-600 cursor-pointer ml-3 h-6 transition-all hover:bg-green-200 active:scale-95 rounded-lg" onClick={() => handleLevelClick()} disabled={sendDisabled}>
                        <SendHorizonalIcon></SendHorizonalIcon>
                    </Button>

                </div>
                <div className="items-end ml-auto mr-10 flex gap-2 font-medium leading-none">
                    50 points gained
                </div>
                <div className="mb-4"></div>
                <div className="items-end ml-auto mr-10 leading-none text-muted-foreground">
                    700 points wagered
                </div>

            </div>
            <div>
                <div className="flex flex-col items-center justify-center mx-auto space-y-2">
                    {fail}
                    <Button disabled={!sendDisabled}>
                        <HomeIcon

                        />
                    </Button>
                </div>

                <div className="items-end flex justify-center w-fit ml-auto mr-10">
                    <MyClock onClick={handleClockClick}></MyClock>
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
