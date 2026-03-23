import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  extractOCR,
  translateText,
  ocrTranslate,
  fetchTranslationHistory,
  fetchOcrTranslateHistory,
} from "../Slices/AuthSlice";
import Navbar from "./Navbar";

const sparkleVariants = {
  animate: {
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    rotate: [0, 180, 360],
    transition: { duration: 2, repeat: Infinity, repeatDelay: 1 },
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(str, n = 72) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "…" : str;
}

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
        <circle cx="82%" cy="12%" r="28" fill="rgba(255,255,220,0.12)" />
        <circle cx="82%" cy="12%" r="18" fill="rgba(255,255,210,0.18)" />
        <circle cx="82%" cy="12%" r="10" fill="rgba(255,255,200,0.35)" />
        <circle cx="82%" cy="12%" r="5" fill="rgba(255,255,230,0.6)" />
      </svg>
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
          <filter id="blur1">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="blur2">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>
        <path
          d="M0 260 L60 210 L110 190 L155 175 L185 155 L210 148 L235 160 L260 140 L290 118 L320 130 L345 115 L370 105 L390 118 L415 100 L440 88 L465 100 L490 112 L510 95 L535 80 L560 92 L585 105 L610 88 L635 75 L660 85 L690 70 L715 82 L740 95 L765 80 L790 68 L815 78 L840 90 L865 75 L890 65 L915 78 L940 90 L965 78 L990 68 L1015 80 L1040 95 L1065 82 L1090 70 L1115 82 L1140 95 L1165 108 L1190 95 L1215 110 L1240 125 L1265 115 L1290 130 L1315 118 L1340 135 L1365 150 L1390 165 L1415 178 L1440 195 L1440 340 L0 340 Z"
          fill="url(#farGrad)"
          filter="url(#blur1)"
        />
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
        <path
          d="M0 295 L40 258 L75 240 L100 222 L125 210 L150 225 L175 205 L200 188 L225 198 L250 178 L275 162 L300 178 L325 158 L350 142 L370 155 L390 138 L410 122 L430 135 L450 148 L470 132 L490 115 L510 128 L530 145 L550 128 L570 112 L590 125 L615 110 L638 95 L658 110 L678 125 L698 110 L718 95 L738 108 L758 125 L778 110 L800 95 L820 108 L842 122 L862 108 L882 95 L902 108 L922 122 L942 110 L962 95 L982 110 L1002 125 L1022 110 L1042 125 L1062 140 L1082 128 L1105 115 L1128 128 L1150 142 L1172 158 L1192 172 L1215 185 L1238 198 L1260 212 L1282 225 L1308 238 L1332 252 L1360 265 L1390 278 L1415 288 L1440 298 L1440 340 L0 340 Z"
          fill="url(#midGrad)"
          filter="url(#blur2)"
        />
        <path
          d="M615 110 L625 104 L632 98 L638 95 L644 98 L650 104 L658 110 L652 108 L644 106 L638 104 L632 106 L624 108 Z"
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
        <path
          d="M0 320 L80 298 L160 285 L240 298 L310 278 L380 268 L440 280 L500 265 L560 252 L620 265 L680 252 L740 265 L800 278 L860 265 L920 252 L980 265 L1040 278 L1100 268 L1160 280 L1220 292 L1300 305 L1380 315 L1440 320 L1440 340 L0 340 Z"
          fill="url(#nearGrad)"
        />
      </svg>
      <div
        className="absolute inset-x-0"
        style={{
          bottom: 0,
          height: "22%",
          background:
            "linear-gradient(0deg, rgba(180,150,220,0.22) 0%, rgba(140,100,200,0.1) 50%, transparent 100%)",
        }}
      />
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

// ── Result Panel ──────────────────────────────────────────────────────────────
function ResultPanel({
  ocrResult,
  ocrLoading,
  translationResult,
  translationLoading,
  ocrTranslateResult,
  ocrTranslateLoading,
  mode,
  error,
}) {
  const isLoading = ocrLoading || translationLoading || ocrTranslateLoading;

  const cardStyle = {
    background: "rgba(15, 8, 50, 0.72)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(167,139,250,0.22)",
    borderRadius: "1.25rem",
    boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
  };
  const labelStyle = {
    fontSize: "0.65rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(167,139,250,0.65)",
    fontWeight: 700,
    marginBottom: "0.4rem",
  };
  const textStyle = {
    color: "#e2d9f3",
    fontSize: "0.9rem",
    lineHeight: 1.75,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };
  const devStyle = {
    fontFamily: "'Noto Sans Devanagari', serif",
    color: "rgba(220,190,255,0.9)",
    fontSize: "0.88rem",
    lineHeight: 1.8,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  if (isLoading)
    return (
      <motion.div
        className="w-full mt-6 p-6 flex flex-col items-center justify-center gap-3"
        style={{ ...cardStyle, minHeight: 120 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-2 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "linear-gradient(135deg,#c084fc,#7c3aed)" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <p style={{ color: "rgba(200,170,255,0.65)", fontSize: "0.8rem" }}>
          Processing…
        </p>
      </motion.div>
    );

  if (error)
    return (
      <motion.div
        className="w-full mt-6 p-5"
        style={{ ...cardStyle, border: "1px solid rgba(239,68,68,0.35)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p style={{ color: "rgba(252,165,165,0.9)", fontSize: "0.875rem" }}>
          ⚠ {error}
        </p>
      </motion.div>
    );

  if (mode === "ocr" && ocrResult)
    return (
      <motion.div
        className="w-full mt-6 p-6 flex flex-col gap-4"
        style={cardStyle}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            style={{
              color: "#c084fc",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
            }}
          >
            OCR · ओसीआर
          </span>
          <span style={{ color: "rgba(167,139,250,0.55)", fontSize: "0.7rem" }}>
            Lang: {ocrResult.language?.toUpperCase()}
          </span>
        </div>
        <div>
          <p style={labelStyle}>Extracted Text</p>
          <p style={devStyle}>{ocrResult.extracted_text}</p>
        </div>
        {ocrResult.lines?.length > 0 && (
          <div>
            <p style={labelStyle}>Lines ({ocrResult.lines.length})</p>
            <div className="flex flex-col gap-1.5">
              {ocrResult.lines.map((line, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="flex items-center gap-2 flex-1 rounded-lg px-3 py-1.5"
                    style={{
                      background: "rgba(124,58,237,0.12)",
                      border: "1px solid rgba(167,139,250,0.12)",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(167,139,250,0.45)",
                        fontSize: "0.65rem",
                        minWidth: 16,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={devStyle}>{line}</span>
                  </div>
                  <span
                    style={{
                      color: "rgba(167,139,250,0.55)",
                      fontSize: "0.68rem",
                      paddingTop: "0.35rem",
                      minWidth: 36,
                      textAlign: "right",
                    }}
                  >
                    {(ocrResult.confidence_scores?.[i] * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );

  if (mode === "translate" && translationResult)
    return (
      <motion.div
        className="w-full mt-6 p-6 flex flex-col gap-4"
        style={cardStyle}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            style={{
              color: "#c084fc",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
            }}
          >
            Translation · अनुवाद
          </span>
          <span style={{ color: "rgba(167,139,250,0.55)", fontSize: "0.7rem" }}>
            {translationResult.direction === "ne_en"
              ? "नेपाली → English"
              : "English → नेपाली"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(167,139,250,0.15)",
            }}
          >
            <p style={labelStyle}>Source</p>
            <p
              style={
                translationResult.direction === "ne_en" ? devStyle : textStyle
              }
            >
              {translationResult.source_text}
            </p>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(192,132,252,0.08)",
              border: "1px solid rgba(192,132,252,0.18)",
            }}
          >
            <p style={{ ...labelStyle, color: "rgba(192,132,252,0.75)" }}>
              Translated
            </p>
            <p
              style={
                translationResult.direction === "ne_en" ? textStyle : devStyle
              }
            >
              {translationResult.translated_text}
            </p>
          </div>
        </div>
      </motion.div>
    );

  if (mode === "ocr-translate" && ocrTranslateResult) {
    const { ocr, translated_text, direction } = ocrTranslateResult;
    return (
      <motion.div
        className="w-full mt-6 p-6 flex flex-col gap-5"
        style={cardStyle}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            style={{
              color: "#c084fc",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
            }}
          >
            OCR + Translation · ओसीआर + अनुवाद
          </span>
          <span style={{ color: "rgba(167,139,250,0.55)", fontSize: "0.7rem" }}>
            {direction === "ne_en" ? "नेपाली → English" : "English → नेपाली"}
          </span>
        </div>
        <div>
          <p style={labelStyle}>Extracted Text (OCR)</p>
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(167,139,250,0.15)",
            }}
          >
            <p style={direction === "en_ne" ? textStyle : devStyle}>
              {ocr?.full_text}
            </p>
          </div>
        </div>
        {ocr?.texts?.length > 0 && (
          <div>
            <p style={labelStyle}>Detected Lines</p>
            <div className="flex flex-col gap-1.5">
              {ocr.texts.map((line, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="flex-1 rounded-lg px-3 py-1.5 flex items-center gap-2"
                    style={{
                      background: "rgba(124,58,237,0.08)",
                      border: "1px solid rgba(167,139,250,0.1)",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(167,139,250,0.45)",
                        fontSize: "0.65rem",
                        minWidth: 16,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={direction === "en_ne" ? textStyle : devStyle}>
                      {line}
                    </span>
                  </div>
                  <span
                    style={{
                      color: "rgba(167,139,250,0.55)",
                      fontSize: "0.68rem",
                      minWidth: 36,
                      textAlign: "right",
                    }}
                  >
                    {(ocr.scores?.[i] * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <p style={{ ...labelStyle, color: "rgba(192,132,252,0.75)" }}>
            Translated Text
          </p>
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(192,132,252,0.08)",
              border: "1px solid rgba(192,132,252,0.18)",
            }}
          >
            <p style={direction === "en_ne" ? devStyle : textStyle}>
              {translated_text}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
}

// ── Translation History Panel ─────────────────────────────────────────────────
function TranslationHistoryPanel({ history, loading, error, onReuseEntry }) {
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  const cardBase = {
    background: "rgba(15, 8, 50, 0.72)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(167,139,250,0.22)",
    borderRadius: "1.25rem",
    boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
  };
  const devStyle = {
    fontFamily: "'Noto Sans Devanagari', serif",
    color: "rgba(220,190,255,0.88)",
    fontSize: "0.85rem",
    lineHeight: 1.75,
  };
  const enStyle = { color: "#e2d9f3", fontSize: "0.85rem", lineHeight: 1.75 };

  if (loading)
    return (
      <div
        className="w-full p-6 flex flex-col items-center gap-3"
        style={cardBase}
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "linear-gradient(135deg,#c084fc,#7c3aed)" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <p style={{ color: "rgba(200,170,255,0.55)", fontSize: "0.78rem" }}>
          Loading history…
        </p>
      </div>
    );

  if (error)
    return (
      <div
        className="w-full p-5"
        style={{ ...cardBase, border: "1px solid rgba(239,68,68,0.3)" }}
      >
        <p style={{ color: "rgba(252,165,165,0.8)", fontSize: "0.82rem" }}>
          ⚠ {error}
        </p>
      </div>
    );

  if (!history?.length)
    return (
      <div
        className="w-full p-8 flex flex-col items-center gap-3"
        style={cardBase}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(167,139,250,0.2)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="#a78bfa"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p style={{ color: "rgba(167,139,250,0.55)", fontSize: "0.82rem" }}>
          No translation history yet
        </p>
        <p
          style={{
            fontFamily: "'Noto Sans Devanagari', serif",
            color: "rgba(167,139,250,0.35)",
            fontSize: "0.72rem",
          }}
        >
          अहिलेसम्म कुनै इतिहास छैन
        </p>
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-2.5">
      {history.map((item, idx) => {
        const isNE = item.direction === "ne_en";
        const isExpanded = expandedId === item.id;
        return (
          <motion.div
            key={item.id}
            layout
            className="w-full rounded-2xl overflow-hidden cursor-pointer"
            style={{
              background: isExpanded
                ? "rgba(20, 10, 60, 0.88)"
                : "rgba(15, 8, 50, 0.65)",
              backdropFilter: "blur(18px)",
              border: isExpanded
                ? "1px solid rgba(192,132,252,0.35)"
                : "1px solid rgba(167,139,250,0.18)",
              boxShadow: isExpanded
                ? "0 8px 40px rgba(124,58,237,0.18)"
                : "0 4px 20px rgba(0,0,0,0.22)",
              transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            onClick={() => setExpandedId(isExpanded ? null : item.id)}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div
                className="flex-shrink-0 px-2.5 py-1 rounded-lg"
                style={{
                  background: isNE
                    ? "rgba(124,58,237,0.22)"
                    : "rgba(192,132,252,0.15)",
                  color: isNE ? "#c084fc" : "#a78bfa",
                  border: `1px solid ${isNE ? "rgba(192,132,252,0.28)" : "rgba(167,139,250,0.2)"}`,
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  fontFamily: isNE
                    ? "'Noto Sans Devanagari', serif"
                    : "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                {isNE ? "नेपाली→EN" : "EN→नेपाली"}
              </div>
              <p
                className="flex-1 text-xs truncate"
                style={{
                  color: "rgba(210,190,255,0.68)",
                  fontFamily: isNE
                    ? "'Noto Sans Devanagari', serif"
                    : "inherit",
                }}
              >
                {truncate(item.source_text, 58)}
              </p>
              <span
                className="flex-shrink-0 text-xs hidden sm:block"
                style={{
                  color: "rgba(167,139,250,0.38)",
                  whiteSpace: "nowrap",
                }}
              >
                {formatDate(item.created_at)}
              </span>
              <motion.svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                className="flex-shrink-0"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.22 }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="rgba(167,139,250,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  key="exp"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="px-4 pb-4 flex flex-col gap-3 border-t"
                    style={{ borderColor: "rgba(167,139,250,0.12)" }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div
                        className="rounded-xl p-3.5"
                        style={{
                          background: "rgba(124,58,237,0.1)",
                          border: "1px solid rgba(167,139,250,0.14)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.6rem",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgba(167,139,250,0.55)",
                            fontWeight: 700,
                            marginBottom: "0.45rem",
                          }}
                        >
                          Source
                        </p>
                        <p style={isNE ? devStyle : enStyle}>
                          {item.source_text}
                        </p>
                      </div>
                      <div
                        className="rounded-xl p-3.5"
                        style={{
                          background: "rgba(192,132,252,0.07)",
                          border: "1px solid rgba(192,132,252,0.16)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.6rem",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgba(192,132,252,0.6)",
                            fontWeight: 700,
                            marginBottom: "0.45rem",
                          }}
                        >
                          Translated
                        </p>
                        <p style={isNE ? enStyle : devStyle}>
                          {item.translated_text}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <span
                        className="text-xs sm:hidden"
                        style={{ color: "rgba(167,139,250,0.38)" }}
                      >
                        {formatDate(item.created_at)}
                      </span>
                      <div className="flex items-center gap-2 ml-auto">
                        <motion.button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{
                            background: "rgba(124,58,237,0.14)",
                            border: "1px solid rgba(167,139,250,0.2)",
                            color:
                              copiedId === item.id
                                ? "#86efac"
                                : "rgba(200,170,255,0.75)",
                          }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) =>
                            handleCopy(item.translated_text, item.id, e)
                          }
                        >
                          {copiedId === item.id ? (
                            <>
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M5 13l4 4L19 7"
                                  stroke="#86efac"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Copied
                            </>
                          ) : (
                            <>
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <rect
                                  x="9"
                                  y="9"
                                  width="13"
                                  height="13"
                                  rx="2"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                                <path
                                  d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                />
                              </svg>
                              Copy
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{
                            background:
                              "linear-gradient(135deg,rgba(124,58,237,0.28),rgba(147,51,234,0.22))",
                            border: "1px solid rgba(192,132,252,0.26)",
                            color: "#c084fc",
                          }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onReuseEntry(item);
                          }}
                        >
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                            <path
                              d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                          Reuse
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── OCR Translate History Panel ───────────────────────────────────────────────
function OcrTranslateHistoryPanel({ history, loading, error }) {
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  const cardBase = {
    background: "rgba(15, 8, 50, 0.72)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(167,139,250,0.22)",
    borderRadius: "1.25rem",
    boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
  };
  const devStyle = {
    fontFamily: "'Noto Sans Devanagari', serif",
    color: "rgba(220,190,255,0.88)",
    fontSize: "0.85rem",
    lineHeight: 1.75,
  };
  const enStyle = { color: "#e2d9f3", fontSize: "0.85rem", lineHeight: 1.75 };

  if (loading)
    return (
      <div
        className="w-full p-6 flex flex-col items-center gap-3"
        style={cardBase}
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "linear-gradient(135deg,#c084fc,#7c3aed)" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <p style={{ color: "rgba(200,170,255,0.55)", fontSize: "0.78rem" }}>
          Loading OCR history…
        </p>
      </div>
    );

  if (error)
    return (
      <div
        className="w-full p-5"
        style={{ ...cardBase, border: "1px solid rgba(239,68,68,0.3)" }}
      >
        <p style={{ color: "rgba(252,165,165,0.8)", fontSize: "0.82rem" }}>
          ⚠ {error}
        </p>
      </div>
    );

  if (!history?.length)
    return (
      <div
        className="w-full p-8 flex flex-col items-center gap-3"
        style={cardBase}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(167,139,250,0.2)",
          }}
        >
          {/* Image + translate icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="3"
              stroke="#a78bfa"
              strokeWidth="1.8"
            />
            <path
              d="M8 15l3-4 2 2.5 2-3 3 4.5H8z"
              stroke="#a78bfa"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p style={{ color: "rgba(167,139,250,0.55)", fontSize: "0.82rem" }}>
          No OCR translate history yet
        </p>
        <p
          style={{
            fontFamily: "'Noto Sans Devanagari', serif",
            color: "rgba(167,139,250,0.35)",
            fontSize: "0.72rem",
          }}
        >
          अहिलेसम्म कुनै ओसीआर इतिहास छैन
        </p>
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-2.5">
      {history.map((item, idx) => {
        const isNE = item.direction === "ne_en";
        const isExpanded = expandedId === item.id;
        // extracted_text is the OCR source, translated_text is the output
        const sourceText = item.extracted_text || "";
        const translatedText = item.translated_text || "";

        return (
          <motion.div
            key={item.id}
            layout
            className="w-full rounded-2xl overflow-hidden cursor-pointer"
            style={{
              background: isExpanded
                ? "rgba(20, 10, 60, 0.88)"
                : "rgba(15, 8, 50, 0.65)",
              backdropFilter: "blur(18px)",
              border: isExpanded
                ? "1px solid rgba(192,132,252,0.35)"
                : "1px solid rgba(167,139,250,0.18)",
              boxShadow: isExpanded
                ? "0 8px 40px rgba(124,58,237,0.18)"
                : "0 4px 20px rgba(0,0,0,0.22)",
              transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            onClick={() => setExpandedId(isExpanded ? null : item.id)}
          >
            {/* Collapsed row */}
            <div className="flex items-center gap-3 px-4 py-3">
              {/* OCR badge — distinct teal tint to differentiate from text-only */}
              <div
                className="flex-shrink-0 px-2.5 py-1 rounded-lg flex items-center gap-1"
                style={{
                  background: "rgba(56,189,248,0.12)",
                  color: "#67e8f9",
                  border: "1px solid rgba(103,232,249,0.22)",
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M8 15l3-4 2 2.5 2-3 3 4.5H8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
                {isNE ? "OCR नेपाली→EN" : "OCR EN→नेपाली"}
              </div>

              <p
                className="flex-1 text-xs truncate"
                style={{
                  color: "rgba(210,190,255,0.68)",
                  fontFamily: isNE
                    ? "'Noto Sans Devanagari', serif"
                    : "inherit",
                }}
              >
                {truncate(sourceText, 52)}
              </p>

              {/* Confidence badge (avg) */}
              {item.confidence_scores?.length > 0 && (
                <span
                  className="flex-shrink-0 hidden sm:flex items-center gap-1 rounded-md px-2 py-0.5"
                  style={{
                    background: "rgba(124,58,237,0.14)",
                    color: "rgba(192,132,252,0.75)",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                  }}
                >
                  {(
                    (item.confidence_scores.reduce((a, b) => a + b, 0) /
                      item.confidence_scores.length) *
                    100
                  ).toFixed(0)}
                  % conf
                </span>
              )}

              <span
                className="flex-shrink-0 text-xs hidden sm:block"
                style={{
                  color: "rgba(167,139,250,0.38)",
                  whiteSpace: "nowrap",
                }}
              >
                {formatDate(item.created_at)}
              </span>
              <motion.svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                className="flex-shrink-0"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.22 }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="rgba(167,139,250,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>

            {/* Expanded */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  key="exp"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="px-4 pb-4 flex flex-col gap-3 border-t"
                    style={{ borderColor: "rgba(167,139,250,0.12)" }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {/* Extracted text */}
                      <div
                        className="rounded-xl p-3.5"
                        style={{
                          background: "rgba(56,189,248,0.07)",
                          border: "1px solid rgba(103,232,249,0.14)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.6rem",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgba(103,232,249,0.55)",
                            fontWeight: 700,
                            marginBottom: "0.45rem",
                          }}
                        >
                          Extracted (OCR)
                        </p>
                        <p style={isNE ? devStyle : enStyle}>{sourceText}</p>
                        {/* Per-line confidence scores */}
                        {item.confidence_scores?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.confidence_scores.map((score, i) => (
                              <span
                                key={i}
                                className="rounded px-1.5 py-0.5"
                                style={{
                                  background: "rgba(103,232,249,0.08)",
                                  color: "rgba(103,232,249,0.6)",
                                  fontSize: "0.58rem",
                                  fontWeight: 600,
                                }}
                              >
                                L{i + 1}: {(score * 100).toFixed(1)}%
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Translated text */}
                      <div
                        className="rounded-xl p-3.5"
                        style={{
                          background: "rgba(192,132,252,0.07)",
                          border: "1px solid rgba(192,132,252,0.16)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.6rem",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgba(192,132,252,0.6)",
                            fontWeight: 700,
                            marginBottom: "0.45rem",
                          }}
                        >
                          Translated
                        </p>
                        <p style={isNE ? enStyle : devStyle}>
                          {translatedText}
                        </p>
                      </div>
                    </div>

                    {/* Footer row */}
                    <div className="flex items-center gap-2 justify-between">
                      <span
                        className="text-xs sm:hidden"
                        style={{ color: "rgba(167,139,250,0.38)" }}
                      >
                        {formatDate(item.created_at)}
                      </span>
                      <div className="flex items-center gap-2 ml-auto">
                        {/* Copy translated */}
                        <motion.button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{
                            background: "rgba(124,58,237,0.14)",
                            border: "1px solid rgba(167,139,250,0.2)",
                            color:
                              copiedId === `${item.id}-tr`
                                ? "#86efac"
                                : "rgba(200,170,255,0.75)",
                          }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) =>
                            handleCopy(translatedText, `${item.id}-tr`, e)
                          }
                        >
                          {copiedId === `${item.id}-tr` ? (
                            <>
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M5 13l4 4L19 7"
                                  stroke="#86efac"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Copied
                            </>
                          ) : (
                            <>
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <rect
                                  x="9"
                                  y="9"
                                  width="13"
                                  height="13"
                                  rx="2"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                                <path
                                  d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                />
                              </svg>
                              Copy Translation
                            </>
                          )}
                        </motion.button>
                        {/* Copy OCR source */}
                        <motion.button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{
                            background: "rgba(56,189,248,0.1)",
                            border: "1px solid rgba(103,232,249,0.18)",
                            color:
                              copiedId === `${item.id}-src`
                                ? "#86efac"
                                : "rgba(103,232,249,0.75)",
                          }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) =>
                            handleCopy(sourceText, `${item.id}-src`, e)
                          }
                        >
                          {copiedId === `${item.id}-src` ? (
                            <>
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M5 13l4 4L19 7"
                                  stroke="#86efac"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Copied
                            </>
                          ) : (
                            <>
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="3"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                                <path
                                  d="M8 15l3-4 2 2.5 2-3 3 4.5H8z"
                                  stroke="currentColor"
                                  strokeWidth="1.4"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Copy OCR
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function NepaliLensUI() {
  const dispatch = useDispatch();

  const {
    ocrResult,
    ocrLoading,
    ocrError,
    translationResult,
    translationLoading,
    translationError,
    ocrTranslateResult,
    ocrTranslateLoading,
    ocrTranslateError,
    translationHistory,
    translationHistoryLoading,
    translationHistoryError,
    ocrTranslateHistory,
    ocrTranslateHistoryLoading,
    ocrTranslateHistoryError,
  } = useSelector((state) => state.auth);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [translateEnabled, setTranslateEnabled] = useState(true);
  const [activeMode, setActiveMode] = useState(null);
  const [manualText, setManualText] = useState("");
  const [manualDirection, setManualDirection] = useState("ne_en");
  const [showManualTranslate, setShowManualTranslate] = useState(false);
  const [ocrLanguage, setOcrLanguage] = useState("ne");
  const [showHistory, setShowHistory] = useState(false);
  const [historyFetched, setHistoryFetched] = useState(false);

  // ── NEW: which history tab is active ─────────────────────────────────────
  const [historyTab, setHistoryTab] = useState("translation"); // "translation" | "ocr"

  const fileInputRef = useRef(null);

  // Fetch both history lists on first open
  const handleOpenHistory = () => {
    setShowHistory((v) => {
      const next = !v;
      if (next && !historyFetched) {
        dispatch(fetchTranslationHistory());
        dispatch(fetchOcrTranslateHistory());
        setHistoryFetched(true);
      }
      return next;
    });
  };

  // Auto-refresh the correct history after a successful operation
  useEffect(() => {
    if (translationResult && historyFetched) {
      dispatch(fetchTranslationHistory());
    }
  }, [translationResult]);

  useEffect(() => {
    if (ocrTranslateResult && historyFetched) {
      dispatch(fetchOcrTranslateHistory());
    }
  }, [ocrTranslateResult]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setUploadedFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setUploadedFile(file);
    }
  };

  const handleExtractAndTranslate = () => {
    if (!uploadedFile) return;
    if (translateEnabled) {
      setActiveMode("ocr-translate");
      dispatch(ocrTranslate({ image: uploadedFile, language: ocrLanguage }));
    } else {
      setActiveMode("ocr");
      dispatch(extractOCR({ image: uploadedFile, language: ocrLanguage }));
    }
  };

  const handleManualTranslate = () => {
    if (!manualText.trim()) return;
    setActiveMode("translate");
    dispatch(
      translateText({ text: manualText.trim(), direction: manualDirection }),
    );
  };

  const handleReuseEntry = (item) => {
    setManualText(item.source_text);
    setManualDirection(item.direction);
    setShowManualTranslate(true);
    setShowHistory(false);
    setTimeout(
      () =>
        document
          .getElementById("manual-translate-panel")
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      120,
    );
  };

  // Refresh handler — refreshes the currently visible tab
  const handleRefreshHistory = () => {
    if (historyTab === "translation") {
      dispatch(fetchTranslationHistory());
    } else {
      dispatch(fetchOcrTranslateHistory());
    }
  };

  const currentError =
    activeMode === "ocr"
      ? ocrError
      : activeMode === "translate"
        ? translationError
        : activeMode === "ocr-translate"
          ? ocrTranslateError
          : null;

  // Combined badge count
  const totalHistoryCount =
    (translationHistory?.length ?? 0) + (ocrTranslateHistory?.length ?? 0);

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      >
        <MountainBackground />

        {/* Watermark */}
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
            भाषा दर्पण
          </span>
        </div>

        <div className="relative z-10 w-full max-w-4xl mt-16">
          {/* Subtitle */}
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
              स्मार्ट ओसीआर · अनुवाद · पहचान
            </span>
          </motion.div>

          {/* Hero */}
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

          {/* Upload + Preview */}
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
              {uploadedFile ? (
                <p
                  className="text-center font-semibold text-sm mb-2"
                  style={{ color: "rgba(192,132,252,0.9)" }}
                >
                  ✓ {uploadedFile.name}
                </p>
              ) : (
                <p
                  className="text-center font-medium text-sm mb-4"
                  style={{ color: "rgba(220,200,255,0.8)" }}
                >
                  Drop your image, PDF, or
                  <br />
                  screenshot here
                </p>
              )}
              <p
                className="text-center text-xs mb-4"
                style={{
                  fontFamily: "'Noto Sans Devanagari', serif",
                  color: "rgba(180,150,255,0.55)",
                  letterSpacing: "0.05em",
                }}
              >
                आफ्नो फाइल अपलोड गर्नुहोस्
              </p>
              <div
                className="flex items-center gap-2 mb-4"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  style={{
                    color: "rgba(167,139,250,0.65)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  Lang:
                </span>
                {["ne", "en"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setOcrLanguage(lang)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background:
                        ocrLanguage === lang
                          ? "linear-gradient(135deg,#7c3aed,#9333ea)"
                          : "rgba(124,58,237,0.12)",
                      color:
                        ocrLanguage === lang
                          ? "#fff"
                          : "rgba(200,170,255,0.65)",
                      border:
                        ocrLanguage === lang
                          ? "1px solid rgba(192,132,252,0.4)"
                          : "1px solid rgba(167,139,250,0.18)",
                    }}
                  >
                    {lang === "ne" ? "नेपाली" : "English"}
                  </button>
                ))}
              </div>
              <motion.button
                className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.45)",
                }}
                whileHover={{ scale: 1.05 }}
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
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                </div>
              </motion.button>
              <AnimatePresence>
                {uploadedImage ? (
                  <motion.img
                    key="preview"
                    src={uploadedImage}
                    alt="preview"
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
                    <p
                      className="text-xs mb-3 text-center leading-relaxed"
                      style={{
                        fontFamily: "'Noto Sans Devanagari', serif",
                        color: "rgba(200,180,255,0.6)",
                        fontSize: "0.7rem",
                      }}
                    >
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
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Extract button */}
          <motion.div
            className="flex justify-center mb-8 relative"
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
              >
                <path
                  d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z"
                  fill="#e879f9"
                />
              </motion.svg>
            ))}
            <motion.button
              className="px-10 py-4 rounded-2xl text-white text-base font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed 0%, #9333ea 60%, #c026d3 100%)",
                boxShadow:
                  "0 8px 40px rgba(124,58,237,0.5), 0 0 0 1px rgba(167,139,250,0.2)",
              }}
              whileHover={
                uploadedFile
                  ? {
                      scale: 1.05,
                      boxShadow:
                        "0 12px 50px rgba(124,58,237,0.65), 0 0 0 1px rgba(167,139,250,0.35)",
                    }
                  : {}
              }
              whileTap={uploadedFile ? { scale: 0.97 } : {}}
              disabled={!uploadedFile || ocrLoading || ocrTranslateLoading}
              onClick={handleExtractAndTranslate}
            >
              {ocrLoading || ocrTranslateLoading
                ? "Processing…"
                : `✦  ${translateEnabled ? "Extract & Translate" : "Extract Text"}`}
            </motion.button>
          </motion.div>

          {/* Toggle Row */}
          <motion.div
            className="flex justify-center gap-3 mb-5 flex-wrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Translate Text button */}
            <button
              className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
              style={{
                color: showManualTranslate
                  ? "#f0ecff"
                  : "rgba(210,185,255,0.82)",
                background: showManualTranslate
                  ? "linear-gradient(135deg, rgba(124,58,237,0.45), rgba(147,51,234,0.38))"
                  : "rgba(124,58,237,0.15)",
                border: "1px solid",
                borderColor: showManualTranslate
                  ? "rgba(192,132,252,0.55)"
                  : "rgba(167,139,250,0.3)",
                backdropFilter: "blur(12px)",
                boxShadow: showManualTranslate
                  ? "0 4px 22px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.08)"
                  : "0 2px 10px rgba(0,0,0,0.2)",
              }}
              onClick={() => setShowManualTranslate((v) => !v)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 7h14M5 12h8M5 17h5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Translate Text
              <span
                style={{
                  fontFamily: "'Noto Sans Devanagari', serif",
                  fontSize: "0.7rem",
                  opacity: 0.75,
                }}
              >
                पाठ अनुवाद
              </span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  marginLeft: 2,
                  transition: "transform 0.22s",
                  transform: showManualTranslate
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* History button */}
            <button
              className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
              style={{
                color: showHistory ? "#f0ecff" : "rgba(210,185,255,0.82)",
                background: showHistory
                  ? "linear-gradient(135deg, rgba(124,58,237,0.45), rgba(147,51,234,0.38))"
                  : "rgba(124,58,237,0.15)",
                border: "1px solid",
                borderColor: showHistory
                  ? "rgba(192,132,252,0.55)"
                  : "rgba(167,139,250,0.3)",
                backdropFilter: "blur(12px)",
                boxShadow: showHistory
                  ? "0 4px 22px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.08)"
                  : "0 2px 10px rgba(0,0,0,0.2)",
              }}
              onClick={handleOpenHistory}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              History
              <span
                style={{
                  fontFamily: "'Noto Sans Devanagari', serif",
                  fontSize: "0.7rem",
                  opacity: 0.75,
                }}
              >
                इतिहास
              </span>
              {/* Combined badge */}
              <span
                className="flex items-center justify-center rounded-md font-bold"
                style={{
                  minWidth: 22,
                  height: 18,
                  padding: "0 5px",
                  background: showHistory
                    ? "rgba(192,132,252,0.3)"
                    : "rgba(124,58,237,0.28)",
                  color: "#c084fc",
                  fontSize: "0.62rem",
                  letterSpacing: "0.02em",
                }}
              >
                {totalHistoryCount > 0 ? totalHistoryCount : "·"}
              </span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  marginLeft: 2,
                  transition: "transform 0.22s",
                  transform: showHistory ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </motion.div>

          {/* ── Manual Translate Panel ── */}
          <AnimatePresence>
            {showManualTranslate && (
              <motion.div
                id="manual-translate-panel"
                className="w-full mb-5 p-5 rounded-2xl"
                style={{
                  background: "rgba(15, 8, 50, 0.65)",
                  backdropFilter: "blur(18px)",
                  border: "1px solid rgba(167,139,250,0.2)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                }}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    style={{
                      color: "rgba(167,139,250,0.65)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Direction:
                  </span>
                  {[
                    { value: "ne_en", label: "नेपाली → English" },
                    { value: "en_ne", label: "English → नेपाली" },
                  ].map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setManualDirection(d.value)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background:
                          manualDirection === d.value
                            ? "linear-gradient(135deg,#7c3aed,#9333ea)"
                            : "rgba(124,58,237,0.12)",
                        color:
                          manualDirection === d.value
                            ? "#fff"
                            : "rgba(200,170,255,0.65)",
                        border:
                          manualDirection === d.value
                            ? "1px solid rgba(192,132,252,0.4)"
                            : "1px solid rgba(167,139,250,0.18)",
                        fontFamily:
                          d.value === "ne_en"
                            ? "'Noto Sans Devanagari', serif"
                            : "inherit",
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={4}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder={
                    manualDirection === "ne_en"
                      ? "यहाँ नेपाली पाठ टाइप गर्नुहोस्…"
                      : "Type English text here…"
                  }
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
                  style={{
                    background: "rgba(20,10,55,0.6)",
                    border: "1px solid rgba(167,139,250,0.22)",
                    color: "#e2d9f3",
                    fontFamily:
                      manualDirection === "ne_en"
                        ? "'Noto Sans Devanagari', serif"
                        : "'Outfit', sans-serif",
                    fontSize: "0.88rem",
                    lineHeight: 1.8,
                    caretColor: "#c084fc",
                  }}
                />
                <div className="flex justify-end mt-3">
                  <motion.button
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                      boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                    }}
                    whileHover={manualText.trim() ? { scale: 1.04 } : {}}
                    whileTap={manualText.trim() ? { scale: 0.97 } : {}}
                    disabled={!manualText.trim() || translationLoading}
                    onClick={handleManualTranslate}
                  >
                    {translationLoading ? "Translating…" : "✦ Translate"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── History Panel ── */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                className="w-full mb-5"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32 }}
              >
                {/* History header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="#a78bfa"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      style={{
                        color: "rgba(200,170,255,0.85)",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                      }}
                    >
                      History
                    </span>
                    <span
                      style={{
                        fontFamily: "'Noto Sans Devanagari', serif",
                        color: "rgba(167,139,250,0.45)",
                        fontSize: "0.7rem",
                      }}
                    >
                      · इतिहास
                    </span>
                  </div>
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{
                      color: "rgba(192,132,252,0.75)",
                      border: "1px solid rgba(167,139,250,0.2)",
                      background: "rgba(124,58,237,0.12)",
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRefreshHistory}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M1 4v6h6M23 20v-6h-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Refresh
                  </motion.button>
                </div>

                {/* ── Tab switcher ────────────────────────────────────────── */}
                <div
                  className="flex mb-4 rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(15, 8, 50, 0.6)",
                    border: "1px solid rgba(167,139,250,0.2)",
                    backdropFilter: "blur(16px)",
                    padding: "3px",
                    gap: "3px",
                  }}
                >
                  {/* Tab: Text Translation */}
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background:
                        historyTab === "translation"
                          ? "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(147,51,234,0.4))"
                          : "transparent",
                      color:
                        historyTab === "translation"
                          ? "#f0ecff"
                          : "rgba(180,155,255,0.6)",
                      border:
                        historyTab === "translation"
                          ? "1px solid rgba(192,132,252,0.35)"
                          : "1px solid transparent",
                      boxShadow:
                        historyTab === "translation"
                          ? "0 2px 12px rgba(124,58,237,0.25)"
                          : "none",
                    }}
                    onClick={() => setHistoryTab("translation")}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 7h14M5 12h8M5 17h5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Text Translation
                    <span
                      className="rounded px-1.5 py-0.5 font-bold"
                      style={{
                        background:
                          historyTab === "translation"
                            ? "rgba(192,132,252,0.25)"
                            : "rgba(124,58,237,0.18)",
                        color:
                          historyTab === "translation"
                            ? "#c084fc"
                            : "rgba(167,139,250,0.5)",
                        fontSize: "0.58rem",
                      }}
                    >
                      {translationHistory?.length ?? 0}
                    </span>
                  </button>

                  {/* Tab: OCR + Translate */}
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background:
                        historyTab === "ocr"
                          ? "linear-gradient(135deg, rgba(56,189,248,0.22), rgba(14,165,233,0.18))"
                          : "transparent",
                      color:
                        historyTab === "ocr"
                          ? "#e0f2fe"
                          : "rgba(180,155,255,0.6)",
                      border:
                        historyTab === "ocr"
                          ? "1px solid rgba(103,232,249,0.28)"
                          : "1px solid transparent",
                      boxShadow:
                        historyTab === "ocr"
                          ? "0 2px 12px rgba(56,189,248,0.15)"
                          : "none",
                    }}
                    onClick={() => setHistoryTab("ocr")}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 15l3-4 2 2.5 2-3 3 4.5H8z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    OCR + Translate
                    <span
                      className="rounded px-1.5 py-0.5 font-bold"
                      style={{
                        background:
                          historyTab === "ocr"
                            ? "rgba(103,232,249,0.18)"
                            : "rgba(56,189,248,0.12)",
                        color:
                          historyTab === "ocr"
                            ? "#67e8f9"
                            : "rgba(103,232,249,0.45)",
                        fontSize: "0.58rem",
                      }}
                    >
                      {ocrTranslateHistory?.length ?? 0}
                    </span>
                  </button>
                </div>

                {/* ── Tab content ─────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                  {historyTab === "translation" ? (
                    <motion.div
                      key="translation-tab"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22 }}
                    >
                      <TranslationHistoryPanel
                        history={translationHistory}
                        loading={translationHistoryLoading}
                        error={translationHistoryError}
                        onReuseEntry={handleReuseEntry}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ocr-tab"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22 }}
                    >
                      <OcrTranslateHistoryPanel
                        history={ocrTranslateHistory}
                        loading={ocrTranslateHistoryLoading}
                        error={ocrTranslateHistoryError}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Results Panel ── */}
          <ResultPanel
            ocrResult={ocrResult}
            ocrLoading={ocrLoading}
            translationResult={translationResult}
            translationLoading={translationLoading}
            ocrTranslateResult={ocrTranslateResult}
            ocrTranslateLoading={ocrTranslateLoading}
            mode={activeMode}
            error={currentError}
          />

          {/* Feature Cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 mb-12"
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
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
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
