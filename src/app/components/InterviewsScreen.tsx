import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, Clock, Video, FileText, CheckCircle2, XCircle, 
  PlayCircle, AlertCircle, ChevronRight, Check, ListChecks, 
  MoreHorizontal, BrainCircuit, Activity
} from "lucide-react";
import { AnimatedContent } from "./ui/AnimatedContent";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router";

export function InterviewsScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  return (
    <div className="flex flex-col gap-6 animate-[pulse-glow_0.5s_ease-out] pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-20">
        <div>
          <h2 className="font-[Manrope,sans-serif] text-[32px] font-extrabold text-[#1F2430] tracking-tight leading-tight">
            Interview Operations
          </h2>
          <p className="text-[15px] font-medium text-[#1F2430]/60 mt-1">
            Manage your schedule, preparation, and active sessions.
          </p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-white/50 border border-white/60 rounded-xl shadow-sm w-fit">
          {(['all', 'upcoming', 'past'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-[14px] font-bold capitalize transition-all ${
                filter === tab 
                  ? 'bg-white text-[#1F2430] shadow-sm' 
                  : 'text-[#1F2430]/50 hover:text-[#1F2430]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {(filter === 'all' || filter === 'upcoming') && (
        <>
          <AnimatedContent direction="vertical" distance={20} delay={0.1}>
            <h3 className="text-[14px] font-extrabold text-[#1F2430]/40 uppercase tracking-wider mb-4">Up Next</h3>
            
            {/* Urgent / Next Up Action Card */}
            <div className="glass-card rounded-[2rem] p-6 md:p-8 border border-[#10B981]/30 bg-gradient-to-br from-white via-white/80 to-[#10B981]/10 relative overflow-hidden shadow-[0_16px_48px_rgba(16,185,129,0.08)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#10B981]/20 to-transparent pointer-events-none rounded-bl-[4rem]" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-[#1F2430]/10 shadow-sm flex items-center justify-center overflow-hidden shrink-0 relative">
                    <div className="absolute inset-0 bg-[#10B981]/10 animate-pulse" />
                    <ImageWithFallback src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop" alt="Vercel" className="w-10 h-10 object-cover rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10B981]/10 border border-[#10B981]/20 text-[12px] font-extrabold text-[#10B981] uppercase tracking-wide">
                        <Activity className="w-3.5 h-3.5" /> Starting in 15 mins
                      </span>
                    </div>
                    <h4 className="font-[Manrope,sans-serif] text-[24px] font-bold text-[#1F2430] leading-tight">
                      System Design Deep Dive
                    </h4>
                    <p className="text-[15px] font-semibold text-[#1F2430]/60 mt-1">
                      Vercel • Staff Engineer, DX
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white text-[#1F2430] text-[15px] font-bold shadow-sm hover:bg-[#F8F9FC] transition-colors flex items-center justify-center gap-2 border border-[#1F2430]/10">
                    <ListChecks className="w-5 h-5" /> Prep Notes
                  </button>
                  <button 
                    onClick={() => navigate('/pre-interview')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#10B981] text-white text-[15px] font-bold shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:bg-[#059669] transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="w-5 h-5" /> Join Room
                  </button>
                </div>
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={20} delay={0.2}>
            <h3 className="text-[14px] font-extrabold text-[#1F2430]/40 uppercase tracking-wider mb-4 mt-8">Scheduled Queue</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Preparation State Card */}
              <div className="glass-card rounded-[1.5rem] p-6 border border-white/80 hover:shadow-[0_8px_24px_rgba(30,35,60,0.04)] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop" alt="Stripe" className="w-8 h-8 rounded-full border border-[#1F2430]/10" />
                    <div>
                      <h4 className="font-bold text-[#1F2430] text-[16px]">Stripe</h4>
                      <p className="text-[13px] font-medium text-[#1F2430]/60">Technical Screen</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-white/50 text-[#1F2430]/40 hover:text-[#1F2430]">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 border border-[#1F2430]/5 text-[12px] font-bold text-[#1F2430]/70">
                    <Calendar className="w-3.5 h-3.5 opacity-60" /> Tomorrow
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 border border-[#1F2430]/5 text-[12px] font-bold text-[#1F2430]/70">
                    <Clock className="w-3.5 h-3.5 opacity-60" /> 10:00 AM PST
                  </div>
                </div>

                <div className="bg-[#3E63F5]/5 border border-[#3E63F5]/10 rounded-xl p-4 flex items-start gap-3">
                  <BrainCircuit className="w-5 h-5 text-[#3E63F5] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[14px] font-bold text-[#1F2430]">Needs Preparation</h5>
                    <p className="text-[13px] text-[#1F2430]/70 font-medium mt-1">Review the API idempotency concepts before this session.</p>
                  </div>
                </div>
              </div>

              {/* Distant Scheduled Card */}
              <div className="glass-card rounded-[1.5rem] p-6 border border-white/80 hover:shadow-[0_8px_24px_rgba(30,35,60,0.04)] transition-all opacity-80 hover:opacity-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback src="https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=200&h=200&fit=crop" alt="OpenAI" className="w-8 h-8 rounded-full border border-[#1F2430]/10" />
                    <div>
                      <h4 className="font-bold text-[#1F2430] text-[16px]">OpenAI</h4>
                      <p className="text-[13px] font-medium text-[#1F2430]/60">Frontend Architecture</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-white/50 text-[#1F2430]/40 hover:text-[#1F2430]">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 border border-[#1F2430]/5 text-[12px] font-bold text-[#1F2430]/70">
                    <Calendar className="w-3.5 h-3.5 opacity-60" /> Apr 28, 2026
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 border border-[#1F2430]/5 text-[12px] font-bold text-[#1F2430]/70">
                    <Clock className="w-3.5 h-3.5 opacity-60" /> 1:30 PM PST
                  </div>
                </div>

                <div className="bg-[#1F2430]/5 border border-[#1F2430]/5 rounded-xl p-4 flex items-center justify-center gap-2 text-[#1F2430]/60 font-bold text-[14px]">
                  <CheckCircle2 className="w-4 h-4" /> Prep Checklist Complete
                </div>
              </div>
            </div>
          </AnimatedContent>
        </>
      )}

      {(filter === 'all' || filter === 'past') && (
        <AnimatedContent direction="vertical" distance={20} delay={0.3}>
          <h3 className="text-[14px] font-extrabold text-[#1F2430]/40 uppercase tracking-wider mb-4 mt-8">Completed & Cancelled</h3>
          
          <div className="space-y-3">
            {/* Completed Result Card */}
            <div className="glass-card rounded-[1rem] p-4 border border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-[#1F2430]/5">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F2430] text-[15px]">Linear - Initial Screen</h4>
                  <p className="text-[13px] font-medium text-[#1F2430]/50">Completed Apr 20 • Result Pending</p>
                </div>
              </div>
              <button className="text-[13px] font-bold text-[#3E63F5] bg-[#3E63F5]/10 px-4 py-2 rounded-lg hover:bg-[#3E63F5]/20 transition-colors self-start sm:self-auto">
                View Feedback
              </button>
            </div>

            {/* Cancelled Card */}
            <div className="glass-card rounded-[1rem] p-4 border border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-[#1F2430]/5">
                  <XCircle className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F2430] text-[15px] line-through">Discord - Culture Fit</h4>
                  <p className="text-[13px] font-medium text-[#1F2430]/50">Cancelled by Company • Role Filled</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContent>
      )}
    </div>
  );
}
