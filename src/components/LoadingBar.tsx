"use client";

import { motion } from "framer-motion";

const LoadingBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[100] overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
        style={{
          width: "50%",
        }}
      />
    </div>
  );
};

export default LoadingBar;
