import table from "table.jpg"
import MyClock from "./Clock";
import { HeartPulseIcon } from "lucide-react";

function BackandForth() {
    return (
        <div className="w-full">
            <div className="flex items-center justify-center mt-20">
                <img src={table} alt="table" className="min-h-50 max-h-125 min-w-100 max-w-300 h-100 w-200 object-cover" />
                <div className="absolute top-60 flex items-center justify-center">
                    <h2 className="text-white text-2xl font-bold">Question</h2>
                </div>
            </div>
            <div className="grid grid-cols">
                <h1 className="justify-center items-center flex">
                    Dhilon
                    <HeartPulseIcon className="text-red-500" />
                </h1>
                <div className="items-end flex justify-center w-fit ml-auto mr-10">
                    <MyClock></MyClock>
                </div>
            </div>


        </div>
    )


}

export default BackandForth;