import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Particles from "./Particles";

interface SectionProps {
  id?: string;
  children: ReactNode;
  backgroundImage?: string;
}

export default function Section({ id, children, backgroundImage }: SectionProps) {
  return (
    <section
      id={id}
      className="relative flex min-h-screen snap-start items-center justify-center overflow-hidden bg-black px-8 text-center"
    >
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ scale: 1 }}
          whileInView={{ scale: 1.08 }}
          viewport={{ once: false }}
          transition={{ duration: 22 }}
        />
      )}

      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,156,61,.12)_0%,rgba(0,0,0,.25)_45%,rgba(0,0,0,.65)_100%)]" />

      <Particles />

      <motion.div
        className="relative z-10 max-w-5xl drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)]"
        initial={{ opacity: 0, y: 70, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2 }}
      >
        {children}
      </motion.div>
    </section>
  );
}