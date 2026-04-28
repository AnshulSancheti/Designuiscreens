import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Sparkles, Lock, ShieldCheck, CheckCircle2, Share2, Clock, Loader2,
  AlertCircle, X, GraduationCap, Briefcase, Eye, RefreshCw, FileText,
  Target, Info, Star, ChevronRight
} from "lucide-react";
import { AnimatedContent } from "./ui/AnimatedContent";
import { demoApi, type HCVResponse, type EvidenceDimension, getDemoModeActive } from "../lib/demoApi";
import { toast } from "sonner";

// Identity (kept stable per product intent)
const IDENTITY = {
  name: "Aisha Sharma",
  target_role: "Frontend Engineer",
  location: "Bengaluru, India",
};

const PROFILE_DATA = {
  role_alignment: {
    primary_fit: "Frontend Engineer",
    fit_label: "Strong Signal Match",
    adjacent_roles: ["UI Engineer", "Product Engineer", "Design Engineer"],
  },
  achievements_and_education: [
    {
      type: "Education" as const,
      title: "B.Tech, Computer Science",
      source: "RV College of Engineering",
      verification: "Self-Reported" as const,
    },
    {
      type: "Experience" as const,
      title: "Frontend Intern",
      source: "Early-stage startup",
      verification: "Signal Verified" as const,
    },
  ],
};

function shortenToSentences(text: string, max = 2): string {
  const parts = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!parts) return text;
  return parts.slice(0, max).join("").trim();
}

// ---------- Signal helpers (one source of truth) ----------
type SignalBand = "Strong" | "Moderate" | "Needs more evidence";
type ConfidenceBand = "High" | "Moderate" | "Low";
type TraitFamily = "behavioral" | "technical";

function getSignalBand(score: number): SignalBand {
  if (score >= 0.8) return "Strong";
  if (score >= 0.6) return "Moderate";
  return "Needs more evidence";
}

function getConfidenceBand(confidence: number): ConfidenceBand {
  if (confidence >= 0.85) return "High";
  if (confidence >= 0.7) return "Moderate";
  return "Low";
}

function isGapTrait(dim: EvidenceDimension) {
  return dim.confidence < 0.7 || dim.score < 0.55 || dim.evidence_snippets.length === 0;
}

function getTraitFamily(name: string): TraitFamily {
  const technicalWords = [
    "react", "typescript", "component", "state", "debug", "api",
    "testing", "performance", "system", "frontend", "architecture",
    "technical", "execution", "problem", "engineering", "code",
  ];
  const normalized = name.toLowerCase();
  return technicalWords.some((word) => normalized.includes(word)) ? "technical" : "behavioral";
}

function getTraitSentence(dim: EvidenceDimension) {
  const signal = getSignalBand(dim.score).toLowerCase();
  const confidence = getConfidenceBand(dim.confidence).toLowerCase();
  if (isGapTrait(dim)) {
    return `PlacedOn needs more interview evidence before presenting ${dim.dimension} as a confident signal.`;
  }
  return `${dim.dimension} shows up as a ${signal} signal with ${confidence} confidence, based on observed interview behavior.`;
}

const TECH_COLOR = "#3E63F5"; // cool blue
const WARM_COLOR = "#F59E0B"; // warm gold

// ---------- Constellation positioning ----------
const TRAIT_POSITIONS: Record<string, { x: number; y: number }> = {
  "Component Architecture": { x: 21, y: 32 },
  "Debugging Approach": { x: 42, y: 23 },
  "Product Communication": { x: 66, y: 34 },
  "State Management": { x: 31, y: 58 },
  "Responsive UI": { x: 55, y: 62 },
  "API Integration": { x: 74, y: 54 },
  "Testing Discipline": { x: 22, y: 74 },
  "Performance Optimization": { x: 83, y: 72 },
  "System Design Breadth": { x: 48, y: 79 },
  // Mock HCV defaults
  "Technical Execution": { x: 70, y: 28 },
  "System Design": { x: 82, y: 56 },
  "Problem Solving": { x: 56, y: 70 },
  "Collaboration": { x: 22, y: 40 },
  "Communication": { x: 32, y: 70 },
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getTraitPosition(name: string): { x: number; y: number } {
  if (TRAIT_POSITIONS[name]) return TRAIT_POSITIONS[name];
  const h = hashString(name);
  const family = getTraitFamily(name);
  // Behavioral biased to left half (10–48), technical biased to right (52–90).
  const x = family === "behavioral" ? 12 + (h % 36) : 54 + ((h >> 3) % 36);
  const y = 18 + ((h >> 5) % 64);
  return { x, y };
}

type StarPoint = {
  dim: EvidenceDimension;
  family: TraitFamily;
  isGap: boolean;
  x: number;
  y: number;
  coreSize: number; // 8-12
  glowRadius: number; // px, scales with score
  glowOpacity: number; // 0..1, scales with confidence
};

function buildStars(dims: EvidenceDimension[]): StarPoint[] {
  return dims.map((d) => {
    const { x, y } = getTraitPosition(d.dimension);
    const family = getTraitFamily(d.dimension);
    const coreSize = 8 + Math.round(Math.max(0, Math.min(1, d.score)) * 4); // 8..12
    const glowRadius = 28 + Math.round(d.score * 64); // 28..~92
    const glowOpacity = 0.18 + d.confidence * 0.55; // 0.18..0.73
    return { dim: d, family, isGap: isGapTrait(d), x, y, coreSize, glowRadius, glowOpacity };
  });
}

// Pick 1–2 nearest same-family non-gap neighbors per non-gap star (no full mesh).
function buildEdges(stars: StarPoint[]): Array<{ a: number; b: number; family: TraitFamily }> {
  const edges = new Set<string>();
  const out: Array<{ a: number; b: number; family: TraitFamily }> = [];
  stars.forEach((s, i) => {
    if (s.isGap) return;
    const candidates = stars
      .map((other, j) => ({ j, other }))
      .filter(({ j, other }) => j !== i && !other.isGap && other.family === s.family)
      .map(({ j, other }) => ({
        j,
        d: Math.hypot(other.x - s.x, other.y - s.y),
      }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    candidates.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edges.has(key)) {
        edges.add(key);
        out.push({ a: Math.min(i, j), b: Math.max(i, j), family: s.family });
      }
    });
  });
  return out;
}

