"use client"

import { useEffect, useRef, useState } from "react"
import { SidebarLayout } from "./SidebarLayout"
import { Input } from "@/components/ui/input"
import { HomeIcon, SendHorizonalIcon } from "lucide-react"
import { Button } from "./components/ui/button"
import { useParams } from "wouter"
import useSWR from "swr"
import { Game, Question } from "./types"
import MyClock, { ClockHandle } from "./components/Clock"
import answersMatch from "./components/strCmp"
import { currUser } from "./components/CurrUser"
import useCreateUser from "./components/CreateUser"



const PyramidLevel = ({ question, isGreen }: { question: Question, isGreen: boolean }) => {
    const width = 60 / (question?.level ?? 0 + 1) + 33; //percent based rows

    return (
        <div className={`flex border-1 items-center overflow-hidden basis-10 p-4 cursor-pointer ${isGreen ? 'bg-green-500' : 'bg-red-400'}`} style={{ width: `${width}%` }}>
            <div className="flex-initial ml-2 basis-1/5">
                Level {question?.level ?? 0}
            </div>
            <div className="flex-auto flex items-center justify-center basis-3/5 text-xs">
                <b>{question.text}</b>
            </div>
        </div>
    )
}

function Pyramid() {


    const params = useParams();
    const { data: game, error, isLoading } = useSWR<Game>(`/games/${params.id}`) //still need to sort by sport

    const [inputValue, setInputValue] = useState('');
    const [count, setCount] = useState(0);
    const [highlightedLevelId, setHighlightedLevelId] = useState(0);
    const [fail, setFail] = useState('');
    const [sendDisabled, setSendDisabled] = useState(false);
    const clockRef = useRef<ClockHandle>(null);

    const [shouldUpdateScore, setShouldUpdateScore] = useState(false);

    const { user, isLoading: isLoadingUser, isError, errorMessage } = currUser();

    const { trigger: createUser, isMutating } = useCreateUser();



    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Keep the initial setup effect
    useEffect(() => {
        setCount(game?.questions.length ?? 0);
        setHighlightedLevelId(game?.questions.length ?? 0);
    }, [game]);

    // Score handling effect - only for wrong answers
    useEffect(() => {
        if (shouldUpdateScore && user && game?.sport) {
            try {
                user.scores[game.sport] += (60 * ((game?.questions.length ?? 0) - highlightedLevelId)); //posting twice for some reason
                createUser({
                    uName: user.username,
                    pwd: "",
                    scores: user.scores,
                    friends: []
                });
                setShouldUpdateScore(false);
            } catch (error) {
                console.error(error);
            }
        }
    }, [shouldUpdateScore, user, game?.sport, highlightedLevelId, createUser]);

    const handleExpire = () => { //just resets and keeps going
        setSendDisabled(true);
        setFail("You ran out of time");
        setShouldUpdateScore(true);
        // Just stop the clock without toggling

        if (user && game?.sport) {
            try {
                user.scores[game.sport] += (60 * ((game?.questions.length ?? 0) - highlightedLevelId));
                createUser({
                    uName: user.username,
                    pwd: "",
                    scores: user.scores,
                    friends: []
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleClockClick = () => {
        if (!sendDisabled) {  // Only allow clicking if not disabled
            clockRef.current?.toggle();
        }
    };


    const handleLevelClick = () => {
        if (answersMatch(capitalizeFirstLetter(inputValue), game?.questions[count - 1].answer)) {
            setHighlightedLevelId(count - 1);
            setInputValue('');
            setCount(count - 1);
            // For correct answers, reset and start the clock
            clockRef.current?.reset();
        }
        else {
            setFail("You failed the pyramid");
            setSendDisabled(true);
            // For wrong answers, just stop the clock without resetting
            clockRef.current?.toggle();
            // Set the flag to update score
            setShouldUpdateScore(true);
        }
    };

    if (error || isError) return <div>Error: {errorMessage}</div>
    if (isLoading || isLoadingUser || isMutating) return <div>loading...</div>

    //the clock doesn't stop when the user gets a question wrong or the clock expires
    //the clock doesn't stop when the user gets a question wrong or the clock expires
    //the clock doesn't stop when the user gets a question wrong or the clock expires
    //the clock doesn't stop when the user gets a question wrong or the clock expires
    //the clock doesn't stop when the user gets a question wrong or the clock expires

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
                    {60 * ((game?.questions.length ?? 0) - highlightedLevelId)} points gained
                </div>
                <div className="mb-4"></div>
                <div className="items-end ml-auto mr-10 leading-none text-muted-foreground">
                    {50 * (game?.questions.length ?? 0)} points wagered
                </div>

            </div>
            <div>
                <div className="flex flex-col items-center justify-center mx-auto space-y-2">
                    {fail}
                    <a
                        href={!sendDisabled ? undefined : "/"}
                        style={{
                            pointerEvents: !sendDisabled ? 'none' : 'auto',
                            color: !sendDisabled ? 'gray' : 'blue',
                        }}
                        aria-disabled={!sendDisabled}
                    >
                        <HomeIcon />
                    </a>
                </div>

                <div className="items-end flex justify-center w-fit ml-auto mr-10">
                    <MyClock
                        onClick={handleClockClick}
                        isR={true}
                        reset={false}
                        onExpire={handleExpire}
                        ref={clockRef}
                    ></MyClock>
                </div>
            </div>




        </div>
    )
}

export default function PyramidPage() { //need to make it so you can't stop the timer by clicking on the clock
    return (
        <SidebarLayout>
            <Pyramid />
        </SidebarLayout>
    )
}
