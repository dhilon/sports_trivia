import table from "table.jpg"
import MyClock from "./Clock";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Redirect, useParams } from "wouter";
import useSWR from "swr";

function RapidFire() {
    const [isTextVisible, setIsTextVisible] = useState(false);

    const params = useParams();
    const { data, error, isLoading } = useSWR(`/games/` + params.id)

    if (error) return <Redirect to="/" />;
    if (isLoading) return <div>loading...</div>

    const handleClick = () => {
        setIsTextVisible(!isTextVisible);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-center mt-20">
                <img src={table} alt="table" className="min-h-50 max-h-125 min-w-100 max-w-300 h-100 w-200 object-cover" />
                <div className="absolute top-60 flex items-center justify-center">
                    <h2 className="text-white text-2xl font-bold">{isTextVisible && <p>Question</p>}</h2>
                </div>
            </div>
            <div className="grid grid-cols">
                <h1 className="justify-center items-center flex">
                    Dhilon
                    <br />
                    <StarIcon className="text-black fill-amber-400" />
                </h1>
                <div className="items-end flex justify-center w-fit ml-auto mr-10">
                    <MyClock onClick={handleClick}></MyClock>
                </div>
            </div>


        </div>
    )


}

export default RapidFire;