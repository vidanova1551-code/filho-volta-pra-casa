import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeText({
  children,
  delay = 0,
  className = "",
}: FadeTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 1,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}