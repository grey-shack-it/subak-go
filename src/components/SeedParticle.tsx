import { useEffect, useState } from "react";
import seedImg from "../assets/seed.png";

type Props = {
    x: number;
    y: number;
    delay: number;
};

export default function SeedParticle({
    x,
    y,
    delay,
}: Props) {
    const [start, setStart] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            setStart(true);
        }, delay);

        return () => clearTimeout(t);
    }, [delay]);

    return (
        <img
            src={seedImg}
            alt=""
            draggable={false}
            style={{
                position: "absolute",
                left: "50%",
                top: "68%",
                width: 18,
                height: 18,
                pointerEvents: "none",

                transform: start
                    ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                    : "translate(-50%, -50%)",

                transition: "transform 280ms ease-out",
            }}
        />
    );
}