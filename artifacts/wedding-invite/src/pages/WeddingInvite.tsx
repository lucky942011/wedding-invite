import { useState, useEffect, useRef } from "react";
import SealButton from "../components/wedding/SealButton";
import CurtainReveal from "../components/wedding/CurtainReveal";
import InvitationContent from "../components/wedding/InvitationContent";

export default function WeddingInvite() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lock scroll when on entry screen
  useEffect(() => {
    if (!inviteOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [inviteOpen]);

  // Attempt to play music immediately on load
  useEffect(() => {
    const startMusic = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.2;
        audioRef.current.play().catch(() => {
          // Browser blocked autoplay; will succeed on user's first interaction
        });
      }
    };

    // Try to play immediately when the page loads
    startMusic();

    // Since browsers block autoplay, listen for the very first click or tap ANYWHERE on the screen
    document.addEventListener("click", startMusic, { once: true });
    document.addEventListener("touchstart", startMusic, { once: true });

    return () => {
      document.removeEventListener("click", startMusic);
      document.removeEventListener("touchstart", startMusic);
    };
  }, []);

  const handleOpenInvitation = () => {
    setInviteOpen(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch(() => {
        // Audio playback failed (e.g., due to browser policy), we can ignore
      });
    }
  };

  return (
    <>
      <audio ref={audioRef} autoPlay loop preload="auto">
        <source src="./ishqhai.mp3" type="audio/mpeg" />
      </audio>

      <CurtainReveal 
        isOpen={inviteOpen}
        onOpen={handleOpenInvitation}
        sealContent={<SealButton onClick={handleOpenInvitation} />}
      >
        {/* Content to show after opening */}
        {inviteOpen && <InvitationContent />}
      </CurtainReveal>
    </>
  );
}
