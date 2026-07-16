import { useEffect, useRef, useState } from "react";
import WatermelonSprite from "../components/WatermelonSprite";
import Face from "../components/Face";
import seedImg from "../assets/seed.webp";
import popImg from "../assets/pop.webp";
import SeedParticle from "../components/SeedParticle";
import count3Img from "../assets/count3.webp";
import count2Img from "../assets/count2.webp";
import count1Img from "../assets/count1.webp";
import goImg from "../assets/go.webp";
import popSound from "../assets/sounds/pop.ogg";
import spitSound from "../assets/sounds/spit.ogg";
import goSound from "../assets/sounds/go.ogg";
import finishSound from "../assets/sounds/finish.ogg";
import { playSfx } from "../utils/audio";
import pauseImg from "../assets/pause.webp";
import resumeImg from "../assets/resume.webp";
import homeImg from "../assets/home.webp";
import watermelonSheet from "../assets/watermelon_sheet.webp";
import BG1 from "../assets/BG1.webp";
import BG2 from "../assets/BG2.webp";
import BG3 from "../assets/BG3.webp";
import BG4 from "../assets/BG4.webp";
import BG5 from "../assets/BG5.webp";
import BG6 from "../assets/BG6.webp";
import BG7 from "../assets/BG7.webp";
import BG8 from "../assets/BG8.webp";
import { saveRanking } from "../lib/supabase";
import PressableImage from "../components/PressableImage";

const BACKGROUNDS = [
    BG1,
    BG2,
    BG3,
    BG4,
    BG5,
    BG6,
    BG7,
    BG8,
];

type GameScreenProps = {
    onFinish: () => void;
    onHome: () => void;
};

