import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, Users, FileText, CheckCircle2, UserCheck, Plus, ArrowRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const CompanyDashboard = () => {
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, totalApps: 0, shortlisted: 0 });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/company/internships'),
          api.get('/company/applicants'),
        ]);

        if (jobsRes.data.success && appsRes.data.success) {
          const jobs = jobsRes.data.data;
          const apps = appsRes.data.data;

          const active = jobs.filter(j => j.status === 'active').length;
          const shortlisted = apps.filter(a => a.status === 'shortlisted' || a.status === 'interview_scheduled').length;

          setStats({
            totalJobs: jobs.length,
            activeJobs: active,
            totalApps: apps.length,
            shortlisted: shortlisted,
          });

          setRecentApplicants(apps.slice(0, 4));
        }
      } catch (err) {
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Plain CSS Bar Chart representation data
  const chartData = [
    { label: 'Applied', value: stats.totalApps - stats.shortlisted, color: 'bg-primary-500' },
    { label: 'Shortlisted', value: stats.shortlisted, color: 'bg-amber-500' },
    { label: 'Offers Given', value: recentApplicants.filter(a => a.status === 'accepted').length || 1, color: 'bg-emerald-500' },
  ];

  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Call to Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500">
            Publish new job descriptions and shortlist applicant resumes.
          </p>
        </div>
        <Link
          to="/dashboard/company/post"
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-sm shadow-md transition"
        >
          <Plus size={16} /> Post Internship
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Postings"
          value={stats.totalJobs}
          icon={Briefcase}
          description="Internships published"
        />
        <StatCard
          title="Active Openings"
          value={stats.activeJobs}
          icon={CheckCircle2}
          colorClass="text-emerald-500"
          description="Currently recruiting"
        />
        <StatCard
          title="Applications Received"
          value={stats.totalApps}
          icon={Users}
          colorClass="text-indigo-500"
          description="Resumes submitted"
        />
        <StatCard
          title="In Pipeline"
          value={stats.shortlisted}
          icon={UserCheck}
          colorClass="text-amber-500"
          description="Shortlisted/Interviewed"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Applicant Analytics Chart */}
        <GlassCard className="space-y-6 lg:col-span-1">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Hiring Pipeline
            </h3>
            <p className="text-xs text-slate-500">Candidate ratios by recruitment status</p>
          </div>

          <div className="space-y-4 pt-4">
            {chartData.map((data, index) => {
              const percentage = (data.value / maxVal) * 100;
              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-650 dark:text-slate-350">{data.label}</span>
                    <span className="text-slate-900 dark:text-white font-bold">{data.value}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${data.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Right: Recent Applicants List */}
        <GlassCard className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Recent Applicants
              </h3>
              <p className="text-xs text-slate-500">Latest candidates to submit resumes</p>
            </div>
            <Link
              to="/dashboard/company/applicants"
              className="text-xs font-semibold text-primary-500 flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentApplicants.length === 0 ? (
              <div className="py-8 text-center text-slate-450 dark:text-slate-500">
                <p className="text-sm">No applications received yet.</p>
              </div>
            ) : (
              recentApplicants.map((app) => (
                <div key={app._id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {app.student?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Applied for: <span className="font-semibold text-slate-700 dark:text-slate-300">{app.internship?.title}</span>
                    </p>
                  </div>
                  <div>
                    <span className={`
                      text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full
                      ${app.status === 'applied' && 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'}
                      ${app.status === 'shortlisted' && 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'}
                      ${app.status === 'interview_scheduled' && 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400'}
                      ${app.status === 'accepted' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'}
                      ${app.status === 'rejected' && 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'}
                    `}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default CompanyDashboard;
