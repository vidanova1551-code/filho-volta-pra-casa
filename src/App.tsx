import { useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import LoginAdmin from "./pages/LoginAdmin";
import PainelAdmin from "./pages/PainelAdmin";
import RotaProtegida from "./routes/RotaProtegida";
import CadastroEvangelismo from "./pages/CadastroEvangelismo";

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
      audio.volume = 0.3;
      await audio.play();
      console.log("Música tocando");
    } catch (error) {
      console.error("Erro ao tocar música:", error);
    }
  };

  return (
    <BrowserRouter>
      <audio ref={audioRef} src={music} loop preload="auto" />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/adm" element={<LoginAdmin />} />

        <Route path="/cadastro" element={<CadastroEvangelismo />} />

        <Route
          path="/adm/painel"
          element={
            <RotaProtegida>
              <PainelAdmin />
            </RotaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;