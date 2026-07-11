import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
<<<<<<< HEAD
import api, { getAssetUrl } from '../services/api';
=======
import api from '../services/api';
>>>>>>> 5ad54ac356437c46391d42f18547dd0a7250531b
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  ArrowLeft,
  Bookmark,
  Send,
  Building,
  CheckCircle,
  FileText,
  BookmarkCheck,
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Modal from '../components/Modal';
import { DetailSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  
  // Form states
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [customResume, setCustomResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const [jobRes, appliedRes] = await Promise.all([
        api.get(`/internships/${id}`),
        api.get('/internships/student/applied'),
      ]);

      if (jobRes.data.success) {
        setJob(jobRes.data.data);
      }

      // Check if student applied
      if (appliedRes.data.success) {
        const hasApplied = appliedRes.data.data.some(app => app.internship?._id === id);
        setApplied(hasApplied);
      }

      // Check if student bookmarked
      if (user && user.profile?.savedInternships) {
        setIsBookmarked(user.profile.savedInternships.includes(id));
      }
    } catch (err) {
      toast.error('Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        const res = await api.delete(`/internships/${id}/bookmark`);
        if (res.data.success) {
          setIsBookmarked(false);
          toast.success('Removed from saved bookmarks');
        }
      } else {
        const res = await api.post(`/internships/${id}/bookmark`);
        if (res.data.success) {
          setIsBookmarked(true);
          toast.success('Saved to bookmarks');
        }
      }
      refreshUser();
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      formData.append('useProfileResume', useProfileResume);

      if (!useProfileResume) {
        if (!customResume) {
          toast.error('Please upload a PDF resume');
          setSubmitting(false);
          return;
        }
        formData.append('resume', customResume);
      }

      const res = await api.post(`/internships/${id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setApplied(true);
        setApplyModalOpen(false);
        toast.success('Application submitted successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <DetailSkeleton />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 space-y-4">
        <p className="text-slate-500">Internship posting not found or has been removed.</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
      >
        <ArrowLeft size={16} /> Back to Search
      </button>

      {/* Main Detail Card */}
      <GlassCard className="relative overflow-hidden">
        {/* Banner strip */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary-500 to-indigo-500"></div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
          {/* Header info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200/50 dark:border-slate-800 overflow-hidden">
              {job.company?.logo ? (
                <img
<<<<<<< HEAD
                  src={getAssetUrl(job.company.logo)}
=======
                  src={`http://localhost:5000${job.company.logo}`}
>>>>>>> 5ad54ac356437c46391d42f18547dd0a7250531b
                  alt={job.company.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building className="text-slate-400" size={28} />
              )}
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
                {job.title}
              </h1>
              <p className="text-sm font-bold text-primary-500 hover:underline">
                {job.company?.website ? (
                  <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                    {job.company?.companyName}
                  </a>
                ) : (
                  job.company?.companyName
                )}
              </p>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmarkToggle}
              className={`p-3 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                isBookmarked
                  ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500'
              }`}
            >
              {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>

            {applied ? (
              <button
                disabled
                className="flex items-center justify-center gap-1.5 px-6 py-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-sm font-bold shadow-inner"
              >
                <CheckCircle size={16} /> Applied
              </button>
            ) : (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/10 transition"
              >
                <Send size={16} /> Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 py-6 border-y border-slate-100 dark:border-slate-850">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <MapPin size={12} /> Location
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{job.location}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Briefcase size={12} /> Work Mode
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{job.workMode}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <DollarSign size={12} /> Stipend
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {job.stipend ? `$${job.stipend}/mo` : 'Unpaid'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Calendar size={12} /> Duration
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{job.duration}</p>
          </div>
        </div>

        {/* Content sections */}
        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Role Description
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Eligibility Criteria</h4>
              <p className="text-slate-600 dark:text-slate-400">{job.eligibility}</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Important Dates</h4>
              <p className="text-slate-650 dark:text-slate-450">
                Last date to apply:{' '}
                <span className="font-bold text-rose-500">
                  {new Date(job.deadline).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Application overlay modal */}
      <Modal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} title="Apply for Internship">
        <form onSubmit={handleApplySubmit} className="space-y-6">
          {/* Resume Source selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Select Resume
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUseProfileResume(true)}
                className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition text-center ${
                  useProfileResume
                    ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <FileText size={20} />
                <span className="text-xs font-bold">Use Profile Resume</span>
              </button>

              <button
                type="button"
                onClick={() => setUseProfileResume(false)}
                className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition text-center ${
                  !useProfileResume
                    ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Send size={20} />
                <span className="text-xs font-bold">Upload Custom PDF</span>
              </button>
            </div>
          </div>

          {/* Profile Resume reference text */}
          {useProfileResume && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary-500" />
                <span className="truncate text-slate-700 dark:text-slate-300">
                  {user?.profile?.resume ? 'profile_resume.pdf' : 'No profile resume uploaded!'}
                </span>
              </div>
              {!user?.profile?.resume && (
                <Link
                  to="/dashboard/student/profile"
                  className="font-bold text-primary-500 hover:underline"
                >
                  Upload profile resume first
                </Link>
              )}
            </div>
          )}

          {/* Custom PDF Upload dropzone */}
          {!useProfileResume && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500">Upload PDF</label>
              <input
                type="file"
                accept=".pdf"
                onChange={e => setCustomResume(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-500/10 file:text-primary-600 hover:file:bg-primary-500/20"
              />
            </div>
          )}

          {/* Cover Letter text area */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Cover Letter / Introduction (Optional)
            </label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              placeholder="Explain why you are a good match for this role..."
            />
          </div>

          {/* Submit Actions */}
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100 dark:border-slate-850">
            <button
              type="button"
              onClick={() => setApplyModalOpen(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (useProfileResume && !user?.profile?.resume)}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InternshipDetail;
