import { useState } from "react";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import RankingScreen from "./screens/RankingScreen";

function App() {
  const [screen, setScreen] = useState<"home" | "game" | "ranking">("home");

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
}

export default App;