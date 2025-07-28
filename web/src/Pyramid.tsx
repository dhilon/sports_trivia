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
import { currUser } from "./components/CurrUser"
import useCreateGame from "./components/CreateGame"
import useEditUser from "./components/EditUser"
import useAnswerChecker from "./components/AnswerChecker"



const PyramidLevel = ({ question, isGreen }: { question: Question, isGreen: boolean }) => {
    const width = 60 / (question?.level ?? 0 + 1) + 33; //percent based rows

    return (
        <div className={`flex border-1 items-center overflow-hidden basis-10 p-4 cursor-pointer ${isGreen ? 'bg-green-500' : 'bg-cyan-200'}`} style={{ width: `${width}%` }}>
            <div className="flex-initial ml-2 basis-1/5 text-purple-400 font-bold">
                Level {question?.level ?? 0}
            </div>
            <div className="flex-auto flex items-center justify-center basis-3/5 text-xs text-purple-400">
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

    const { trigger: createUser, isMutating } = useEditUser();

    const { trigger: updateGame, isMutating: isMutatingGame } = useCreateGame();

    const { trigger: answerChecker, isMutating: isCheckingAnswer, error: answerCheckerError } = useAnswerChecker();



    function updateGameStatus(status: string) {
        updateGame({
            id: parseInt(game?.id ?? '0'),
            status: status,
            time: (game?.time ?? 0) + 10 - (clockRef.current?.getTime() ?? 0),
            score: (60 * ((game?.questions.length ?? 0) - highlightedLevelId)),
            current_question: game?.questions[count - 1].id ?? 0
        });
    }

    // Keep the initial setup effect
    useEffect(() => {
        setCount(game?.questions.length ?? 0);
        game?.questions.sort((a, b) =>
            b.difficulty - a.difficulty || b.id - a.id
        );

        if (game?.status === "finished") {
            const currentQuestionIndex = (game?.questions.findIndex(q => q.id == game?.current_question) ?? -2) + 1;
            setHighlightedLevelId(currentQuestionIndex);
            setSendDisabled(true);
            setFail("Pyramid already finished");
        }
        else {
            const currentQuestionIndex = 0;
            setHighlightedLevelId(game?.questions.length ?? 0 - currentQuestionIndex);
        }

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
                updateGameStatus("finished");
                setShouldUpdateScore(false);
            } catch (error) {
                console.error(error);
            }
        }

    }, [shouldUpdateScore, user, game?.sport, highlightedLevelId, createUser]);

    const handleExpire = () => { //just resets and keeps going
        setSendDisabled(true);
        if (fail != "Pyramid already finished") {
            setFail("You ran out of time");
            setShouldUpdateScore(true);
        }
    };

    const handleClockClick = () => {
    };


    const handleLevelClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const check = await answerChecker({ question: game?.questions[count - 1]?.text ?? "", answer: inputValue });

        if (check) {
            setHighlightedLevelId(count - 1);
            setInputValue('');
            setCount(count - 1);
            clockRef.current?.reset();
        }
        else {
            setFail("You failed the pyramid");
            setSendDisabled(true);
            clockRef.current?.toggle();
            setShouldUpdateScore(true);
        }
    };

    if (error || isError || answerCheckerError) return <div>Error: {errorMessage}</div>
    if (isLoading || isLoadingUser || isMutating || isMutatingGame || isCheckingAnswer) return <div>loading...</div>


    const gameWithLevels = {
        ...game, //sort questions by difficulty in frontend
        questions: game?.questions?.map((question, index) => ({
            ...question,
            // highest level = length, then down to 1
            level: (game.questions.length ?? 0) - index
        })) ?? []
    }


    return (
        <div>
            <div className="flex items-center justify-center text-2xl text-blue-500">Tower of Power</div>
            <div className="flex flex-col items-center mt-5">
                {gameWithLevels?.questions.map((question, index) => (<PyramidLevel key={index}
                    question={question}
                    isGreen={question.level <= (game?.questions.length ?? 0) - highlightedLevelId}
                ></PyramidLevel>))}
            </div>

            <div className="flex items-center space-x-2 py-4">
                <div className="flex-1 text-sm ml-10 text-pink-700">
                    {(game?.questions.length ?? 0) - highlightedLevelId} level(s) completed.
                </div>
                <form onSubmit={handleLevelClick} className="flex items-center justify-center flex-3">
                    <Input placeholder="Enter Answer:" className="w-100" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    <Button type="submit" className="shadow-lg bg-green-600 cursor-pointer ml-3 h-6 transition-all hover:bg-green-200 active:scale-95 rounded-lg" disabled={sendDisabled}>
                        <SendHorizonalIcon></SendHorizonalIcon>
                    </Button>
                </form>
                <div className="items-end ml-auto mr-10 flex gap-2 font-medium leading-none">
                    {60 * ((game?.questions.length ?? 0) - highlightedLevelId)} points gained
                </div>
                <div className="mb-4"></div>
                <div className="items-end ml-auto mr-10 leading-none text-muted-foreground">
                    {50 * (game?.questions.length ?? 0)} points wagered
                </div>

            </div>


            <div className="flex items-start justify-between px-10 mt-2">
                <div className="flex items-start">
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
                <div className="flex items-start text-red-500">
                    {fail}
                </div>
                <div className="flex items-start">
                    <MyClock
                        onClick={handleClockClick}
                        isR={!sendDisabled}
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
