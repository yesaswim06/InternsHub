import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Briefcase, Bookmark, Calendar, ArrowRight, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import { CardSkeleton } from '../components/LoadingSkeleton';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ applied: 0, bookmarks: 0, interviews: 0 });
  const [appliedList, setAppliedList] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appliedRes, bookmarksRes] = await Promise.all([
          api.get('/internships/student/applied'),
          api.get('/internships/student/bookmarks'),
        ]);

        if (appliedRes.data.success && bookmarksRes.data.success) {
          const applied = appliedRes.data.data;
          const bookmarks = bookmarksRes.data.data;

          const interviewList = applied.filter(app => app.status === 'interview_scheduled');

          setStats({
            applied: applied.length,
            bookmarks: bookmarks.length,
            interviews: interviewList.length,
          });

          setAppliedList(applied.slice(0, 3)); // show top 3 recent
          setInterviews(interviewList);
        }
      } catch (err) {
        console.error('Failed to load student dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute profile completeness percentage
  const getProfileCompleteness = () => {
    if (!user || !user.profile) return 0;
    let score = 0;
    const { bio, skills, resume, education } = user.profile;

    if (bio && bio.trim() !== '') score += 25;
    if (skills && skills.length > 0) score += 25;
    if (resume && resume.trim() !== '') score += 25;
    if (education && education.length > 0) score += 25;

    return score;
  };

  const completeness = getProfileCompleteness();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-primary-500/10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-display tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-primary-100 text-sm max-w-md">
            Review your application status, browse recommended openings, and prepare for upcoming interviews.
          </p>
        </div>
        <Link
          to="/dashboard/student/search"
          className="mt-4 md:mt-0 px-5 py-3 bg-white hover:bg-slate-50 text-primary-700 font-bold rounded-2xl text-sm shadow-md transition-all duration-200"
        >
          Explore Internships
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Applications Sent"
          value={stats.applied}
          icon={Briefcase}
          description="Total submissions"
        />
        <StatCard
          title="Saved Internships"
          value={stats.bookmarks}
          icon={Bookmark}
          description="Bookmarked postings"
        />
        <StatCard
          title="Interviews Scheduled"
          value={stats.interviews}
          icon={Calendar}
          description="Upcoming meeting slots"
        />
      </div>

      {/* Profile & Action Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Actions and Profile Completeness */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Progress */}
          <GlassCard className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Profile Completeness
              </h3>
              <span className="text-sm font-bold text-primary-500">{completeness}%</span>
            </div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                {user?.profile?.bio ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-slate-400" />}
                <span className={user?.profile?.bio ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>Short Bio</span>
              </div>
              <div className="flex items-center gap-2">
                {user?.profile?.skills?.length > 0 ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-slate-400" />}
                <span className={user?.profile?.skills?.length > 0 ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>Skills (Tags)</span>
              </div>
              <div className="flex items-center gap-2">
                {user?.profile?.resume ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-slate-400" />}
                <span className={user?.profile?.resume ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>Resume (PDF)</span>
              </div>
              <div className="flex items-center gap-2">
                {user?.profile?.education?.length > 0 ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-slate-400" />}
                <span className={user?.profile?.education?.length > 0 ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>Education Items</span>
              </div>
            </div>

            {completeness < 100 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/dashboard/student/profile"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold rounded-xl text-primary-500 transition"
                >
                  <FileText size={16} /> Complete Your Profile
                </Link>
              </div>
            )}
          </GlassCard>

          {/* Recent Applications list */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Recent Submissions
              </h3>
              <Link
                to="/dashboard/student/applied"
                className="text-xs font-semibold text-primary-500 flex items-center gap-1 hover:underline"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {appliedList.length === 0 ? (
                <div className="py-6 text-center text-slate-450 dark:text-slate-500">
                  <p className="text-sm">You haven't applied to any internships yet.</p>
                </div>
              ) : (
                appliedList.map((app) => (
                  <div key={app._id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {app.internship?.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {app.internship?.company?.companyName} &bull; {app.internship?.location}
                      </p>
                    </div>
                    <div>
                      <span className={`
                        text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full
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

        {/* Right Side: Interview Calendar Schedule */}
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Upcoming Interviews
            </h3>

            <div className="space-y-3">
              {interviews.length === 0 ? (
                <div className="py-6 text-center text-slate-450 dark:text-slate-500">
                  <p className="text-sm">No interviews scheduled yet.</p>
                </div>
              ) : (
                interviews.map((app) => (
                  <div key={app._id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary-500">
                        {app.internship?.company?.companyName}
                      </p>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {app.internship?.title}
                      </h4>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(app.interview?.date).toLocaleString()}
                      </p>
                    </div>
                    <a
                      href={app.interview?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition"
                    >
                      Join Meeting
                    </a>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
