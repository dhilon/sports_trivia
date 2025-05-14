import table from "table.jpg"
import MyClock from "./Clock";
import { HeartPulseIcon } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { Redirect, useParams } from "wouter";


export function PlayerHearts({ players }: { players: string[] }) {
    return (
        <div className="flex space-x-4 justify-center items-center">
            {players.map((player) => (
                <h1 key={player} className="flex items-center space-x-2">
                    <span>{player}</span>
                    <HeartPulseIcon className="text-red-500" />
                </h1>
            ))}
        </div>

    )
}


function AroundTheHorn() {
    const [isTextVisible, setIsTextVisible] = useState(false);
    const params = useParams();
    const { data: game, error, isLoading } = useSWR(`/games/` + params.id)

    if (error) return <Redirect to="/" />;
    if (isLoading) return <div>loading...</div>

    const handleExpire = () => {

    }

    const handleClick = () => {
        setIsTextVisible(!isTextVisible);
    };
    return (
        <div className="w-full">
            <div className="flex items-center justify-center mt-20">
                <h1 className="justify-center items-center flex">

                    <HeartPulseIcon className="text-red-500" />
                </h1>
                <img src={table} alt="table" className="min-h-50 max-h-125 min-w-100 max-w-300 h-100 w-200 object-cover" />
                <div className="absolute top-60 flex items-center justify-center">
                    <h2 className="text-white text-2xl font-bold">{isTextVisible && <p>Question</p>}</h2>
                </div>
                <h1 className="justify-center items-center flex">

                    <HeartPulseIcon className="text-red-500" />
                </h1>
            </div>
            <div className="grid grid-cols">
                <PlayerHearts players={game.players} />
                <div className="items-end flex justify-center w-fit ml-auto mr-10">
                    <MyClock onClick={handleClick} isR={false} reset={false} onExpire={handleExpire} ref={null}></MyClock>
                </div>
            </div>


        </div>
    )


}

export default AroundTheHorn;