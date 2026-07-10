import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Building, Briefcase, FileText, CheckCircle, ShieldAlert, Check, X } from 'lucide-react';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ totalStudents: 0, totalCompanies: 0, activeJobs: 0, totalApps: 0 });
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setMetrics({
          totalStudents: res.data.stats.totalStudents,
          totalCompanies: res.data.stats.totalCompanies,
          activeJobs: res.data.stats.activeInternships,
          totalApps: res.data.stats.totalApplications,
        });
        setChartData(res.data.chartData);
      }

      // Fetch pending companies
      const companiesRes = await api.get('/admin/companies');
      if (companiesRes.data.success) {
        const pending = companiesRes.data.data.filter(c => c.status === 'pending');
        setPendingCompanies(pending);
      }
    } catch (err) {
      toast.error('Failed to load system dashboard analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCompanyApproval = async (id, status) => {
    try {
      const res = await api.put(`/admin/companies/${id}/status`, { status });
      if (res.data.success) {
        toast.success(`Company account has been ${status} successfully!`);
        fetchStats();
      }
    } catch (err) {
      toast.error('Failed to update company verification status');
    }
  };

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

  // Calculate highest application value for CSS bar scaling
  const maxVal = Math.max(...chartData.map(c => c.applications), 1);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          System Administration
        </h1>
        <p className="text-sm text-slate-500">
          Review system metrics, manage users, and approve company partners.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={metrics.totalStudents}
          icon={Users}
          description="Registered profiles"
        />
        <StatCard
          title="Hiring Partners"
          value={metrics.totalCompanies}
          icon={Building}
          colorClass="text-emerald-500"
          description="Total companies"
        />
        <StatCard
          title="Active Listings"
          value={metrics.activeJobs}
          icon={Briefcase}
          colorClass="text-indigo-500"
          description="Internships online"
        />
        <StatCard
          title="Total Applications"
          value={metrics.totalApps}
          icon={FileText}
          colorClass="text-amber-500"
          description="Resumes submitted"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Platform Growth Chart */}
        <GlassCard className="space-y-6 lg:col-span-1">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Platform Activity
            </h3>
            <p className="text-xs text-slate-500">Submissions over time</p>
          </div>

          {/* Simple CSS Chart bars */}
          <div className="flex justify-between items-end h-32 pt-4 px-2">
            {chartData.map((data, idx) => {
              const heightPercentage = (data.applications / maxVal) * 80;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-white">
                    {data.applications}
                  </span>
                  <div
                    className="w-8 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${heightPercentage}px` }}
                  ></div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    {data.name}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Right: Pending Approvals list */}
        <GlassCard className="space-y-4 lg:col-span-2">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Pending Company Approvals
            </h3>
            <p className="text-xs text-slate-500">Verify company profiles before active hiring begins</p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingCompanies.length === 0 ? (
              <div className="py-8 text-center text-slate-450 dark:text-slate-500">
                <p className="text-sm">No pending approvals at this time.</p>
              </div>
            ) : (
              pendingCompanies.map((company) => (
                <div key={company._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {company.companyName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Location: {company.location} &bull; Website: {' '}
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
                        {company.website || 'N/A'}
                      </a>
                    </p>
                    <p className="text-xs text-slate-400 max-w-lg line-clamp-2">
                      {company.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCompanyApproval(company._id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm shadow-emerald-500/10"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleCompanyApproval(company._id, 'rejected')}
                      className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm shadow-rose-500/10"
                    >
                      <X size={14} /> Reject
                    </button>
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

export default AdminDashboard;
