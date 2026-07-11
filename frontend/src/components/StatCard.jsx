import React from 'react';
import GlassCard from './GlassCard';

const StatCard = ({ title, value, icon: Icon, description, trend, colorClass = 'text-primary-500' }) => {
  return (
    <GlassCard hoverEffect={true} className="flex items-start justify-between">
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans tracking-wide uppercase">
          {title}
        </p>
        <h3 className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>
        {description && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            {trend && (
              <span className={`font-semibold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trend}
              </span>
            )}
            <span>{description}</span>
          </div>
        )}
      </div>
      <div className={`p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl ${colorClass}`}>
        <Icon size={24} strokeWidth={2} />
      </div>
    </GlassCard>
  );
};

export default StatCard;
