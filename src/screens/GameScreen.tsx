import { useEffect, useState } from "react";
import WatermelonSprite from "../components/WatermelonSprite";

export default function GameScreen() {
    function randomBiteTarget() {
        return Math.floor(Math.random() * 3) + 6;
    }
    const TARGET = 10;
    const FRAME_MAPS: Record<number, number[]> = {
        6: [0, 2, 3, 5, 6, 8],
        7: [0, 2, 3, 4, 5, 6, 8],
        8: [0, 2, 3, 4, 5, 6, 7, 8],
    };
    const [count, setCount] = useState(0);
    const [time, setTime] = useState(0);
    const [biteCount, setBiteCount] = useState(0);
    const [biteTarget, setBiteTarget] = useState(randomBiteTarget());
    const [pressed, setPressed] = useState(false);
    const [juice, setJuice] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [spawnPop, setSpawnPop] = useState(false);

    useEffect(() => {
        if (count >= TARGET) return;

        const timer = setInterval(() => {
            setTime((prev) => prev + 10);
        }, 10);

        return () => clearInterval(timer);
    }, [count]);

    const handleEat = () => {
        setPressed(true);
        setJuice(true);
        setRotation(Math.random() > 0.5 ? 3 : -3);

        setTimeout(() => {
            setPressed(false);
            setJuice(false);
            setRotation(0);
        }, 120);

        if (count >= TARGET) return;

        const nextBite = biteCount + 1;

        if (nextBite >= biteTarget) {
            // 수박 한 조각 다 먹음
            setCount((prev) => prev + 1);
            setBiteCount(0);
            setBiteTarget(randomBiteTarget());

            setSpawnPop(true);

            setTimeout(() => {
                setSpawnPop(false);
            }, 120);
        } else {
            // 아직 먹는 중
            setBiteCount(nextBite);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#EAF8FF",
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            {/* 상단 HUD */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <div
                    style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                    }}
                >
                    🍉 {TARGET - count}개 남음
                </div>

                <div
                    style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                    }}
                >
                    ⏱ {(time / 1000).toFixed(2)}초
                </div>
            </div>

            {/* 대기 중인 수박 */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "30px",
                }}
            >
                {Array.from({
                    length: Math.min(TARGET - count - 1, 6),
                }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            fontSize: `${42 - i * 4}px`,
                            opacity: 1 - i * 0.12,
                        }}
                    >
                        🍉
                    </div>
                ))}
            </div>

            {/* 현재 먹는 수박 */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    onClick={handleEat}
                    style={{
                        cursor: "pointer",
                        userSelect: "none",
                        textAlign: "center",
                        transform: `${spawnPop
                                ? "scale(1.18)"
                                : pressed
                                    ? "scale(1.08)"
                                    : "scale(1)"
                            } rotate(${rotation}deg)`,
                        transition: "transform 80ms ease-out",
                        position: "relative",
                        display: "inline-block",
                    }}
                >
                    <div
                        style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginBottom: "12px",
                        }}
                    >
                        {biteCount + 1} / {biteTarget}
                    </div>

                    <WatermelonSprite frame={FRAME_MAPS[biteTarget][biteCount]} />
                    {juice && (
                        <>
                            <div className="juice j1"></div>
                            <div className="juice j2"></div>
                            <div className="juice j3"></div>
                            <div className="juice j4"></div>
                        </>
                    )}
                </div>
            </div>

            {/* 씨앗(임시) */}
            <div
                style={{
                    textAlign: "center",
                    fontSize: "18px",
                    marginBottom: "20px",
                }}
            >
                씨앗 : ⚫⚫⚫⚫⚫⚫⚫⚫⚫⚫
            </div>
        </div>
    );
}