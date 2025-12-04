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



const PyramidLevel = ({ question, isGreen, totalQuestions }: { question: Question, isGreen: boolean, totalQuestions: number }) => {
    const width = 70 / (question?.level ?? 0 + 1) + 50; //percent based rows - wider

    // Adjust height and spacing based on number of questions
    const isManyQuestions = totalQuestions > 10;
    const rowHeight = isManyQuestions ? '35px' : '45px';
    const rowMargin = isManyQuestions ? 'mb-1' : 'mb-1.5';
    const fontSize = isManyQuestions ? 'text-[10px]' : 'text-xs';
    const padding = isManyQuestions ? 'px-2 ml-2' : 'px-3 ml-3';

    return (
        <div className={`flex items-center overflow-hidden border border-gray-200 rounded-lg shadow-sm ${rowMargin} transition-all duration-200 ${isGreen ? 'bg-green-500 border-green-600' : 'bg-white hover:bg-gray-50'}`} style={{ width: `${width}%`, minHeight: rowHeight }}>
            <div className={`flex-initial ${padding} basis-1/5 font-semibold ${fontSize} ${isGreen ? 'text-white' : 'text-gray-500'}`}>
                Level {question?.level ?? 0}
            </div>
            <div className={`flex-auto flex items-center justify-center basis-3/5 ${fontSize} ${padding} ${isGreen ? 'text-white font-semibold' : 'text-gray-700'}`}>
                {question.text}
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
            time: 1,
            score: Math.floor(Math.min(Math.max(10000 / (user?.scores[game?.sport ?? ""] ?? 0), 10), 50) * ((game?.questions.length ?? 0) - highlightedLevelId) - (user?.scores[game?.sport ?? ""] ?? 0) * 0.05 * (game?.questions.length ?? 0)),
            current_question: highlightedLevelId ?? 0
        });
    }

    // Keep the initial setup effect
    useEffect(() => {
        const total = game?.questions.length ?? 0;
        setCount(total);
        game?.questions.sort((a, b) =>
            b.difficulty - a.difficulty || b.id - a.id
        );
        const currentIndex = game?.current_question ?? -1;

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

        const result = await answerChecker({ question: game?.questions[count - 1]?.text ?? "", answer: game?.questions[count - 1]?.answer ?? "", response: inputValue });

        console.log(result.similarity_score);
        console.log(result.reasoning);

        if (result.is_match) {
            setHighlightedLevelId(count - 1);
            setInputValue('');
            setCount(count - 1);
            clockRef.current?.reset();
        }
        else {
            setFail("You failed the pyramid! " + result.reasoning);
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


    const totalQuestions = game?.questions.length ?? 0;
    const isManyQuestions = totalQuestions > 10;
    const containerPadding = isManyQuestions ? 'py-2' : 'py-4';
    const titleMargin = isManyQuestions ? 'mb-2' : 'mb-4';
    const pyramidMargin = isManyQuestions ? 'mb-2' : 'mb-4';
    const pyramidGap = isManyQuestions ? 'gap-0.5' : 'gap-1';

    return (
        <div className={`max-w-6xl mx-auto px-2 sm:px-4 ${containerPadding}`}>
            <div className={`flex items-center justify-center ${titleMargin}`}>
                <h1 className="text-xl sm:text-2xl font-bold text-purple-600">Tower of Power</h1>
            </div>
            <div className={`flex flex-col items-center ${pyramidGap} ${pyramidMargin}`}>
                {gameWithLevels?.questions.map((question, index) => (<PyramidLevel key={index}
                    question={question}
                    isGreen={question.level <= (game?.questions.length ?? 0) - highlightedLevelId}
                    totalQuestions={totalQuestions}
                ></PyramidLevel>))}
            </div>

            <div className={`flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 ${isManyQuestions ? 'py-3 px-3 sm:px-4' : 'py-4 px-4 sm:px-6'} bg-gray-50 rounded-lg border border-gray-200 ${isManyQuestions ? 'mb-2' : 'mb-3'}`}>
                <div className="flex-1 text-xs sm:text-sm font-medium text-gray-700 text-center sm:text-left">
                    {(game?.questions.length ?? 0) - highlightedLevelId} level(s) completed.
                </div>
                <form onSubmit={handleLevelClick} className="flex items-center justify-center gap-2 flex-1">
                    <Input placeholder="Enter Answer:" className="w-full max-w-md text-sm" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white shadow-md transition-all hover:shadow-lg active:scale-95 rounded-lg px-3 sm:px-4 py-2 h-9"
                        disabled={sendDisabled}
                    >
                        <SendHorizonalIcon className="h-4 w-4" />
                    </Button>
                </form>
                <div className="flex-1 flex flex-col items-center sm:items-end gap-1 text-xs sm:text-sm">
                    <div className="font-semibold text-green-600">
                        +{Math.floor(Math.min(Math.max(10000 / (user?.scores[game?.sport ?? ""] ?? 0), 10), 50) * ((game?.questions.length ?? 0) - highlightedLevelId))} points gained
                    </div>
                    <div className="text-gray-500">
                        -{Math.floor((user?.scores[game?.sport ?? ""] ?? 0) * 0.05 * (game?.questions.length ?? 0))} points wagered
                    </div>
                </div>
            </div>


            <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${isManyQuestions ? 'px-3 sm:px-4 mt-1' : 'px-4 sm:px-6 mt-2'}`}>
                <div className="flex items-center gap-3">
                    {sendDisabled ? (
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                            onClick={() => navigate("/")}
                        >
                            <HomeIcon className="h-5 w-5" />
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-300 bg-white text-gray-400 opacity-50 cursor-not-allowed"
                            disabled={true}
                        >
                            <HomeIcon className="h-5 w-5" />
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="icon"
                        className={`border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-95 ${!sendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!sendDisabled}
                        onClick={handleRefreshClick}
                    >
                        <RefreshCcwIcon className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex items-center text-red-500 font-medium min-h-[24px]">
                    {fail || (isCheckingAnswer && "Checking answer...")}
                </div>
                <div className="flex items-center">
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
