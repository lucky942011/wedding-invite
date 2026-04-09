import { useState } from "react";
import { motion } from "framer-motion";

export default function SealButton({ onClick }: { onClick: () => void }) {
  const [breaking, setBreaking] = useState(false);

  const handleClick = () => {
    if (breaking) return;
    setBreaking(true);
    // Give it a small delay to show crack animation before opening
    setTimeout(() => {
      onClick();
    }, 800);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="relative flex items-center justify-center focus:outline-none"
      style={{ width: 140, height: 140, cursor: breaking ? "default" : "pointer" }}
      animate={
        breaking 
          ? { scale: 1.15, opacity: 0 } 
          : { scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(201,168,76,0)", "0px 0px 25px rgba(201,168,76,0.6)", "0px 0px 0px rgba(201,168,76,0)"] }
      }
      transition={
        breaking 
          ? { duration: 0.6, delay: 0.4 } 
          : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }
      aria-label="Break the seal to open invitation"
      data-testid="wax-seal"
    >
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 38% 38%, #9e2020 0%, #6b1414 40%, #4a0e0e 100%)",
          boxShadow: "0 0 0 3px #c9a84c, 0 0 0 5px #6b1414, 0 8px 32px rgba(0,0,0,.9), inset 0 2px 4px rgba(255,200,100,.15)",
        }}
      />
      {/* Inner decorative ring */}
      <div
        className="absolute rounded-full border border-[rgba(201,168,76,0.5)]"
        style={{ inset: 10 }}
      />
      <div
        className="absolute rounded-full border border-dashed border-[rgba(201,168,76,0.3)]"
        style={{ inset: 16 }}
      />
      {/* Initials */}
      <div className="relative z-10 text-center flex flex-col items-center">
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem",
            color: "#e8c96d",
            letterSpacing: "0.1em",
            textShadow: "0 1px 3px rgba(0,0,0,.6)",
            lineHeight: 1,
          }}
        >
          A & S
        </span>
        <div className="w-10 h-px bg-[rgba(201,168,76,0.5)] my-1.5" />
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.5rem",
            color: "rgba(201,168,76,.7)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          2026
        </span>
      </div>
      {/* Crack lines shown during break */}
      {breaking && (
        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        >
          <motion.line x1="60" y1="60" x2="20" y2="20" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
          <motion.line x1="60" y1="60" x2="100" y2="15" stroke="#c9a84c" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.05 }} />
          <motion.line x1="60" y1="60" x2="5" y2="70" stroke="#c9a84c" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.1 }} />
          <motion.line x1="60" y1="60" x2="115" y2="55" stroke="#c9a84c" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.08 }} />
          <motion.line x1="60" y1="60" x2="30" y2="110" stroke="#c9a84c" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.15 }} />
          <motion.line x1="60" y1="60" x2="95" y2="105" stroke="#c9a84c" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.06 }} />
        </svg>
      )}
    </motion.button>
  );
}
