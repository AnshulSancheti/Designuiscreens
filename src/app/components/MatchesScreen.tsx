import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, Building2, Bookmark, BookmarkCheck, TrendingUp, Clock, 
  ChevronRight, Zap, ShieldCheck, Target, ArrowRight, Share, Bell, 
  Sparkles, CheckCircle2, FileText, Send, Search
} from "lucide-react";
import { AnimatedContent } from "./ui/AnimatedContent";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type MatchLevel = "Strong Match" | "Good Match" | "Possible Match";
type ActionType = "apply" | "express_interest";

interface Match {
  id: number;
  company: string;
  logo: string;
  role: string;
  location: string;
  matchLevel: MatchLevel;
  salary: string;
  tags: string[];
  matchedAt: string;
  saved: boolean;
  matchReason: string;
  verifiedSkill: string;
  actionType: ActionType;
}

const matches: Match[] = [
  {
    id: 1,
    company: "Stripe",
    logo: "https://logo.clearbit.com/stripe.com",
    role: "Senior Frontend Engineer",
    location: "San Francisco, CA · Remote",
    matchLevel: "Strong Match",
    salary: "$180k – $240k",
    tags: ["React", "TypeScript", "Design Systems"],
    matchedAt: "2 hours ago",
    saved: false,
    matchReason: "Stripe is looking for rigorous UI component architecture. Your deep expertise in React state management and design systems is an exact fit for their core checkout team.",
    verifiedSkill: "React Architecture",
    actionType: "apply"
  },
  {
    id: 2,
    company: "Vercel",
    logo: "https://logo.clearbit.com/vercel.com",
    role: "Staff Engineer, DX",
    location: "Remote",
    matchLevel: "Strong Match",
    salary: "$200k – $260k",
    tags: ["Next.js", "Performance", "Open Source"],
    matchedAt: "5 hours ago",
    saved: true,
    matchReason: "Your strong performance profiling skills and Next.js background perfectly align with Vercel's mission to improve developer experience metrics.",
    verifiedSkill: "Web Performance",
    actionType: "apply"
  },
  {
    id: 3,
    company: "Linear",
    logo: "https://logo.clearbit.com/linear.app",
    role: "Product Engineer",
    location: "Remote",
    matchLevel: "Good Match",
    salary: "$160k – $210k",
    tags: ["React", "WebGL", "Animation"],
    matchedAt: "1 day ago",
    saved: false,
    matchReason: "Linear values high-craft product engineering. While your WebGL is foundational, your proven track record of shipping polished React features makes you a highly viable candidate.",
    verifiedSkill: "UI Polishing",
    actionType: "express_interest"
  },
  {
    id: 4,
    company: "Figma",
    logo: "https://logo.clearbit.com/figma.com",
    role: "Senior Product Engineer",
    location: "San Francisco, CA · Hybrid",
    matchLevel: "Possible Match",
    salary: "$190k – $250k",
    tags: ["Canvas", "WebAssembly", "TypeScript"],
    matchedAt: "1 day ago",
    saved: false,
    matchReason: "Figma needs deep TypeScript and Canvas knowledge. Your TypeScript is elite, though you may need to ramp up on specific Canvas APIs for this particular team.",
    verifiedSkill: "Advanced TypeScript",
    actionType: "express_interest"
  }
];

