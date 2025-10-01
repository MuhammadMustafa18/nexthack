"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SlidingTextProps = {
  staticText?: string;
  words: string[];
  interval?: number;
  textClassName?: string; // applied to the changing words
};

export function FlippingText({
  staticText = "Best software for",

  words,
  interval = 2000,
  textClassName,
}: SlidingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <div className={`relative flex gap-2 items-center ${textClassName}`}>
      <div className=" h-[1em] w-fit overflow-hidden ">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={{ y: "40%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-40%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute left-0 "
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
