import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-6 animate-pulse border border-transparent dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>
      <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      {Array.from({ length: cols }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        </td>
      ))}
    </tr>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-px bg-slate-200 dark:bg-slate-750"></div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
      </div>
    </div>
  );
};