function MatchBadge({ level }: { level: MatchLevel }) {
  const getStyles = () => {
    switch (level) {
      case "Strong Match": return { bg: "bg-[#10B981]/10", border: "border-[#10B981]/20", text: "text-[#10B981]", icon: <Zap className="w-3.5 h-3.5" /> };
      case "Good Match": return { bg: "bg-[#3E63F5]/10", border: "border-[#3E63F5]/20", text: "text-[#3E63F5]", icon: <Target className="w-3.5 h-3.5" /> };
      case "Possible Match": return { bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/20", text: "text-[#F59E0B]", icon: <Sparkles className="w-3.5 h-3.5" /> };
    }
  };
  const s = getStyles();
  
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[12px] tracking-wide border ${s.bg} ${s.border} ${s.text} backdrop-blur-sm`}>
      {s.icon}
      {level}
    </div>
  );
}

function ZeroMatchState() {
  return (
    <AnimatedContent direction="vertical" distance={20} delay={0.1}>
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        
        {/* Main Status Area */}
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 flex-1 border-white/80 shadow-[0_16px_40px_rgba(30,35,60,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#3E63F5]/10 to-transparent pointer-events-none rounded-tr-[2.5rem]" />
          
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#1F2430]/10 flex items-center justify-center mb-6 relative">
            <Search className="w-8 h-8 text-[#1F2430]/30" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center border-2 border-white text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          
          <h2 className="font-[Manrope,sans-serif] text-3xl font-extrabold text-[#1F2430] tracking-tight mb-4">
            Curating your tailored matches
          </h2>
          <p className="text-[16px] text-[#1F2430]/70 font-medium max-w-xl leading-relaxed mb-8">
            We are actively scanning for roles that align perfectly with your verified profile. We maintain a high bar for matches to ensure you only see opportunities where you have a strong competitive advantage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-white/50 border border-white/60">
              <h4 className="text-[13px] font-bold text-[#1F2430]/50 uppercase tracking-wider mb-3">Your Strongest Signals</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-[#3E63F5]/10 text-[#3E63F5] text-[13px] font-bold">React Architecture</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981] text-[13px] font-bold">Performance</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] text-[13px] font-bold">System Design</span>
              </div>
            </div>
            
            <div className="p-5 rounded-2xl bg-white/50 border border-white/60">
              <h4 className="text-[13px] font-bold text-[#1F2430]/50 uppercase tracking-wider mb-3">Target Role Paths</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#1F2430]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Frontend Infrastructure
                </div>
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#1F2430]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Senior Product Engineer
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="px-6 py-3.5 rounded-xl bg-[#1F2430] text-white text-[15px] font-bold shadow-md hover:bg-[#2A3040] transition-colors flex items-center justify-center gap-2">
              <Bell className="w-4 h-4" /> Notify me of new matches
            </button>
            <button className="px-6 py-3.5 rounded-xl bg-white/60 text-[#1F2430] text-[15px] font-bold shadow-sm border border-white hover:bg-white transition-colors flex items-center justify-center gap-2">
              Review Preferences
            </button>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="flex flex-col gap-4 lg:w-[320px] shrink-0">
          <div className="glass-card rounded-[2rem] p-6 border-white/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#3E63F5]/10 text-[#3E63F5] flex items-center justify-center mb-4">
              <Share className="w-6 h-6" />
            </div>
            <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-2">Share Profile Directly</h3>
            <p className="text-[13px] text-[#1F2430]/60 font-medium mb-6">
              Don't wait for matches. Use your verified profile to bypass initial technical screens at any company.
            </p>
            <button className="w-full py-3 rounded-xl bg-white text-[#1F2430] text-[13px] font-bold shadow-sm border border-[#1F2430]/[0.06] hover:bg-[#F3F2F0] transition-colors flex items-center justify-center gap-2">
              <Share className="w-4 h-4" /> Copy Profile Link
            </button>
          </div>

          <div className="glass-card rounded-[2rem] p-6 border-white/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-2">Unlock More Roles</h3>
            <p className="text-[13px] text-[#1F2430]/60 font-medium mb-6">
              Companies are looking for full-stack capabilities. Complete a Backend micro-interview to expand your reach.
            </p>
            <button className="w-full py-3 rounded-xl bg-white text-[#1F2430] text-[13px] font-bold shadow-sm border border-[#1F2430]/[0.06] hover:bg-[#F3F2F0] transition-colors flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Add Backend Skill
            </button>
          </div>
        </div>

      </div>
    </AnimatedContent>
  );
}

export function MatchesScreen() {
  // Toggle this to preview the zero-match state
  const [showZeroState, setShowZeroState] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<number>>(
    new Set(matches.filter((m) => m.saved).map((m) => m.id))
  );

  const toggleSave = (id: number) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <AnimatedContent direction="vertical" distance={20} delay={0}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3E63F5] to-[#2A44B0] flex items-center justify-center shadow-[0_4px_16px_rgba(62,99,245,0.3)]">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-[Manrope,sans-serif] text-[1.75rem] font-extrabold text-[#1F2430] leading-none">
                Curated Matches
              </h2>
            </div>
            <p className="text-[14px] text-[#1F2430]/55 font-medium ml-[52px]">
              High-signal role alignments based on your verified technical profile.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 ml-[52px] md:ml-0">
            <button 
              onClick={() => setShowZeroState(!showZeroState)}
              className="px-3 py-2 rounded-xl bg-white/40 hover:bg-white border border-[#1F2430]/10 text-[12px] font-bold text-[#1F2430]/50 transition-colors"
            >
              Toggle Zero State
            </button>
            <div className="px-4 py-2 glass-card rounded-xl flex items-center gap-2 text-[13px] font-bold text-[#1F2430]/70">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              {matches.length} curated this week
            </div>
          </div>
        </div>
      </AnimatedContent>

      <AnimatePresence mode="wait">
        {showZeroState ? (
          <motion.div
            key="zero-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ZeroMatchState />
          </motion.div>
        ) : (
          <motion.div
            key="matches-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {matches.map((match, i) => (
              <AnimatedContent key={match.id} direction="vertical" distance={30} delay={0.05 * i}>
                <motion.div
                  className="glass-card rounded-[2rem] p-6 md:p-8 flex flex-col lg:flex-row gap-8 group relative overflow-hidden border border-white/80 transition-all hover:border-[#3E63F5]/20 hover:shadow-[0_24px_48px_rgba(62,99,245,0.05)]"
                >
                  {/* Subtle Background Accent */}
                  <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/60 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Left Column: Role Details */}
                  <div className="lg:w-[45%] flex flex-col relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-[#1F2430]/5 shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover:shadow-md transition-shadow">
                        <ImageWithFallback src={match.logo} alt={match.company} className="w-10 h-10 object-contain" />
                      </div>
                      <div>
                        <MatchBadge level={match.matchLevel} />
                        <h3 className="font-[Manrope,sans-serif] text-[22px] font-bold text-[#1F2430] leading-tight mt-2 mb-1">
                          {match.role}
                        </h3>
                        <div className="flex items-center gap-2 text-[15px] font-bold text-[#1F2430]/70">
                          <Building2 className="w-4 h-4" /> {match.company}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#1F2430]/60 font-medium mb-6">
                      <span className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-md border border-white">
                        <MapPin className="w-3.5 h-3.5" /> {match.location}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-md border border-white">
                        <Clock className="w-3.5 h-3.5" /> {match.matchedAt}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {match.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-lg bg-[#1F2430]/5 text-[#1F2430]/70 text-[12px] font-bold tracking-wide border border-[#1F2430]/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-[#1F2430]/10 to-transparent" />
                  <div className="block lg:hidden h-px w-full bg-gradient-to-r from-transparent via-[#1F2430]/10 to-transparent" />

                  {/* Right Column: Match Reasoning & Actions */}
                  <div className="lg:w-[55%] flex flex-col justify-center relative z-10 pt-4 lg:pt-0">
                    
                    {/* The "Why" Box */}
                    <div className="mb-6 p-5 rounded-2xl bg-[#F8F9FC]/80 border border-white/60 relative">
                      <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-white border border-[#1F2430]/10 text-[11px] font-bold text-[#3E63F5] flex items-center gap-1.5 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Skill: {match.verifiedSkill}
                      </div>
                      <p className="text-[14px] text-[#1F2430]/80 font-medium leading-relaxed mt-2 text-pretty">
                        {match.matchReason}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-auto">
                      {match.actionType === "apply" ? (
                        <button className="flex-1 min-w-[180px] py-3.5 rounded-xl bg-[#3E63F5] text-white text-[14px] font-bold shadow-[0_4px_16px_rgba(62,99,245,0.25)] hover:bg-[#2A44B0] transition-all flex items-center justify-center gap-2 group/btn">
                          <Send className="w-4 h-4" /> Apply with Profile
                        </button>
                      ) : (
                        <button className="flex-1 min-w-[180px] py-3.5 rounded-xl bg-white text-[#1F2430] border border-[#1F2430]/10 text-[14px] font-bold shadow-sm hover:border-[#1F2430]/30 hover:bg-[#F8F9FC] transition-all flex items-center justify-center gap-2 group/btn">
                          <Zap className="w-4 h-4 text-[#F59E0B]" /> Express Interest
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSave(match.id); }}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                          savedIds.has(match.id) 
                            ? 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]' 
                            : 'bg-white/60 border-white/80 text-[#1F2430]/50 hover:text-[#1F2430]'
                        }`}
                      >
                        {savedIds.has(match.id) ? (
                          <BookmarkCheck className="w-5 h-5" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                </motion.div>
              </AnimatedContent>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}