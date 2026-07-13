import { Button } from "@toss/tds-mobile";
import { useEffect } from "react";
import { playHomeBgm } from "../utils/bgm";

type HomeScreenProps = {
  onStart: () => void;
};

export default function HomeScreen({ onStart }: HomeScreenProps) {
  useEffect(() => {
    playHomeBgm();
  }, []);
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        background: "#EAF8FF",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "96px",
          marginBottom: "20px",
        }}
      >
        🍉
      </div>

      <h1
        style={{
          margin: 0,
          fontSize: "42px",
          fontWeight: 800,
        }}
      >
        수박먹GO
      </h1>

      <p
        style={{
          marginTop: "12px",
          marginBottom: "40px",
          fontSize: "18px",
          lineHeight: 1.5,
          color: "#666",
        }}
      >
        가장 빠르게 먹고
        <br />
        1등에 도전!
      </p>

      <Button size="large" onClick={onStart}>
        게임 시작
      </Button>
    </div>
  );
}