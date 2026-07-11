import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, GraduationCap, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Stylized Network Graduation Hub logo for InternsHub
export const LogoIcon = ({ size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ width: size, height: size }}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M5 17c0 1.5 3 3 7 3s7-1.5 7-3" />
    <path d="M2 17l10 5 10-5" />
    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

// SVG Illustration: Job Search Catalog Mockup
const SearchIllustration = () => (
  <svg className="w-full h-40 text-primary-500 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-4" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Search Box */}
    <rect x="10" y="10" width="180" height="20" rx="6" className="fill-white dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" />
    <circle cx="22" cy="20" r="4" className="stroke-primary-500" strokeWidth="1.5" />
    <line x1="25" y1="23" x2="29" y2="27" className="stroke-primary-500" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="36" y="16" width="60" height="8" rx="2" className="fill-slate-200 dark:fill-slate-800" />
    <rect x="150" y="14" width="32" height="12" rx="4" className="fill-primary-500" />
    <rect x="156" y="18" width="20" height="4" rx="1" fill="white" />

    {/* Job Card 1 */}
    <rect x="10" y="40" width="85" height="70" rx="8" className="fill-white dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" />
    <rect x="18" y="48" width="12" height="12" rx="3" className="fill-primary-500/10" />
    <rect x="22" y="52" width="4" height="4" className="fill-primary-500" />
    <rect x="36" y="48" width="45" height="6" rx="1.5" className="fill-slate-900 dark:fill-white" />
    <rect x="36" y="57" width="25" height="4" rx="1" className="fill-slate-405 dark:fill-slate-700" />
    <rect x="18" y="74" width="69" height="3" rx="1" className="fill-slate-100 dark:fill-slate-850" />
    <rect x="18" y="81" width="55" height="3" rx="1" className="fill-slate-100 dark:fill-slate-850" />
    <rect x="18" y="93" width="25" height="8" rx="3" className="fill-emerald-100 dark:fill-emerald-950/60" />
    <rect x="22" y="95" width="17" height="4" rx="1" className="fill-emerald-600 dark:fill-emerald-400" />

    {/* Job Card 2 */}
    <rect x="105" y="40" width="85" height="70" rx="8" className="fill-white dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" />
    <rect x="113" y="48" width="12" height="12" rx="3" className="fill-indigo-500/10" />
    <rect x="117" y="52" width="4" height="4" className="fill-indigo-500" />
    <rect x="131" y="48" width="45" height="6" rx="1.5" className="fill-slate-900 dark:fill-white" />
    <rect x="131" y="57" width="25" height="4" rx="1" className="fill-slate-405 dark:fill-slate-700" />
    <rect x="113" y="74" width="69" height="3" rx="1" className="fill-slate-100 dark:fill-slate-850" />
    <rect x="113" y="81" width="55" height="3" rx="1" className="fill-slate-100 dark:fill-slate-850" />
    <rect x="113" y="93" width="25" height="8" rx="3" className="fill-indigo-100 dark:fill-indigo-950/60" />
    <rect x="117" y="95" width="17" height="4" rx="1" className="fill-indigo-600 dark:fill-indigo-400" />
  </svg>
);

// SVG Illustration: Recruitment Pipelines & Interviews
const PipelineIllustration = () => (
  <svg className="w-full h-40 text-primary-500 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-4" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Candidate Row 1 */}
    <rect x="10" y="10" width="180" height="30" rx="8" className="fill-white dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" />
    <circle cx="25" cy="25" r="10" className="fill-primary-100 dark:fill-primary-950" />
    <rect x="21" y="21" width="8" height="8" rx="2" className="fill-primary-500" />
    <rect x="42" y="18" width="55" height="6" rx="1.5" className="fill-slate-900 dark:fill-white" />
    <rect x="42" y="27" width="30" height="4" rx="1" className="fill-slate-405 dark:fill-slate-700" />
    <rect x="135" y="18" width="45" height="14" rx="5" className="fill-purple-100 dark:fill-purple-950/60" />
    <rect x="141" y="23" width="33" height="4" rx="1" className="fill-purple-600 dark:fill-purple-400" />

    {/* Candidate Row 2 */}
    <rect x="10" y="48" width="180" height="30" rx="8" className="fill-white dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" />
    <circle cx="25" cy="63" r="10" className="fill-emerald-100 dark:fill-emerald-950" />
    <rect x="21" y="59" width="8" height="8" rx="2" className="fill-emerald-500" />
    <rect x="42" y="56" width="55" height="6" rx="1.5" className="fill-slate-900 dark:fill-white" />
    <rect x="42" y="65" width="30" height="4" rx="1" className="fill-slate-405 dark:fill-slate-700" />
    <rect x="145" y="56" width="35" height="14" rx="5" className="fill-emerald-100 dark:fill-emerald-950/60" />
    <rect x="151" y="61" width="23" height="4" rx="1" className="fill-emerald-600 dark:fill-emerald-400" />

    {/* Candidate Row 3 */}
    <rect x="10" y="86" width="180" height="24" rx="6" className="fill-white dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" />
    <circle cx="25" cy="98" r="7" className="fill-slate-100 dark:fill-slate-800" />
    <rect x="42" y="95" width="45" height="5" rx="1" className="fill-slate-300 dark:fill-slate-800" />
  </svg>
);

