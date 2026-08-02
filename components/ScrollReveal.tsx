"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = "up" 
}: { 
  children: ReactNode, 
  delay?: number, 
  direction?: "up" | "down" | "left" | "right" 
}) {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.7, delay, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