function ConstellationStar({
  star,
  selected,
  onSelect,
  offset,
}: {
  star: StarPoint;
  selected: boolean;
  onSelect: () => void;
  offset: { x: number; y: number };
}) {
  const reduceMotion = useReducedMotion();
  const color = star.family === "technical" ? TECH_COLOR : WARM_COLOR;
  const haloOpacity = selected ? Math.min(1, star.glowOpacity + 0.25) : star.glowOpacity;
  const haloSize = selected ? star.glowRadius + 18 : star.glowRadius;

  return (
    <span
      style={{ left: `${star.x}%`, top: `${star.y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={`${star.dim.dimension}, ${getSignalBand(star.dim.score).toLowerCase()} signal, ${getConfidenceBand(star.dim.confidence).toLowerCase()} confidence. Open trait details.`}
      aria-pressed={selected}
      animate={{ x: offset.x, y: offset.y }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18, mass: 0.4 }}
      className="group relative pointer-events-auto flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3E63F5]/40"
    >
      {/* Halo: radius = score, opacity = confidence */}
      <span
        aria-hidden
        className="absolute rounded-full pointer-events-none transition-all duration-300"
        style={{
          width: haloSize,
          height: haloSize,
          opacity: haloOpacity,
          background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
          filter: selected ? "saturate(1.15)" : undefined,
        }}
      />
      {/* Core */}
      {star.isGap ? (
        <span
          className="relative rounded-full bg-[#FFFCF6] transition-transform group-hover:scale-110"
          style={{
            width: star.coreSize,
            height: star.coreSize,
            border: `1.5px dashed ${color}`,
          }}
        />
      ) : (
        <motion.span
          className="relative rounded-full transition-transform group-hover:scale-110"
          style={{
            width: star.coreSize,
            height: star.coreSize,
            background: color,
            boxShadow: selected ? `0 0 14px ${color}` : `0 0 6px ${color}`,
          }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: selected ? 1 : [0.9, 1, 0.9] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {/* Label under star */}
      <span
        className={`absolute top-full mt-2 whitespace-nowrap text-[11px] font-bold pointer-events-none transition-opacity ${
          selected
            ? "opacity-90 text-[#1F2430]"
            : "opacity-40 text-[#1F2430]/80 group-hover:opacity-90 group-focus-visible:opacity-90"
        }`}
      >
        {star.dim.dimension}
      </span>
    </motion.button>
    </span>
  );
}

interface ProfileConstellationProps {
  dimensions: EvidenceDimension[];
  selectedTrait: EvidenceDimension | null;
  onSelectTrait: (trait: EvidenceDimension) => void;
}

function ProfileConstellation({ dimensions, selectedTrait, onSelectTrait }: ProfileConstellationProps) {
  const stars = useMemo(() => buildStars(dimensions), [dimensions]);
  const edges = useMemo(() => buildEdges(stars), [stars]);
  const selectedIdx = selectedTrait
    ? stars.findIndex((s) => s.dim.dimension === selectedTrait.dimension)
    : -1;
  const reduceMotion = useReducedMotion();
  const skyRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  function getStarOffset(star: StarPoint, idx: number): { x: number; y: number } {
    if (reduceMotion || !pointer || idx === selectedIdx) return { x: 0, y: 0 };
    const starPx = (star.x / 100) * pointer.w;
    const starPy = (star.y / 100) * pointer.h;
    const dx = starPx - pointer.x;
    const dy = starPy - pointer.y;
    const distance = Math.hypot(dx, dy);
    const RADIUS = 140;
    if (distance >= RADIUS || distance < 0.5) return { x: 0, y: 0 };
    const force = (1 - distance / RADIUS) * 14;
    const gapBoost = star.isGap ? 1.2 : 1;
    const confidenceDamp = 1 / Math.max(0.45, star.dim.confidence);
    const magnitude = force * gapBoost * confidenceDamp;
    return { x: (dx / distance) * magnitude, y: (dy / distance) * magnitude };
  }

  // Sparse background dots — deterministic so no layout shift
  const bgDots = useMemo(() => {
    const out: Array<{ x: number; y: number; r: number }> = [];
    let h = 7;
    for (let i = 0; i < 22; i++) {
      h = (h * 1103515245 + 12345) & 0x7fffffff;
      out.push({
        x: (h % 1000) / 10,
        y: ((h >> 7) % 1000) / 10,
        r: 0.6 + ((h >> 13) % 10) / 18,
      });
    }
    return out;
  }, []);

  return (
    <section
      aria-label="Your evidence constellation"
      className="relative w-full rounded-[1.75rem] overflow-hidden"
      style={{
        background: "#F3F2F0",
        border: "1px solid rgba(31,36,48,0.08)",
        minHeight: 560,
        height: "70vh",
        maxHeight: 720,
      }}
    >
      {/* Slim title block */}
      <div className="px-6 sm:px-8 pt-7 pb-2 relative z-10">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45">
          <Sparkles className="w-3.5 h-3.5" /> Profile
        </div>
        <h2 className="font-[Manrope,sans-serif] text-[22px] sm:text-[26px] font-extrabold text-[#1F2430] tracking-tight mt-1.5 leading-tight">
          Your Evidence Constellation
        </h2>
        <p className="text-[13px] sm:text-[14px] text-[#1F2430]/60 font-medium mt-1.5 max-w-2xl leading-relaxed">
          Every star is a trait PlacedOn inferred from observed interview behavior.
        </p>
      </div>

      {/* Sky region */}
      <div
        ref={skyRef}
        onPointerMove={(e) => {
          if (reduceMotion) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setPointer({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            w: rect.width,
            h: rect.height,
          });
        }}
        onPointerLeave={() => setPointer(null)}
        className="absolute inset-0 top-[120px] sm:top-[128px] bottom-[88px] sm:bottom-[72px]"
      >
        {/* Sparse background dots */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {bgDots.map((d, i) => (
            <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.r} fill="#1F2430" fillOpacity={0.06} />
          ))}

          {/* Connection lines (behind stars) */}
          {edges.map((e, i) => {
            const a = stars[e.a];
            const b = stars[e.b];
            const isHot = selectedIdx === e.a || selectedIdx === e.b;
            const stroke = e.family === "technical" ? TECH_COLOR : WARM_COLOR;
            return (
              <line
                key={i}
                x1={`${a.x}%`}
                y1={`${a.y}%`}
                x2={`${b.x}%`}
                y2={`${b.y}%`}
                stroke={stroke}
                strokeWidth={isHot ? 1.2 : 1}
                strokeOpacity={isHot ? 0.45 : 0.12}
                style={{ transition: "stroke-opacity 200ms ease" }}
              />
            );
          })}
        </svg>

        {stars.map((s, i) => (
          <ConstellationStar
            key={s.dim.dimension}
            star={s}
            selected={i === selectedIdx}
            offset={getStarOffset(s, i)}
            onSelect={() => onSelectTrait(s.dim)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="absolute left-0 right-0 bottom-0 px-6 sm:px-8 py-4 flex flex-wrap items-center gap-x-5 gap-y-2 z-10 bg-gradient-to-t from-[#F3F2F0] via-[#F3F2F0]/90 to-transparent">
        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-[#1F2430]/70">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: WARM_COLOR }} /> Gold = behavioral
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-[#1F2430]/70">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: TECH_COLOR }} /> Blue = technical
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-[#1F2430]/70">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: `radial-gradient(circle, ${TECH_COLOR} 0%, transparent 70%)` }}
          />
          Glow = signal strength
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-[#1F2430]/70">
          <span className="w-2.5 h-2.5 rounded-full border-[1.5px] border-dashed border-[#1F2430]/40 bg-[#FFFCF6]" /> Dotted = needs more evidence
        </div>
      </div>
    </section>
  );
}

// ---------- Signal ring (SVG) ----------
// Outer arc = score, inner arc = confidence. Color follows trait family.
function SignalRing({
  score,
  confidence,
  family,
  size = 132,
}: {
  score: number;
  confidence: number;
  family: TraitFamily;
  size?: number;
}) {
  const familyColor = family === "technical" ? TECH_COLOR : WARM_COLOR;
  const stroke = 8;
  const innerStroke = 5;
  const r1 = size / 2 - stroke / 2 - 2;
  const r2 = r1 - stroke - 4;
  const cx = size / 2;
  const cy = size / 2;
  const c1 = 2 * Math.PI * r1;
  const c2 = 2 * Math.PI * r2;
  const scoreClamped = Math.max(0, Math.min(1, score));
  const confidenceClamped = Math.max(0, Math.min(1, confidence));
  const signalLabel = getSignalBand(score);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        {/* Outer track */}
        <circle cx={cx} cy={cy} r={r1} fill="none" stroke="rgba(31,36,48,0.08)" strokeWidth={stroke} />
        {/* Outer arc — score */}
        <circle
          cx={cx}
          cy={cy}
          r={r1}
          fill="none"
          stroke={familyColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c1 * scoreClamped} ${c1}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* Inner track */}
        <circle cx={cx} cy={cy} r={r2} fill="none" stroke="rgba(31,36,48,0.06)" strokeWidth={innerStroke} />
        {/* Inner arc — confidence */}
        <circle
          cx={cx}
          cy={cy}
          r={r2}
          fill="none"
          stroke="#10B981"
          strokeWidth={innerStroke}
          strokeLinecap="round"
          strokeDasharray={`${c2 * confidenceClamped} ${c2}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity={0.85}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45">Signal</div>
        <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] leading-tight text-[15px] mt-0.5">
          {signalLabel}
        </div>
      </div>
    </div>
  );
}

// ---------- Trait Drawer ----------
interface TraitDrawerProps {
  trait: EvidenceDimension | null;
  onClose: () => void;
  onSelectNext?: () => void;
  onSelectPrevious?: () => void;
  onValidate?: (response: "feels_right" | "flag") => void;
  onScheduleRetake?: () => void;
}

function TraitDrawer({
  trait,
  onClose,
  onSelectNext,
  onSelectPrevious,
  onValidate,
  onScheduleRetake,
}: TraitDrawerProps) {
  const reduceMotion = useReducedMotion();
  // Close on Escape
  useEffect(() => {
    if (!trait) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && onSelectNext) onSelectNext();
      else if (e.key === "ArrowLeft" && onSelectPrevious) onSelectPrevious();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [trait, onClose, onSelectNext, onSelectPrevious]);

  return (
    <AnimatePresence>
      {trait && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[#1F2430]/25 backdrop-blur-[2px]"
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`${trait.dimension} details`}
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={reduceMotion ? { duration: 0.15 } : { type: "spring", damping: 30, stiffness: 280 }}
            className="
              fixed z-50 bg-[#FFFCF6] flex flex-col
              shadow-[-12px_0_40px_rgba(30,35,60,0.12)]
              left-0 right-0 bottom-0 max-h-[88vh] rounded-t-[1.5rem]
              sm:left-auto sm:max-h-none sm:rounded-t-none sm:top-0 sm:bottom-0 sm:w-[420px]
            "
          >
            {/* Mobile grab handle */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
              <span className="w-10 h-1.5 rounded-full bg-[#1F2430]/15" />
            </div>

            {/* Header: family chip + nav + close */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1F2430]/[0.06] shrink-0">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onSelectPrevious}
                  disabled={!onSelectPrevious}
                  aria-label="Previous trait"
                  className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-[#1F2430]/50 hover:text-[#1F2430] hover:bg-[#1F2430]/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={onSelectNext}
                  disabled={!onSelectNext}
                  aria-label="Next trait"
                  className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-[#1F2430]/50 hover:text-[#1F2430] hover:bg-[#1F2430]/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#1F2430]/50 hover:text-[#1F2430] hover:bg-[#1F2430]/5 transition-colors"
                aria-label="Close trait details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Swap content per trait without closing the drawer */}
            <AnimatePresence mode="wait">
              <motion.div
                key={trait.dimension}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="flex-1 overflow-y-auto"
              >
                <TraitDrawerBody trait={trait} onScheduleRetake={onScheduleRetake} onValidate={onValidate} />
              </motion.div>
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function TraitDrawerBody({
  trait,
  onScheduleRetake,
  onValidate,
}: {
  trait: EvidenceDimension;
  onScheduleRetake?: () => void;
  onValidate?: (response: "feels_right" | "flag") => void;
}) {
  const family = getTraitFamily(trait.dimension);
  const familyColor = family === "technical" ? TECH_COLOR : WARM_COLOR;
  const familyTint = family === "technical" ? "rgba(62,99,245,0.08)" : "rgba(245,158,11,0.10)";
  const familyText = family === "technical" ? "#3349B0" : "#8A5A0B";
  const gap = isGapTrait(trait);
  const signalLabel = getSignalBand(trait.score);
  const confidenceLabel = getConfidenceBand(trait.confidence);

  return (
    <div className="px-5 py-5 flex flex-col gap-5">
      {/* 1. Trait name + 2. family chip */}
      <div className="flex flex-col gap-2.5">
        <span
          className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
          style={{ background: familyTint, color: familyText }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: familyColor }} />
          {family === "technical" ? "Technical" : "Behavioral"}
        </span>
        <h3 className="font-[Manrope,sans-serif] text-[22px] font-extrabold text-[#1F2430] tracking-tight leading-tight">
          {trait.dimension}
        </h3>
        {gap && (
          <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F59E0B]/10 text-[#A46500] text-[11px] font-bold uppercase tracking-wider">
            <Info className="w-3 h-3" /> Needs more evidence
          </div>
        )}
      </div>

      {/* 3. Signal ring + 4. labels */}
      <div className="flex items-center gap-5">
        <SignalRing score={trait.score} confidence={trait.confidence} family={family} />
        <div className="flex flex-col gap-3 min-w-0">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45">Signal</div>
            <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[16px] leading-tight">
              {signalLabel}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45">Confidence</div>
            <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[16px] leading-tight">
              {confidenceLabel}
            </div>
          </div>
        </div>
      </div>

      {/* 5. How this shows up */}
      <div className="rounded-xl bg-white border border-[#1F2430]/[0.06] p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45 mb-1.5">
          How this shows up
        </div>
        <p className="text-[14px] text-[#1F2430]/80 font-medium leading-relaxed">
          {getTraitSentence(trait)}
        </p>
      </div>

      {/* 6. Evidence */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45 mb-2">
          Evidence
        </div>
        {trait.evidence_snippets.length === 0 ? (
          <p className="text-[13px] text-[#1F2430]/55 italic">No direct evidence captured yet.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {trait.evidence_snippets.map((s, i) => (
              <div
                key={i}
                className="rounded-xl bg-white border border-[#1F2430]/[0.06] p-3 text-[13px] text-[#1F2430]/80 font-medium leading-relaxed"
              >
                <span className="text-[#1F2430]/30 mr-1">"</span>
                {s}
                <span className="text-[#1F2430]/30 ml-1">"</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Gap CTA — only when isGapTrait */}
      {gap && (
        <div className="rounded-xl bg-[#F59E0B]/8 border border-[#F59E0B]/20 p-4 flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#A46500] mt-0.5 shrink-0" />
            <p className="text-[13px] text-[#1F2430]/80 font-medium leading-relaxed">
              More interview evidence can strengthen this signal.
            </p>
          </div>
          <button
            type="button"
            onClick={onScheduleRetake}
            className="self-start min-h-[44px] px-4 rounded-xl bg-[#1F2430] text-white text-[13px] font-bold hover:bg-[#1F2430]/90 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Schedule a retake
          </button>
        </div>
      )}

      {/* Subtle metadata (raw decimals only as secondary) */}
      <div className="text-[11px] text-[#1F2430]/40 font-medium flex items-center gap-3 pt-1 border-t border-[#1F2430]/[0.05]">
        <span>Score {trait.score.toFixed(2)}</span>
        <span>·</span>
        <span>Confidence {Math.round(trait.confidence * 100)}%</span>
        <span>·</span>
        <span>Uncertainty {Math.round(trait.uncertainty * 100)}%</span>
      </div>

      {/* 8. Validation footer */}
      <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onValidate?.("feels_right")}
          className="flex-1 min-h-[44px] px-4 rounded-xl bg-[#10B981] text-white text-[14px] font-bold hover:bg-[#0E9E70] transition-colors inline-flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> This feels right
        </button>
        <button
          type="button"
          onClick={() => onValidate?.("flag")}
          className="flex-1 min-h-[44px] px-4 rounded-xl bg-white text-[#1F2430] text-[14px] font-bold border border-[#1F2430]/15 hover:bg-[#F8F9FC] transition-colors inline-flex items-center justify-center gap-2"
        >
          <AlertCircle className="w-4 h-4" /> Flag this trait
        </button>
      </div>
    </div>
  );
}

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-[#1F2430]/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full transition-[width]"
        style={{ width: `${Math.round(value * 100)}%`, background: color }}
      />
    </div>
  );
}

export function ProfileScreen() {
  const [hcvData, setHcvData] = useState<HCVResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(getDemoModeActive());
  const [focusedDim, setFocusedDim] = useState<string | null>(null);
  const [validatedAccurate, setValidatedAccurate] = useState<null | "yes" | "needs_edit">(null);
  const [personalNote, setPersonalNote] = useState("");

  useEffect(() => {
    const handler = (e: Event) => setIsDemoMode((e as CustomEvent<boolean>).detail);
    window.addEventListener("demo-mode-changed", handler);
    setIsDemoMode(getDemoModeActive());
    return () => window.removeEventListener("demo-mode-changed", handler);
  }, []);

  async function loadHCV() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoApi.getHCV();
      setHcvData(data);
    } catch (err) {
      console.error("Failed to load HCV data:", err);
      setError("Unable to load profile data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadHCV();
  }, []);

  const focused = useMemo<EvidenceDimension | null>(
    () => (hcvData ? hcvData.dimensions.find((d) => d.dimension === focusedDim) ?? null : null),
    [hcvData, focusedDim]
  );

  const focusedIndex = useMemo(
    () => (hcvData && focusedDim ? hcvData.dimensions.findIndex((d) => d.dimension === focusedDim) : -1),
    [hcvData, focusedDim]
  );

  const selectAdjacent = (delta: 1 | -1) => {
    if (!hcvData || focusedIndex < 0) return;
    const next = (focusedIndex + delta + hcvData.dimensions.length) % hcvData.dimensions.length;
    setFocusedDim(hcvData.dimensions[next].dimension);
  };

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText("https://placedon.com/profile/aisha-sharma-blr-2024");
      toast.success("Profile link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handlePublishProfile = () => {
    setIsPublished(true);
    toast.success("Profile published! Employers can now discover you.");
  };

  const handlePreviewAsEmployer = () => {
    const target = document.getElementById("public-tier-preview");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleToggleAvailability = () => {
    setIsAvailable((prev) => {
      const next = !prev;
      toast(next ? "You're open to offers." : "You're paused — hidden from new matches.", {
        icon: next ? "✨" : "⏸",
      });
      return next;
    });
  };

  const lastUpdatedLabel = hcvData
    ? new Date(hcvData.embedding_metadata.last_updated).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] font-[Inter,sans-serif] gap-4">
        <Loader2 className="w-10 h-10 text-[#3E63F5] animate-spin" />
        <p className="text-[14px] font-semibold text-[#1F2430]/60">Loading profile data...</p>
      </div>
    );
  }

  if (error || !hcvData) {
    return (
      <div className="flex flex-col gap-6 pb-12">
        <div className="rounded-[2rem] glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-1">
                Profile data unavailable
              </h3>
              <p className="text-[14px] text-[#1F2430]/60">
                {error || "Unable to load profile. Please check your backend connection and try again."}
              </p>
            </div>
          </div>
          <button
            onClick={() => loadHCV()}
            className="w-full md:w-auto min-h-[44px] px-6 rounded-xl bg-[#3E63F5] text-white text-[15px] md:text-[14px] font-bold shadow-sm hover:bg-[#2A44B0] transition-colors whitespace-nowrap shrink-0"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Top 3 dimensions for "TL;DR strengths" line
  const gapTraits = hcvData.dimensions.filter(isGapTrait);

  return (
    <div className="flex flex-col gap-6 font-[Inter,sans-serif] pb-12 overflow-x-hidden">
      {isDemoMode && (
        <div className="bg-[#1F2430] text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg w-full gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0" />
            <div className="min-w-0">
              <p className="text-[14px] font-bold">Demo Data</p>
              <p className="text-[13px] text-white/70 truncate">Backend connection unavailable. Showing fallback preview data.</p>
            </div>
          </div>
          <button
            onClick={() => loadHCV()}
            className="min-h-[44px] px-3 bg-white/10 hover:bg-white/20 rounded-lg text-[13px] font-medium transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* 1. STICKY SLIM PROFILE TOP STRIP */}
      <div className="sticky top-0 z-30 -mx-4 sm:mx-0 px-3 sm:px-4 py-2.5 backdrop-blur-md bg-[#FFFCF6]/85 border border-[#1F2430]/[0.06] rounded-none sm:rounded-2xl shadow-[0_2px_12px_rgba(30,35,60,0.04)] flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Avatar with verified badge */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white to-[#EEF1F8] border border-[#1F2430]/10 flex items-center justify-center font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[13px]">
            {IDENTITY.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10B981] border-2 border-[#FFFCF6] flex items-center justify-center"
            title="Verified profile"
            aria-label="Verified profile"
          >
            <ShieldCheck className="w-2.5 h-2.5 text-white" />
          </span>
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[14px] leading-tight truncate">
            {IDENTITY.name}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#1F2430]/60 font-semibold truncate">
            <span className="truncate">{IDENTITY.target_role}</span>
            {lastUpdatedLabel && (
              <>
                <span className="hidden sm:inline text-[#1F2430]/30">·</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[#1F2430]/50">
                  <Clock className="w-3 h-3" /> Updated {lastUpdatedLabel}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Availability toggle */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-[#1F2430]/[0.08] shrink-0">
          <span className="text-[11px] font-bold text-[#1F2430]/65">
            {isAvailable ? "Open" : "Paused"}
          </span>
          <button
            type="button"
            onClick={handleToggleAvailability}
            role="switch"
            aria-checked={isAvailable}
            aria-label="Toggle availability"
            className={`relative w-9 h-5 rounded-full transition-colors ${
              isAvailable ? "bg-[#10B981]" : "bg-[#1F2430]/20"
            }`}
          >
            <motion.span
              layout
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: isAvailable ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Preview as employer */}
        <button
          type="button"
          onClick={handlePreviewAsEmployer}
          className="hidden lg:inline-flex items-center gap-1.5 min-h-[36px] px-2 text-[12px] font-bold text-[#1F2430]/65 hover:text-[#1F2430] transition-colors shrink-0"
        >
          <Eye className="w-3.5 h-3.5" /> Preview as employer
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShareProfile}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-xl bg-white text-[#1F2430] text-[12px] font-bold border border-[#1F2430]/10 hover:bg-[#F8F9FC] transition-colors shrink-0"
          aria-label="Share profile link"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Publish */}
        <button
          type="button"
          onClick={handlePublishProfile}
          disabled={isPublished}
          className={`min-h-[40px] px-3 sm:px-4 rounded-xl text-[12px] font-bold transition-colors shrink-0 ${
            isPublished
              ? "bg-[#10B981] text-white cursor-default"
              : "bg-[#3E63F5] text-white hover:bg-[#2A44B0]"
          }`}
        >
          {isPublished ? (
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Published
            </span>
          ) : (
            "Publish"
          )}
        </button>
      </div>

      {/* Compact availability + preview row for narrow screens */}
      <div className="md:hidden flex items-center justify-between gap-3 px-1 -mt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleAvailability}
            role="switch"
            aria-checked={isAvailable}
            aria-label="Toggle availability"
            className={`relative w-9 h-5 rounded-full transition-colors ${
              isAvailable ? "bg-[#10B981]" : "bg-[#1F2430]/20"
            }`}
          >
            <motion.span
              layout
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: isAvailable ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className="text-[12px] font-bold text-[#1F2430]/70">
            {isAvailable ? "Open to offers" : "Paused"}
          </span>
        </div>
        <button
          type="button"
          onClick={handlePreviewAsEmployer}
          className="inline-flex items-center gap-1.5 min-h-[36px] px-2 text-[12px] font-bold text-[#1F2430]/65 hover:text-[#1F2430] transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Preview as employer
        </button>
      </div>

      {/* 2. CONSTELLATION HERO */}
      <AnimatedContent direction="vertical" distance={20} delay={0.05}>
        <ProfileConstellation
          dimensions={hcvData.dimensions}
          selectedTrait={focused}
          onSelectTrait={(t) => setFocusedDim(t.dimension)}
        />
      </AnimatedContent>

      {/* 3. TRAIT DRAWER */}
      <TraitDrawer
        trait={focused}
        onClose={() => setFocusedDim(null)}
        onSelectNext={hcvData.dimensions.length > 1 ? () => selectAdjacent(1) : undefined}
        onSelectPrevious={hcvData.dimensions.length > 1 ? () => selectAdjacent(-1) : undefined}
        onValidate={(r) => {
          if (r === "feels_right") toast.success("Trait marked as accurate.");
          else toast("Trait flagged for review.", { icon: "⚑" });
        }}
        onScheduleRetake={() => toast("Retake flow coming up")}
      />

      {/* Below-fold readable column */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">

      {/* SECTION 1: TL;DR + Role match + Self-validation */}
      <AnimatedContent direction="vertical" distance={20} delay={0.1}>
        <section className="rounded-[1.75rem] bg-white border border-[#1F2430]/[0.06] shadow-[0_4px_24px_rgba(30,35,60,0.03)] p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* TL;DR */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45">
                <FileText className="w-3.5 h-3.5" /> TL;DR
              </div>
              <p className="text-[16px] sm:text-[17px] leading-[1.7] text-[#1F2430]/85 font-medium text-pretty">
                {hcvData.summary}
              </p>
            </div>
            {/* Role match */}
            <div className="flex flex-col gap-2 lg:border-l lg:border-[#1F2430]/[0.08] lg:pl-8">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45">
                <Target className="w-3.5 h-3.5" /> Role match
              </div>
              <div className="font-[Manrope,sans-serif] text-[20px] font-extrabold text-[#1F2430] leading-tight">
                {PROFILE_DATA.role_alignment.primary_fit}
              </div>
              <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10B981]/10 text-[#0E7A5C] text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> {PROFILE_DATA.role_alignment.fit_label}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {PROFILE_DATA.role_alignment.adjacent_roles.map((r) => (
                  <span key={r} className="px-2.5 py-1 rounded-lg bg-[#1F2430]/[0.04] text-[12px] font-bold text-[#1F2430]/70">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Self-validation */}
          <div className="mt-6 pt-6 border-t border-[#1F2430]/[0.06] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-between">
            <div className="min-w-0">
              <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[15px] leading-tight">
                Does this feel like you?
              </div>
              <p className="text-[13px] text-[#1F2430]/60 font-medium mt-0.5">
                Your validation is the final check before publishing.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => { setValidatedAccurate("yes"); toast.success("Profile marked as accurate."); }}
                className={`min-h-[44px] px-4 rounded-xl text-[14px] font-bold border transition-colors inline-flex items-center justify-center gap-2 ${
                  validatedAccurate === "yes"
                    ? "bg-[#10B981] text-white border-[#10B981]"
                    : "bg-white text-[#1F2430] border-[#1F2430]/15 hover:bg-[#F8F9FC]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> Yes, this feels like me
              </button>
              <button
                type="button"
                onClick={() => { setValidatedAccurate("needs_edit"); toast("Flag a trait from the constellation to revisit it.", { icon: "⚑" }); }}
                className={`min-h-[44px] px-4 rounded-xl text-[14px] font-bold border transition-colors inline-flex items-center justify-center gap-2 ${
                  validatedAccurate === "needs_edit"
                    ? "bg-[#F59E0B] text-white border-[#F59E0B]"
                    : "bg-white text-[#1F2430] border-[#1F2430]/15 hover:bg-[#F8F9FC]"
                }`}
              >
                <AlertCircle className="w-4 h-4" /> Flag something
              </button>
            </div>
          </div>
        </section>
      </AnimatedContent>

      {/* SECTION 2: Public-tier preview */}
      <AnimatedContent direction="vertical" distance={20} delay={0.14}>
        <section
          id="public-tier-preview"
          className="rounded-[1.75rem] bg-gradient-to-br from-white to-[#F8F6EE] border border-[#1F2430]/[0.06] shadow-[0_4px_24px_rgba(30,35,60,0.03)] p-6 sm:p-8 scroll-mt-24"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45 mb-1">
            <Eye className="w-3.5 h-3.5" /> Public preview
          </div>
          <h3 className="font-[Manrope,sans-serif] text-[20px] font-extrabold text-[#1F2430] tracking-tight leading-tight mb-4">
            What employers will see
          </h3>

          <div className="rounded-2xl bg-white border border-[#1F2430]/[0.08] p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-[#EEF1F8] border border-[#1F2430]/10 flex items-center justify-center font-[Manrope,sans-serif] font-extrabold text-[#1F2430]">
                {IDENTITY.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[16px] truncate">
                  {IDENTITY.name}
                </div>
                <div className="text-[13px] text-[#1F2430]/60 font-semibold truncate">
                  {IDENTITY.target_role} · {IDENTITY.location}
                </div>
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10B981]/10 text-[#0E7A5C] text-[11px] font-bold uppercase tracking-wider shrink-0">
                <ShieldCheck className="w-3 h-3" /> Evidence-backed
              </span>
            </div>

            <p className="text-[14px] text-[#1F2430]/80 font-medium leading-relaxed">
              {shortenToSentences(hcvData.summary, 2)}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {hcvData.dimensions
                .filter((d) => !isGapTrait(d))
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((d) => {
                  const isTech = getTraitFamily(d.dimension) === "technical";
                  return (
                    <span
                      key={d.dimension}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold"
                      style={{
                        background: isTech ? "rgba(62,99,245,0.08)" : "rgba(245,158,11,0.10)",
                        color: isTech ? "#3349B0" : "#8A5A0B",
                      }}
                    >
                      <Star className="w-3 h-3" /> {d.dimension}
                    </span>
                  );
                })}
            </div>

            <div className="flex items-center gap-1.5 text-[12px] text-[#1F2430]/55 font-semibold pt-2 border-t border-[#1F2430]/[0.05]">
              <Lock className="w-3 h-3" /> Raw transcript stays private.
            </div>
          </div>
        </section>
      </AnimatedContent>

      {/* SECTION 3: Achievements & education */}
      <AnimatedContent direction="vertical" distance={20} delay={0.18}>
        <section className="rounded-[1.75rem] bg-white border border-[#1F2430]/[0.06] shadow-[0_4px_24px_rgba(30,35,60,0.03)] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45 mb-4">
            <GraduationCap className="w-3.5 h-3.5" /> Achievements & education
          </div>
          <div className="flex flex-col divide-y divide-[#1F2430]/[0.06]">
            {PROFILE_DATA.achievements_and_education.map((item) => {
              const verified = item.verification === "Signal Verified";
              const Icon = item.type === "Education" ? GraduationCap : Briefcase;
              return (
                <div key={item.title} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFCF6] border border-[#1F2430]/[0.08] flex items-center justify-center text-[#1F2430]/50 shrink-0">
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45">
                      {item.type}
                    </div>
                    <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[14px] leading-tight truncate">
                      {item.title}
                    </div>
                    <div className="text-[12px] text-[#1F2430]/60 font-semibold truncate">{item.source}</div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      verified
                        ? "bg-[#10B981]/10 text-[#0E7A5C]"
                        : "bg-[#1F2430]/[0.04] text-[#1F2430]/55"
                    }`}
                  >
                    {verified ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {item.verification}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </AnimatedContent>

      {/* SECTION 4: Personal notes */}
      <AnimatedContent direction="vertical" distance={20} delay={0.22}>
        <section className="rounded-[1.75rem] bg-white border border-[#1F2430]/[0.06] shadow-[0_4px_24px_rgba(30,35,60,0.03)] p-6 sm:p-8">
          <label htmlFor="profile-personal-notes" className="block">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45 mb-1">
              <FileText className="w-3.5 h-3.5" /> Notes
            </div>
            <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[15px] leading-tight mb-3">
              Your notes
            </div>
          </label>
          <textarea
            id="profile-personal-notes"
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            placeholder="Add context you want to remember before publishing."
            className="w-full min-h-[120px] rounded-xl bg-[#FFFCF6] border border-[#1F2430]/10 p-3 text-[14px] text-[#1F2430] font-medium placeholder:text-[#1F2430]/35 focus:outline-none focus:border-[#3E63F5]/40 resize-y"
          />
          <div className="flex items-center justify-between mt-2 text-[12px] text-[#1F2430]/50 font-semibold">
            <span className="inline-flex items-center gap-1.5"><Lock className="w-3 h-3" /> Private to you</span>
            <span>{personalNote.length} chars</span>
          </div>
        </section>
      </AnimatedContent>

      {/* SECTION 5: Profile provenance (quiet footer row) */}
      <AnimatedContent direction="vertical" distance={20} delay={0.26}>
        <section className="rounded-[1.25rem] bg-[#FFFCF6] border border-[#1F2430]/[0.06] px-5 py-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#1F2430]/65 font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1F2430]/45" />
              Provenance
            </span>
            <span className="text-[#1F2430]/30">·</span>
            <span>Model: <span className="text-[#1F2430]">{hcvData.embedding_metadata.model}</span></span>
            <span className="text-[#1F2430]/30">·</span>
            <span>{hcvData.embedding_metadata.dimension_count.toLocaleString()} dimensions</span>
            <span className="text-[#1F2430]/30">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated {new Date(hcvData.embedding_metadata.last_updated).toLocaleDateString()}
            </span>
            <span className="text-[#1F2430]/30">·</span>
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" /> Private until published
            </span>
            <span className="text-[#1F2430]/30">·</span>
            <span>Transcript: private</span>
          </div>
        </section>
      </AnimatedContent>

      {/* SECTION 6: Retake CTA */}
      <AnimatedContent direction="vertical" distance={20} delay={0.3}>
        <section className="rounded-[1.75rem] bg-gradient-to-br from-[#EEF1F8] to-[#FFFCF6] border border-[#1F2430]/[0.06] shadow-[0_4px_24px_rgba(30,35,60,0.03)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="min-w-0">
            <h3 className="font-[Manrope,sans-serif] text-[18px] font-extrabold text-[#1F2430] tracking-tight leading-tight">
              Want to strengthen this profile?
            </h3>
            <p className="text-[14px] text-[#1F2430]/70 font-medium mt-1 max-w-xl leading-relaxed">
              A follow-up interview can add evidence to dotted or low-confidence traits.
              {gapTraits.length > 0 && (
                <> Currently {gapTraits.length} trait{gapTraits.length === 1 ? "" : "s"} could use more signal.</>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast("Retake flow coming up")}
            className="min-h-[44px] px-5 rounded-xl bg-[#3E63F5] text-white text-[14px] font-bold hover:bg-[#2A44B0] transition-colors inline-flex items-center justify-center gap-2 shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Schedule a retake
          </button>
        </section>
      </AnimatedContent>

      </div>
    </div>
  );
}

export default ProfileScreen;
