import { useRef } from "react";
import Home from "./pages/Home";
import music from "./assets/audio/ainda-ha-lugar.mp3";

declare global {
  interface Window {
    startBackgroundMusic?: () => void;
  }
}

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  window.startBackgroundMusic = async () => {
    const audio = audioRef.current;

    if (!audio) {
      console.log("Elemento de áudio não encontrado");
      return;
    }

    try {
      audio.volume = 0.30;
      await audio.play();
      console.log("Música tocando");
    } catch (error) {
      console.error("Erro ao tocar música:", error);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={music} loop preload="auto" />
      <Home />
    </>
  );
}

export default App;