// SVG Illustration: Advanced Analytics dashboard Graph
const AnalyticsIllustration = () => (
  <svg className="w-full h-40 text-primary-500 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-4" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Grid Lines */}
    <line x1="20" y1="20" x2="180" y2="20" className="stroke-slate-100 dark:stroke-slate-850" strokeWidth="1" />
    <line x1="20" y1="50" x2="180" y2="50" className="stroke-slate-100 dark:stroke-slate-850" strokeWidth="1" />
    <line x1="20" y1="80" x2="180" y2="80" className="stroke-slate-100 dark:stroke-slate-850" strokeWidth="1" />
    <line x1="20" y1="100" x2="180" y2="100" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" />

    {/* Bar 1 */}
    <rect x="35" y="60" width="15" height="40" rx="3" className="fill-primary-500" />
    {/* Bar 2 */}
    <rect x="65" y="40" width="15" height="60" rx="3" className="fill-primary-500" />
    {/* Bar 3 */}
    <rect x="95" y="75" width="15" height="25" rx="3" className="fill-indigo-500" />
    {/* Bar 4 */}
    <rect x="125" y="30" width="15" height="70" rx="3" className="fill-primary-500" />
    {/* Bar 5 */}
    <rect x="155" y="15" width="15" height="85" rx="3" className="fill-emerald-500" />

    {/* Line chart trend on top */}
    <path d="M42.5 70 L72.5 50 L102.5 80 L132.5 35 L162.5 20" fill="none" className="stroke-amber-500" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="162.5" cy="20" r="3" className="fill-white stroke-amber-500" strokeWidth="1.5" />
  </svg>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 grid-bg text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto w-full z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold font-display shadow-md shadow-primary-500/20">
            <LogoIcon size={22} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
            InternsHub
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold hover:text-primary-500 dark:text-slate-300 dark:hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-500/10 hover:shadow-primary-500/25 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col lg:flex-row items-center justify-center gap-12 py-12 md:py-20">
        {/* Left Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full text-xs font-semibold text-primary-600 dark:text-primary-400"
          >
            <ShieldCheck size={14} /> Approved by Leading Universities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] tracking-tight text-slate-900 dark:text-white"
          >
            Connect, Apply, and{' '}
            <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
              Elevate Your Career
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 font-sans"
          >
            The premium platform connecting talented students with top-tier companies. Explore stipend-backed internships, secure interview slots, and fast-track your future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Link
              to="/register?role=student"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 rounded-2xl font-bold shadow-lg transition-all duration-200"
            >
              Apply for Internships
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/register?role=company"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 rounded-2xl font-bold transition"
            >
              Post an Internship
            </Link>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 max-w-md mx-auto lg:mx-0"
          >
            <div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">10K+</p>
              <p className="text-xs text-slate-500">Students Joined</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">500+</p>
              <p className="text-xs text-slate-500">Hiring Partners</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">95%</p>
              <p className="text-xs text-slate-500">Hire Rate</p>
            </div>
          </motion.div>
        </div>

        {/* Right Graphical Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 w-full max-w-lg space-y-6"
        >
          {/* Student Panel Overlay */}
          <div className="bg-white dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-950 dark:text-white">Student Hub</h4>
                  <p className="text-xs text-slate-500">Manage profile & resumes</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Upload PDF Resumes & Auto-apply</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Filter by stipend, skill tags, & work modes</span>
              </div>
            </div>
          </div>

          {/* Company Panel Overlay */}
          <div className="bg-white dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950/60 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-950 dark:text-white">Company Panel</h4>
                  <p className="text-xs text-slate-500">Post & shortlist applicants</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-full">
                Secure
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={14} className="text-primary-500" />
                <span>Publish listings & configure hiring pipelines</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={14} className="text-primary-500" />
                <span>Integrate Interview schedules & mail templates</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Interactive Platform Features Section */}
      <section className="bg-white dark:bg-slate-900/50 py-16 md:py-24 border-t border-slate-200/60 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Powerful Core Features
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Designed to connect candidates and hiring coordinators efficiently, securely, and in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="space-y-5 flex flex-col">
              <SearchIllustration />
              <div className="space-y-2 flex-1">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  1. Smart Search Catalog
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                  Students can browse verified postings using multi-faceted query bounds, matching stipend sizes, location settings, and custom skill badges instantly.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="space-y-5 flex flex-col">
              <PipelineIllustration />
              <div className="space-y-2 flex-1">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  2. Integrated Hiring Pipeline
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                  Companies manage applications smoothly through built-in pipelines. Verify candidate details, shortlist applicants, and schedule video meetings in a few clicks.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="space-y-5 flex flex-col">
              <AnalyticsIllustration />
              <div className="space-y-2 flex-1">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  3. Real-Time Admin Dashboards
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                  Administrators monitor user grids, handle company registry approvals, remove spam posts, and trace monthly metrics and activity trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/20">
        &copy; {new Date().getFullYear()} InternsHub. Crafted with Passion.
      </footer>
    </div>
  );
};

export default Landing;
