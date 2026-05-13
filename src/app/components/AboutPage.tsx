import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, BrainCircuit, Eye, Network } from 'lucide-react';
import { Logo } from './Logo';

export function AboutPage() {
  const reduce = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 selection:bg-blue-200 selection:text-blue-900">
      {/* Soft ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute right-[-120px] top-1/3 h-[380px] w-[380px] rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute bottom-[-160px] left-[-80px] h-[420px] w-[420px] rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      {/* Top nav */}
      <header className="relative z-10 border-b border-white/40 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-semibold text-slate-900">PlacedOn</span>
          </Link>
          <Link
            to="/"
            className="flex min-h-11 items-center gap-1.5 rounded-full border border-white/60 bg-white/60 px-4 text-sm font-medium text-slate-600 backdrop-blur-md transition hover:bg-white/80 hover:text-slate-900 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:pt-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={itemVariants} className="mb-6 flex justify-center">
            <span className="rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-sm font-medium text-blue-700 backdrop-blur-md">
              Our Mission
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="font-['Instrument_Serif'] text-5xl italic tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Match with certainty.
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
          >
            We're building the first talent matching platform that relies on undeniable evidence rather than keyword optimization.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Card 1 */}
          <motion.div 
            variants={itemVariants}
            className="relative flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] backdrop-blur-xl transition-all hover:bg-white/70"
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-inner">
              <Network className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">Trait Mapping</h3>
            <p className="text-slate-600 leading-relaxed">
              Explore candidates through an interactive node graph that connects related skills, experiences, and behavioral traits in multi-dimensional space.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={itemVariants}
            className="relative flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] backdrop-blur-xl transition-all hover:bg-white/70"
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-inner">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">Proctored Assessments</h3>
            <p className="text-slate-600 leading-relaxed">
              Our secure testing environment utilizes advanced screen recording and eye-tracking metrics to ensure absolute integrity during technical evaluations.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            variants={itemVariants}
            className="relative flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] backdrop-blur-xl transition-all hover:bg-white/70 sm:col-span-2 lg:col-span-1"
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 shadow-inner">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">Dense ATS Dashboard</h3>
            <p className="text-slate-600 leading-relaxed">
              Designed for power users. Employers can filter, segment, and shortlist talent with high-information-density interfaces that respect their time.
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-24 rounded-3xl border border-white/60 bg-white/40 p-8 text-center backdrop-blur-xl sm:p-12"
        >
          <h2 className="font-['Instrument_Serif'] text-4xl italic text-slate-900 sm:text-5xl">Join the early access</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            We are currently rolling out to a select group of candidates and employers.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-8 text-base font-medium text-white transition hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-[0.98]"
          >
            Request Access
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
