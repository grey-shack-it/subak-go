import { useEffect, useState } from "react";

export default function GameScreen() {
    function randomBiteTarget() {
        return Math.floor(Math.random() * 3) + 6;
    }
    const TARGET = 10;

    const [count, setCount] = useState(0);
    const [time, setTime] = useState(0);
    const [biteCount, setBiteCount] = useState(0);
    const [biteTarget, setBiteTarget] = useState(randomBiteTarget());
    const [position, setPosition] = useState({
        x: 120,
        y: 180,
    });

    useEffect(() => {
        if (count >= TARGET) return;

        const timer = setInterval(() => {
            setTime((prev) => prev + 10);
        }, 10);

        return () => clearInterval(timer);
    }, [count]);

    const handleEat = () => {
        if (count >= TARGET) return;

        const nextBite = biteCount + 1;

        if (nextBite >= biteTarget) {
            // 수박 한 조각 다 먹음
            setCount((prev) => prev + 1);
            setBiteCount(0);
            setBiteTarget(randomBiteTarget());
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

                    <div
                        style={{
                            fontSize: "180px",
                            transition: "transform .08s",
                        }}
                    >
                        🍉
                    </div>
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