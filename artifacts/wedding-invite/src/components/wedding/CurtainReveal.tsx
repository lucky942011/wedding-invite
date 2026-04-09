import { ReactNode, useState, useEffect } from "react";

interface CurtainRevealProps {
  isOpen: boolean;
  onOpen: () => void;
  children: ReactNode;
  sealContent: ReactNode;
}

export default function CurtainReveal({ isOpen, onOpen, children, sealContent }: CurtainRevealProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Force scroll to top when opened to prevent premature hiding
      window.scrollTo(0, 0);
      setIsScrolled(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleScroll = () => {
      // Only hide curtains if user has significantly scrolled down
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <>
      {/* Background Content (The Actual Invitation) */}
      <div 
        className="relative w-full z-0 transition-all duration-[3000ms] ease-out delay-500"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1)" : "scale(0.9)",
          pointerEvents: isOpen ? "auto" : "none"
        }}
      >
        {children}
      </div>

      {/* The Curtains Overlay (Fixed to screen) */}
      <div 
        className={`fixed top-0 left-0 w-full h-screen z-40 pointer-events-none overflow-hidden transition-opacity duration-700 ${isOpen && isScrolled ? 'opacity-0' : 'opacity-100'}`}
        style={{ perspective: "1500px" }}
      >
        {/* Left Leaf */}
        <div 
          className="absolute top-0 left-0 w-1/2 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] cursor-pointer"
          onClick={() => { if (!isOpen) onOpen(); }}
          style={{
            height: "110%",
            transformOrigin: "top left",
            borderRight: "1px solid rgba(255,215,0,0.3)",
            background: "repeating-linear-gradient(to right, #800000 0%, #a30000 5%, #800000 10%, #5c0000 12%)",
            transition: "all 2.8s ease-in-out",
            transform: isOpen ? "translateX(-20%) translateY(-5%) scaleX(0.45) rotateZ(10deg)" : "translateX(0) translateY(0) scaleX(1) rotateZ(0deg)",
            borderBottomRightRadius: isOpen ? "100% 120%" : "0",
            pointerEvents: isOpen ? "none" : "auto",
          }}
        />
        
        {/* Right Leaf */}
        <div 
          className="absolute top-0 right-0 w-1/2 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] cursor-pointer"
          onClick={() => { if (!isOpen) onOpen(); }}
          style={{
            height: "110%",
            transformOrigin: "top right",
            background: "repeating-linear-gradient(to left, #800000 0%, #a30000 5%, #800000 10%, #5c0000 12%)",
            transition: "all 2.8s ease-in-out",
            transform: isOpen ? "translateX(20%) translateY(-5%) scaleX(0.45) rotateZ(-10deg)" : "translateX(0) translateY(0) scaleX(1) rotateZ(0deg)",
            borderBottomLeftRadius: isOpen ? "100% 120%" : "0",
            pointerEvents: isOpen ? "none" : "auto",
          }}
        />
      </div>

      {/* Center Seal & Welcome Text (In front of the curtain) */}
      <div 
        className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none transition-opacity duration-700 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className={`flex flex-col items-center gap-6 ${isOpen ? 'pointer-events-none' : 'pointer-events-auto'}`} onClick={(e) => e.stopPropagation()}>
          <div className="text-center pointer-events-none">
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                color: "#f7e8b8",
                letterSpacing: "0.08em",
                lineHeight: 1.05,
                textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                margin: 0,
              }}
            >
              Welcome to Our Story
            </h1>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                color: "#d7b969",
                letterSpacing: "0.14em",
                marginTop: 12,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              Together With Love
            </p>
          </div>
          
          <div className="mt-8">
            {sealContent}
          </div>
        </div>
      </div>
    </>
  );
}
