import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Building, MapPin, Globe, Check, X, ShieldAlert } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { TableRowSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/companies');
      if (res.data.success) {
        setCompanies(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load companies listing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await api.put(`/admin/companies/${id}/status`, { status });
      if (res.data.success) {
        toast.success(`Verification status updated to: ${status}`);
        fetchCompanies();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredCompanies = filter
    ? companies.filter(c => c.status === filter)
    : companies;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Manage Hiring Partners
          </h1>
          <p className="text-sm text-slate-500">
            Verify organization registries and adjust approval state.
          </p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
        >
          <option value="">All Companies</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Grid Grid */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-150 dark:divide-slate-800 text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Owner Profile</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {loading ? (
                <>
                  <TableRowSkeleton cols={5} />
                  <TableRowSkeleton cols={5} />
                </>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-450">
                    No companies match your filters.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    {/* Name & Website */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{c.companyName}</p>
                        {c.website && (
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-500 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <Globe size={12} /> Website Link
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Owner Details */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-205">{c.user?.name || 'Deleted Account'}</p>
                        <p className="text-xs text-slate-500">{c.user?.email}</p>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-slate-650 dark:text-slate-350">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" /> {c.location}
                      </span>
                    </td>

                    {/* Verification status */}
                    <td className="px-6 py-4">
                      <span className={`
                        text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full
                        ${c.status === 'approved' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'}
                        ${c.status === 'pending' && 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'}
                        ${c.status === 'rejected' && 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'}
                      `}>
                        {c.status}
                      </span>
                    </td>

                    {/* Controls */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {c.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(c._id, 'approved')}
                            className="p-1.5 border border-emerald-200 hover:bg-emerald-50 text-emerald-600 dark:border-emerald-950/40 dark:hover:bg-emerald-950/20 rounded-lg transition"
                            title="Verify Partner"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {c.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(c._id, 'rejected')}
                            className="p-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-950/40 dark:hover:bg-rose-950/20 rounded-lg transition"
                            title="Reject/Suspend Partner"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default ManageCompanies;
