"use client"

import { useEffect, useRef, useState } from "react"
import { SidebarLayout } from "./SidebarLayout"
import { Input } from "@/components/ui/input"
import { HomeIcon, RefreshCcwIcon, SendHorizonalIcon } from "lucide-react"
import { Button } from "./components/ui/button"
import { useParams } from "wouter"
import useSWR from "swr"
import { Game, Question } from "./types"
import MyClock, { ClockHandle } from "./components/Clock"
import { currUser } from "./components/CurrUser"
import useCreateGame from "./components/CreateGame"
import useEditUser from "./components/EditUser"
import useAnswerChecker from "./components/AnswerChecker"
import { navigate } from "wouter/use-browser-location"
import useNewGame from "./components/NewGame"



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
    const { data: game, error, isLoading, mutate: mutateGame } = useSWR<Game>(`/games/${params.id}`) //still need to sort by sport

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

    const { trigger: newGame, isMutating: isMutatingNewGame } = useNewGame();

    const { trigger: answerChecker, isMutating: isCheckingAnswer, error: answerCheckerError } = useAnswerChecker();



    function updateGameStatus(status: string) {
        updateGame({
            id: parseInt(game?.id ?? '0'),
            status: status,
            time: (game?.time ?? 0) + 10 - (clockRef.current?.getTime() ?? 0),
            score: Math.floor(Math.min(Math.max(10000 / (user?.scores[game?.sport ?? ""] ?? 0), 10), 50) * ((game?.questions.length ?? 0) - highlightedLevelId) - (user?.scores[game?.sport ?? ""] ?? 0) * 0.05 * (game?.questions.length ?? 0)),
            current_question: game?.questions[count - 1].id ?? 0
        });
        //update question difficulty
    }

    // Keep the initial setup effect
    useEffect(() => {
        const total = game?.questions.length ?? 0;
        setCount(total);
        game?.questions.sort((a, b) =>
            b.difficulty - a.difficulty || b.id - a.id
        );
        const idx = game?.questions.findIndex(q => q.id === game?.current_question) ?? -1;
        const currentIndex = idx; //TODO: this is wrong

        if (game?.status === "finished") {
            // 1-based completed count
            setHighlightedLevelId(currentIndex);
            setSendDisabled(true);
            setFail("Pyramid already finished");
        } else {
            const currentIndex = 0;
            setHighlightedLevelId(total - currentIndex);
        }
        if (currentIndex === 0 && fail != "You conquered the pyramid!") {
            setFail("You conquered the pyramid!");
            setSendDisabled(true);
            setShouldUpdateScore(true);
        }

    }, [game]);

    // Score handling effect - only for wrong answers
    useEffect(() => {
        if (shouldUpdateScore && user && game?.sport) {
            try {
                user.scores[game.sport] += Math.floor(Math.min(Math.max(10000 / (user?.scores[game?.sport ?? ""] ?? 0), 10), 50) * ((game?.questions.length ?? 0) - highlightedLevelId) - (user?.scores[game?.sport ?? ""] ?? 0) * 0.05 * (game?.questions.length ?? 0));
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

    const handleExpire = () => {
        setSendDisabled(true);
        if (fail != "Pyramid already finished" && fail != "You ran out of time") {
            setFail("You ran out of time");
            setShouldUpdateScore(true);
        }
    };

    const handleClockClick = () => {
    };

    async function handleRefreshClick(e: React.FormEvent) {
        e.preventDefault();

        // 2) Send credentials to Flask
        try {
            if (!user?.username) {
                throw new Error("Must be logged in to create game");
            }
            const id = (await newGame({ type: "tower_of_power", sport: game?.sport ?? "basketball" })).id;
            mutateGame();
            clockRef.current?.reset();
            clockRef.current?.toggle();
            setInputValue('');
            setSendDisabled(false);
            setFail("");
            navigate("/games/" + game?.sport + "/tower_of_power/" + id);
        } catch (error: any) {
            // 4) On 4xx/5xx, display message
            console.log(error.response?.data?.error);
        }
    }


    const handleLevelClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const check = await answerChecker({ question: game?.questions[count - 1]?.text ?? "", answer: inputValue });

        if (check == "True") {
            setHighlightedLevelId(count - 1);
            setInputValue('');
            setCount(count - 1);
            clockRef.current?.reset();
        }
        else {
            setFail("You failed the pyramid! The correct answer is " + check);
            setSendDisabled(true);
            clockRef.current?.toggle();
            setShouldUpdateScore(true);
        }
    };

    if (error || isError || answerCheckerError) return <div>Error: {errorMessage}</div>
    if (isLoading || isLoadingUser || isMutating || isMutatingGame || isMutatingNewGame) return <div>loading...</div>


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
                    {Math.floor(Math.min(Math.max(10000 / (user?.scores[game?.sport ?? ""] ?? 0), 10), 50) * ((game?.questions.length ?? 0) - highlightedLevelId))} points gained
                </div>
                <div className="mb-4"></div>
                <div className="items-end ml-auto mr-10 leading-none text-muted-foreground">
                    {Math.floor((user?.scores[game?.sport ?? ""] ?? 0) * 0.05 * (game?.questions.length ?? 0))} points wagered
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
                    <button className="shadow-lg cursor-pointer transition-all hover:bg-gray-100  active:scale-95 rounded-lg ml-10"
                        onClick={e => handleRefreshClick(e)}
                        style={{
                            pointerEvents: !sendDisabled ? 'none' : 'auto',
                            color: !sendDisabled ? 'gray' : 'blue',
                        }}
                        aria-disabled={!sendDisabled}
                    >
                        <RefreshCcwIcon />
                    </button>
                </div>
                <div className="flex items-start text-red-500">
                    {fail || (isCheckingAnswer && "Checking answer...")}
                </div>
                <div className="flex items-start">
                    <MyClock
                        onClick={handleClockClick}
                        isR={!sendDisabled}
                        stop={true}
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
