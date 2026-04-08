import { useState, useEffect, useRef, useCallback } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

function useScrollFade(active: boolean) {
  useEffect(() => {
    if (!active) return;
    // Small delay to let React finish rendering all sections into the DOM
    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
      const elements = document.querySelectorAll(".scroll-fade");
      elements.forEach((el) => observer.observe(el));
      // Cleanup stored on ref so we can disconnect on unmount
      (window as any).__scrollFadeObserver = observer;
    }, 100);
    return () => {
      clearTimeout(timeout);
      (window as any).__scrollFadeObserver?.disconnect();
    };
  }, [active]);
}

const weddingDate = new Date("December 12, 2026 17:00:00");

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    alt: "Couple portrait",
    className: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80",
    alt: "Wedding flowers",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1549416878-b1df28c9da68?w=600&q=80",
    alt: "Wedding rings",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
    alt: "Reception venue",
    className: "col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
    alt: "Wedding cake",
    className: "",
  },
];

const events = [
  {
    name: "Mehendi Ceremony",
    date: "December 10, 2026",
    time: "4:00 PM Onwards",
    venue: "Rosewood Garden, Mumbai",
    icon: "🌿",
    description: "Join us for an evening of henna art, music, and celebration as we prepare for the festivities ahead.",
    color: "from-green-900/30 to-green-800/10",
    borderColor: "border-green-700/30",
  },
  {
    name: "Haldi Ceremony",
    date: "December 11, 2026",
    time: "10:00 AM Onwards",
    venue: "Sunshine Terrace, Mumbai",
    icon: "✨",
    description: "A vibrant morning of turmeric rituals and blessings to usher in good fortune for the couple.",
    color: "from-yellow-900/30 to-yellow-800/10",
    borderColor: "border-yellow-700/30",
  },
  {
    name: "Wedding Ceremony",
    date: "December 12, 2026",
    time: "5:00 PM Onwards",
    venue: "The Grand Palace, Mumbai",
    icon: "💍",
    description: "The sacred union in a ceremony filled with ancient rituals, vows of eternal love, and grand celebration.",
    color: "from-amber-900/30 to-amber-800/10",
    borderColor: "border-amber-700/30",
  },
];

interface RSVPData {
  name: string;
  attending: string;
  guests: string;
  message: string;
}

