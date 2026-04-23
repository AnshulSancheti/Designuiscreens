import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Filter, Briefcase, Bookmark, UserPlus, ShieldCheck, 
  ChevronRight, Lock, MapPin, Zap, CheckCircle2, TrendingUp, X
} from "lucide-react";
import { AnimatedContent } from "./ui/AnimatedContent";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DotGrid } from "./ui/DotGrid";
import { Orb } from "./ui/Orb";

const candidates = [
  {
    id: 1,
    roleFit: 96,
    role: "Senior Frontend Engineer",
    traits: ["System Architecture", "Performance Optimization", "Mentorship"],
    skills: ["React", "TypeScript", "State Management", "WebGL"],
    freshness: "Interviewed 2 days ago",
    location: "Remote (US)",
    experience: "8 years",
    availability: "2 weeks",
    status: "new",
  },
  {
    id: 2,
    roleFit: 92,
    role: "Frontend Engineer",
    traits: ["Product Sense", "Animation", "UI Polish"],
    skills: ["React", "Framer Motion", "CSS Architecture"],
    freshness: "Interviewed 1 week ago",
    location: "San Francisco, CA",
    experience: "4 years",
    availability: "Immediate",
    status: "new",
  },
  {
    id: 3,
    roleFit: 89,
    role: "Staff Frontend Engineer",
    traits: ["Technical Strategy", "Design Systems", "Cross-team Comm"],
    skills: ["TypeScript", "React", "Node.js", "Accessibility"],
    freshness: "Interviewed 3 days ago",
    location: "Remote (Global)",
    experience: "10+ years",
    availability: "4 weeks",
    status: "saved",
  },
  {
    id: 4,
    roleFit: 85,
    role: "Frontend Developer",
    traits: ["Fast Learner", "Execution Speed", "Testing"],
    skills: ["React", "Next.js", "Tailwind CSS"],
    freshness: "Interviewed 12 hours ago",
    location: "New York, NY",
    experience: "2 years",
    availability: "Immediate",
    status: "new",
  },
];

const jobs = [
  { id: 1, title: "Senior Frontend Engineer", department: "Engineering", active: true },
  { id: 2, title: "Staff Frontend Engineer", department: "Core UI", active: false },
  { id: 3, title: "Product Designer", department: "Design", active: false },
];

