import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Sparkles, ChevronRight, Briefcase, Zap, Shield, ArrowRight, Play, 
  Search, Code2, LayoutTemplate, Database, LineChart, ShieldCheck,
  BrainCircuit, Lock, Link2, Copy, BarChart3, TrendingUp, Clock, Eye, Send, FileText
} from 'lucide-react';
import { AnimatedContent } from './ui/AnimatedContent';
import { BlurText } from './ui/BlurText';
import { motion } from 'motion/react';
import { NextBestActionCard, NextActionState } from './NextBestActionCard';

export function UserDashboard() {
  const navigate = useNavigate();
  // We can toggle this state to preview the different card states in the shell
  const [actionState, setActionState] = useState<NextActionState>('review_profile');

  return (
    <div className="flex flex-col gap-6 animate-[pulse-glow_0.5s_ease-out]">
      
      {/* Top Header / Stage Aware Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 z-20 relative">
        <div>
          <h1 className="font-[Manrope,sans-serif] text-[28px] font-bold text-[#1F2430] tracking-tight">
            <BlurText 
              text="Welcome back, Alex"
              delay={0.03}
              animateBy="words"
              direction="bottom"
            />
          </h1>
          <p className="text-[15px] font-medium text-[#1F2430]/60 mt-1">
            Your profile is currently <strong className="text-[#1F2430]">Private</strong>. Complete your review to get matched.
          </p>
        </div>
        
        {/* Subtle Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative group/search">
            <Search className="w-4 h-4 text-[#1F2430]/40 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within/search:text-[#3E63F5] transition-colors" />
            <input 
              type="text"
              placeholder="Search companies, roles..."
              className="w-full md:w-64 bg-white/60 backdrop-blur-md border border-[#1F2430]/10 rounded-xl py-2 pl-9 pr-4 text-[13px] font-medium text-[#1F2430] placeholder:text-[#1F2430]/40 focus:outline-none focus:ring-2 focus:ring-[#3E63F5]/20 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* 1. Next Best Action */}
      <AnimatedContent direction="vertical" distance={20} delay={0.1}>
        <NextBestActionCard state={actionState} />
      </AnimatedContent>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Profile Snapshot */}
        <AnimatedContent direction="vertical" distance={20} delay={0.15} className="lg:col-span-2 flex flex-col">
          <div className="h-full rounded-[2.5rem] glass-card p-6 md:p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#3E63F5]/10 to-transparent pointer-events-none rounded-tr-[2.5rem]" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" /> Profile Snapshot
              </h3>
              <button onClick={() => navigate('/candidate/profile')} className="text-[13px] font-bold text-[#3E63F5] hover:text-[#2A44B0] transition-colors flex items-center gap-1">
                View Full <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#EEF1F8] to-[#EAEAFE] flex items-center justify-center shrink-0 border border-[#3E63F5]/10 shadow-inner text-[#3E63F5] text-2xl font-bold tracking-tighter">
                AC
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-[#1F2430] mb-1">Alex Chen</h4>
                <p className="text-[14px] font-medium text-[#1F2430]/70 mb-3">Frontend Engineer • 3 YOE • New York / Remote</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] text-[11px] font-bold tracking-wide">High Confidence Fit</span>
                  <span className="px-2 py-1 rounded-md bg-[#1F2430]/5 text-[#1F2430]/70 text-[11px] font-bold tracking-wide border border-[#1F2430]/10">React</span>
                  <span className="px-2 py-1 rounded-md bg-[#1F2430]/5 text-[#1F2430]/70 text-[11px] font-bold tracking-wide border border-[#1F2430]/10">System Design</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#1F2430]/[0.04] mt-auto">
              <p className="text-[13px] text-[#1F2430]/70 font-medium italic leading-relaxed">
                "Alex is a frontend-focused engineer who explains technical decisions clearly and approaches UI problems with structure. Shows strong thinking around component reuse and state management."
              </p>
            </div>
          </div>
        </AnimatedContent>

        {/* 3. Share Profile */}
        <AnimatedContent direction="vertical" distance={20} delay={0.2} className="flex flex-col">
          <div className="h-full rounded-[2.5rem] glass-card p-6 md:p-8 flex flex-col border-[#3E63F5]/20 bg-gradient-to-b from-white/60 to-[#F8F9FC]/80 shadow-[0_8px_32px_rgba(62,99,245,0.05)]">
            <div className="w-12 h-12 rounded-xl bg-[#3E63F5]/10 border border-[#3E63F5]/20 flex items-center justify-center text-[#3E63F5] mb-4">
              <Link2 className="w-6 h-6" />
            </div>
            <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430] mb-2">Share Profile</h3>
            <p className="text-[14px] text-[#1F2430]/60 font-medium mb-6 flex-1">
              Send your verified profile directly to recruiters to bypass initial technical screens.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#1F2430]/10 shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white to-transparent" />
                <span className="text-[13px] font-medium text-[#1F2430]/60 truncate select-all pl-1">placedon.com/p/alex-chen-fe92k</span>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#F8F9FC] hover:bg-[#EEF1F8] flex items-center justify-center text-[#1F2430] transition-colors border border-[#1F2430]/10 shadow-sm opacity-0 group-hover:opacity-100">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <button className="w-full py-3 rounded-xl bg-white text-[#1F2430] text-[13px] font-bold shadow-sm border border-[#1F2430]/[0.06] hover:bg-[#F3F2F0] transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send via Email
              </button>
            </div>
          </div>
        </AnimatedContent>

        {/* 4. Matches */}
        <AnimatedContent direction="vertical" distance={20} delay={0.25} className="flex flex-col">
          <div className="h-full rounded-[2.5rem] glass-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3E63F5]" /> Matches
              </h3>
              <span className="w-6 h-6 rounded-full bg-[#3E63F5] text-white text-[12px] font-bold flex items-center justify-center">3</span>
            </div>
            
            <div className="space-y-3 flex-1">
              {[
                { company: 'Stripe', role: 'Frontend Engineer', match: '96%' },
                { company: 'Vercel', role: 'UI Engineer', match: '92%' },
                { company: 'Linear', role: 'Product Engineer', match: '88%' }
              ].map((m, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/50 border border-white/60 hover:bg-white transition-colors cursor-pointer group flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-[#1F2430]">{m.company}</div>
                    <div className="text-[12px] font-medium text-[#1F2430]/60">{m.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-[#10B981]">{m.match} fit</div>
                    <div className="text-[11px] font-bold text-[#3E63F5] opacity-0 group-hover:opacity-100 transition-opacity">View Pitch →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedContent>

        {/* 5. Pipeline */}
        <AnimatedContent direction="vertical" distance={20} delay={0.3} className="flex flex-col">
          <div className="h-full rounded-[2.5rem] glass-card p-6 flex flex-col">
            <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] flex items-center gap-2 mb-6">
              <Briefcase className="w-4 h-4 text-[#8B5CF6]" /> Pipeline
            </h3>
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#1F2430]/5">
                <span className="text-[13px] font-medium text-[#1F2430]/70 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Pending Response</span>
                <span className="text-[14px] font-bold text-[#1F2430]">2</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#1F2430]/5">
                <span className="text-[13px] font-medium text-[#1F2430]/70 flex items-center gap-2"><Code2 className="w-3.5 h-3.5" /> Follow-up Challenges</span>
                <span className="text-[14px] font-bold text-[#1F2430]">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-[#1F2430]/70 flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Offers Extended</span>
                <span className="text-[14px] font-bold text-[#10B981]">1</span>
              </div>
            </div>
            <button onClick={() => navigate('/candidate/applications')} className="mt-6 w-full py-2.5 rounded-xl bg-white/60 text-[#1F2430] text-[12px] font-bold shadow-sm border border-white hover:bg-white transition-colors">
              View All Applications
            </button>
          </div>
        </AnimatedContent>

        {/* 6. Activity & Growth (Combined or Split) */}
        <AnimatedContent direction="vertical" distance={20} delay={0.35} className="flex flex-col">
          <div className="h-full rounded-[2.5rem] glass-card p-6 flex flex-col relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#F59E0B]/10 rounded-full blur-[30px] pointer-events-none" />
            <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] flex items-center gap-2 mb-6">
              <TrendingUp className="w-4 h-4 text-[#F59E0B]" /> Growth Activity
            </h3>
            
            <div className="space-y-4 flex-1">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#1F2430]">Profile viewed by Stripe</div>
                  <div className="text-[11px] font-medium text-[#1F2430]/50">2 hours ago</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#3E63F5]/10 text-[#3E63F5] flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#1F2430]">+15% visibility increase</div>
                  <div className="text-[11px] font-medium text-[#1F2430]/50">This week</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#1F2430]">Retake eligibility unlocked</div>
                  <div className="text-[11px] font-medium text-[#1F2430]/50">Yesterday</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContent>

      </div>
    </div>
  );
}