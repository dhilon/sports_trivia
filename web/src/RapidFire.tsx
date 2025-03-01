import table from "table.jpg"
import MyClock from "./Clock";

function RapidFire() {
    return (
        <div className="w-full">
            <div className="flex flex-cols w-fit ml-auto mr-auto items-center py-4">
                <img src={table} alt="table" className="min-h-50 max-h-125 min-w-100 max-w-300 h-100 w-200" />
                <MyClock></MyClock>
            </div>
        </div>
    )


}

export default RapidFire;