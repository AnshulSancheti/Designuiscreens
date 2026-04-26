import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileCheck, Eye, Heart, Target, Users, Trophy, Archive, 
  ArrowRight, Clock, MapPin, Building2, PlayCircle, Star
} from "lucide-react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AnimatedContent } from "./ui/AnimatedContent";

type ApplicationStage = 'applied' | 'reviewing' | 'interest' | 'follow-up' | 'interviewing' | 'offer' | 'closed';

interface Application {
  id: string;
  company: string;
  role: string;
  stage: ApplicationStage;
  logo: string;
  date: string;
  action?: { label: string; path: string; type: 'primary' | 'secondary' | 'alert' };
  salary?: string;
  match?: string;
}

const STAGES: { id: ApplicationStage; label: string; icon: any; color: string; bgColor: string }[] = [
  { id: 'applied', label: 'Applied', icon: <FileCheck className="w-4 h-4" />, color: 'text-[#1F2430]/60', bgColor: 'bg-white/40' },
  { id: 'reviewing', label: 'Reviewing', icon: <Eye className="w-4 h-4" />, color: 'text-[#3B82F6]', bgColor: 'bg-[#3B82F6]/10' },
  { id: 'interest', label: 'Interest Received', icon: <Heart className="w-4 h-4" />, color: 'text-[#EC4899]', bgColor: 'bg-[#EC4899]/10' },
  { id: 'follow-up', label: 'Follow-up Requested', icon: <Target className="w-4 h-4" />, color: 'text-[#F59E0B]', bgColor: 'bg-[#F59E0B]/10' },
  { id: 'interviewing', label: 'Interviewing', icon: <Users className="w-4 h-4" />, color: 'text-[#8B5CF6]', bgColor: 'bg-[#8B5CF6]/10' },
  { id: 'offer', label: 'Offer', icon: <Trophy className="w-4 h-4" />, color: 'text-[#10B981]', bgColor: 'bg-[#10B981]/10' },
  { id: 'closed', label: 'Closed', icon: <Archive className="w-4 h-4" />, color: 'text-[#1F2430]/40', bgColor: 'bg-[#1F2430]/5' },
];

const INITIAL_APPS: Application[] = [
  {
    id: "app1",
    company: "Linear",
    role: "Staff Engineer, DX",
    stage: "interest",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop",
    date: "Expires in 7 days",
    match: "Strong Match",
    action: { label: "Review Request", path: "/candidate/interest", type: "primary" },
  },
  {
    id: "app2",
    company: "Stripe",
    role: "Backend Engineer",
    stage: "follow-up",
    logo: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop",
    date: "Due in 3 days",
    action: { label: "View Challenge", path: "/candidate/challenge", type: "alert" },
  },
  {
    id: "app3",
    company: "Anthropic",
    role: "AI Integration Lead",
    stage: "reviewing",
    logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=200&h=200&fit=crop",
    date: "Updated 2d ago",
    match: "Great Match"
  },
  {
    id: "app4",
    company: "Discord",
    role: "Frontend Engineer",
    stage: "applied",
    logo: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=200&h=200&fit=crop",
    date: "Applied 4d ago"
  },
  {
    id: "app5",
    company: "OpenAI",
    role: "Frontend AI",
    stage: "interviewing",
    logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=200&h=200&fit=crop",
    date: "Today, 2:00 PM",
    action: { label: "Join Room", path: "/pre-interview", type: "secondary" }
  },
  {
    id: "app6",
    company: "Vercel",
    role: "Senior UX Engineer",
    stage: "offer",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop",
    date: "Sent yesterday",
    salary: "$190k - $220k",
    action: { label: "View Offer Details", path: "#", type: "primary" }
  },
  {
    id: "app7",
    company: "Meta",
    role: "UI Engineer",
    stage: "closed",
    logo: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=200&fit=crop",
    date: "Closed"
  }
];

