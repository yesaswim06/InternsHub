import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, MapPin, DollarSign, Calendar, FileText, Download } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const AppliedInternships = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const res = await api.get('/internships/student/applied');
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load applied internships');
      } finally {
        setLoading(false);
      }
    };

    fetchApplied();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400';
      case 'shortlisted':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400';
      case 'accepted':
        return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400';
      case 'rejected':
        return 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-900';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          My Applications
        </h1>
        <p className="text-sm text-slate-500">
          Track the recruitment stage for each of your submitted applications.
        </p>
      </div>

      {applications.length === 0 ? (
        <GlassCard className="text-center py-16 space-y-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            You haven't submitted any internship applications yet.
          </p>
          <Link
            to="/dashboard/student/search"
            className="inline-block px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-primary-500/10"
          >
            Find Internships
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <GlassCard key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    {app.internship?.title}
                  </h3>
                  <p className="text-sm font-bold text-primary-500">
                    {app.internship?.company?.companyName}
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {app.internship?.location}</span>
                  <span className="flex items-center gap-1"><DollarSign size={12} /> ${app.internship?.stipend}/mo</span>
                  <span className="flex items-center gap-1">
                    Applied on: {new Date(app.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status and Action controls */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4">
                <span className={`
                  text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full
                  ${getStatusBadge(app.status)}
                `}>
                  {app.status.replace('_', ' ')}
                </span>
                
                <a
                  href={`http://localhost:5000${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-500 hover:underline transition"
                >
                  <FileText size={14} /> Resume PDF <Download size={12} />
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedInternships;
