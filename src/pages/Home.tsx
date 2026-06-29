import { useState } from "react";
import Hero from "../components/Hero/Hero";

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
    <main className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory">
      <Hero onStart={() => setStarted(true)} />

      {started && (
        <>
          <Chapter01 />
          <Chapter02 />
          <Chapter03 />
          <Chapter04 />
          <Chapter05 />
          <Chapter06 />
          <Decision />
          <Form />
          <Footer />
        </>
      )}
    </main>
  );
}