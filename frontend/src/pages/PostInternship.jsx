import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, MapPin, DollarSign, Calendar, Tag, ClipboardList, Clock, ArrowLeft, Save } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import toast from 'react-hot-toast';

const PostInternship = () => {
  const { id } = useParams(); // exists if editing
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      location: '',
      workMode: 'Onsite',
      duration: '',
      stipend: '',
      skills: '',
      eligibility: '',
      deadline: '',
      description: '',
    },
  });

  useEffect(() => {
    if (!id) return;

    const fetchInternshipDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/internships/${id}`);
        if (res.data.success) {
          const job = res.data.data;
          
          // Format deadline to yyyy-MM-dd for HTML date input
          const formattedDeadline = job.deadline ? job.deadline.split('T')[0] : '';
          
          reset({
            title: job.title,
            location: job.location,
            workMode: job.workMode,
            duration: job.duration,
            stipend: job.stipend,
            skills: job.skills.join(', '),
            eligibility: job.eligibility,
            deadline: formattedDeadline,
            description: job.description,
          });
        }
      } catch (err) {
        toast.error('Failed to load internship details for editing');
      } finally {
        setLoading(false);
      }
    };

    fetchInternshipDetails();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (id) {
        // Edit mode
        const res = await api.put(`/company/internships/${id}`, data);
        if (res.data.success) {
          toast.success('Internship updated successfully');
          navigate('/dashboard/company');
        }
      } else {
        // Create mode
        const res = await api.post('/company/internships', data);
        if (res.data.success) {
          toast.success('Internship posted successfully');
          navigate('/dashboard/company');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save internship');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="absolute top-6 left-6">
        <Link
          to="/dashboard/company"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          {id ? 'Edit Internship' : 'Post Internship'}
        </h1>
        <p className="text-sm text-slate-500">
          Provide detailed specifications for the role to attract qualified candidates.
        </p>
      </div>

      <GlassCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Internship Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Briefcase size={16} />
                </div>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                    errors.title ? 'border-rose-500' : 'focus:border-primary-500'
                  }`}
                  placeholder="e.g. Software Engineer Intern"
                />
              </div>
              {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin size={16} />
                </div>
                <input
                  type="text"
                  {...register('location', { required: 'Location is required' })}
                  className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                    errors.location ? 'border-rose-500' : 'focus:border-primary-500'
                  }`}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              {errors.location && <p className="mt-1 text-xs text-rose-500">{errors.location.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Work Mode */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Mode
              </label>
              <select
                {...register('workMode')}
                className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500"
              >
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Duration (e.g., '3 Months')
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Clock size={16} />
                </div>
                <input
                  type="text"
                  {...register('duration', { required: 'Duration is required' })}
                  className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                    errors.duration ? 'border-rose-500' : 'focus:border-primary-500'
                  }`}
                  placeholder="e.g. 6 Months"
                />
              </div>
              {errors.duration && <p className="mt-1 text-xs text-rose-500">{errors.duration.message}</p>}
            </div>

            {/* Stipend */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Monthly Stipend ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <DollarSign size={16} />
                </div>
                <input
                  type="number"
                  {...register('stipend', { required: 'Stipend is required' })}
                  className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                    errors.stipend ? 'border-rose-500' : 'focus:border-primary-500'
                  }`}
                  placeholder="e.g. 1000"
                />
              </div>
              {errors.stipend && <p className="mt-1 text-xs text-rose-500">{errors.stipend.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Skills Required (Comma-separated)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Tag size={16} />
                </div>
                <input
                  type="text"
                  {...register('skills', { required: 'Skills are required' })}
                  className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                    errors.skills ? 'border-rose-500' : 'focus:border-primary-500'
                  }`}
                  placeholder="React, Node.js, Python"
                />
              </div>
              {errors.skills && <p className="mt-1 text-xs text-rose-500">{errors.skills.message}</p>}
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Last Date to Apply
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  {...register('deadline', { required: 'Deadline is required' })}
                  className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                    errors.deadline ? 'border-rose-500' : 'focus:border-primary-500'
                  }`}
                />
              </div>
              {errors.deadline && <p className="mt-1 text-xs text-rose-500">{errors.deadline.message}</p>}
            </div>
          </div>

          {/* Eligibility */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Eligibility Criteria
            </label>
            <input
              type="text"
              {...register('eligibility', { required: 'Eligibility is required' })}
              className={`block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                errors.eligibility ? 'border-rose-500' : 'focus:border-primary-500'
              }`}
              placeholder="e.g. Final year B.Tech / BCA / MCA students"
            />
            {errors.eligibility && <p className="mt-1 text-xs text-rose-500">{errors.eligibility.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 text-slate-400">
                <ClipboardList size={16} />
              </div>
              <textarea
                rows={6}
                {...register('description', { required: 'Description is required' })}
                className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                  errors.description ? 'border-rose-500' : 'focus:border-primary-500'
                }`}
                placeholder="Explain the role responsibilities, team details, and target expectations..."
              />
            </div>
            {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/dashboard/company"
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              <Save size={14} />
              {submitting ? 'Saving...' : id ? 'Update Posting' : 'Publish Internship'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default PostInternship;