export default function WeddingInvite() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [animatingEnvelope, setAnimatingEnvelope] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [petals, setPetals] = useState<number[]>([]);
  const [rsvpData, setRsvpData] = useState<RSVPData>({ name: "", attending: "yes", guests: "1", message: "" });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeLeft = useCountdown(weddingDate);
  useScrollFade(showContent);

  const openInvite = useCallback(() => {
    if (envelopeOpen) return;
    setAnimatingEnvelope(true);
    setTimeout(() => {
      setEnvelopeOpen(true);
      setShowContent(true);
      document.body.style.overflow = "auto";

      const petalCount = Array.from({ length: 18 }, (_, i) => i);
      setPetals(petalCount);

      if (audioRef.current) {
        audioRef.current.volume = 0.25;
        audioRef.current.play().catch(() => {});
      }
    }, 1200);
  }, [envelopeOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "countdown", "story", "events", "gallery", "rsvp"];
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) current = id;
      }
      setActiveNav(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Background music */}
      <audio ref={audioRef} loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>

      {/* Falling Petals */}
      {showContent &&
        petals.map((i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 6}s`,
              fontSize: `${14 + Math.random() * 12}px`,
              opacity: 0,
            }}
          >
            {["🌸", "🌺", "✿", "❀", "🌹"][Math.floor(Math.random() * 5)]}
          </span>
        ))}

      {/* ENVELOPE SCREEN */}
      {!envelopeOpen && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer ${
            animatingEnvelope ? "envelope-exit pointer-events-none" : ""
          }`}
          style={{
            background: "linear-gradient(135deg, #2c1810 0%, #1a0f08 30%, #0d0703 60%, #1a0f08 100%)",
          }}
          onClick={openInvite}
          data-testid="envelope-screen"
        >
          {/* Stars */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-amber-200"
              style={{
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `sparkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite`,
                opacity: 0,
              }}
            />
          ))}

          {/* Corner ornaments */}
          <div className="absolute top-6 left-6 text-amber-400/40 text-4xl select-none">✦</div>
          <div className="absolute top-6 right-6 text-amber-400/40 text-4xl select-none">✦</div>
          <div className="absolute bottom-6 left-6 text-amber-400/40 text-4xl select-none">✦</div>
          <div className="absolute bottom-6 right-6 text-amber-400/40 text-4xl select-none">✦</div>

          {/* Decorative border */}
          <div
            className="absolute inset-8 rounded pointer-events-none"
            style={{ border: "1px solid rgba(201,168,76,0.2)" }}
          />
          <div
            className="absolute inset-10 rounded pointer-events-none"
            style={{ border: "1px solid rgba(201,168,76,0.08)" }}
          />

          {/* Envelope SVG */}
          <div className="float-up mb-8">
            <div className="relative flex items-center justify-center" style={{ width: 280, height: 200 }}>
              {/* Envelope body */}
              <svg width="280" height="200" viewBox="0 0 280 200" fill="none">
                {/* Envelope body */}
                <rect x="10" y="60" width="260" height="130" rx="4" fill="#3d2410" stroke="#c9a84c" strokeWidth="1.5" />
                {/* Envelope flap */}
                <path d="M10 60 L140 130 L270 60 Z" fill="#4d2e15" stroke="#c9a84c" strokeWidth="1.5" />
                {/* Envelope bottom fold lines */}
                <path d="M10 190 L95 125" stroke="#c9a84c" strokeWidth="0.8" strokeOpacity="0.5" />
                <path d="M270 190 L185 125" stroke="#c9a84c" strokeWidth="0.8" strokeOpacity="0.5" />
                {/* Wax seal area */}
                <circle cx="140" cy="125" r="32" fill="#8B1A1A" stroke="#c9a84c" strokeWidth="2" />
                <circle cx="140" cy="125" r="26" fill="none" stroke="#c9a84c" strokeWidth="1" strokeDasharray="3 3" />
                <text x="140" y="130" textAnchor="middle" fill="#c9a84c" fontSize="16" fontFamily="serif">A&S</text>
                {/* Decorative lines on envelope */}
                <line x1="80" y1="100" x2="200" y2="100" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.3" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="text-center mb-10 px-8">
            <p
              className="text-amber-200/60 tracking-[0.3em] text-xs uppercase mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              You are cordially invited to
            </p>
            <h1
              className="gold-shimmer mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                lineHeight: 1.2,
              }}
            >
              Adarsh & Shreya
            </h1>
            <p
              className="text-amber-200/50 tracking-[0.2em] text-sm"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
            >
              A Wedding Celebration
            </p>
          </div>

          {/* Click prompt */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="wax-pulse rounded-full px-8 py-3 cursor-pointer select-none"
              style={{
                background: "linear-gradient(135deg, #8B1A1A, #c9a84c, #8B1A1A)",
                border: "1px solid #c9a84c",
              }}
            >
              <span
                className="text-amber-100 tracking-[0.25em] text-xs uppercase"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Open Invitation
              </span>
            </div>
            <p className="text-amber-400/40 text-xs tracking-widest animate-pulse">Click to reveal</p>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      {showContent && (
        <div className={envelopeOpen ? "content-reveal" : "opacity-0"}>

          {/* Floating Navigation */}
          <nav
            className="wedding-nav fixed top-0 left-0 right-0 z-40 border-b"
            style={{
              background: "rgba(245, 238, 220, 0.85)",
              borderColor: "rgba(201,168,76,0.2)",
            }}
          >
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
              <span
                className="gold-shimmer text-lg"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                A & P
              </span>
              <div className="hidden md:flex items-center gap-6">
                {["story", "events", "gallery", "rsvp"].map((id) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="text-xs tracking-widest uppercase transition-colors hover:text-amber-600"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      color: activeNav === id ? "#c9a84c" : "#8a7550",
                    }}
                    data-testid={`nav-${id}`}
                  >
                    {id}
                  </button>
                ))}
              </div>
              <div className="text-amber-600/60 text-xs tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Dec 12, 2026
              </div>
            </div>
          </nav>

          {/* HERO SECTION */}
          <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a0f08 0%, #2c1810 40%, #1a0f08 100%)",
            }}
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, #c9a84c 0%, transparent 50%), radial-gradient(circle at 75% 75%, #c9a84c 0%, transparent 50%)`,
              }}
            />

            {/* Stars */}
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-amber-200"
                style={{
                  width: `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `sparkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite`,
                  opacity: 0,
                }}
              />
            ))}

            {/* Corner ornaments */}
            <div className="absolute top-24 left-8 text-amber-400/30 text-5xl select-none hidden md:block">❧</div>
            <div className="absolute top-24 right-8 text-amber-400/30 text-5xl select-none hidden md:block" style={{ transform: "scaleX(-1)" }}>❧</div>

            {/* Decorative border */}
            <div
              className="absolute inset-8 pointer-events-none hidden md:block"
              style={{ border: "1px solid rgba(201,168,76,0.15)" }}
            />

            <div className="relative text-center px-6 max-w-3xl mx-auto">
              <p
                className="text-amber-300/60 tracking-[0.4em] text-xs uppercase mb-8 fade-in-up"
                style={{ fontFamily: "'Montserrat', sans-serif", animationDelay: "0.1s" }}
              >
                Together with their families
              </p>

              <div className="mb-6 fade-in-up" style={{ animationDelay: "0.3s" }}>
                <h1
                  className="gold-shimmer leading-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(3rem, 10vw, 6rem)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Adarsh
                </h1>
                <div className="my-3 flex items-center justify-center gap-4">
                  <span
                    className="text-amber-400/50"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}
                  >
                    &
                  </span>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                  <span
                    className="text-amber-400/50"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}
                  >
                    &
                  </span>
                </div>
                <h1
                  className="gold-shimmer leading-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(3rem, 10vw, 6rem)",
                    letterSpacing: "-0.01em",
                    animationDelay: "0.5s",
                  }}
                >
                  Shreya
                </h1>
              </div>

              <div className="gold-divider max-w-xs mx-auto mb-8 fade-in-up" style={{ animationDelay: "0.5s" }}>
                <span className="text-amber-400/60 text-xs tracking-widest whitespace-nowrap">— ✦ —</span>
              </div>

              <div className="fade-in-up" style={{ animationDelay: "0.7s" }}>
                <p
                  className="text-amber-200/80 tracking-[0.2em] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem" }}
                >
                  December 12, 2026
                </p>
                <p className="text-amber-300/50 tracking-[0.15em] text-xs uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  The Grand Palace, Mumbai
                </p>
              </div>

              <div className="mt-12 fade-in-up" style={{ animationDelay: "0.9s" }}>
                <button
                  onClick={() => scrollTo("countdown")}
                  className="inline-flex items-center gap-2 text-amber-400/60 text-xs tracking-widest uppercase hover:text-amber-300 transition-colors animate-bounce"
                  data-testid="scroll-down-btn"
                >
                  <span>Scroll</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 12L2 6h12z" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* COUNTDOWN SECTION */}
          <section
            id="countdown"
            className="section-padding text-center"
            style={{ background: "linear-gradient(180deg, #f5eedc 0%, #faf6ea 100%)" }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="scroll-fade mb-4">
                <p className="text-amber-600/60 tracking-[0.3em] text-xs uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Counting down to
                </p>
              </div>
              <div className="scroll-fade mb-12">
                <h2
                  className="text-amber-800"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
                >
                  Our Special Day
                </h2>
              </div>

              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto scroll-fade">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center"
                    data-testid={`countdown-${label.toLowerCase()}`}
                  >
                    <div
                      className="relative w-full aspect-square max-w-28 flex items-center justify-center rounded-sm mb-3"
                      style={{
                        background: "linear-gradient(135deg, #2c1810, #3d2410)",
                        border: "1px solid rgba(201,168,76,0.4)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(201,168,76,0.1)",
                      }}
                    >
                      <span
                        className="gold-shimmer"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                          lineHeight: 1,
                        }}
                      >
                        {pad(value)}
                      </span>
                    </div>
                    <span
                      className="text-amber-700/60 tracking-[0.2em] uppercase"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6rem" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="scroll-fade mt-12">
                <div
                  className="inline-block px-8 py-3 rounded-sm"
                  style={{
                    border: "1px solid rgba(201,168,76,0.3)",
                    background: "rgba(201,168,76,0.05)",
                  }}
                >
                  <p
                    className="text-amber-700/70 tracking-widest text-xs italic"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
                  >
                    "Every love story is beautiful, but ours is my favourite."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* OUR STORY SECTION */}
          <section
            id="story"
            className="section-padding"
            style={{ background: "linear-gradient(180deg, #1a0f08 0%, #2c1810 100%)" }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 scroll-fade">
                <p className="text-amber-400/50 tracking-[0.3em] text-xs uppercase mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  How it began
                </p>
                <h2
                  className="gold-shimmer mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)" }}
                >
                  Our Story
                </h2>
                <div className="gold-divider max-w-xs mx-auto">
                  <span className="text-amber-500/40 text-xs">✦</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    year: "2019",
                    title: "First Meeting",
                    desc: "Two souls met at a friend's gathering, exchanged glances across a crowded room, and the universe conspired in ways neither could have imagined.",
                    icon: "✨",
                  },
                  {
                    year: "2021",
                    title: "Falling in Love",
                    desc: "Through countless conversations, shared dreams, and stolen moments — love quietly, beautifully, inevitably found its way into both their hearts.",
                    icon: "💫",
                  },
                  {
                    year: "2024",
                    title: "The Proposal",
                    desc: "Under a sky full of stars, Adarsh asked the question that changed everything. Shreya said yes, and a lifetime of together began right there.",
                    icon: "💍",
                  },
                ].map((item, idx) => (
                  <div
                    key={item.year}
                    className="scroll-fade text-center"
                    style={{ transitionDelay: `${idx * 0.15}s` }}
                    data-testid={`story-card-${idx}`}
                  >
                    <div
                      className="relative p-8 rounded-sm h-full"
                      style={{
                        background: "rgba(201,168,76,0.04)",
                        border: "1px solid rgba(201,168,76,0.15)",
                      }}
                    >
                      <div className="text-3xl mb-4">{item.icon}</div>
                      <p
                        className="gold-shimmer text-sm tracking-widest mb-3"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {item.year}
                      </p>
                      <h3
                        className="text-amber-200 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem" }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-amber-300/55 leading-relaxed text-sm"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", lineHeight: 1.8 }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* EVENTS SECTION */}
          <section
            id="events"
            className="section-padding"
            style={{ background: "linear-gradient(180deg, #faf6ea 0%, #f5eedc 100%)" }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 scroll-fade">
                <p className="text-amber-600/50 tracking-[0.3em] text-xs uppercase mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Join us for
                </p>
                <h2
                  className="text-amber-800 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)" }}
                >
                  Wedding Events
                </h2>
                <div className="gold-divider max-w-xs mx-auto">
                  <span className="text-amber-500/40 text-xs">✦</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {events.map((event, idx) => (
                  <div
                    key={event.name}
                    className="scroll-fade"
                    style={{ transitionDelay: `${idx * 0.15}s` }}
                    data-testid={`event-card-${idx}`}
                  >
                    <div
                      className={`p-8 h-full rounded-sm bg-gradient-to-b ${event.color} border ${event.borderColor}`}
                      style={{ background: "white" }}
                    >
                      <div className="text-4xl mb-6">{event.icon}</div>
                      <h3
                        className="text-amber-800 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem" }}
                      >
                        {event.name}
                      </h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3">
                          <span className="text-amber-500 mt-0.5">📅</span>
                          <div>
                            <p className="text-amber-800/80 text-sm font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              {event.date}
                            </p>
                            <p className="text-amber-600/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              {event.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-amber-500 mt-0.5">📍</span>
                          <p className="text-amber-700/70 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {event.venue}
                          </p>
                        </div>
                      </div>

                      <p
                        className="text-amber-700/60 leading-relaxed"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", lineHeight: 1.8 }}
                      >
                        {event.description}
                      </p>

                      <div
                        className="mt-6 pt-6"
                        style={{ borderTop: "1px solid rgba(201,168,76,0.2)" }}
                      >
                        <span className="text-amber-600/50 tracking-widest text-xs uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          Black Tie Optional
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* GALLERY SECTION */}
          <section
            id="gallery"
            className="section-padding"
            style={{ background: "linear-gradient(180deg, #1a0f08 0%, #2c1810 100%)" }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 scroll-fade">
                <p className="text-amber-400/50 tracking-[0.3em] text-xs uppercase mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Moments together
                </p>
                <h2
                  className="gold-shimmer mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)" }}
                >
                  Our Gallery
                </h2>
                <div className="gold-divider max-w-xs mx-auto">
                  <span className="text-amber-500/40 text-xs">✦</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 scroll-fade">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`gallery-item ${img.className}`}
                    style={{
                      height: img.className.includes("row-span-2") ? "420px" : "200px",
                      border: "1px solid rgba(201,168,76,0.2)",
                    }}
                    data-testid={`gallery-item-${idx}`}
                  >
                    <img src={img.src} alt={img.alt} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP SECTION */}
          <section
            id="rsvp"
            className="section-padding text-center"
            style={{ background: "linear-gradient(180deg, #f5eedc 0%, #faf6ea 100%)" }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="scroll-fade mb-4">
                <p className="text-amber-600/50 tracking-[0.3em] text-xs uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Kindly reply by November 1, 2026
                </p>
              </div>
              <div className="scroll-fade mb-12">
                <h2
                  className="text-amber-800 mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)" }}
                >
                  RSVP
                </h2>
                <p
                  className="text-amber-700/60 italic"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
                >
                  We would be honored to celebrate with you
                </p>
              </div>

              {!rsvpSubmitted ? (
                <form
                  onSubmit={handleRSVP}
                  className="scroll-fade text-left space-y-6"
                  data-testid="rsvp-form"
                >
                  <div
                    className="p-8 rounded-sm"
                    style={{
                      background: "white",
                      border: "1px solid rgba(201,168,76,0.2)",
                      boxShadow: "0 4px 24px rgba(100,80,20,0.06)",
                    }}
                  >
                    {/* Name */}
                    <div className="mb-6">
                      <label
                        className="block text-amber-700/70 tracking-widest text-xs uppercase mb-2"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="luxury-input w-full px-4 py-3 text-sm"
                        placeholder="Your name"
                        value={rsvpData.name}
                        onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                        required
                        data-testid="input-name"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      />
                    </div>

                    {/* Attending */}
                    <div className="mb-6">
                      <label
                        className="block text-amber-700/70 tracking-widest text-xs uppercase mb-3"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Will you be attending?
                      </label>
                      <div className="flex gap-4">
                        {[
                          { value: "yes", label: "Joyfully Accept", icon: "💌" },
                          { value: "no", label: "Regretfully Decline", icon: "🙏" },
                        ].map((opt) => (
                          <label
                            key={opt.value}
                            className="flex-1 flex items-center gap-3 p-4 rounded-sm cursor-pointer transition-all"
                            style={{
                              border: `1px solid ${rsvpData.attending === opt.value ? "#c9a84c" : "rgba(201,168,76,0.2)"}`,
                              background: rsvpData.attending === opt.value ? "rgba(201,168,76,0.08)" : "transparent",
                            }}
                            data-testid={`attending-${opt.value}`}
                          >
                            <input
                              type="radio"
                              name="attending"
                              value={opt.value}
                              checked={rsvpData.attending === opt.value}
                              onChange={(e) => setRsvpData({ ...rsvpData, attending: e.target.value })}
                              className="sr-only"
                            />
                            <span className="text-lg">{opt.icon}</span>
                            <span
                              className="text-xs"
                              style={{
                                fontFamily: "'Montserrat', sans-serif",
                                color: rsvpData.attending === opt.value ? "#8B6914" : "#a08040",
                                fontWeight: rsvpData.attending === opt.value ? 500 : 400,
                              }}
                            >
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Number of guests */}
                    {rsvpData.attending === "yes" && (
                      <div className="mb-6">
                        <label
                          className="block text-amber-700/70 tracking-widest text-xs uppercase mb-2"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Number of Guests
                        </label>
                        <select
                          className="luxury-input w-full px-4 py-3 text-sm"
                          value={rsvpData.guests}
                          onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                          data-testid="select-guests"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          {["1", "2", "3", "4", "5"].map((n) => (
                            <option key={n} value={n}>{n} {n === "1" ? "Guest" : "Guests"}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Message */}
                    <div className="mb-8">
                      <label
                        className="block text-amber-700/70 tracking-widest text-xs uppercase mb-2"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Message for the Couple
                      </label>
                      <textarea
                        className="luxury-input w-full px-4 py-3 text-sm resize-none"
                        placeholder="Share your wishes and blessings..."
                        rows={4}
                        value={rsvpData.message}
                        onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                        data-testid="textarea-message"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 tracking-[0.25em] text-xs uppercase transition-all hover:opacity-90"
                      style={{
                        background: "linear-gradient(135deg, #8B1A1A, #c9a84c, #8B1A1A)",
                        color: "#faf6ea",
                        fontFamily: "'Montserrat', sans-serif",
                        letterSpacing: "0.25em",
                        border: "1px solid #c9a84c",
                      }}
                      data-testid="button-submit"
                    >
                      Send RSVP
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  className="scroll-fade p-12 rounded-sm text-center"
                  style={{
                    background: "linear-gradient(135deg, #1a0f08, #2c1810)",
                    border: "1px solid rgba(201,168,76,0.3)",
                  }}
                  data-testid="rsvp-success"
                >
                  <div className="text-5xl mb-6">💌</div>
                  <h3
                    className="gold-shimmer mb-4"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem" }}
                  >
                    Thank You, {rsvpData.name}!
                  </h3>
                  <p
                    className="text-amber-300/70 leading-relaxed"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", lineHeight: 1.8 }}
                  >
                    {rsvpData.attending === "yes"
                      ? "We are overjoyed that you will be joining us on our special day. Your presence will make it even more memorable."
                      : "We understand and will miss you dearly. Your warm wishes mean the world to us."}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* FOOTER */}
          <footer
            style={{ background: "linear-gradient(180deg, #1a0f08 0%, #0d0703 100%)" }}
            className="py-16 text-center px-6"
          >
            <div className="max-w-2xl mx-auto">
              <h2
                className="gold-shimmer mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
              >
                Adarsh & Shreya
              </h2>
              <div className="gold-divider max-w-xs mx-auto mb-6">
                <span className="text-amber-500/40 text-xs">✦</span>
              </div>
              <p
                className="text-amber-400/50 tracking-[0.2em] text-xs uppercase mb-8"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                December 12, 2026 · Mumbai, India
              </p>
              <p
                className="text-amber-300/40 italic"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
              >
                "Two hearts, one soul, forever."
              </p>
              <div className="mt-8 text-amber-500/20 text-xs tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                ✦ ✦ ✦
              </div>
            </div>
          </footer>

        </div>
      )}
    </div>
  );
}
