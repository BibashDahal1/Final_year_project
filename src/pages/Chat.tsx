import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";

const sparkleVariants = {
  animate: {
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    rotate: [0, 180, 360],
    transition: { duration: 2, repeat: Infinity, repeatDelay: 1 },
  },
};

// Realistic layered Himalayan mountain SVG background
function MountainBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0f0c29 0%, #1a1060 18%, #2d1b69 35%, #4a2080 50%, #6b3fa0 65%, #9b6dca 78%, #c8a4e8 88%, #e8d5f5 100%)",
        }}
      />

      {/* Stars layer */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }}>
        {[...Array(80)].map((_, i) => {
          const x = (i * 137.508) % 100;
          const y = (i * 79.3) % 55;
          const r = 0.4 + (i % 4) * 0.3;
          const opacity = 0.3 + (i % 5) * 0.14;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={r}
              fill="white"
              opacity={opacity}
            />
          );
        })}
        {/* Moon glow */}
        <circle cx="82%" cy="12%" r="28" fill="rgba(255,255,220,0.12)" />
        <circle cx="82%" cy="12%" r="18" fill="rgba(255,255,210,0.18)" />
        <circle cx="82%" cy="12%" r="10" fill="rgba(255,255,200,0.35)" />
        <circle cx="82%" cy="12%" r="5" fill="rgba(255,255,230,0.6)" />
      </svg>

      {/* Aurora / atmospheric glow */}
      <div
        className="absolute inset-x-0"
        style={{
          top: "10%",
          height: "35%",
          background:
            "radial-gradient(ellipse 80% 50% at 30% 30%, rgba(100,60,200,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-x-0"
        style={{
          top: "5%",
          height: "40%",
          background:
            "radial-gradient(ellipse 60% 40% at 70% 20%, rgba(60,180,200,0.08) 0%, transparent 65%)",
        }}
      />

      {/* === FAR BACKGROUND RANGE (lightest, most distant) === */}
      <svg
        viewBox="0 0 1440 340"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0"
        style={{ bottom: 0, width: "100%", height: "75%" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="farGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7b5ea7" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#4a2d82" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="midGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5c3d9e" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#2d1b69" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="nearGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b2064" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1a0f45" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="snowFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0ecff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#d4c8f0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9b7dd4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="snowNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#e8deff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7c5abf" stopOpacity="0" />
          </linearGradient>
          <filter id="blur1">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="blur2">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Far range silhouette — very soft, high altitude */}
        <path
          d="M0 260
             L60 210 L110 190 L155 175 L185 155 L210 148 L235 160 L260 140 
             L290 118 L320 130 L345 115 L370 105 L390 118 L415 100 
             L440 88 L465 100 L490 112 L510 95 L535 80 L560 92 
             L585 105 L610 88 L635 75 L660 85 L690 70 L715 82 
             L740 95 L765 80 L790 68 L815 78 L840 90 L865 75 
             L890 65 L915 78 L940 90 L965 78 L990 68 
             L1015 80 L1040 95 L1065 82 L1090 70 L1115 82 
             L1140 95 L1165 108 L1190 95 L1215 110 L1240 125 
             L1265 115 L1290 130 L1315 118 L1340 135 L1365 150 
             L1390 165 L1415 178 L1440 195
             L1440 340 L0 340 Z"
          fill="url(#farGrad)"
          filter="url(#blur1)"
        />

        {/* Far range snow caps */}
        <path
          d="M440 88 L450 84 L460 88 L465 100 L455 96 L445 100 Z"
          fill="url(#snowFar)"
          filter="url(#blur1)"
        />
        <path
          d="M535 80 L545 75 L555 80 L560 92 L550 88 L540 92 Z"
          fill="url(#snowFar)"
          filter="url(#blur1)"
        />
        <path
          d="M635 75 L648 68 L660 75 L658 82 L648 78 L638 83 Z"
          fill="url(#snowFar)"
          filter="url(#blur1)"
        />
        <path
          d="M685 70 L698 62 L712 70 L710 80 L698 75 L688 80 Z"
          fill="url(#snowFar)"
          filter="url(#blur1)"
        />
        <path
          d="M785 68 L798 60 L812 68 L810 78 L798 73 L788 78 Z"
          fill="url(#snowFar)"
          filter="url(#blur1)"
        />
        <path
          d="M885 65 L898 57 L912 65 L910 75 L898 70 L888 75 Z"
          fill="url(#snowFar)"
          filter="url(#blur1)"
        />

        {/* Mid range — sharper, more defined peaks */}
        <path
          d="M0 295
             L40 258 L75 240 L100 222 L125 210 L150 225 L175 205
             L200 188 L225 198 L250 178 L275 162 L300 178
             L325 158 L350 142 L370 155 L390 138 L410 122
             L430 135 L450 148 L470 132 L490 115 L510 128
             L530 145 L550 128 L570 112 L590 125 L615 110
             L638 95 L658 110 L678 125 L698 110 L718 95
             L738 108 L758 125 L778 110 L800 95 L820 108
             L842 122 L862 108 L882 95 L902 108 L922 122
             L942 110 L962 95 L982 110 L1002 125 L1022 110
             L1042 125 L1062 140 L1082 128 L1105 115
             L1128 128 L1150 142 L1172 158 L1192 172
             L1215 185 L1238 198 L1260 212 L1282 225
             L1308 238 L1332 252 L1360 265 L1390 278
             L1415 288 L1440 298
             L1440 340 L0 340 Z"
          fill="url(#midGrad)"
          filter="url(#blur2)"
        />

        {/* Mid range snow — Everest-like peak around x=638 */}
        <path
          d="M615 110 L625 104 L632 98 L638 95 L644 98 L650 104 
             L658 110 L652 108 L644 106 L638 104 L632 106 L624 108 Z"
          fill="url(#snowFar)"
          opacity="0.85"
        />
        <path
          d="M700 95 L710 88 L718 95 L714 103 L710 100 L706 103 Z"
          fill="url(#snowFar)"
          opacity="0.8"
        />
        <path
          d="M490 115 L500 108 L510 115 L506 124 L500 120 L494 124 Z"
          fill="url(#snowFar)"
          opacity="0.8"
        />
        <path
          d="M800 95 L810 88 L820 95 L816 104 L810 100 L804 104 Z"
          fill="url(#snowFar)"
          opacity="0.8"
        />
        <path
          d="M880 95 L890 88 L902 95 L898 104 L890 100 L884 104 Z"
          fill="url(#snowFar)"
          opacity="0.8"
        />

        {/* Foreground dark hills for depth */}
        <path
          d="M0 320
             L80 298 L160 285 L240 298 L310 278 L380 268 
             L440 280 L500 265 L560 252 L620 265 L680 252
             L740 265 L800 278 L860 265 L920 252 L980 265
             L1040 278 L1100 268 L1160 280 L1220 292
             L1300 305 L1380 315 L1440 320
             L1440 340 L0 340 Z"
          fill="url(#nearGrad)"
        />
      </svg>

      {/* Ground fog / mist layer at base */}
      <div
        className="absolute inset-x-0"
        style={{
          bottom: 0,
          height: "22%",
          background:
            "linear-gradient(0deg, rgba(180,150,220,0.22) 0%, rgba(140,100,200,0.1) 50%, transparent 100%)",
          backdropFilter: "blur(0px)",
        }}
      />

      {/* Light atmospheric haze over mountains */}
      <div
        className="absolute inset-x-0"
        style={{
          bottom: "15%",
          height: "30%",
          background:
            "linear-gradient(0deg, rgba(200,170,240,0.12) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

export default function NepaliLensUI() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [translateEnabled, setTranslateEnabled] = useState(true);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      >
        <MountainBackground />

        {/* Proper Devanagari watermark — centered, correct Unicode */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{ zIndex: 1 }}
        >
          <span
            style={{
              fontSize: "clamp(100px, 18vw, 240px)",
              color: "rgba(220, 200, 255, 0.07)",
              fontWeight: 900,
              fontFamily: "'Noto Sans Devanagari', 'Mangal', serif",
              letterSpacing: "0.05em",
              userSelect: "none",
              whiteSpace: "nowrap",
              textShadow: "0 0 80px rgba(180,140,255,0.12)",
            }}
          >
            {/* नेपाली — "Nepali" in Devanagari */}
            भाषा दर्पण
          </span>
        </div>

        {/* Main content */}
        <div className="relative z-10 w-full max-w-4xl mt-16">
          {/* Devanagari script accent above title */}
          <motion.div
            className="text-center mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              style={{
                fontSize: "1.15rem",
                color: "rgba(200,170,255,0.75)",
                fontFamily: "'Noto Sans Devanagari', 'Mangal', serif",
                letterSpacing: "0.15em",
                fontWeight: 500,
              }}
            >
              {/* "Smart OCR" in Devanagari */}
              स्मार्ट ओसीआर · अनुवाद · पहचान
            </span>
          </motion.div>

          {/* Hero Title */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <h1
              className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight"
              style={{ color: "#f0ecff" }}
            >
              Unlock{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #c084fc, #e879f9, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                }}
              >
                Nepali Text
              </span>
              <br />
              <span style={{ color: "#e2d9f3" }}>Instantly with AI</span>
            </h1>
            <p
              className="text-base md:text-lg font-medium"
              style={{ color: "rgba(210,190,255,0.75)" }}
            >
              Advanced OCR for Images, Documents &amp; Screenshots &nbsp;·&nbsp;
              Seamless{" "}
              <span
                style={{
                  fontFamily: "'Noto Sans Devanagari', serif",
                  color: "rgba(220,180,255,0.9)",
                }}
              >
                नेपाली
              </span>{" "}
              → English Translation
            </p>
          </motion.div>

          {/* Upload + Preview Row */}
          <motion.div
            className="flex flex-col md:flex-row gap-5 mb-6 items-stretch"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Drop Zone */}
            <motion.div
              className="flex-1 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-10 cursor-pointer relative"
              style={{
                borderColor: isDragging ? "#c084fc" : "rgba(167,139,250,0.45)",
                background: isDragging
                  ? "rgba(124,58,237,0.12)"
                  : "rgba(20,12,55,0.55)",
                backdropFilter: "blur(16px)",
                minHeight: 210,
                boxShadow: isDragging
                  ? "0 0 40px rgba(168,85,247,0.25) inset"
                  : "0 8px 32px rgba(0,0,0,0.3)",
              }}
              animate={{ scale: isDragging ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <motion.div
                animate={{ y: isDragging ? -8 : [0, -5, 0] }}
                transition={
                  isDragging
                    ? { duration: 0.2 }
                    : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }
                className="mb-4"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(168,85,247,0.3))",
                    border: "1px solid rgba(167,139,250,0.35)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 16V8M12 8L9 11M12 8L15 11"
                      stroke="#c084fc"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 16.5V18.75C3 19.993 4.007 21 5.25 21H18.75C19.993 21 21 19.993 21 18.75V16.5"
                      stroke="#c084fc"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 9C3 6.515 5.015 4.5 7.5 4.5H16.5C18.985 4.5 21 6.515 21 9"
                      stroke="#a78bfa"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="3 2"
                    />
                  </svg>
                </div>
              </motion.div>
              <p
                className="text-center font-medium text-sm mb-4"
                style={{ color: "rgba(220,200,255,0.8)" }}
              >
                Drop your image, PDF, or
                <br />
                screenshot here
              </p>
              {/* Devanagari hint */}
              <p
                className="text-center text-xs mb-4"
                style={{
                  fontFamily: "'Noto Sans Devanagari', serif",
                  color: "rgba(180,150,255,0.55)",
                  letterSpacing: "0.05em",
                }}
              >
                {/* "Upload your file" in Nepali */}
                आफ्नो फाइल अपलोड गर्नुहोस्
              </p>
              <motion.button
                className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.45)",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(124,58,237,0.55)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Browse Files
              </motion.button>
            </motion.div>

            {/* Preview Card */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
              style={{
                width: "clamp(200px, 40%, 240px)",
                minHeight: 210,
                background: "rgba(12, 8, 40, 0.7)",
                border: "1px solid rgba(167,139,250,0.25)",
                backdropFilter: "blur(16px)",
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {/* Toggle button */}
              <motion.button
                className="absolute top-3 right-3 z-10"
                whileTap={{ scale: 0.95 }}
                onClick={() => setTranslateEnabled((v) => !v)}
              >
                <div
                  className="w-11 h-6 rounded-full flex items-center px-1 transition-all duration-300"
                  style={{
                    background: translateEnabled
                      ? "linear-gradient(90deg,#7c3aed,#9333ea)"
                      : "rgba(80,60,120,0.5)",
                  }}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-white shadow"
                    animate={{ x: translateEnabled ? 18 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </motion.button>

              {/* Image preview */}
              <AnimatePresence>
                {uploadedImage ? (
                  <motion.img
                    key="preview"
                    src={uploadedImage}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    className="w-full h-full flex flex-col items-center justify-center p-5 pt-10"
                    style={{ minHeight: 210 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {/* Fake Devanagari text preview lines */}
                    <p
                      className="text-xs mb-3 text-center leading-relaxed"
                      style={{
                        fontFamily: "'Noto Sans Devanagari', serif",
                        color: "rgba(200,180,255,0.6)",
                        fontSize: "0.7rem",
                      }}
                    >
                      {/* Sample Nepali text snippet */}
                      यो एक परीक्षण पाठ हो।
                      <br />
                      नेपाली भाषामा लेखिएको।
                    </p>
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="rounded mb-2"
                        style={{
                          height: 6,
                          width: `${65 + ((i * 11) % 28)}%`,
                          background:
                            i === 0
                              ? "linear-gradient(90deg,#7c3aed,#c084fc)"
                              : "rgba(120,90,180,0.3)",
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Translate badge */}
              <motion.div
                className="absolute bottom-3 left-3 right-3 rounded-lg flex items-center justify-between px-3 py-2 text-xs font-semibold"
                style={{
                  background: "rgba(15,8,45,0.88)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(167,139,250,0.25)",
                }}
                animate={{ opacity: translateEnabled ? 1 : 0.4 }}
              >
                <span style={{ color: "#c084fc" }}>
                  <span style={{ fontFamily: "'Noto Sans Devanagari', serif" }}>
                    नेपाली
                  </span>
                  {" → "}English
                </span>
                <div
                  className="w-8 h-4 rounded-full flex items-center px-0.5 transition-all"
                  style={{
                    background: translateEnabled
                      ? "#7c3aed"
                      : "rgba(80,60,120,0.5)",
                  }}
                >
                  <motion.div
                    className="w-3 h-3 rounded-full bg-white shadow"
                    animate={{ x: translateEnabled ? 14 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Extract & Translate Button */}
          <motion.div
            className="flex justify-center mb-10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {[
              { top: "-10px", right: "-18px", size: 16 },
              { top: "10px", right: "-30px", size: 10 },
              { bottom: "-8px", left: "-22px", size: 12 },
            ].map((s, i) => (
              <motion.svg
                key={i}
                width={s.size}
                height={s.size}
                viewBox="0 0 16 16"
                className="absolute pointer-events-none"
                style={{
                  top: s.top,
                  right: s.right,
                  bottom: s.bottom,
                  left: s.left,
                }}
                variants={sparkleVariants}
                animate="animate"
                custom={i}
              >
                <path
                  d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z"
                  fill="#e879f9"
                />
              </motion.svg>
            ))}
            <motion.button
              className="px-10 py-4 rounded-2xl text-white text-base font-bold tracking-wide"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed 0%, #9333ea 60%, #c026d3 100%)",
                boxShadow:
                  "0 8px 40px rgba(124,58,237,0.5), 0 0 0 1px rgba(167,139,250,0.2)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 12px 50px rgba(124,58,237,0.65), 0 0 0 1px rgba(167,139,250,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              ✦ &nbsp;Extract &amp; Translate
            </motion.button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1, delayChildren: 0.55 },
              },
            }}
          >
            {[
              {
                label: "OCR",
                devanagari: "ओसीआर",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="3"
                      stroke="#c084fc"
                      strokeWidth="2"
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
                label: "Recognition",
                devanagari: "पहचान",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                      stroke="#c084fc"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <rect
                      x="9"
                      y="3"
                      width="6"
                      height="4"
                      rx="1"
                      stroke="#c084fc"
                      strokeWidth="2"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="#a78bfa"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                label: "Translation",
                devanagari: "अनुवाद",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 7h14M5 12h8M5 17h5"
                      stroke="#c084fc"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M15 12l3 5M18 12l-3 5"
                      stroke="#a78bfa"
                      strokeWidth="2"
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
                label: "Documents",
                devanagari: "दस्तावेज",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                      stroke="#c084fc"
                      strokeWidth="2"
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
            ].map((item) => (
              <motion.div
                key={item.label}
                className="rounded-2xl flex flex-col items-center justify-center p-6 gap-2"
                style={{
                  background: "rgba(15, 8, 50, 0.55)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(167,139,250,0.18)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 12px 40px rgba(124,58,237,0.3)",
                  background: "rgba(30, 15, 70, 0.7)",
                  borderColor: "rgba(192,132,252,0.4)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(168,85,247,0.25))",
                    border: "1px solid rgba(167,139,250,0.25)",
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#e2d9f3" }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Noto Sans Devanagari', serif",
                    fontSize: "0.7rem",
                    color: "rgba(167,139,250,0.65)",
                  }}
                >
                  {item.devanagari}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
