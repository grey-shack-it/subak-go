import { useEffect, useRef, useState } from "react";
import WatermelonSprite from "../components/WatermelonSprite";
import Face from "../components/Face";
import seedImg from "../assets/seed.png";
import popImg from "../assets/pop.png";
import SeedParticle from "../components/SeedParticle";
import count3Img from "../assets/count3.png";
import count2Img from "../assets/count2.png";
import count1Img from "../assets/count1.png";
import goImg from "../assets/go.png";
import popSound from "../assets/sounds/pop.mp3";
import spitSound from "../assets/sounds/spit.mp3";
import goSound from "../assets/sounds/go.mp3";
import finishSound from "../assets/sounds/finish.mp3";

export default function GameScreen() {

    console.log(goSound);

    function randomBiteTarget() {
        return Math.floor(Math.random() * 3) + 6;
    }
    function randomSeedCount() {
        return Math.floor(Math.random() * 4); // 0~3개
    }
    function generateSeedPattern(
        biteTarget: number,
        seedCount: number
    ): boolean[] {
        const pattern = Array(biteTarget).fill(false);

        // 위치 목록 생성
        const positions = Array.from(
            { length: biteTarget },
            (_, i) => i
        );

        // Fisher-Yates Shuffle
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [
                positions[j],
                positions[i],
            ];
        }

        // 앞에서 seedCount개만 true
        for (let i = 0; i < seedCount; i++) {
            pattern[positions[i]] = true;
        }

        return pattern;
    }
    const TARGET = 10;
    const FRAME_MAPS: Record<number, number[]> = {
        6: [0, 2, 3, 5, 6, 8],
        7: [0, 2, 3, 4, 5, 6, 8],
        8: [0, 2, 3, 4, 5, 6, 7, 8],
    };
    const initialBiteTarget = randomBiteTarget();
    const initialSeedCount = randomSeedCount();
    const [count, setCount] = useState(0);
    const [time, setTime] = useState(0);
    const [biteCount, setBiteCount] = useState(0);
    const [biteTarget, setBiteTarget] = useState(initialBiteTarget);
    const [pressed, setPressed] = useState(false);
    const [juice, setJuice] = useState(false);
    const [showSeed, setShowSeed] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [juicePos, setJuicePos] = useState({
        x: 50,
        y: 50,
    });
    const [seedCount, setSeedCount] = useState(0);
    const [flyingSeeds, setFlyingSeeds] = useState<
        {
            id: number;
            x: number;
            y: number;
            delay: number;
        }[]
    >([]);
    const [currentSeeds, setCurrentSeeds] = useState(initialSeedCount);
    const [seedPattern, setSeedPattern] = useState(
        generateSeedPattern(initialBiteTarget, initialSeedCount)
    );
    const [spawnPop, setSpawnPop] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [finalTime, setFinalTime] = useState(0);
    const [countdown, setCountdown] = useState<number | null>(3);
    const [gameStarted, setGameStarted] = useState(false);
    const playGo = () => {
        const audio = new Audio(goSound);
        audio.play().catch(() => { });
    };
    const playPop = () => {
        const audio = new Audio(popSound);
        audio.play().catch(() => { });
    };
    const playSpit = (count: number) => {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const audio = new Audio(spitSound);
                audio.play().catch(() => { });
            }, i * 70);
        }
    };
    const playFinish = () => {
        const audio = new Audio(finishSound);
        audio.play().catch(() => { });
    };

    useEffect(() => {
        if (!gameStarted || isGameOver) return;

        const timer = setInterval(() => {
            setTime((prev) => prev + 10);
        }, 10);

        return () => clearInterval(timer);
    }, [gameStarted, isGameOver]);

    useEffect(() => {
        if (count < TARGET) return;

        playFinish();

        setFinalTime(time);
        setIsGameOver(true);
    }, [count]);

    useEffect(() => {
        if (countdown === null) return;
        if (countdown === 3) {
            playGo();
        }
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown((prev) => (prev ?? 0) - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }

        if (countdown === 0) {
            const timer = setTimeout(() => {
                setCountdown(null);
                setGameStarted(true);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleEat = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!gameStarted || isGameOver) return;
        playPop();
        const rect = e.currentTarget.getBoundingClientRect();

        setJuicePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
        setPressed(true);
        setJuice(true);
        setRotation(Math.random() > 0.5 ? 2.0 : -2.0);

        setTimeout(() => {
            setPressed(false);
            setJuice(false);
            setRotation(0);
        }, 120);

        if (count >= TARGET || seedCount >= 10) return;

        const nextBite = biteCount + 1;
        if (seedPattern[biteCount]) {
            setSeedCount((prev) => Math.min(prev + 1, 10));
            setShowSeed(true);
            setTimeout(() => {
                setShowSeed(false);
            }, 400);
        }

        if (nextBite >= biteTarget) {
            // 수박 한 조각 다 먹음
            setCount((prev) => prev + 1);
            const nextBiteTarget = randomBiteTarget();
            const nextSeedCount = randomSeedCount();
            setCurrentSeeds(nextSeedCount);
            setSeedPattern(generateSeedPattern(nextBiteTarget, nextSeedCount));
            setBiteCount(0);
            setBiteTarget(nextBiteTarget);
            setSpawnPop(true);

            setTimeout(() => {
                setSpawnPop(false);
            }, 120);
        } else {
            // 아직 먹는 중
            setBiteCount(nextBite);
        }
    };
    const spitSeeds = () => {
        if (seedCount === 0) return;
        playSpit(seedCount);
        setFlyingSeeds(
            Array.from({ length: seedCount }, (_, i) => {
                const angle =
                    (110 - (40 / Math.max(seedCount - 1, 1)) * i) *
                    Math.PI /
                    180;
                const distance = 650;

                return {
                    id: Date.now() + i,
                    delay: i * 35,
                    x: Math.cos(angle) * distance,
                    y: -Math.sin(angle) * distance,
                };
            })
        );
        setSeedCount(0);
        setTimeout(() => {
            setFlyingSeeds([]);
        }, 1000);
    };

    const restartGame = () => {
        const firstBiteTarget = randomBiteTarget();
        const firstSeedCount = randomSeedCount();

        setCount(0);
        setTime(0);

        setBiteCount(0);
        setBiteTarget(firstBiteTarget);

        setSeedCount(0);
        setCurrentSeeds(firstSeedCount);

        setSeedPattern(
            generateSeedPattern(firstBiteTarget, firstSeedCount)
        );

        setFlyingSeeds([]);

        setPressed(false);
        setJuice(false);
        setShowSeed(false);
        setSpawnPop(false);

        setRotation(0);

        setFinalTime(0);
        setIsGameOver(false);

        setCountdown(3);
        setGameStarted(false);
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
            {countdown !== null && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.25)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 998,
                        pointerEvents: "none",
                    }}
                >
                    <img
                        key={countdown}
                        src={
                            countdown === 3
                                ? count3Img
                                : countdown === 2
                                    ? count2Img
                                    : countdown === 1
                                        ? count1Img
                                        : goImg
                        }
                        alt=""
                        draggable={false}
                        style={{
                            width: countdown === 0 ? "450px" : "220px",
                            userSelect: "none",
                            pointerEvents: "none",

                            animation:
                                countdown === 0
                                    ? "goPop 260ms cubic-bezier(.18,1.3,.32,1)"
                                    : "countdownSlide 1000ms ease-out",
                        }}
                    />
                </div>
            )}
            {isGameOver && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999,
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            borderRadius: "20px",
                            padding: "28px",
                            minWidth: "280px",
                            textAlign: "center",
                            boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "36px",
                                marginBottom: "12px",
                            }}
                        >
                            🎉
                        </div>

                        <div
                            style={{
                                fontSize: "28px",
                                fontWeight: "bold",
                                marginBottom: "18px",
                            }}
                        >
                            FINISH!
                        </div>

                        <div
                            style={{
                                fontSize: "22px",
                                marginBottom: "24px",
                            }}
                        >
                            {(finalTime / 1000).toFixed(2)}초
                        </div>

                        <button
                            onClick={restartGame}
                            style={{
                                padding: "12px 24px",
                                fontSize: "18px",
                                borderRadius: "12px",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            다시하기
                        </button>
                    </div>
                </div>
            )}
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
                                ? "scale(1.06)"
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
                            <img
                                src={popImg}
                                className="juice j1"
                                draggable={false}
                                alt=""
                                style={{
                                    left: `${juicePos.x}%`,
                                    top: `${juicePos.y}%`,
                                    width: "18px",
                                    height: "18px",
                                    position: "absolute",
                                    pointerEvents: "none",
                                    transform: "rotate(-25deg)",
                                }}
                            />

                            <img
                                src={popImg}
                                className="juice j2"
                                draggable={false}
                                alt=""
                                style={{
                                    left: `${juicePos.x}%`,
                                    top: `${juicePos.y}%`,
                                    width: "28px",
                                    height: "28px",
                                    position: "absolute",
                                    pointerEvents: "none",
                                    transform: "rotate(18deg)",
                                }}
                            />

                            <img
                                src={popImg}
                                className="juice j3"
                                draggable={false}
                                alt=""
                                style={{
                                    left: `${juicePos.x}%`,
                                    top: `${juicePos.y}%`,
                                    width: "22px",
                                    height: "22px",
                                    position: "absolute",
                                    pointerEvents: "none",
                                    transform: "rotate(110deg)",
                                }}
                            />

                            <img
                                src={popImg}
                                className="juice j4"
                                draggable={false}
                                alt=""
                                style={{
                                    left: `${juicePos.x}%`,
                                    top: `${juicePos.y}%`,
                                    width: "30px",
                                    height: "30px",
                                    position: "absolute",
                                    pointerEvents: "none",
                                    transform: "rotate(-75deg)",
                                }}
                            />
                        </>
                    )}
                    {showSeed && (
                        <img
                            src={seedImg}
                            alt=""
                            draggable={false}
                            style={{
                                position: "absolute",
                                left: `${juicePos.x}%`,
                                top: `${juicePos.y}%`,
                                width: "22px",
                                height: "22px",
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                                animation: "seedPop 0.4s ease-out forwards",
                            }}
                        />
                    )}
                </div>
            </div>

            <div
                style={{
                    textAlign: "center",
                    marginBottom: "16px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "8px",
                        cursor: "pointer",
                        position: "relative",
                        animation:
                            seedCount >= 10
                                ? "faceShake 0.14s infinite"
                                : seedCount >= 7
                                    ? "faceWobble 0.18s infinite"
                                    : seedCount >= 4
                                        ? "faceWobble 0.35s infinite"
                                        : "faceFloat 1.5s ease-in-out infinite",
                    }}
                    onClick={spitSeeds}
                >
                    <Face
                        state={
                            seedCount >= 10
                                ? 4
                                : seedCount >= 7
                                    ? 3
                                    : seedCount >= 4
                                        ? 2
                                        : 1
                        }
                    />
                    {flyingSeeds.map((seed) => (
                        <SeedParticle
                            key={seed.id}
                            x={seed.x}
                            y={seed.y}
                            delay={seed.delay}
                        />
                    ))}
                </div>

                <div
                    style={{
                        fontSize: "24px",
                        letterSpacing: "2px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "4px",
                        }}
                    >
                        {Array.from({ length: 10 }).map((_, i) => (
                            <img
                                key={i}
                                src={seedImg}
                                alt=""
                                draggable={false}
                                style={{
                                    width: 16,
                                    height: 16,
                                    opacity: i < seedCount ? 1 : 0.18,
                                    userSelect: "none",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}