import { motion } from "framer-motion";
import logo from "../../assets/logo.png";
import heroBg from "../../assets/backgrounds/hero.png";
import Particles from "../Common/Particles";

declare global {
  interface Window {
    startBackgroundMusic?: () => void;
  }
}

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  const handleStart = () => {
    window.startBackgroundMusic?.();
    onStart();

    setTimeout(() => {
      document.getElementById("chapter01")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <section className="relative flex min-h-screen snap-start items-center justify-center overflow-hidden bg-black px-8 text-center">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="absolute inset-0 bg-black/58" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,156,61,.14)_0%,rgba(0,0,0,.35)_45%,rgba(0,0,0,.75)_100%)]" />

      <Particles />

      <div className="relative z-10 flex max-w-4xl flex-col items-center pt-10 md:pt-0">
        <motion.img
          src={logo}
          alt="Filho, Volta pra Casa"
          className="w-[210px] drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)] md:w-[300px]"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        />

        <motion.h1
          className="mt-12 text-[3.35rem] font-black leading-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)] md:text-7xl"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1 }}
        >
          Filho,
          <br />
          Volta pra Casa!
        </motion.h1>

        <motion.p
          className="mt-7 max-w-md text-xl leading-8 text-gray-100 drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)] md:max-w-xl md:text-2xl md:leading-9"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Se você chegou até aqui...
          <br />
          talvez isso não seja por acaso.
        </motion.p>

        <motion.button
          onClick={handleStart}
          className="mt-14 rounded-full bg-[#C89C3D] px-12 py-5 text-lg font-bold uppercase tracking-[4px] text-black transition hover:bg-white hover:scale-105 active:scale-95"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 1 }}
        >
          SEGUIR
        </motion.button>
      </div>
    </section>
  );
}