export function ApplicationsScreen() {
  const navigate = useNavigate();
  const [apps] = useState<Application[]>(INITIAL_APPS);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-140px)] animate-[pulse-glow_0.5s_ease-out]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 z-20">
        <div>
          <h2 className="font-[Manrope,sans-serif] text-[32px] font-extrabold text-[#1F2430] tracking-tight leading-tight">
            Application Pipeline
          </h2>
          <p className="text-[15px] font-medium text-[#1F2430]/60 mt-1">
            Track your matches and active hiring stages.
          </p>
        </div>
      </div>

      {/* Horizontal Pipeline Board */}
      <div className="flex-1 w-full overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar relative">
        
        {/* Visual Connector Line (behind columns) */}
        <div className="absolute top-[38px] left-[150px] right-[150px] h-[2px] bg-gradient-to-r from-transparent via-[#1F2430]/10 to-transparent pointer-events-none hidden md:block" />

        <div className="flex gap-6 min-w-max px-2 relative z-10">
          {STAGES.map((stage, index) => {
            const stageApps = apps.filter(app => app.stage === stage.id);
            
            return (
              <AnimatedContent 
                key={stage.id} 
                direction="horizontal" 
                distance={20} 
                delay={index * 0.05}
                className="w-[320px] shrink-0 snap-center flex flex-col"
              >
                {/* Stage Column Header */}
                <div className={`glass-card rounded-[1.5rem] p-4 border border-white/60 mb-5 relative flex items-center justify-between shadow-sm`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stage.bgColor} ${stage.color} border border-white/40 shadow-inner`}>
                      {stage.icon}
                    </div>
                    <span className="font-[Manrope,sans-serif] font-bold text-[15px] text-[#1F2430]">
                      {stage.label}
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white border border-[#1F2430]/5 flex items-center justify-center text-[12px] font-extrabold text-[#1F2430]/50 shadow-sm">
                    {stageApps.length}
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex flex-col gap-4 flex-1">
                  <AnimatePresence>
                    {stageApps.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-24 rounded-[1.5rem] border-2 border-dashed border-[#1F2430]/10 flex items-center justify-center bg-white/20"
                      >
                        <span className="text-[13px] font-bold text-[#1F2430]/30">No active roles</span>
                      </motion.div>
                    ) : (
                      stageApps.map((app, i) => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + (i * 0.05) }}
                          className="glass-card rounded-[1.5rem] p-5 border border-white/80 shadow-[0_4px_16px_rgba(30,35,60,0.03)] hover:shadow-[0_12px_32px_rgba(30,35,60,0.06)] hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden"
                        >
                          {/* Accent Gradient based on Stage */}
                          {app.stage === 'interest' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EC4899] to-[#F472B6]" />}
                          {app.stage === 'follow-up' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]" />}
                          {app.stage === 'offer' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#10B981] to-[#34D399]" />}
                          {app.stage === 'interviewing' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]" />}

                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-[1rem] bg-white border border-[#1F2430]/10 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                              <ImageWithFallback src={app.logo} alt={app.company} className="w-8 h-8 object-cover rounded-full" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-[#1F2430] text-[16px] leading-tight">{app.company}</h4>
                              <p className="font-semibold text-[#1F2430]/60 text-[13px] mt-0.5">{app.role}</p>
                            </div>
                          </div>

                          {/* Meta Information Tags */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 border border-[#1F2430]/5 text-[11px] font-bold text-[#1F2430]/70">
                              <Clock className="w-3 h-3 text-[#1F2430]/40" /> {app.date}
                            </div>
                            {app.match && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[11px] font-bold text-[#10B981]">
                                <Star className="w-3 h-3" /> {app.match}
                              </div>
                            )}
                            {app.salary && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3E63F5]/10 border border-[#3E63F5]/20 text-[11px] font-bold text-[#3E63F5]">
                                {app.salary}
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          {app.action && (
                            <div className="pt-4 border-t border-[#1F2430]/10">
                              <button 
                                onClick={() => navigate(app.action!.path)}
                                className={`w-full py-2.5 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 ${
                                  app.action.type === 'primary' 
                                    ? 'bg-[#1F2430] text-white hover:bg-[#2A3040] shadow-md' 
                                    : app.action.type === 'alert'
                                    ? 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-md shadow-[#F59E0B]/20'
                                    : 'bg-white text-[#1F2430] border border-[#1F2430]/10 hover:bg-[#1F2430]/5 shadow-sm'
                                }`}
                              >
                                {app.action.type === 'secondary' && <PlayCircle className="w-4 h-4" />}
                                {app.action.label}
                                {app.action.type !== 'secondary' && <ArrowRight className="w-4 h-4 opacity-70" />}
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      </div>
      
      {/* Global Style for hiding scrollbar visually but keeping functionality */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
