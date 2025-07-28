import MyClock, { ClockHandle } from "./components/Clock";
import { SendHorizonalIcon, StarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Redirect, useParams } from "wouter";
import useSWR from "swr";
import { Question, User } from "./types";
import { currUser } from "./components/CurrUser";
import { Input } from "./components/ui/input";
import useCreateGame from "./components/CreateGame";
import { Button } from "./components/ui/button";
import useAnswerChecker from "./components/AnswerChecker";
import useEditUser from "./components/EditUser";
import { Link } from "wouter";

export function PlayerStars({ players, scores }: { players: User[], scores: { [key: string]: number } }) {
    const radius = 50; // Distance from center
    const centerX = 50; // Center position as percentage
    const centerY = 50; // Center position as percentage
    const { user: currentUser } = currUser();

    return (
        <div className="relative w-full h-full">
            {players.map((player, index) => {
                const angle = (index * 360) / players.length - 90; // Start from top (-90 degrees)
                const radian = (angle * Math.PI) / 180;
                const x = centerX + (radius * Math.cos(radian));
                const y = centerY + (radius * Math.sin(radian));

                const isCurrentUser = currentUser?.username === player.username;
                const bgColor = isCurrentUser ? 'bg-blue-200' : 'bg-purple-200';
                const borderColor = isCurrentUser ? 'border-blue-400' : 'border-purple-400';

                const score = scores[player.id];

                return (
                    <div
                        key={player.username}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2 ${bgColor} px-3 py-1 rounded-full shadow-md border-2 ${borderColor}`}
                        style={{
                            left: `${x}%`,
                            top: `${y}%`,
                        }}
                    >
                        <span className="text-purple-500 font-semibold">{player.username}</span>
                        {Array.from({ length: Math.min(score, 5) }, (_, i) => (
                            <StarIcon key={i} className="text-black fill-amber-400 w-4 h-4" />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

function RapidFire() {
    const [isTextVisible, setIsTextVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [fail, setFail] = useState("Waiting for players to join the game.");
    const [sendDisabled, setSendDisabled] = useState(false);
    const clockRef = useRef<ClockHandle>(null);
    const [gameEnd, setGameEnd] = useState(false);


    const { trigger: createGame, isMutating: isCreatingGame, error: createGameError } = useCreateGame();

    const params = useParams();
    const { data: game, error, isLoading, mutate } = useSWR(`/games/` + params.id)

    const { user, isLoading: isLoadingUser, isError } = currUser();

    const { trigger: createUser, isMutating } = useEditUser();

    const { trigger: answerChecker, isMutating: isCheckingAnswer, error: answerCheckerError } = useAnswerChecker();


    useEffect(() => {
        if (game?.status === "finished") {
            setFail("You lost the game!");
            setSendDisabled(true);
        }
    }, [game]);

    function updateGameStatus(status: string) {
        createGame({
            id: parseInt(game?.id ?? '0'),
            status: status,
            time: (game?.time ?? 0) - (clockRef.current?.getTime() ?? 0),
            score: game.scores[user?.id ?? 0] ?? 0,
            current_question: game.current_question
        });
    }

    useEffect(() => {
        if (gameEnd && user && game?.sport) {
            try {
                user.scores[game.sport] += (game.scores[user.id] ?? 0); //posting twice for some reason
                createUser({
                    uName: user.username,
                    pwd: "",
                    scores: user.scores,
                    friends: []
                });
                updateGameStatus("finished");
                setGameEnd(false);
            } catch (error) {
                console.error(error);
            }
        }
    }, [gameEnd, user, game?.sport, createUser]);

    const handleClockClick = () => {
        if (game.status === "not_started") {
            createGame({ id: game.id, status: "in_progress", time: 0, score: 0, current_question: 0 });
            mutate();
        }
        setIsTextVisible(!isTextVisible);
    };

    const handleAnswerClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const check = await answerChecker({ question: game.questions.find((question: Question) => question.id === game.current_question)?.text ?? "", answer: inputValue });

        if (check) {
            setInputValue('');
            setFail("You got this one right!");
            createGame({ id: game.id, status: "", time: 1, score: 1, current_question: 0 });
            mutate();
            // For correct answers, reset and start the clock
            clockRef.current?.reset();
        }
        else {
            setFail("You got this one wrong :(");
            setSendDisabled(true);
            clockRef.current?.toggle();
            setGameEnd(true);
        }
    };

    const handleExpire = () => {
        setSendDisabled(true);
        if (fail != "You lost the game!") {
            setFail("You ran out of time");
            setSendDisabled(true);
            clockRef.current?.toggle();
            setGameEnd(true);
        }

    }

    if (error || createGameError || answerCheckerError || isError) return <Redirect to="/" />;
    if (isLoading || isCreatingGame || isCheckingAnswer || isLoadingUser || isMutating) return <div>loading...</div>

    return (
        <div className="w-full">
            <div className="relative flex size-full min-h-screen flex-col gradient-background dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
                <div className="layout-container flex h-full grow flex-col">
                    <div className="px-40 flex flex-1 justify-center py-5">
                        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                            <h2 className="text-blue-500 tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Welcome to the Trivia Battle!</h2>
                            <div className="flex px-4 py-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl object-cover border-10 border-gray-200 relative"
                                    style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8aq4_uQkVIKHH-jWogdXFcM1dbGn-t6HOmokgNC1S9GoCRQp6ezCxpTuLwDWPrUyJ1Zeazo5BSGIyV02QOrxhzWcl6XGeg-v_umCljs33Ux_r09Ql41b-IbU5t4_XirlfqMgfD-IHAp27LNsTsa8PUq4XgAof_VDe9eUfY1aI6jysV_K_BgCjRoscJBP28SeLchxRZV9cTOKFbNECvIZ8N4LdIsGtAYqpmGzupwAu0pcHJwwG6wKrK032XmBG8c2Q8lpA2sJlA-zm")` }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        {game.status === "finished" ? (
                                            <Link href={`/games/${game.sport}/rapid_fire/${game.id}/results`}>
                                                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl cursor-pointer shadow-lg">
                                                    View Results
                                                </Button>
                                            </Link>
                                        ) : (
                                            <h2 className="text-purple-500 text-2xl font-bold max-w-[45ch] text-center break-words">
                                                {isTextVisible && <p>{game.questions.find((question: Question) => question.id === game.current_question)?.text}</p>}
                                            </h2>
                                        )}
                                    </div>
                                    <div className="absolute inset-0">
                                        <PlayerStars players={game.players} scores={game.scores} />
                                    </div>
                                </div>
                            </div>

                            <div className="justify-center items-center flex gap-3">
                                <div className={`${fail === "You got this one right!" ? 'text-green-500' : 'text-red-500'} leading-normal text-center`} style={{
                                    fontSize: "25px"
                                }}>
                                    {fail}
                                </div>
                                <div className="flex gap-2 font-medium leading-none">
                                    <form onSubmit={handleAnswerClick} className="flex gap-2">
                                        <Input placeholder="Answer:" className=" text-white border-white w-100" value={inputValue} onChange={(e) => setInputValue(e.target.value)}></Input>
                                        <Button type="submit" className="shadow-lg cursor-pointer h-6 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 rounded-lg" disabled={sendDisabled}>
                                            <SendHorizonalIcon></SendHorizonalIcon>
                                        </Button>
                                    </form>
                                </div>

                                <div className="items-end flex justify-center w-fit ml-10 mr-10">
                                    <MyClock onClick={handleClockClick} isR={!sendDisabled} reset={false} onExpire={handleExpire} ref={clockRef}></MyClock>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RapidFire;
