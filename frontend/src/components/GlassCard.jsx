import React from 'react';

const GlassCard = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div
      className={`
        bg-white dark:bg-slate-900/60 
        backdrop-blur-md 
        border border-slate-200/80 dark:border-slate-800/80 
        rounded-2xl 
        shadow-sm dark:shadow-2xl dark:shadow-black/20
        p-6 
        transition-all duration-300
        ${hoverEffect ? 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
