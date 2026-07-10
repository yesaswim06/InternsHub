import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 grid-bg p-6">
      <GlassCard className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/60 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold font-display text-slate-900 dark:text-white">404</h1>
          <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-200">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Unfortunately, the resource you are looking for has been removed, renamed, or does not exist.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-md"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </GlassCard>
    </div>
  );
};

export default NotFound;