export default function GameScreen({
    onFinish,
    onHome,
}: GameScreenProps) {

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
    const [background] = useState(
        BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
    );
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
    const [isPaused, setIsPaused] = useState(false);
    const playGo = () => {
        playSfx(goSound);
    };
    const playPop = () => {
        playSfx(popSound);
    };
    const playSpit = (count: number) => {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                playSfx(spitSound);
            }, i * 35);
        }
    };
    const playFinish = () => {
        playSfx(finishSound);
    };

    useEffect(() => {
        if (!gameStarted || isGameOver || isPaused) return;

        const timer = setInterval(() => {
            setTime((prev) => prev + 10);
        }, 10);

        return () => clearInterval(timer);
    }, [gameStarted, isGameOver, isPaused]);

    useEffect(() => {
        if (count < TARGET) return;
        const finishGame = async () => {
            playFinish();
            const penalty = seedCount * 200;
            const finalRecord = time + penalty;
            setFinalTime(finalRecord);
            const nickname = localStorage.getItem("nickname");
            if (nickname) {
                try {
                    const penalty = seedCount * 200;
                    const finalRecord = time + penalty;
                    await saveRanking(nickname, finalRecord);
                } catch (e) {
                    console.error("랭킹 저장 실패", e);
                }
            }
            setIsGameOver(true);
        };
        finishGame();
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
        if (!gameStarted || isGameOver || isPaused) return;
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
        setIsPaused(false);
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#000",
            }}
        >
            <div
                style={{
                    position: "relative",
                    height: "100vh",
                    aspectRatio: "9 / 16",
                    containerType: "inline-size",
                    overflow: "hidden",
                    backgroundImage: `url(${background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px",
                    boxSizing: "border-box",
                }}
            >
                {gameStarted && !isGameOver && (
                    <PressableImage
                        src={pauseImg}
                        alt="일시정지"
                        draggable={false}
                        onClick={() => setIsPaused(true)}
                        style={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            width: 40,
                            height: 40,
                            zIndex: 998,
                            cursor: "pointer",
                        }}
                    />
                )}
                {isPaused && (
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
                                display: "flex",
                                gap: "24px",
                            }}
                        >
                            <PressableImage
                                src={resumeImg}
                                alt="다시 시작"
                                draggable={false}
                                onClick={() => setIsPaused(false)}
                                style={{
                                    width: "72px",
                                    height: "72px",
                                    cursor: "pointer",
                                }}
                            />
                            <PressableImage
                                src={homeImg}
                                alt="홈으로"
                                draggable={false}
                                onClick={onHome}
                                style={{
                                    width: "72px",
                                    height: "72px",
                                    cursor: "pointer",
                                }}
                            />
                        </div>
                    </div>
                )}
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
                                width: "55%",
                                maxWidth: "260px",
                                padding: "20px",
                                textAlign: "center",
                                boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "clamp(24px, 8vw, 36px)",
                                    marginBottom: "12px",
                                }}
                            >
                                🎉
                            </div>

                            <div
                                style={{
                                    fontSize: "clamp(20px, 6vw, 28px)",
                                    fontWeight: "bold",
                                    marginBottom: "18px",
                                }}
                            >
                                FINISH!
                            </div>

                            <div
                                style={{
                                    fontSize: "clamp(16px, 5vw, 22px)",
                                    lineHeight: 1.8,
                                    marginBottom: "24px",
                                }}
                            >
                                <div>기록 : {(finalTime / 1000).toFixed(2)}초</div>
                                <div>남은 씨앗 : {seedCount}개</div>
                                <div>페널티 : +{(seedCount * 0.2).toFixed(1)}초</div>

                                <div
                                    style={{
                                        marginTop: "10px",
                                        fontWeight: "bold",
                                        fontSize: "clamp(18px, 5vw, 24px)",
                                        color: "#d62828",
                                    }}
                                >
                                    최종기록 : {(finalTime / 1000).toFixed(2)}초
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "12px",
                                }}
                            >
                                <button
                                    onClick={restartGame}
                                    style={{
                                        flex: 1,
                                        padding: "12px 0",
                                        fontSize: "clamp(14px,3vw,18px)",
                                        borderRadius: "12px",
                                        border: "none",
                                        cursor: "pointer",
                                        background: "#036d0c",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    다시하기
                                </button>

                                <button
                                    onClick={onFinish}
                                    style={{
                                        flex: 1,
                                        padding: "12px 0",
                                        fontSize: "clamp(14px,3vw,18px)",
                                        borderRadius: "12px",
                                        border: "none",
                                        cursor: "pointer",
                                        background: "#ff7b00",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    랭킹보기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* 상단 HUD */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "clamp(14px, 10cqw, 42px)",
                            fontWeight: "bold",
                            letterSpacing: "0.4cqw",
                            color: "#02a710",
                            WebkitTextStroke: "1px white",
                            textShadow: "0 2px 4px rgba(248, 243, 243, 0.35)",
                        }}
                    >
                        ⏱ {(time / 1000).toFixed(2)}
                    </div>
                </div>

                {/* 남은 수박 표시 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "0.2cqw",
                        marginBottom: "3cqw",
                    }}
                >
                    {Array.from({
                        length: TARGET - count,
                    }).map((_, i) => (
                        <div
                            key={i}
                            className="watermelon-idle"
                            style={{
                                width: "20cqw",
                                height: "20cqw",
                                maxWidth: "50px",
                                maxHeight: "50px",
                                backgroundImage: `url(${watermelonSheet})`,
                                backgroundSize: "300% 300%",
                                backgroundPosition: "0% 0%",
                                backgroundRepeat: "no-repeat",
                                animationDelay: `${i * 0.12}s`,
                            }}
                        />
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
                                        width: "6cqw",
                                        height: "6cqw",
                                        maxWidth: "24px",
                                        maxHeight: "24px",
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
                                        width: "3.5cqw",
                                        height: "3.5cqw",
                                        maxWidth: "32px",
                                        maxHeight: "32px",
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
                                        width: "2.7cqw",
                                        height: "2.7cqw",
                                        maxWidth: "26px",
                                        maxHeight: "26px",
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
                                        width: "7cqw",
                                        height: "7cqw",
                                        maxWidth: "40px",
                                        maxHeight: "40px",
                                        position: "absolute",
                                        pointerEvents: "none",
                                        transform: "rotate(-75deg)",
                                    }}
                                />
                                <img
                                    src={popImg}
                                    className="juice j5"
                                    draggable={false}
                                    alt=""
                                    style={{
                                        left: `${juicePos.x}%`,
                                        top: `${juicePos.y}%`,
                                        width: "7cqw",
                                        height: "7cqw",
                                        maxWidth: "40px",
                                        maxHeight: "40px",
                                        position: "absolute",
                                        pointerEvents: "none",
                                    }}
                                />
                                <img
                                    src={popImg}
                                    className="juice j6"
                                    draggable={false}
                                    alt=""
                                    style={{
                                        left: `${juicePos.x}%`,
                                        top: `${juicePos.y}%`,
                                        width: "6cqw",
                                        height: "6cqw",
                                        maxWidth: "40px",
                                        maxHeight: "40px",
                                        position: "absolute",
                                        pointerEvents: "none",
                                    }}
                                />
                                <img
                                    src={popImg}
                                    className="juice j7"
                                    draggable={false}
                                    alt=""
                                    style={{
                                        left: `${juicePos.x}%`,
                                        top: `${juicePos.y}%`,
                                        width: "5cqw",
                                        height: "5cqw",
                                        maxWidth: "40px",
                                        maxHeight: "40px",
                                        position: "absolute",
                                        pointerEvents: "none",
                                    }}
                                />
                                <img
                                    src={popImg}
                                    className="juice j8"
                                    draggable={false}
                                    alt=""
                                    style={{
                                        left: `${juicePos.x}%`,
                                        top: `${juicePos.y}%`,
                                        width: "5cqw",
                                        height: "5cqw",
                                        maxWidth: "35px",
                                        maxHeight: "35px",
                                        position: "absolute",
                                        pointerEvents: "none",
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
                                    width: "5cqw",
                                    height: "5cqw",
                                    maxWidth: "22px",
                                    maxHeight: "22px",
                                    transform: "translate(-50%, -50%)",
                                    pointerEvents: "none",
                                    animation: "seedPop 1s ease-out forwards",
                                }}
                            />
                        )}
                    </div>
                </div>

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "5cqw",
                        transform: "translateY(-10cqw)",
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
                            fontSize: "3cqw",
                            letterSpacing: "0.2cqw",
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
                                        width: "7cqw",
                                        height: "7cqw",
                                        maxWidth: 25,
                                        maxHeight: 25,
                                        opacity: i < seedCount ? 1 : 0.18,
                                        userSelect: "none",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}