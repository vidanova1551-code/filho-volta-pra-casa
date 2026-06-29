import { useEffect, useRef } from "react";
import music from "../../assets/audio/ainda-ha-lugar.mp3";

declare global {
  interface Window {
    startBackgroundMusic?: () => void;
  }
}

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(music);
    audio.loop = true;
    audio.volume = 0.2;

    audioRef.current = audio;

    window.startBackgroundMusic = async () => {
      console.log("Tentando tocar música...");

      try {
        await audio.play();
        console.log("Música iniciada!");
      } catch (e) {
        console.error("Erro ao tocar:", e);
      }
    };

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  return null;
}