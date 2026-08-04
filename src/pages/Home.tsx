import { useState } from "react";

import Hero from "../components/Hero/Hero";
import IndicadorRolagem from "../components/IndicadorRolagem";

import Chapter01 from "../components/Journey/Chapter01";
import Chapter02 from "../components/Journey/Chapter02";
import Chapter03 from "../components/Journey/Chapter03";
import Chapter04 from "../components/Journey/Chapter04";
import Chapter05 from "../components/Journey/Chapter05";
import Chapter06 from "../components/Journey/Chapter06";
import Decision from "../components/Journey/Decision";
import Form from "../components/Form/Form";
import Footer from "../components/Layout/Footer";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth">
      <div className="relative">
        <Hero onStart={() => setStarted(true)} />

        {started && (
          <IndicadorRolagem texto="Deslize para começar esta jornada" />
        )}
      </div>

      {started && (
        <>
          <div className="relative">
            <Chapter01 />
            <IndicadorRolagem texto="Continue... ainda há mais para você" />
          </div>

          <div className="relative">
            <Chapter02 />
            <IndicadorRolagem texto="Há uma história esperando por você" />
          </div>

          <div className="relative">
            <Chapter03 />
            <IndicadorRolagem texto="Ainda não acabou" />
          </div>

          <div className="relative">
            <Chapter04 />
            <IndicadorRolagem texto="Dê mais um passo" />
          </div>

          <div className="relative">
            <Chapter05 />
            <IndicadorRolagem texto="Continue... o Pai ainda está falando" />
          </div>

          <div className="relative">
            <Chapter06 />
            <IndicadorRolagem texto="Você está perto de uma decisão" />
          </div>

          <div className="relative">
            <Decision />
            <IndicadorRolagem texto="Deslize e dê o próximo passo" />
          </div>

          <Form />
          <Footer />
        </>
      )}
    </main>
  );
}