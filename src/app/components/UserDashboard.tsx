import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Bell, Settings, User, Sparkles, ChevronRight, 
  Clock, Briefcase, Zap, Star, Shield, ArrowUpRight, 
  MapPin, CheckCircle2, TrendingUp, Calendar, ArrowRight, Award
} from 'lucide-react';

export function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#F3F2F0] relative overflow-hidden font-[Inter,sans-serif] selection:bg-[#3E63F5] selection:text-white">
      {/* Global CSS for floating animations and noise */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 8s ease-in-out infinite; }
        
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.25;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      {/* Ambient Background Washes */}
      <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] bg-[#E3E8F8] rounded-full mix-blend-multiply blur-[120px] opacity-70" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#F4EBE3] rounded-full mix-blend-multiply blur-[120px] opacity-60" />
      <div className="absolute top-[20%] right-[15%] w-[40vw] h-[40vw] bg-[#E9E4F5] rounded-full mix-blend-multiply blur-[100px] opacity-50" />
      <div className="noise-overlay" />

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-8 md:px-12 md:py-12">
        
        {/* Navigation & Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#3E63F5] to-[#8C9EFF] p-[2px] shadow-[0_8px_24px_rgba(62,99,245,0.25)] transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&q=80" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#10B981] rounded-full border-[3px] border-[#F3F2F0] shadow-sm" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#1F2430]/50 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3E63F5]" />
                Good morning
              </p>
              <h1 className="font-[Manrope,sans-serif] text-[28px] font-bold text-[#1F2430] tracking-tight leading-none">
                Alex Chen
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-11 h-11 rounded-[1.25rem] bg-white/60 backdrop-blur-xl border border-white shadow-[0_4px_16px_rgba(30,35,60,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#1F2430]/60 hover:text-[#1F2430] hover:bg-white/80 transition-all hover:-translate-y-0.5">
              <Bell className="w-5 h-5" />
              {/* Notification dot */}
              <span className="absolute top-3 right-3 w-2 h-2 bg-[#D4183D] rounded-full shadow-[0_0_6px_rgba(212,24,61,0.5)]" />
            </button>
            <button className="w-11 h-11 rounded-[1.25rem] bg-white/60 backdrop-blur-xl border border-white shadow-[0_4px_16px_rgba(30,35,60,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#1F2430]/60 hover:text-[#1F2430] hover:bg-white/80 transition-all hover:-translate-y-0.5">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Top Bento Grid: High Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Card 1: Upcoming Interview (Hero Card) */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-[2.5rem] bg-white/40 backdrop-blur-3xl border border-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_12px_40px_rgba(30,35,60,0.03)] p-8 md:p-10 group flex flex-col md:flex-row gap-8 items-center justify-between">
            {/* Glowing Orb inside the glass */}
            <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-[#3E63F5] to-[#B392F0] rounded-full blur-[80px] opacity-40 animate-pulse-glow" />
            
            <div className="relative z-10 w-full md:w-[55%]">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="px-3 py-1.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Upcoming in 45m
                </div>
                <div className="px-3 py-1.5 rounded-full bg-white/60 text-[#1F2430]/60 text-[12px] font-bold uppercase tracking-wider border border-white shadow-sm">
                  Round 1
                </div>
              </div>
              
              <h2 className="font-[Manrope,sans-serif] text-3xl md:text-4xl font-bold text-[#1F2430] tracking-tight mb-4 leading-[1.1]">
                PlacedOn AI <br/>Interview
              </h2>
              <p className="text-[16px] text-[#1F2430]/70 font-medium mb-8 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Product Manager Role
              </p>
              
              <button 
                onClick={() => navigate('/pre-interview')}
                className="group/btn relative px-6 py-3.5 rounded-2xl bg-[#1F2430] text-white font-semibold text-[15px] shadow-[0_8px_20px_rgba(30,35,60,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-[#2A3040] hover:-translate-y-0.5 transition-all overflow-hidden flex items-center gap-2 w-fit"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
                Enter waiting room
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 3D Abstract Graphic Component */}
            <div className="relative z-10 w-full md:w-[45%] h-[240px] flex items-center justify-center shrink-0 perspective-[1000px]">
              {/* Floating Base Card */}
              <div className="relative w-[220px] h-[260px] rounded-[2rem] bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_20px_40px_rgba(62,99,245,0.1),inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col items-center justify-center animate-float-slow rotate-y-[-10deg] rotate-x-[5deg] transform-style-3d">
                
                {/* Floating Waveforms (AI representation) */}
                <div className="flex items-center justify-center gap-1.5 mb-6 translate-z-[40px]">
                  {[40, 24, 56, 32, 64, 24, 40].map((h, i) => (
                    <div key={i} className="w-2.5 rounded-full bg-gradient-to-t from-[#3E63F5] to-[#8C9EFF] shadow-[0_4px_12px_rgba(62,99,245,0.3)] transition-all duration-700 ease-in-out" style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <div className="w-12 h-12 rounded-full bg-[#EEF1F8] text-[#3E63F5] flex items-center justify-center shadow-inner translate-z-[30px]">
                  <Sparkles className="w-6 h-6" />
                </div>
                
                {/* Floating badges breaking the bounds */}
                <div className="absolute -right-6 top-8 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-white shadow-[0_8px_24px_rgba(30,35,60,0.06)] text-[13px] font-bold text-[#1F2430] flex items-center gap-1.5 animate-float-fast translate-z-[60px]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Ready
                </div>
                <div className="absolute -left-8 bottom-12 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-white shadow-[0_8px_24px_rgba(30,35,60,0.06)] text-[13px] font-bold text-[#1F2430] flex items-center gap-1.5 animate-float-fast translate-z-[50px]" style={{animationDelay: '1s'}}>
                  <Zap className="w-4 h-4 text-[#F59E0B]" /> AI Agent
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Latest Offer (Celebratory) */}
          <div className="lg:col-span-4 relative overflow-hidden rounded-[2.5rem] bg-white/40 backdrop-blur-3xl border border-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_12px_40px_rgba(30,35,60,0.03)] p-8 flex flex-col justify-between group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
            {/* Glowing Gold Orb */}
            <div className="absolute -top-10 -right-10 w-[200px] h-[200px] bg-gradient-to-bl from-[#FBBF24] to-[#FCD34D] rounded-full blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1F2430] to-[#3A4052] flex items-center justify-center text-white mb-6 shadow-[0_8px_16px_rgba(30,35,60,0.2)]">
                <Star className="w-5 h-5 fill-[#FBBF24] text-[#FBBF24]" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[13px] font-bold text-[#F59E0B] tracking-wide uppercase">New Offer</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F2430]/20" />
                <span className="text-[13px] font-medium text-[#1F2430]/50">2h ago</span>
              </div>
              <h3 className="font-[Manrope,sans-serif] text-2xl font-bold text-[#1F2430] mb-1">Stripe</h3>
              <p className="text-[15px] font-medium text-[#1F2430]/70 mb-4">Product Design Intern</p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981] text-[13px] font-bold border border-[#10B981]/20">
                <TrendingUp className="w-3.5 h-3.5" /> Top 5% package
              </div>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between pt-5 border-t border-[#1F2430]/[0.06]">
              <span className="text-[15px] font-bold text-[#1F2430]">Review Details</span>
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1F2430] group-hover:bg-[#1F2430] group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Pipeline & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Applications List */}
          <div className="lg:col-span-2 rounded-[2.5rem] bg-white/40 backdrop-blur-3xl border border-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_8px_32px_rgba(30,35,60,0.02)] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430]">Active Applications</h3>
              <button className="text-[14px] font-semibold text-[#3E63F5] hover:text-[#2A44B0] flex items-center gap-1 transition-colors">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { company: "Notion", role: "Frontend Engineer", status: "Technical Round", date: "Next: Thu, 10 AM", icon: "N", color: "bg-black text-white" },
                { company: "Vercel", role: "Design Engineer", status: "Applied", date: "Applied 3d ago", icon: "V", color: "bg-[#171717] text-white" },
                { company: "Linear", role: "Product Manager", status: "Final Round", date: "Awaiting response", icon: "L", color: "bg-[#5E6AD2] text-white" }
              ].map((app, i) => (
                <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white/60 shadow-[0_2px_8px_rgba(30,35,60,0.01)] hover:bg-white/80 transition-all cursor-pointer hover:shadow-[0_8px_24px_rgba(30,35,60,0.04)] hover:-translate-y-0.5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${app.color} shadow-sm flex items-center justify-center text-[18px] font-bold font-[Manrope,sans-serif]`}>
                      {app.icon}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#1F2430] leading-tight mb-1">{app.company}</h4>
                      <p className="text-[13px] font-medium text-[#1F2430]/60">{app.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[13px] font-bold text-[#1F2430]/80">{app.status}</span>
                      <span className="text-[12px] font-medium text-[#1F2430]/50">{app.date}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1F2430]/40 group-hover:text-[#1F2430] group-hover:bg-[#F3F2F0] transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats (Glassmorphic mini-bento) */}
          <div className="rounded-[2.5rem] bg-white/40 backdrop-blur-3xl border border-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_8px_32px_rgba(30,35,60,0.02)] p-8 relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[150px] h-[150px] bg-gradient-to-tr from-[#10B981] to-[#34D399] rounded-full blur-[50px] opacity-20" />
            
            <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430] mb-8">Your Pipeline</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/60 border border-white/80 shadow-[0_4px_12px_rgba(30,35,60,0.02)] relative overflow-hidden group">
                <div className="text-[12px] font-bold text-[#1F2430]/50 mb-1">Applied</div>
                <div className="text-3xl font-[Manrope,sans-serif] font-bold text-[#1F2430]">24</div>
                <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform"><Briefcase className="w-16 h-16" /></div>
              </div>
              <div className="p-4 rounded-2xl bg-white/60 border border-white/80 shadow-[0_4px_12px_rgba(30,35,60,0.02)] relative overflow-hidden group">
                <div className="text-[12px] font-bold text-[#1F2430]/50 mb-1">Interviews</div>
                <div className="text-3xl font-[Manrope,sans-serif] font-bold text-[#1F2430]">5</div>
                <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform"><Clock className="w-16 h-16" /></div>
              </div>
              <div className="p-4 rounded-2xl bg-[#1F2430] border border-[#2A3040] shadow-[0_8px_24px_rgba(30,35,60,0.15)] col-span-2 relative overflow-hidden group flex items-center justify-between">
                <div className="relative z-10">
                  <div className="text-[12px] font-bold text-white/60 mb-1">Offers</div>
                  <div className="text-3xl font-[Manrope,sans-serif] font-bold text-white">2</div>
                </div>
                <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-colors">
                  <Award className="w-6 h-6" />
                </div>
                {/* Abstract graphic inside dark card */}
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 bg-gradient-to-l from-[#3E63F5] to-transparent pointer-events-none mix-blend-overlay" />
              </div>
            </div>
            
            <div className="mt-8 p-4 rounded-2xl bg-white/40 border border-white/60 flex items-start gap-3 backdrop-blur-sm">
              <div className="mt-1 w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <p className="text-[13px] font-medium text-[#1F2430]/70 leading-relaxed">
                Your application response rate is <strong className="text-[#1F2430]">22% higher</strong> than peers in your track. Keep it up!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
