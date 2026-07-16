import { useState } from "react";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import RankingScreen from "./screens/RankingScreen";
import MuteButton from "./components/MuteButton";

function App() {
  const [screen, setScreen] = useState<"home" | "game" | "ranking">("home");

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