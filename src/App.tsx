import { useState } from "react";
import "./App.css";

import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";

function App() {
  const [screen, setScreen] = useState<"home" | "game">("home");

  if (screen === "home") {
    return <HomeScreen onStart={() => setScreen("game")} />;
  }

  return <GameScreen />;
}

export default App;