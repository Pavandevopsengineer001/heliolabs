"use client";

import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";

export function Reveal(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      {...props}
    />
  );
}

