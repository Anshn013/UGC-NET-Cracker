import React from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  paper1Count: number;
  paper2Count: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  paper1Count,
  paper2Count,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between selection:bg-blue-400 selection:text-slate-950">
      {/* Top Academic Strip */}
      <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-blue-300 bg-blue-950/60 border border-blue-800/60 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>NTA UGC NET · Paper 1 & Paper 2 Economics</span>
        </div>
        <span className="hidden sm:inline text-xs font-mono text-slate-400">
          Code 01 · Dual-Paper CBT Workbench
        </span>
      </header>

      {/* Main Center Hero, Metrics & CTA */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center space-y-10">
        <div className="space-y-5">
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Artha<span className="text-blue-400">JRF</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A structured UGC NET & JRF preparation arena combining verified previous-year questions, step-by-step explanations, exam tips, and NTA-style mock simulations.
          </p>
        </div>

        {/* Live Question Bank Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-medium uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Paper 2 Economics</span>
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-white mt-2 tabular-nums">
              {paper2Count}+
            </p>
            <p className="text-xs text-slate-400 mt-1">
              PYQs across all 10 Economics units with explanations
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paper 1 Aptitude</span>
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-white mt-2 tabular-nums">
              {paper1Count}+
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Teaching, Research, Logic, DI, ICT & Higher Ed
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-medium uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Exam & Explain</span>
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-white mt-2">
              CBT + Notes
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Timed mock tests, instant explanations & exam tips
            </p>
          </div>
        </div>

        {/* Center "Let's Begin" Action */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Let&apos;s Begin</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <span className="text-xs text-slate-400">
            Free · No sign-up required · Study progress saves automatically in your browser
          </span>
        </div>

        {/* Creator Signature & Contact Card */}
        <div className="max-w-3xl mx-auto pt-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-widest text-blue-400">
                Created By
              </p>
              <h2 className="text-xl font-semibold text-white">
                Anshin Shan K
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  UGC NET Qualified (Economics) · MA Economics, Farook College, Calicut
                </span>
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                <a
                  href="tel:+916235040913"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91 6235040913</span>
                </a>
                <a
                  href="mailto:anshinshan13@gmail.com"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>anshinshan13@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
              <a
                href="https://github.com/Anshn013"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-slate-300" />
                <span>github.com/Anshn013</span>
              </a>
              <a
                href="https://www.linkedin.com/in/anshinshan13"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                <span>linkedin.com/in/anshinshan13</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-6 text-center text-xs text-slate-500">
        ArthaJRF · Created by Anshin Shan K · UGC NET Paper 1 & Paper 2 Preparation
      </footer>
    </div>
  );
};