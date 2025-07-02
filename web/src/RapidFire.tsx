import MyClock from "./components/Clock";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Redirect, useParams } from "wouter";
import useSWR from "swr";
import { User } from "./types";
import { currUser } from "./components/CurrUser";
import { Input } from "./components/ui/input";

export function PlayerStars({ players }: { players: User[] }) {
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
                        <StarIcon className="text-black fill-amber-400" />
                    </div>
                );
            })}
        </div>
    );
}

function RapidFire() {
    const [isTextVisible, setIsTextVisible] = useState(false);

    const params = useParams();
    const { data: game, error, isLoading } = useSWR(`/games/` + params.id)

    if (error) return <Redirect to="/" />;
    if (isLoading) return <div>loading...</div>

    const handleClick = () => {
        setIsTextVisible(!isTextVisible);
    };

    const handleExpire = () => {

    }

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
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <h2 className="text-purple-500 text-2xl font-bold max-w-[45ch] text-center break-words">{isTextVisible && <p>{game.questions[0].text}</p>}</h2>
                                    </div>
                                    <div className="absolute inset-0">
                                        <PlayerStars players={game.players} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center items-center">
                                <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
                                    Waiting for players to join the game. Please wait or invite your friends to play.
                                </p>
                                <Input placeholder="Answer:" className=" text-white border-white mr-10"></Input>
                                <div className="items-end flex justify-center w-fit ml-auto mr-10">
                                    <MyClock onClick={handleClick} isR={false} reset={false} onExpire={handleExpire} ref={null}></MyClock>
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