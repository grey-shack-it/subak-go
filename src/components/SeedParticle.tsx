import { useEffect, useState } from "react";
import seedImg from "../assets/seed.webp";

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
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const t1 = setTimeout(() => {
            setStart(true);
        }, delay);

        const t2 = setTimeout(() => {
            setVisible(false);
        }, delay + 190);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
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
                width: "15cqw",
                height: "15cqw",
                maxWidth: "25px",
                maxHeight: "25px",
                pointerEvents: "none",

                transform: start
                    ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                    : "translate(-50%, -50%)",

                transition: `
                    transform 220ms linear,
                    opacity 90ms linear
                `,
                opacity: visible ? 1 : 0,
            }}
        />
    );
}