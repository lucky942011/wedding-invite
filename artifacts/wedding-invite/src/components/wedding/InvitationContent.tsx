import { useState, useEffect } from "react";

/* ─── Countdown hook ─── */
function useCountdown(target: Date) {
  const calc = () => {
    const d = target.getTime() - Date.now();
    if (d <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(d / 86400000),
      hours: Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000) / 60000),
      seconds: Math.floor((d % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

/* ─── IntersectionObserver reveal hook ─── */
function useReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
      );
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
      (window as any).__revealIo = io;
    }, 150);
    return () => { clearTimeout(timeout); (window as any).__revealIo?.disconnect(); };
  }, [active]);
}

/* ─── Data ─── */
const WEDDING_DATE = new Date("July 1, 2026 19:00:00");

const EVENTS = [
  {
    name: "Engagement",
    date: "June 29, 2026",
    day: "Monday",
    time: "6:00 PM Onwards",
    venue: "Sri Banshi Garden, Muzaffarpur",
    icon: "🛕",
    desc: "Join us as two families come together to celebrate the union of Adarsh & Shreya in an intimate ceremony of blessings.",
  },
  {
    name: "Haldi Ceremony",
    date: "July 1, 2026",
    day: "Wednesday",
    time: "11:00 AM Onwards",
    venue: "Sri Banshi Garden, Muzaffarpur",
    icon: "🌼",
    desc: "A vibrant morning of turmeric rituals, folk music, and the warm glow of family blessings to herald the sacred day.",
  },
  {
    name: "Wedding Ceremony",
    date: "July 1, 2026",
    day: "Wednesday",
    time: "7:00 PM Onwards",
    venue: "Sri Banshi Garden, Muzaffarpur",
    icon: "🪔",
    desc: "The sacred Saptapadi — seven vows, one soul. Witness the union under a canopy of flowers as Adarsh weds Shreya.",
  },
];

const GALLERY_URLS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=75",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=75",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=75",
  "https://images.unsplash.com/photo-1549416878-b1df28c9da68?w=400&q=75",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=75",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=75",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&q=75",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=75",
];

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: 1 + Math.random() * 2,
  dur: 2 + Math.random() * 4,
  delay: Math.random() * 5,
}));

const PETALS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  dur: 6 + Math.random() * 8,
  delay: Math.random() * 8,
  size: 14 + Math.random() * 10,
  emoji: ["🌸", "🌺", "✿", "❀"][Math.floor(Math.random() * 4)],
}));

function CountdownTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center justify-center"
        style={{
          width: "clamp(64px, 16vw, 90px)",
          height: "clamp(64px, 16vw, 90px)",
          background: "linear-gradient(145deg, #1a0e07, #2a1508)",
          border: "1px solid rgba(201,168,76,.35)",
          boxShadow: "0 4px 24px rgba(0,0,0,.4), inset 0 1px 0 rgba(201,168,76,.1)",
        }}
      >
        <span
          className="gold-text"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
            lineHeight: 1,
          }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(201,168,76,.55)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function InvitationContent() {
  const [navVisible, setNavVisible] = useState(false);
  const [rsvpData, setRsvpData] = useState({ 
    name: "", 
    mobile: "",
    arrival: "",
    departure: "",
    attending: "yes", 
    guests: "2", 
    message: "" 
  });
  const [rsvpDone, setRsvpDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeLeft = useCountdown(WEDDING_DATE);
  
  useReveal(true);

  const FORM_URL =
  "https://docs.google.com/forms/d/1MkdGTOKSOX6WdqAYCVm-Ksxzncg-kIo8lTfTvRcRZd8/formResponse";

const handleRsvpSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  const formData = new FormData();

  formData.append("entry.328858146", rsvpData.name);
  formData.append("entry.641601387", rsvpData.mobile);
  formData.append("entry.942835027", rsvpData.guests);
  formData.append("entry.902610072", rsvpData.message);

  // Arrival Date (IMPORTANT - split required)
  const arrival = new Date(rsvpData.arrival);
  formData.append("entry.2061003475_year", String(arrival.getFullYear()));
  formData.append("entry.2061003475_month", String(arrival.getMonth() + 1));
  formData.append("entry.2061003475_day", String(arrival.getDate()));


  // Departure Date (IMPORTANT - split required)
  const departure = new Date(rsvpData.departure);
  formData.append("entry.339648232_year", String(departure.getFullYear()));
  formData.append("entry.339648232_month", String(departure.getMonth() + 1));
  formData.append("entry.339648232_day", String(departure.getDate()));

  // --- DEBUG LOGGING ---
  console.log("=== RSVP Submission Debug ===");
  console.log("Target URL:", FORM_URL);
  const payloadObj: Record<string, string> = {};
  formData.forEach((value, key) => { payloadObj[key] = value.toString(); });
  console.table(payloadObj);
  console.log("=============================");

  try {
    const response = await fetch(FORM_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    console.log("Fetch request finished. Response (opaque):", response);
    setRsvpDone(true);
  } catch (error) {
    console.error("RSVP Submission Error:", error);
    alert("Submission failed. Check console for details.");
  } finally {
    setIsSubmitting(false);
  }
};

  useEffect(() => {
    const handler = () => setNavVisible(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ animation: "fadeIn 1s ease forwards" }}>
      {/* Sticky nav */}
      <nav
        className="sticky-nav z-50 fixed top-0 w-full"
        style={{ opacity: navVisible ? 1 : 0, pointerEvents: navVisible ? "auto" : "none", transition: "opacity .4s", background: "rgba(13, 8, 4, 0.8)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(201, 168, 76, 0.2)" }}
      >
        <div className="max-w-5xl mx-auto px-6 h-13 flex items-center justify-between" style={{ height: 52 }}>
          <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.5rem", color: "#e8c96d" }}><span style={{ fontFamily: "'Playfair Display', serif" }}>A</span> & S</span>
          <div className="hidden md:flex gap-7">
            {[["story", "Story"], ["countdown", "Countdown"], ["events", "Events"], ["venue", "Venue"], ["rsvp", "RSVP"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(201,168,76,.6)", background: "none", border: "none", cursor: "pointer" }}
                className="hover:text-amber-300 transition-colors"
              >{label}</button>
            ))}
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "rgba(201,168,76,.4)" }}>01·07·26</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
          background: "radial-gradient(ellipse at 50% 40%, #200f07 0%, #0d0804 70%)",
          padding: "80px 24px",
        }}
      >
        {/* bg stars */}
        {STARS.slice(0, 30).map((s) => (
          <div key={s.id} className="absolute rounded-full"
            style={{ width: s.size, height: s.size, top: s.top, left: s.left, background: "#f0e6cc", animation: `sparkTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`, opacity: 0 }} />
        ))}

        {/* Petals */}
        {PETALS.map((p) => (
          <span
            key={p.id}
            className="petal z-10"
            style={{
              left: p.left,
              fontSize: p.size,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.emoji}
          </span>
        ))}

        {/* Top Center Ganesha Image */}
        <div className="fade-up mb-8 flex justify-center z-10" style={{ animationDelay: "0.05s" }}>
          <div 
            className="rounded-full border-2 border-[rgba(201,168,76,0.4)] p-1 overflow-hidden"
            style={{
              boxShadow: "0 0 60px rgba(201,168,76,0.5), inset 0 0 20px rgba(201,168,76,0.2)",
              animation: "sealPulse 4s ease-in-out infinite"
            }}
          >
            <img 
              src="./ganeshafirst.jpg" 
              alt="Ganesha" 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover" 
            />
          </div>
        </div>

        {/* Ganesh mantra */}
        <p className="fade-up text-center mb-8 z-10" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,3vw,1.4rem)", color: "rgba(201,168,76,.6)", letterSpacing: "0.1em", animationDelay: ".1s" }}>
          ॐ श्री गणेशाय नमः
        </p>

        <p className="fade-up text-center mb-6 z-10" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.55rem", letterSpacing: "0.4em", color: "rgba(201,168,76,.4)", textTransform: "uppercase", animationDelay: ".25s" }}>
          With the blessings of the almighty
        </p>

        {/* Couple names */}
        <div className="text-center fade-up z-10" style={{ animationDelay: ".4s" }}>
          <h1 style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(3.5rem, 12vw, 7rem)", lineHeight: 1.05, color: "#e8c96d", textShadow: "0 0 60px rgba(201,168,76,.25)" }}>
            <span style={{ fontFamily: "'Playfair Display', serif" }}>A</span>darsh
          </h1>
          <div className="gold-divider my-3">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "rgba(201,168,76,.5)" }}>weds</span>
          </div>
          <h1 style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(3.5rem, 12vw, 7rem)", lineHeight: 1.05, color: "#e8c96d", textShadow: "0 0 60px rgba(201,168,76,.25)" }}>
            Shreya
          </h1>
        </div>

        {/* Date & Venue */}
        <div className="text-center mt-8 fade-up z-10" style={{ animationDelay: ".6s" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem,3vw,1.4rem)", color: "rgba(240,230,204,.7)", letterSpacing: "0.1em" }}>
            1<sup>st</sup> July 2026
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(201,168,76,.4)", textTransform: "uppercase", marginTop: 8 }}>
            Sri Banshi Garden, Muzaffarpur
          </p>
        </div>

        {/* Scroll prompt */}
        <button
          onClick={() => scrollTo("story")}
          className="mt-16 fade-up flex flex-col items-center gap-2 z-10"
          style={{ background: "none", border: "none", cursor: "pointer", animationDelay: ".9s" }}
        >
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.5rem", letterSpacing: "0.3em", color: "rgba(201,168,76,.4)", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(180deg,rgba(201,168,76,.4),transparent)" }} />
        </button>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div style={{ overflow: "hidden", borderTop: "1px solid rgba(201,168,76,.1)", borderBottom: "1px solid rgba(201,168,76,.1)", padding: "4px 0", background: "#0a0604" }}>
        <div className="marquee-track flex whitespace-nowrap" style={{ animation: "marquee 30s linear infinite" }}>
          {[...GALLERY_URLS, ...GALLERY_URLS].map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              loading="lazy"
              style={{ width: 120, height: 80, objectFit: "cover", flexShrink: 0, marginRight: 4, opacity: 0.7 }}
            />
          ))}
        </div>
      </div>

      {/* ── FAMILY BLESSINGS / STORY ── */}
      <section
        id="story"
        className="invite-section"
        style={{ background: "linear-gradient(180deg,#0d0804 0%,#120a05 100%)", padding: "80px 24px" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="reveal mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.55rem", letterSpacing: "0.35em", color: "rgba(201,168,76,.4)", textTransform: "uppercase" }}>With the heavenly blessings of</p>

          <div className="reveal mb-8" style={{ transitionDelay: ".1s" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem,4vw,2.2rem)", color: "#e8c96d", marginBottom: 6 }}>Our Story</h2>
            <div className="gold-divider"><span style={{ color: "#c9a84c", fontSize: "0.7rem" }}>✦</span></div>
          </div>

          {/* Family names */}
          <div className="reveal mb-12 grid sm:grid-cols-2 gap-8" style={{ transitionDelay: ".15s" }}>
            {[
              { family: "Groom's Family", names: ["Shri Sudhanshu Bhushan Prasad", "Smt. Bibha Shrivastava"], from: "Muzaffarpur, Bihar" },
              { family: "Bride's Family", names: ["Shri Sunil Kumar Shrivastava", "Dr. Prem Lata Shrivastava"], from: "Muzaffarpur, Bihar" },
            ].map((f, i) => (
              <div key={i} className="text-center p-6"
                style={{ border: "1px solid rgba(201,168,76,.15)", background: "rgba(201,168,76,.02)" }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.5rem", letterSpacing: "0.3em", color: "rgba(201,168,76,.45)", textTransform: "uppercase", marginBottom: 12 }}>{f.family}</p>
                {f.names.map((n) => (
                  <p key={n} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "rgba(240,230,204,.75)", lineHeight: 1.8 }}>{n}</p>
                ))}
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(201,168,76,.35)", marginTop: 8 }}>{f.from}</p>
              </div>
            ))}
          </div>

          {/* Story milestones */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            {[
              { year: "Dec 2025", title: "First Meeting", icon: "✨", desc: "On the 5th of December 2025, two souls met and the universe quietly smiled — a moment that changed everything." },
              { year: "2026", title: "The Proposal", icon: "💍", desc: "Under a sky full of stars, Adarsh asked, and Shreya said yes — and a lifetime of together began." },
            ].map((s, i) => (
              <div key={s.year} className="reveal event-card p-6 text-center" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{s.icon}</div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(201,168,76,.55)", textTransform: "uppercase", marginBottom: 6 }}>{s.year}</p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#e8c96d", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgba(240,230,204,.55)", lineHeight: 1.8 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section
        id="countdown"
        className="invite-section"
        style={{ background: "linear-gradient(180deg,#100806 0%,#0d0804 100%)", padding: "80px 24px" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="reveal mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.55rem", letterSpacing: "0.35em", color: "rgba(201,168,76,.4)", textTransform: "uppercase" }}>
            Counting down
          </p>
          <h2 className="reveal mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#e8c96d", transitionDelay: ".1s" }}>
            Until We Say I Do
          </h2>
          <p className="reveal mb-10" style={{ fontFamily: "'Cormorant Garamond', serif', serif", fontSize: "1.05rem", color: "rgba(240,230,204,.4)", letterSpacing: "0.1em", transitionDelay: ".15s" }}>
            1<sup>st</sup> July 2026 · 7:00 PM
          </p>

          <div className="reveal flex justify-center gap-4 sm:gap-8 mb-12" style={{ transitionDelay: ".2s" }}>
            <CountdownTile value={timeLeft.days} label="Days" />
            <CountdownTile value={timeLeft.hours} label="Hours" />
            <CountdownTile value={timeLeft.minutes} label="Min" />
            <CountdownTile value={timeLeft.seconds} label="Sec" />
          </div>

          <blockquote className="reveal" style={{ transitionDelay: ".3s" }}>
            <div className="gold-divider mb-6"><span style={{ color: "#c9a84c", fontSize: "0.7rem" }}>✦</span></div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem,2.5vw,1.5rem)", fontStyle: "italic", color: "rgba(240,230,204,.55)", lineHeight: 1.9 }}>
              "Where you are, that is home."<br />
              <span style={{ fontSize: "0.7em", letterSpacing: "0.2em", fontStyle: "normal", color: "rgba(201,168,76,.4)" }}>— E.B. White</span>
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section
        id="events"
        className="invite-section"
        style={{ background: "linear-gradient(180deg,#0a0503 0%,#110804 100%)", padding: "80px 24px" }}
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-16">
            <p className="reveal mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.55rem", letterSpacing: "0.35em", color: "rgba(201,168,76,.4)", textTransform: "uppercase" }}>Join us for</p>
            <h2 className="reveal mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#e8c96d", transitionDelay: ".1s" }}>
              The Celebrations
            </h2>
            <div className="reveal gold-divider" style={{ transitionDelay: ".15s" }}><span style={{ color: "#c9a84c", fontSize: "0.7rem" }}>✦</span></div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {EVENTS.map((ev, i) => (
              <div
                key={ev.name}
                className="reveal event-card p-8 border border-[rgba(201,168,76,.1)] bg-[rgba(201,168,76,.02)]"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div style={{ fontSize: "2.2rem", marginBottom: 16 }}>{ev.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#e8c96d", marginBottom: 16 }}>{ev.name}</h3>

                <div style={{ borderTop: "1px solid rgba(201,168,76,.15)", paddingTop: 16, marginBottom: 16 }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "rgba(240,230,204,.8)", marginBottom: 3 }}>{ev.date}</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: "rgba(201,168,76,.5)", textTransform: "uppercase" }}>{ev.day}</p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.8rem", marginTop: 2 }}>🕐</span>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", color: "rgba(240,230,204,.55)", letterSpacing: "0.05em" }}>{ev.time}</p>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.8rem", marginTop: 2 }}>📍</span>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", color: "rgba(240,230,204,.55)", letterSpacing: "0.05em" }}>{ev.venue}</p>
                </div>

                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgba(240,230,204,.45)", lineHeight: 1.8 }}>{ev.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VENUE ── */}
      <section
        id="venue"
        className="invite-section"
        style={{ background: "linear-gradient(180deg,#0d0804 0%,#0a0503 100%)", padding: "80px 24px" }}
      >
        <div className="max-w-3xl mx-auto w-full text-center">
          <p className="reveal mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.55rem", letterSpacing: "0.35em", color: "rgba(201,168,76,.4)", textTransform: "uppercase" }}>Where we celebrate</p>
          <h2 className="reveal mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#e8c96d", transitionDelay: ".1s" }}>
            The Venue
          </h2>
          <div className="reveal gold-divider mb-6" style={{ transitionDelay: ".15s" }}><span style={{ color: "#c9a84c", fontSize: "0.7rem" }}>✦</span></div>

          <div className="reveal mb-4" style={{ transitionDelay: ".2s" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#e8c96d", marginBottom: 4 }}>Sri Banshi Garden</h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(201,168,76,.45)", textTransform: "uppercase" }}>
              Muzaffarpur · Bihar
            </p>
          </div>

          {/* Map iframe */}
          <div
            className="reveal"
            style={{
              transitionDelay: ".25s",
              border: "1px solid rgba(201,168,76,.25)",
              overflow: "hidden",
              height: 320,
              position: "relative",
            }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Sri+Banshi+Garden+Muzaffarpur+Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(0.85) brightness(0.9)" }}
              loading="lazy"
              title="Venue Map"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <p className="reveal mt-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontStyle: "italic", color: "rgba(240,230,204,.45)", lineHeight: 1.8, transitionDelay: ".3s" }}>
            Sri Banshi Garden is a stunning celebration venue in the heart of Muzaffarpur, offering a grand setting for an evening of joy, traditions, and timeless memories.
          </p>
        </div>
      </section>

      {/* ── GALLERY marquee ── */}
      <div style={{ overflow: "hidden", padding: "4px 0", borderTop: "1px solid rgba(201,168,76,.08)", borderBottom: "1px solid rgba(201,168,76,.08)", background: "#080402" }}>
        <div className="marquee-track flex whitespace-nowrap" style={{ animation: "marquee 30s linear infinite reverse" }}>
          {[...GALLERY_URLS, ...GALLERY_URLS].map((url, i) => (
            <img key={i} src={url} alt="" loading="lazy" style={{ width: 160, height: 110, objectFit: "cover", flexShrink: 0, marginRight: 4, opacity: 0.6 }} />
          ))}
        </div>
      </div>

      {/* ── RSVP ── */}
      <section
        id="rsvp"
        className="invite-section"
        style={{ background: "linear-gradient(180deg,#0a0503 0%,#0d0804 100%)", padding: "80px 24px" }}
      >
        <div className="max-w-xl mx-auto w-full">
          <div className="text-center mb-12">
            <p className="reveal mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.55rem", letterSpacing: "0.35em", color: "rgba(201,168,76,.4)", textTransform: "uppercase" }}>Kindly reply by 1st June 2026</p>
            <h2 className="reveal mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#e8c96d", transitionDelay: ".1s" }}>RSVP</h2>
            <p className="reveal" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontStyle: "italic", color: "rgba(240,230,204,.4)", transitionDelay: ".15s" }}>
              We would be honoured to celebrate with you
            </p>
          </div>

          {!rsvpDone ? (
            <form
              className="reveal"
              style={{ transitionDelay: ".2s", border: "1px solid rgba(201,168,76,.2)", padding: "40px 36px", background: "rgba(201,168,76,.02)" }}
              onSubmit={handleRsvpSubmit}
            >
              {/* Name */}
              <div className="mb-6">
                <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,.5)", marginBottom: 8 }}>Full Name *</label>
                <input
                  type="text" required
                  className="w-full bg-[rgba(20,10,5,0.6)] border border-[rgba(201,168,76,0.3)] text-[#f0e6cc] focus:border-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-[#c9a84c] transition-colors"
                  style={{ padding: "12px 16px", fontSize: "0.8rem" }}
                  placeholder="Your name"
                  value={rsvpData.name}
                  onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                />
              </div>

              {/* Mobile */}
              <div className="mb-6">
                <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,.5)", marginBottom: 8 }}>Mobile Number *</label>
                <input
                  type="tel" required
                  className="w-full bg-[rgba(20,10,5,0.6)] border border-[rgba(201,168,76,0.3)] text-[#f0e6cc] focus:border-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-[#c9a84c] transition-colors"
                  style={{ padding: "12px 16px", fontSize: "0.8rem" }}
                  placeholder="Your mobile number"
                  value={rsvpData.mobile}
                  onChange={(e) => setRsvpData({ ...rsvpData, mobile: e.target.value })}
                />
              </div>

              {/* Arrival & Departure */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,.5)", marginBottom: 8 }}>Arrival Date *</label>
                  <input
                    type="date" required
                    className="w-full bg-[rgba(20,10,5,0.6)] border border-[rgba(201,168,76,0.3)] text-[#f0e6cc] focus:border-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-[#c9a84c] transition-colors"
                    style={{ padding: "12px 16px", fontSize: "0.8rem", colorScheme: "dark" }}
                    value={rsvpData.arrival}
                    onChange={(e) => setRsvpData({ ...rsvpData, arrival: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,.5)", marginBottom: 8 }}>Departure Date *</label>
                  <input
                    type="date" required
                    className="w-full bg-[rgba(20,10,5,0.6)] border border-[rgba(201,168,76,0.3)] text-[#f0e6cc] focus:border-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-[#c9a84c] transition-colors"
                    style={{ padding: "12px 16px", fontSize: "0.8rem", colorScheme: "dark" }}
                    value={rsvpData.departure}
                    onChange={(e) => setRsvpData({ ...rsvpData, departure: e.target.value })}
                  />
                </div>
              </div>

              {/* Attending */}
              <div className="mb-6">
                <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,.5)", marginBottom: 10 }}>Attending?</label>
                <div className="flex gap-4">
                  {[["yes", "💌 Joyfully Accept"], ["no", "🙏 Regretfully Decline"]].map(([val, label]) => (
                    <label
                      key={val}
                      style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "12px", cursor: "pointer", fontSize: "0.65rem",
                        fontFamily: "'Montserrat', sans-serif",
                        border: `1px solid ${rsvpData.attending === val ? "#c9a84c" : "rgba(201,168,76,.18)"}`,
                        background: rsvpData.attending === val ? "rgba(201,168,76,.08)" : "transparent",
                        color: rsvpData.attending === val ? "#e8c96d" : "rgba(201,168,76,.45)",
                        transition: "all .25s",
                      }}
                    >
                      <input type="radio" name="attending" value={val} checked={rsvpData.attending === val}
                        onChange={(e) => setRsvpData({ ...rsvpData, attending: e.target.value })}
                        className="sr-only" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Guests */}
              {rsvpData.attending === "yes" && (
                <div className="mb-6">
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,.5)", marginBottom: 8 }}>No. of Guests</label>
                  <select className="w-full bg-[rgba(20,10,5,0.6)] border border-[rgba(201,168,76,0.3)] text-[#f0e6cc] focus:border-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-[#c9a84c] transition-colors" style={{ padding: "12px 16px", fontSize: "0.8rem" }}
                    value={rsvpData.guests} onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}>
                    {["1","2","3","4","5"].map((n) => <option key={n} value={n}>{n} {n==="1"?"Guest":"Guests"}</option>)}
                  </select>
                </div>
              )}

              {/* Message */}
              <div className="mb-8">
                <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,.5)", marginBottom: 8 }}>Your Wishes / Description</label>
                <textarea
                  className="w-full bg-[rgba(20,10,5,0.6)] border border-[rgba(201,168,76,0.3)] text-[#f0e6cc] focus:border-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-[#c9a84c] transition-colors" rows={4} style={{ padding: "12px 16px", fontSize: "0.8rem", resize: "none" }}
                  placeholder="Share your blessings with the couple or any additional details..."
                  value={rsvpData.message}
                  onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  padding: "16px", fontFamily: "'Montserrat', sans-serif", fontSize: "0.6rem",
                  letterSpacing: "0.3em", textTransform: "uppercase",
                  background: "linear-gradient(135deg,#6b1414 0%,#c9a84c 50%,#6b1414 100%)",
                  color: "#f5eedc", border: "1px solid #c9a84c", cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Sending..." : "Send RSVP"}
              </button>
            </form>
          ) : (
            <div
              className="text-center reveal in-view"
              style={{ border: "1px solid rgba(201,168,76,.25)", padding: "60px 40px", background: "rgba(201,168,76,.02)" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: 20 }}>💌</div>
              <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: "2.5rem", color: "#e8c96d", marginBottom: 12 }}>Thank You, {rsvpData.name}!</h3>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(240,230,204,.55)", lineHeight: 1.9 }}>
                {rsvpData.attending === "yes"
                  ? "We are overjoyed! Your presence will make our day even more special. See you on the 1st of July!"
                  : "We understand and will miss you dearly. Your warm wishes mean the world to us."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "linear-gradient(180deg,#0d0804 0%,#060402 100%)",
          padding: "80px 24px 60px",
          textAlign: "center",
          borderTop: "1px solid rgba(201,168,76,.1)",
        }}
      >
        <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(3rem,8vw,5rem)", color: "#e8c96d", marginBottom: 16, textShadow: "0 0 40px rgba(201,168,76,.2)" }}>
        <span style={{ fontFamily: "'Playfair Display', serif" }}>A</span>darsh & Shreya
        </h2>
        <div className="gold-divider mb-6"><span style={{ color: "#c9a84c", fontSize: "0.7rem" }}>✦</span></div>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,.35)", marginBottom: 16 }}>
          1st July 2026 · Sri Banshi Garden, Muzaffarpur
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(240,230,204,.3)" }}>
          "Two hearts, one beautiful journey."
        </p>
      </footer>
    </div>
  );
}
