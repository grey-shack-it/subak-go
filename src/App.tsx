import { useEffect, useState } from "react";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import RankingScreen from "./screens/RankingScreen";
import MuteButton from "./components/MuteButton";
import { initAds } from "./utils/ads";
import { checkAndUpdateApp } from "./utils/appUpdate";

function App() {
  const [screen, setScreen] = useState<"home" | "game" | "ranking">("home");

  useEffect(() => {
    initAds().catch((e) => console.error("AdMob 초기화 실패", e));
    checkAndUpdateApp();
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return (
          <HomeScreen
            onStart={() => setScreen("game")}
            onRanking={() => setScreen("ranking")}
          />
        );

      case "game":
        return (
          <GameScreen
            onFinish={() => setScreen("ranking")}
            onHome={() => setScreen("home")}
          />
        );

      case "ranking":
        return (
          <RankingScreen
            onHome={() => setScreen("home")}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderScreen()}
      <MuteButton />
    </>
  );
}

export default App;