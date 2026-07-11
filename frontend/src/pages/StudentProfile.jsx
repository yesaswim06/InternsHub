import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api, { getAssetUrl } from '../services/api';
import { User, Mail, BookOpen, Tag, Link2, FileText, Plus, Trash2, Save, UploadCloud } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const { user, refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bio: user?.profile?.bio || '',
      skills: user?.profile?.skills?.join(', ') || '',
      github: user?.profile?.github || '',
      linkedin: user?.profile?.linkedin || '',
      education: user?.profile?.education?.length > 0 ? user.profile.education : [{ institute: '', degree: '', year: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only');
      return;
    }

    setResumeUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/students/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        toast.success('Resume uploaded successfully!');
        refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload resume');
    } finally {
      setResumeUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    
    // Parse skills from comma-separated string
    const skillList = data.skills
      ? data.skills.split(',').map(s => s.trim()).filter(s => s !== '')
      : [];

    try {
      const res = await api.put('/students/profile', {
        bio: data.bio,
        skills: skillList,
        education: data.education,
        github: data.github,
        linkedin: data.linkedin,
      });

      if (res.data.success) {
        toast.success('Profile updated successfully');
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to update profile details');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          My Profile Setup
        </h1>
        <p className="text-sm text-slate-500">
          Build your professional identity to stand out to hiring partners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Avatar and Resume Upload */}
        <div className="space-y-6 lg:col-span-1">
          {/* Summary Card */}
          <GlassCard className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-950/60 rounded-3xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-extrabold text-3xl font-display shadow-inner mx-auto">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {user?.name}
              </h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="text-xs px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold rounded-full inline-block uppercase tracking-wider">
              {user?.role}
            </div>
          </GlassCard>

          {/* Resume Upload Card */}
          <GlassCard className="space-y-4">
            <h3 className="font-bold text-sm font-display uppercase tracking-wide text-primary-500">
              Resume Document (PDF)
            </h3>

            {user?.profile?.resume ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText size={18} className="text-primary-500 flex-shrink-0" />
                  <a
                    href={getAssetUrl(user.profile.resume)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold hover:underline text-slate-700 dark:text-slate-355 truncate"
                  >
                    View Current Resume
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No resume PDF uploaded yet.</p>
            )}

            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500/50 rounded-2xl p-6 text-center cursor-pointer transition">
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                disabled={resumeUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <UploadCloud className="mx-auto text-slate-400" size={28} />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-350">
                  {resumeUploading ? 'Uploading PDF...' : 'Upload PDF Resume'}
                </p>
                <p className="text-[10px] text-slate-400">PDF documents only, max 5MB</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Profile Details form */}
        <div className="lg:col-span-2">
          <GlassCard>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Bio description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Short Bio
                </label>
                <textarea
                  rows={4}
                  {...register('bio')}
                  className="block w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
                  placeholder="Introduce yourself to companies..."
                />
              </div>

              {/* Skills input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  {...register('skills')}
                  className="block w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
                  placeholder="e.g. React, Node.js, Python, SQL"
                />
                <p className="text-[10px] text-slate-400">Separate skill tags with commas.</p>
              </div>

              {/* Social URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    {...register('github')}
                    className="block w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    {...register('linkedin')}
                    className="block w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              {/* Education section */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-display uppercase tracking-wide text-primary-500">
                    Education Items
                  </h3>
                  <button
                    type="button"
                    onClick={() => append({ institute: '', degree: '', year: '' })}
                    className="flex items-center gap-1 text-xs font-bold text-primary-500 hover:text-primary-600 transition"
                  >
                    <Plus size={14} /> Add Row
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-3 items-end p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-2xl">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            Institution Name
                          </label>
                          <input
                            type="text"
                            {...register(`education.${index}.institute`, { required: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                            placeholder="Harvard University"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            Degree / Course
                          </label>
                          <input
                            type="text"
                            {...register(`education.${index}.degree`, { required: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                            placeholder="B.S. Computer Science"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            Graduation Year
                          </label>
                          <input
                            type="text"
                            {...register(`education.${index}.year`, { required: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                            placeholder="e.g. 2026"
                          />
                        </div>
                      </div>

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 border border-rose-200 dark:border-rose-950/40 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50"
                >
                  <Save size={16} />
                  {submitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
