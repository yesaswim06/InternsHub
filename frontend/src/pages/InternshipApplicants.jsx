import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, Calendar, Check, X, ShieldAlert, Clock, RefreshCw, Send, CheckSquare } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Modal from '../components/Modal';
import { TableRowSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const InternshipApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Interview scheduler state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewLink, setInterviewLink] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [schedulerSubmitting, setSchedulerSubmitting] = useState(false);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await api.get('/company/applicants');
      if (res.data.success) {
        setApplicants(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load candidate list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    if (newStatus === 'interview_scheduled') {
      setSelectedAppId(appId);
      setInterviewDate('');
      setInterviewLink('');
      setInterviewNotes('');
      setScheduleModalOpen(true);
      return;
    }

    try {
      const res = await api.put(`/company/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Candidate status updated to: ${newStatus}`);
        fetchApplicants();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update candidate status');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!interviewDate || !interviewLink) {
      toast.error('Date and Link are required');
      return;
    }

    setSchedulerSubmitting(true);
    try {
      const res = await api.put(`/company/applications/${selectedAppId}/status`, {
        status: 'interview_scheduled',
        interviewDate,
        interviewLink,
        interviewNotes,
      });

      if (res.data.success) {
        toast.success('Interview scheduled and email dispatched to candidate!');
        setScheduleModalOpen(false);
        fetchApplicants();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to schedule interview');
    } finally {
      setSchedulerSubmitting(false);
    }
  };

  const filteredApplicants = statusFilter
    ? applicants.filter(app => app.status === statusFilter)
    : applicants;

  return (
    <div className="space-y-6">
      {/* Title & Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Internship Applicants
          </h1>
          <p className="text-sm text-slate-500">
            Review candidate resumes, shortlist profiles, and coordinate interviews.
          </p>
        </div>

        {/* Filter Tab selection */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
        >
          <option value="">All Candidates</option>
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview_scheduled">Interview Scheduled</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Main Table grid */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-150 dark:divide-slate-800 text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Internship Applied</th>
                <th className="px-6 py-4">Resume</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {loading ? (
                <>
                  <TableRowSkeleton cols={5} />
                  <TableRowSkeleton cols={5} />
                  <TableRowSkeleton cols={5} />
                </>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-450">
                    No matching candidates found.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    {/* Candidate Info */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{app.student?.name}</p>
                        <p className="text-xs text-slate-500">{app.student?.email}</p>
                        {app.student?.profile?.skills && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {app.student.profile.skills.slice(0, 3).map((skill, sIdx) => (
                              <span key={sIdx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] rounded font-semibold">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Internship Title */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-850 dark:text-slate-205">{app.internship?.title}</p>
                        <p className="text-xs text-slate-500">${app.internship?.stipend}/mo &bull; {app.internship?.workMode}</p>
                      </div>
                    </td>

                    {/* Resume download link */}
                    <td className="px-6 py-4">
                      <a
                        href={`http://localhost:5000${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 hover:underline"
                      >
                        <FileText size={14} /> Resume PDF
                      </a>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
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
                    </td>

                    {/* Status Modifiers */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {app.status === 'applied' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(app._id, 'shortlisted')}
                              className="p-1.5 border border-amber-200 hover:bg-amber-50 text-amber-600 dark:border-amber-950/40 dark:hover:bg-amber-950/20 rounded-lg text-xs font-bold transition"
                              title="Shortlist Candidate"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleStatusChange(app._id, 'rejected')}
                              className="p-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-950/40 dark:hover:bg-rose-950/20 rounded-lg text-xs font-bold transition"
                              title="Reject Candidate"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        
                        {app.status === 'shortlisted' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(app._id, 'interview_scheduled')}
                              className="p-1.5 border border-purple-200 hover:bg-purple-50 text-purple-600 dark:border-purple-950/40 dark:hover:bg-purple-950/20 rounded-lg text-xs font-bold transition flex items-center gap-1"
                              title="Schedule Interview"
                            >
                              <Calendar size={12} /> Interview
                            </button>
                            <button
                              onClick={() => handleStatusChange(app._id, 'rejected')}
                              className="p-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-950/40 dark:hover:bg-rose-950/20 rounded-lg text-xs font-bold transition"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {app.status === 'interview_scheduled' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(app._id, 'accepted')}
                              className="p-1.5 border border-emerald-200 hover:bg-emerald-50 text-emerald-600 dark:border-emerald-950/40 dark:hover:bg-emerald-950/20 rounded-lg text-xs font-bold transition flex items-center gap-1"
                              title="Accept Candidate"
                            >
                              <Check size={12} /> Offer
                            </button>
                            <button
                              onClick={() => handleStatusChange(app._id, 'rejected')}
                              className="p-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-950/40 dark:hover:bg-rose-950/20 rounded-lg text-xs font-bold transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {(app.status === 'accepted' || app.status === 'rejected') && (
                          <span className="text-xs text-slate-400">Pipeline Finished</span>
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

      {/* Scheduler Modal */}
      <Modal isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} title="Schedule Interview Meeting">
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Meeting Date & Time
            </label>
            <input
              type="datetime-local"
              value={interviewDate}
              onChange={e => setInterviewDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Meeting Video Link (Google Meet / Zoom)
            </label>
            <input
              type="url"
              value={interviewLink}
              onChange={e => setInterviewLink(e.target.value)}
              required
              placeholder="https://meet.google.com/abc-defg-hij"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Coordinator Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={interviewNotes}
              onChange={e => setInterviewNotes(e.target.value)}
              placeholder="e.g. Please bring a copy of your recent project or github references."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={schedulerSubmitting}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send size={12} /> {schedulerSubmitting ? 'Scheduling...' : 'Dispatch Invitation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InternshipApplicants;