export function EmployerDashboard() {
  const [activeJobId, setActiveJobId] = useState(1);
  const [savedCandidates, setSavedCandidates] = useState<number[]>([3]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (id: number) => {
    setSavedCandidates(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F7F5] relative overflow-hidden font-[Inter,sans-serif] selection:bg-[#10B981] selection:text-white">
      {/* Background & Textures */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 12px 40px rgba(30, 35, 60, 0.04);
        }
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      {/* Corporate/Restrained ambient orbs */}
      <Orb color="#10B981" size={500} opacity={0.06} blur={130} className="top-[-10%] left-[-5%]" duration={25} />
      <Orb color="#3E63F5" size={400} opacity={0.04} blur={120} className="bottom-[10%] right-[-5%]" duration={20} />

      <DotGrid opacity={0.06} size={1} spacing={28} />
      <div className="noise-overlay" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full border-b border-[#1F2430]/5 bg-white/60 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-white font-bold font-[Manrope,sans-serif] shadow-sm">P</div>
            <span className="font-[Manrope,sans-serif] text-[16px] font-bold text-[#1F2430] tracking-tight">PlacedOn</span>
            <span className="px-2 py-0.5 rounded-md bg-[#1F2430]/5 text-[#1F2430]/60 text-[11px] font-bold uppercase tracking-wider ml-2">Employer</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 mr-4 text-[13px] font-semibold text-[#1F2430]/60">
              <span className="hover:text-[#1F2430] cursor-pointer transition-colors text-[#1F2430]">Discovery</span>
              <span className="hover:text-[#1F2430] cursor-pointer transition-colors">Interviews</span>
              <span className="hover:text-[#1F2430] cursor-pointer transition-colors">Settings</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1F2430] to-[#3E63F5] p-[1.5px] cursor-pointer">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-[#E2E8F0]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        
        {/* Page Header */}
        <AnimatedContent direction="vertical" distance={20} delay={0}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="font-[Manrope,sans-serif] text-2xl md:text-3xl font-extrabold text-[#1F2430] mb-2 leading-tight">
                Evidence-backed candidate discovery
              </h1>
              <p className="text-[14px] text-[#1F2430]/60 font-medium">
                Find candidates based on verified interview performance, not resume claims.
              </p>
            </div>
            
            {/* Metrics */}
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {[
                { label: "Open Jobs", value: "3", icon: <Briefcase className="w-4 h-4" /> },
                { label: "Saved Profiles", value: savedCandidates.length.toString(), icon: <Bookmark className="w-4 h-4" /> },
                { label: "Intro Requests", value: "12", icon: <UserPlus className="w-4 h-4" /> },
              ].map((metric, i) => (
                <div key={i} className="glass-card rounded-xl px-4 py-3 min-w-[130px] shrink-0 border border-white flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-[#1F2430]/50 mb-2">
                    {metric.icon}
                    <span className="text-[11px] font-bold uppercase tracking-wider">{metric.label}</span>
                  </div>
                  <span className="font-[Manrope,sans-serif] text-xl font-bold text-[#1F2430]">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_300px] gap-6 xl:gap-8 items-start">
          
          {/* Left Sidebar: Job Selection */}
          <AnimatedContent direction="horizontal" distance={-20} delay={0.1} className="hidden lg:block sticky top-24">
            <div className="mb-4">
              <h3 className="text-[12px] font-bold text-[#1F2430]/50 uppercase tracking-wider mb-3 px-1">Active Roles</h3>
              <div className="space-y-1.5">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setActiveJobId(job.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                      activeJobId === job.id 
                        ? "bg-white shadow-sm border border-white/80" 
                        : "hover:bg-white/40 text-[#1F2430]/60 hover:text-[#1F2430]"
                    }`}
                  >
                    <div className="font-semibold text-[13px] truncate mb-0.5" style={{ color: activeJobId === job.id ? "#1F2430" : "inherit" }}>
                      {job.title}
                    </div>
                    <div className="text-[11px] font-medium opacity-60 flex items-center justify-between">
                      {job.department}
                      {activeJobId === job.id && <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />}
                    </div>
                  </button>
                ))}
              </div>
              <button className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[#1F2430]/20 text-[13px] font-bold text-[#1F2430]/50 hover:bg-[#1F2430]/5 hover:text-[#1F2430] transition-colors">
                <Briefcase className="w-3.5 h-3.5" /> Add New Role
              </button>
            </div>
          </AnimatedContent>

          {/* Middle: Feed & Filters */}
          <div className="flex flex-col gap-5 min-w-0">
            
            {/* Filter Bar */}
            <AnimatedContent direction="vertical" distance={20} delay={0.15}>
              <div className="glass-card rounded-[1.25rem] p-2 flex flex-col md:flex-row items-center gap-2 shadow-sm border border-white sticky top-24 z-30">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1F2430]/40" />
                  <input 
                    type="text" 
                    placeholder="Search traits, skills, or locations..." 
                    className="w-full bg-white/50 border border-transparent focus:border-white/80 focus:bg-white focus:ring-2 focus:ring-[#10B981]/20 rounded-xl py-2 pl-10 pr-4 text-[13px] font-medium outline-none transition-all placeholder:text-[#1F2430]/40 text-[#1F2430]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar px-1">
                  <button className="px-3 py-2 rounded-lg bg-white/60 border border-white/80 text-[12px] font-bold text-[#1F2430]/70 hover:bg-white transition-colors whitespace-nowrap flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Match &gt; 90%
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-white/60 border border-white/80 text-[12px] font-bold text-[#1F2430]/70 hover:bg-white transition-colors whitespace-nowrap">
                    Remote Only
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-[#1F2430]/5 text-[12px] font-bold text-[#1F2430]/60 hover:bg-[#1F2430]/10 transition-colors whitespace-nowrap flex items-center gap-1.5 ml-auto">
                    <Filter className="w-3.5 h-3.5" /> All Filters
                  </button>
                </div>
              </div>
            </AnimatedContent>

            {/* Candidate Feed */}
            <div className="space-y-4 pb-20">
              {candidates.map((candidate, i) => (
                <AnimatedContent key={candidate.id} direction="vertical" distance={20} delay={0.2 + (i * 0.05)}>
                  <motion.div 
                    className="glass-card rounded-[1.5rem] p-5 md:p-6 border border-white relative overflow-hidden group hover:shadow-[0_16px_48px_rgba(30,35,60,0.06)] transition-all"
                  >
                    {/* Top Row: Anonymous ID & Match Score */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1F2430] to-[#4A5568] flex items-center justify-center p-[2px] shadow-sm">
                          <div className="w-full h-full rounded-full bg-[#1F2430] border-2 border-white flex items-center justify-center">
                            <Lock className="w-4 h-4 text-white/50" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-[Manrope,sans-serif] font-bold text-[#1F2430] text-[15px]">Candidate #{String(candidate.id).padStart(4, '0')}</h3>
                            {candidate.status === 'new' && (
                              <span className="w-2 h-2 rounded-full bg-[#3E63F5] shadow-[0_0_8px_rgba(62,99,245,0.6)]" />
                            )}
                          </div>
                          <p className="text-[12px] text-[#1F2430]/50 font-medium flex items-center gap-1.5 mt-0.5">
                            <TrendingUp className="w-3 h-3" /> {candidate.freshness}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                          <Zap className="w-4 h-4 text-[#10B981]" />
                          <span className="font-bold text-[14px] text-[#10B981]">{candidate.roleFit}% Fit</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#1F2430]/40 uppercase tracking-wider mt-1.5 mr-1">For {candidate.role}</span>
                      </div>
                    </div>

                    {/* Middle Row: Traits & Skills */}
                    <div className="bg-white/50 rounded-2xl p-4 border border-white/60 mb-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] font-bold text-[#1F2430]/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Verified Traits
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {candidate.traits.map(trait => (
                              <span key={trait} className="px-2 py-1 rounded-md bg-white border border-[#1F2430]/5 text-[12px] font-bold text-[#1F2430]/80 shadow-sm">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#1F2430]/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#3E63F5]" /> Technical Skills
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {candidate.skills.map(skill => (
                              <span key={skill} className="px-2 py-1 rounded-md bg-[#3E63F5]/5 border border-[#3E63F5]/10 text-[12px] font-bold text-[#3E63F5]">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Metadata & Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 text-[12px] font-medium text-[#1F2430]/60 w-full sm:w-auto">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {candidate.location}</span>
                        <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {candidate.experience}</span>
                        <span className="flex items-center gap-1.5">Available in {candidate.availability}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/60 border border-white text-[#1F2430]/60 text-[13px] font-bold hover:bg-white hover:text-[#1F2430] transition-colors shadow-sm">
                          Pass
                        </button>
                        <button 
                          onClick={() => handleSave(candidate.id)}
                          className={`flex-none w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
                            savedCandidates.includes(candidate.id)
                              ? "bg-[#1F2430] border-[#1F2430] text-white"
                              : "bg-white border-white/80 text-[#1F2430]/50 hover:text-[#1F2430]"
                          }`}
                        >
                          <Bookmark className="w-4.5 h-4.5" fill={savedCandidates.includes(candidate.id) ? "currentColor" : "none"} />
                        </button>
                        <button className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#10B981] text-white text-[13px] font-bold shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.4)] transition-shadow flex items-center justify-center gap-1.5">
                          Request Intro
                        </button>
                      </div>
                    </div>

                  </motion.div>
                </AnimatedContent>
              ))}
            </div>

          </div>

          {/* Right Sidebar: Trust/Privacy & Shortlist */}
          <div className="hidden xl:flex flex-col gap-6 sticky top-24">
            
            <AnimatedContent direction="horizontal" distance={20} delay={0.2}>
              <div className="glass-card rounded-[1.5rem] p-5 border border-white shadow-[0_16px_40px_rgba(30,35,60,0.03)] bg-gradient-to-b from-white/60 to-white/30">
                <div className="w-10 h-10 rounded-xl bg-[#1F2430] text-white flex items-center justify-center mb-4 shadow-md">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-[Manrope,sans-serif] text-[15px] font-bold text-[#1F2430] mb-2">Evidence First, Bias Last</h3>
                <p className="text-[13px] text-[#1F2430]/60 font-medium leading-relaxed mb-4">
                  Candidates remain completely anonymous. You evaluate verified skills, match scores, and interview performance before seeing demographic data.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1F2430]/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Processed profile, no raw transcript
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1F2430]/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Identity hidden until candidate approval
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1F2430]/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Two-way opt-in for intro requests
                  </div>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent direction="horizontal" distance={20} delay={0.3}>
              <div className="glass-card rounded-[1.5rem] p-5 border border-white shadow-[0_8px_32px_rgba(30,35,60,0.03)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-[Manrope,sans-serif] text-[14px] font-bold text-[#1F2430]">Saved Shortlist</h3>
                  <span className="w-6 h-6 rounded-full bg-[#1F2430]/10 flex items-center justify-center text-[11px] font-bold text-[#1F2430]">{savedCandidates.length}</span>
                </div>
                
                {savedCandidates.length === 0 ? (
                  <div className="text-center py-6 text-[13px] font-medium text-[#1F2430]/40 border border-dashed border-[#1F2430]/10 rounded-xl bg-white/30">
                    No candidates saved yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedCandidates.map(id => (
                      <div key={id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 border border-white shadow-sm group">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1F2430] flex items-center justify-center">
                            <Lock className="w-3 h-3 text-white/50" />
                          </div>
                          <div>
                            <div className="text-[12px] font-bold text-[#1F2430]">Candidate #{String(id).padStart(4, '0')}</div>
                            <div className="text-[10px] font-semibold text-[#10B981]">90%+ Fit</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSave(id)}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[#1F2430]/30 hover:bg-[#1F2430]/10 hover:text-[#1F2430] transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {savedCandidates.length > 0 && (
                  <button className="w-full mt-4 py-2.5 rounded-xl bg-[#1F2430] text-white text-[12px] font-bold shadow-sm hover:shadow-md transition-shadow">
                    Review Shortlist
                  </button>
                )}
              </div>
            </AnimatedContent>

          </div>
        </div>

      </div>
    </div>
  );
}
