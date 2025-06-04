// Clock.tsx
import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";

export type ClockHandle = {
    click: () => void;    // expose the native click if you like
    reset: () => void;    // or custom methods
    toggle: () => void;
    getTime: () => number;
};

export interface MyClockProps {
    onClick: () => void;
    isR: boolean;
    reset: boolean;
    onExpire: () => void;
}

// 1) Wrap in forwardRef<ClockHandle,Props>
const MyClock = forwardRef<ClockHandle, MyClockProps>(
    ({ onClick, isR, reset, onExpire }, ref) => {
        const [time, setTime] = useState(10);
        const [isRunning, setRun] = useState(isR);

        useEffect(() => {
            if (!isRunning || time <= 0) return;
            const id = setInterval(() => setTime((t) => t - 1), 1000);
            return () => clearInterval(id);
        }, [isRunning, time]);

        useEffect(() => {
            if (time === 0) {
                setRun(false);
                onExpire();
            }
        }, [time, onExpire]);

        const buttonRef = React.useRef<HTMLButtonElement>(null);

        // 2) Expose methods via useImperativeHandle
        useImperativeHandle(ref, () => ({
            click: () => buttonRef.current?.click(),
            reset: () => setTime(10),
            toggle: () => setRun((r) => !r),
            getTime: () => time,
        }));

        const handleClick = () => {
            if (reset) {
                setTime(10);
                setRun(false);
            } else {
                setRun((r) => !r);
            }
            onClick();
        };

        return (
            <button
                ref={buttonRef}
                onClick={handleClick}

                className="text-6xl font-bold p-6 bg-green-600 text-white rounded-full shadow-lg transition-all active:scale-95"
            >
                {time}s
            </button>
        );
    }
);

export default MyClock;
