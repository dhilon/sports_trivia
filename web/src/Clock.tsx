import { useState, useEffect } from "react";

export default function MyClock({ onClick }: { onClick: () => void }) {
    const [time, setTime] = useState(10); // Start from 10 seconds
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isRunning, time]);

    const handleClick = () => {
        if (time === 0) setTime(10); // Reset timer if it reaches 0
        setIsRunning(!isRunning); // Toggle start/stop
        onClick();
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className="text-6xl font-bold p-6 bg-green-600 text-white rounded-full shadow-lg transition-all active:scale-95"
            >
                {time}s
            </button>
        </div>
    );
}
