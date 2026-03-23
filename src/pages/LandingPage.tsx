import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Image from "../assets/Aksar.png";

// ── Sparkle ───────────────────────────────────────────────────────────────────
const sparkleVariants = {
  animate: {
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    rotate: [0, 180, 360],
    transition: { duration: 2.4, repeat: Infinity, repeatDelay: 0.8 },
  },
};

// ── Mountain Background ───────────────────────────────────────────────────────
function MountainBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0f0c29 0%, #1a1060 18%, #2d1b69 35%, #4a2080 50%, #6b3fa0 65%, #9b6dca 78%, #c8a4e8 88%, #e8d5f5 100%)",
        }}
      />
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.75 }}>
        {[...Array(100)].map((_, i) => {
          const x = (i * 137.508) % 100;
          const y = (i * 79.3) % 60;
          const r = 0.3 + (i % 4) * 0.35;
          const op = 0.25 + (i % 6) * 0.12;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={r}
              fill="white"
              opacity={op}
            />
          );
        })}
        <circle cx="78%" cy="10%" r="36" fill="rgba(255,255,220,0.08)" />
        <circle cx="78%" cy="10%" r="24" fill="rgba(255,255,210,0.14)" />
        <circle cx="78%" cy="10%" r="14" fill="rgba(255,255,200,0.28)" />
        <circle cx="78%" cy="10%" r="7" fill="rgba(255,255,230,0.55)" />
      </svg>
      <div
        className="absolute inset-x-0"
        style={{
          top: "8%",
          height: "38%",
          background:
            "radial-gradient(ellipse 80% 50% at 28% 28%, rgba(100,60,200,0.2) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-x-0"
        style={{
          top: "4%",
          height: "42%",
          background:
            "radial-gradient(ellipse 60% 40% at 72% 18%, rgba(60,180,200,0.09) 0%, transparent 65%)",
        }}
      />

      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0"
        style={{ bottom: 0, width: "100%", height: "78%" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lpFarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7b5ea7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4a2d82" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="lpMidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5c3d9e" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#2d1b69" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id="lpNearGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b2064" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#1a0f45" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="lpSnow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0ecff" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#d4c8f0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9b7dd4" stopOpacity="0" />
          </linearGradient>
          <filter id="lpBlur1">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="lpBlur2">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
        <path
          d="M0 280 L70 230 L130 205 L170 185 L200 165 L225 155 L250 168 L275 148 L305 125 L335 138 L362 120 L385 108 L408 122 L432 104 L458 90 L480 104 L505 118 L525 100 L548 84 L572 97 L595 110 L620 94 L645 78 L668 90 L695 74 L720 86 L748 100 L772 84 L796 70 L820 82 L845 94 L870 78 L893 66 L918 80 L942 94 L966 80 L990 70 L1016 82 L1040 98 L1065 84 L1090 72 L1116 84 L1140 98 L1165 112 L1190 98 L1215 112 L1240 128 L1265 118 L1292 133 L1318 120 L1344 136 L1370 152 L1395 168 L1420 182 L1440 198 L1440 400 L0 400 Z"
          fill="url(#lpFarGrad)"
          filter="url(#lpBlur1)"
        />
        <path
          d="M458 90 L468 85 L478 90 L483 103 L473 99 L463 103 Z"
          fill="url(#lpSnow)"
          filter="url(#lpBlur1)"
        />
        <path
          d="M548 84 L558 78 L568 84 L572 97 L562 92 L552 97 Z"
          fill="url(#lpSnow)"
          filter="url(#lpBlur1)"
        />
        <path
          d="M645 78 L658 71 L670 78 L668 90 L658 85 L648 90 Z"
          fill="url(#lpSnow)"
          filter="url(#lpBlur1)"
        />
        <path
          d="M695 74 L708 66 L722 74 L720 86 L708 80 L698 80 Z"
          fill="url(#lpSnow)"
          filter="url(#lpBlur1)"
        />
        <path
          d="M796 70 L809 62 L822 70 L820 82 L809 77 L799 77 Z"
          fill="url(#lpSnow)"
          filter="url(#lpBlur1)"
        />
        <path
          d="M893 66 L906 58 L920 66 L918 80 L906 75 L896 75 Z"
          fill="url(#lpSnow)"
          filter="url(#lpBlur1)"
        />
        <path
          d="M0 315 L45 275 L85 255 L115 236 L140 222 L165 238 L190 215 L215 198 L240 210 L265 190 L292 172 L318 188 L344 168 L370 150 L392 164 L414 146 L436 128 L458 142 L478 156 L498 138 L520 120 L542 133 L562 148 L582 130 L602 114 L622 128 L643 112 L660 97 L678 112 L696 128 L715 112 L735 96 L755 110 L774 127 L794 111 L815 96 L836 110 L856 124 L876 110 L896 96 L916 110 L937 124 L958 110 L979 96 L1000 110 L1022 126 L1044 112 L1065 128 L1086 144 L1108 130 L1132 116 L1155 130 L1178 146 L1200 160 L1222 175 L1245 188 L1268 202 L1290 215 L1315 228 L1340 242 L1366 255 L1392 268 L1415 280 L1440 290 L1440 400 L0 400 Z"
          fill="url(#lpMidGrad)"
          filter="url(#lpBlur2)"
        />
        <path
          d="M622 128 L632 120 L640 113 L648 108 L655 104 L660 97 L666 104 L672 110 L678 112 L673 112 L666 110 L660 108 L654 110 L648 112 L640 116 L633 121 Z"
          fill="url(#lpSnow)"
          opacity="0.88"
        />
        <path
          d="M520 120 L530 113 L542 120 L538 130 L530 126 L524 130 Z"
          fill="url(#lpSnow)"
          opacity="0.8"
        />
        <path
          d="M735 96 L745 89 L756 96 L752 106 L745 102 L739 106 Z"
          fill="url(#lpSnow)"
          opacity="0.8"
        />
        <path
          d="M815 96 L825 89 L836 96 L832 106 L825 102 L819 106 Z"
          fill="url(#lpSnow)"
          opacity="0.8"
        />
        <path
          d="M895 96 L905 89 L917 96 L913 106 L905 102 L899 106 Z"
          fill="url(#lpSnow)"
          opacity="0.8"
        />
        <path
          d="M0 358 L90 334 L175 318 L255 334 L330 312 L405 298 L465 312 L528 295 L590 280 L652 295 L715 280 L778 295 L840 310 L900 295 L962 280 L1024 295 L1086 310 L1148 298 L1210 312 L1272 326 L1350 340 L1420 352 L1440 358 L1440 400 L0 400 Z"
          fill="url(#lpNearGrad)"
        />
      </svg>
      <div
        className="absolute inset-x-0"
        style={{
          bottom: 0,
          height: "24%",
          background:
            "linear-gradient(0deg, rgba(180,150,220,0.2) 0%, rgba(140,100,200,0.08) 55%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-x-0"
        style={{
          bottom: "14%",
          height: "32%",
          background:
            "linear-gradient(0deg, rgba(200,170,240,0.1) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

// ── Floating Devanagari ambient glyphs ────────────────────────────────────────
function DevnagariOrbs() {
  const glyphs = [
    "क",
    "ख",
    "ग",
    "न",
    "प",
    "भ",
    "म",
    "र",
    "स",
    "ह",
    "अ",
    "इ",
    "उ",
    "ओ",
    "ए",
  ];
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2 }}
    >
      {glyphs.map((g, i) => {
        const x = 4 + ((i * 6.4) % 90);
        const y = 6 + ((i * 5.8) % 74);
        const dur = 8 + (i % 5) * 2.5;
        const delay = (i % 7) * 1.1;
        const size = 13 + (i % 4) * 5;
        const op = 0.035 + (i % 4) * 0.022;
        return (
          <motion.span
            key={i}
            className="absolute select-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: size,
              fontFamily: "'Noto Sans Devanagari', serif",
              color: `rgba(220,190,255,${op})`,
              fontWeight: 700,
            }}
            animate={{ y: [0, -18, 0], opacity: [op, op * 2.2, op] }}
            transition={{
              duration: dur,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {g}
          </motion.span>
        );
      })}
    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, devanagari, desc, delay }: any) {
  return (
    <motion.div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "rgba(15, 8, 50, 0.55)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(167,139,250,0.18)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      whileHover={{
        y: -5,
        boxShadow: "0 16px 48px rgba(124,58,237,0.32)",
        background: "rgba(26, 12, 68, 0.72)",
        borderColor: "rgba(192,132,252,0.38)",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.38), rgba(168,85,247,0.28))",
          border: "1px solid rgba(167,139,250,0.28)",
        }}
      >
        {icon}
      </div>
      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-bold text-sm" style={{ color: "#e2d9f3" }}>
            {title}
          </span>
          <span
            style={{
              fontFamily: "'Noto Sans Devanagari', serif",
              fontSize: "0.68rem",
              color: "rgba(167,139,250,0.6)",
            }}
          >
            {devanagari}
          </span>
        </div>
        <p
          style={{
            color: "rgba(190,170,240,0.65)",
            fontSize: "0.78rem",
            lineHeight: 1.6,
          }}
        >
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

// ── Stat Pill ─────────────────────────────────────────────────────────────────
function StatPill({ value, label, delay }: any) {
  return (
    <motion.div
      className="flex flex-col items-center px-5 py-3 rounded-2xl"
      style={{
        background: "rgba(124,58,237,0.12)",
        border: "1px solid rgba(167,139,250,0.2)",
        backdropFilter: "blur(12px)",
      }}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
    >
      <span
        className="font-extrabold text-xl md:text-2xl"
        style={{
          background: "linear-gradient(90deg,#c084fc,#e879f9)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value}
      </span>
      <span
        style={{
          color: "rgba(200,175,255,0.55)",
          fontSize: "0.68rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginTop: 2,
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/chat");
    } else {
      window.dispatchEvent(new CustomEvent("openSignupModal"));
    }
  };

  const features = [
    {
      title: "Smart OCR",
      devanagari: "ओसीआर",
      desc: "Extract Nepali & English text from any image with AI-powered recognition and confidence scoring.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="3"
            stroke="#c084fc"
            strokeWidth="1.8"
          />
          <path
            d="M7 9h2M7 12h2M7 15h2M12 9h5M12 12h5M12 15h5"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "Instant Translation",
      devanagari: "अनुवाद",
      desc: "Seamlessly translate between Nepali and English. Bidirectional, fast, and context-aware.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 7h14M5 12h8M5 17h5"
            stroke="#c084fc"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15 12l3 5M18 12l-3 5"
            stroke="#a78bfa"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <rect
            x="13"
            y="11"
            width="8"
            height="7"
            rx="1.5"
            stroke="#c084fc"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      title: "OCR + Translate",
      devanagari: "एकसाथ",
      desc: "Upload an image and get extracted text with its full translation in one seamless step.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 3H5a2 2 0 00-2 2v4M9 3h6M9 3v4M15 3h4a2 2 0 012 2v4M21 9v6M21 15v4a2 2 0 01-2 2h-4M15 21H9M9 21H5a2 2 0 01-2-2v-4M3 15V9"
            stroke="#c084fc"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="#a78bfa"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "History & Reuse",
      devanagari: "इतिहास",
      desc: "Every translation is saved. Browse, copy, and reuse past translations at any time.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="#c084fc"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "Documents",
      devanagari: "दस्तावेज",
      desc: "Works on PDFs, scanned documents, screenshots — any visual format containing text.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
            stroke="#c084fc"
            strokeWidth="1.8"
          />
          <path
            d="M14 2v6h6M9 13h6M9 17h4"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "High Confidence",
      devanagari: "सटीकता",
      desc: "Each extracted line comes with a confidence score so you always know the quality.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 11l3 3L22 4"
            stroke="#c084fc"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div
        className="relative w-full min-h-screen overflow-x-hidden"
        style={{
          fontFamily: "'Outfit', 'DM Sans', sans-serif",
          background: "#0f0c29",
        }}
      >
        <MountainBackground />
        <DevnagariOrbs />

        {/* ══════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span
              style={{
                fontSize: "clamp(80px, 15vw, 200px)",
                color: "rgba(220,200,255,0.055)",
                fontWeight: 900,
                fontFamily: "'Noto Sans Devanagari', 'Mangal', serif",
                letterSpacing: "0.04em",
                userSelect: "none",
                whiteSpace: "nowrap",
                textShadow: "0 0 80px rgba(180,140,255,0.1)",
              }}
            >
              अक्षर अनुवाद
            </span>
          </div>

          {/* Ambient sparkles — hidden on mobile to keep it clean */}
          {[
            { top: "28%", left: "12%", size: 14 },
            { top: "22%", right: "14%", size: 10 },
            { top: "58%", left: "7%", size: 8 },
            { top: "62%", right: "9%", size: 12 },
            { top: "33%", left: "89%", size: 9 },
          ].map((s: any, i) => (
            <motion.svg
              key={i}
              width={s.size}
              height={s.size}
              viewBox="0 0 16 16"
              className="absolute pointer-events-none hidden sm:block"
              style={{ top: s.top, left: s.left, right: s.right }}
              variants={sparkleVariants}
              animate="animate"
            >
              <path
                d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z"
                fill="#e879f9"
              />
            </motion.svg>
          ))}

          <img src={Image} alt="Aksar Logo" className="w-50 h-50" />

          {/* AI badge */}
          <motion.div
            className="mb-5 flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(124,58,237,0.18)",
              border: "1px solid rgba(192,132,252,0.3)",
              backdropFilter: "blur(10px)",
            }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#c084fc", boxShadow: "0 0 6px #c084fc" }}
            />
            <span
              style={{
                color: "rgba(200,170,255,0.85)",
                fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              AI-POWERED · NEPALI OCR & TRANSLATION
            </span>
          </motion.div>

          {/* Devanagari tagline */}
          <motion.p
            className="mb-3 text-center"
            style={{
              fontFamily: "'Noto Sans Devanagari', serif",
              color: "rgba(200,170,255,0.7)",
              fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
              letterSpacing: "0.12em",
              fontWeight: 500,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            स्मार्ट ओसीआर · अनुवाद · पहचान
          </motion.p>

          {/* Hero headline */}
          <motion.h1
            className="text-center font-extrabold leading-tight mb-5"
            style={{
              fontSize: "clamp(2rem, 6vw, 5.5rem)",
              color: "#f0ecff",
              maxWidth: 860,
            }}
            initial={{ opacity: 0, y: -32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.2 }}
          >
            Unlock{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #c084fc, #e879f9, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nepali Text
            </span>
            <br className="hidden sm:block" />
            <span style={{ color: "#e2d9f3" }}> Instantly with AI</span>
          </motion.h1>

          {/* Sub-text */}
          <motion.p
            className="text-center mb-10 max-w-xl px-2"
            style={{
              color: "rgba(210,190,255,0.72)",
              fontSize: "clamp(0.88rem, 2vw, 1.05rem)",
              lineHeight: 1.75,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35 }}
          >
            Advanced OCR for images, PDFs &amp; screenshots — with seamless{" "}
            <span
              style={{
                fontFamily: "'Noto Sans Devanagari', serif",
                color: "rgba(220,180,255,0.92)",
              }}
            >
              नेपाली
            </span>{" "}
            ↔ English translation in a single click.
          </motion.p>

          {/* CTA row */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Primary CTA */}
            <motion.button
              onClick={handleGetStarted}
              className="relative px-9 py-4 rounded-2xl text-white font-bold text-base tracking-wide overflow-hidden w-full sm:w-auto"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed 0%, #9333ea 60%, #c026d3 100%)",
                boxShadow:
                  "0 8px 40px rgba(124,58,237,0.55), 0 0 0 1px rgba(167,139,250,0.22)",
                minWidth: 200,
              }}
              whileHover={{
                scale: 1.06,
                boxShadow:
                  "0 14px 50px rgba(124,58,237,0.7), 0 0 0 1px rgba(167,139,250,0.38)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Shimmer */}
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
              />
              ✦ &nbsp;{isAuthenticated ? "Go to Zone" : "Get Started Free"}
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              onClick={() =>
                document
                  .getElementById("features-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-7 py-4 rounded-2xl font-semibold text-sm w-full sm:w-auto"
              style={{
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(167,139,250,0.28)",
                color: "rgba(210,185,255,0.85)",
                backdropFilter: "blur(10px)",
              }}
              whileHover={{
                scale: 1.04,
                background: "rgba(124,58,237,0.22)",
                borderColor: "rgba(192,132,252,0.45)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Features ↓
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <StatPill value="97%+" label="OCR Accuracy" delay={0} />
            <StatPill value="2" label="Languages" delay={0.1} />
            <StatPill
              value="3-in-1"
              label="OCR · Translate · History"
              delay={0.2}
            />
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() =>
              document
                .getElementById("features-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span
              style={{
                color: "rgba(167,139,250,0.4)",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
              }}
            >
              SCROLL
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="rgba(167,139,250,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════════════════════════ */}
        <section
          id="features-section"
          className="relative z-10 px-4 pb-20 max-w-5xl mx-auto w-full"
        >
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p
              style={{
                fontFamily: "'Noto Sans Devanagari', serif",
                color: "rgba(192,132,252,0.7)",
                fontSize: "0.82rem",
                letterSpacing: "0.14em",
                marginBottom: "0.55rem",
              }}
            >
              सुविधाहरू
            </p>
            <h2
              className="font-extrabold"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
                color: "#f0ecff",
                lineHeight: 1.25,
              }}
            >
              Everything you need to{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#c084fc,#e879f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                read Nepali
              </span>
            </h2>
            <p
              className="mt-3 mx-auto max-w-lg"
              style={{
                color: "rgba(200,178,255,0.58)",
                fontSize: "0.88rem",
                lineHeight: 1.7,
              }}
            >
              From raw images to translated text — every step covered in one
              beautifully simple tool.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.08} />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 px-4 pb-24 max-w-4xl mx-auto w-full">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p
              style={{
                fontFamily: "'Noto Sans Devanagari', serif",
                color: "rgba(192,132,252,0.7)",
                fontSize: "0.82rem",
                letterSpacing: "0.14em",
                marginBottom: "0.55rem",
              }}
            >
              कसरी काम गर्छ
            </p>
            <h2
              className="font-extrabold"
              style={{
                fontSize: "clamp(1.4rem, 3.5vw, 2.5rem)",
                color: "#f0ecff",
              }}
            >
              Three steps,{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#c084fc,#e879f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                zero friction
              </span>
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4">
            {[
              {
                n: "01",
                title: "Upload",
                dev: "अपलोड",
                desc: "Drop any image, PDF or screenshot containing Nepali or English text.",
                color: "#c084fc",
              },
              {
                n: "02",
                title: "Extract",
                dev: "निकाल्नुस्",
                desc: "AI OCR detects every character with a per-line confidence score.",
                color: "#e879f9",
              },
              {
                n: "03",
                title: "Translate",
                dev: "अनुवाद गर्नुस्",
                desc: "Get the full translation instantly — or toggle OCR-only mode if you just need the text.",
                color: "#a78bfa",
              },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                className="flex-1 rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden"
                style={{
                  background: "rgba(15, 8, 50, 0.6)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(167,139,250,0.18)",
                }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{
                  borderColor: "rgba(192,132,252,0.35)",
                  boxShadow: "0 12px 40px rgba(124,58,237,0.22)",
                }}
              >
                <span
                  className="absolute top-3 right-4 font-black select-none"
                  style={{
                    fontSize: "4.5rem",
                    color: `${step.color}09`,
                    lineHeight: 1,
                  }}
                >
                  {step.n}
                </span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}33, ${step.color}18)`,
                    border: `1px solid ${step.color}44`,
                    color: step.color,
                  }}
                >
                  {step.n}
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span
                      className="font-bold"
                      style={{ color: "#f0ecff", fontSize: "1rem" }}
                    >
                      {step.title}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Noto Sans Devanagari', serif",
                        color: "rgba(167,139,250,0.52)",
                        fontSize: "0.7rem",
                      }}
                    >
                      {step.dev}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "rgba(190,170,240,0.65)",
                      fontSize: "0.82rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 px-4 pb-28 w-full">
          <motion.div
            className="max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center gap-6"
            style={{
              background: "rgba(15, 8, 50, 0.72)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(167,139,250,0.22)",
              boxShadow:
                "0 16px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Noto Sans Devanagari', serif",
                  color: "rgba(192,132,252,0.65)",
                  fontSize: "0.82rem",
                  letterSpacing: "0.12em",
                  marginBottom: "0.75rem",
                }}
              >
                सुरु गर्न तयार?
              </p>
              <h2
                className="font-extrabold"
                style={{
                  fontSize: "clamp(1.4rem, 4vw, 2.6rem)",
                  color: "#f0ecff",
                  lineHeight: 1.2,
                }}
              >
                Start reading Nepali
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg,#c084fc,#e879f9,#a855f7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  text today — free.
                </span>
              </h2>
              <p
                className="mt-3"
                style={{ color: "rgba(200,178,255,0.58)", fontSize: "0.88rem" }}
              >
                No setup. No subscriptions. Just upload and go.
              </p>
            </div>

            <motion.button
              onClick={handleGetStarted}
              className="relative px-10 py-4 rounded-2xl text-white font-bold text-base overflow-hidden w-full sm:w-auto"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed 0%, #9333ea 60%, #c026d3 100%)",
                boxShadow: "0 8px 40px rgba(124,58,237,0.55)",
              }}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 14px 55px rgba(124,58,237,0.7)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
              />
              ✦ &nbsp;{isAuthenticated ? "Go to Zone" : "Get Started Free"}
            </motion.button>

            <p
              style={{
                color: "rgba(167,139,250,0.38)",
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
              }}
            >
              FREE · NO CREDIT CARD · START IN SECONDS
            </p>
          </motion.div>
        </section>

        {/* Footer fade */}
        <div
          className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, rgba(15,12,41,0.92) 0%, transparent 100%)",
            zIndex: 5,
          }}
        />
      </div>
    </>
  );
};

export default LandingPage;
