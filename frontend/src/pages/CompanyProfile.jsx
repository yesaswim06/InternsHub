import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import api, { getAssetUrl } from '../services/api';
=======
import api from '../services/api';
>>>>>>> 5ad54ac356437c46391d42f18547dd0a7250531b
import { Building, MapPin, Globe, ClipboardList, Save, UploadCloud } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import toast from 'react-hot-toast';

const CompanyProfile = () => {
  const { user, refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: user?.companyProfile?.companyName || '',
      description: user?.companyProfile?.description || '',
      location: user?.companyProfile?.location || '',
      website: user?.companyProfile?.website || '',
    },
  });

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG/PNG/WEBP)');
      return;
    }

    setLogoUploading(true);
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await api.post('/company/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        toast.success('Company logo uploaded successfully!');
        refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload logo');
    } finally {
      setLogoUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.put('/company/profile', data);
      if (res.data.success) {
        toast.success('Company profile updated successfully!');
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to update company details');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Company Profile
        </h1>
        <p className="text-sm text-slate-500">
          Modify company branding, logo, and core location settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Branding & Logo upload */}
        <div className="space-y-6 lg:col-span-1">
          <GlassCard className="text-center space-y-4">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/80 rounded-3xl flex items-center justify-center border border-slate-200/50 dark:border-slate-850 overflow-hidden mx-auto shadow-inner">
              {user?.companyProfile?.logo ? (
                <img
<<<<<<< HEAD
                  src={getAssetUrl(user.companyProfile.logo)}
=======
                  src={`http://localhost:5000${user.companyProfile.logo}`}
>>>>>>> 5ad54ac356437c46391d42f18547dd0a7250531b
                  alt={user.companyProfile.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building className="text-slate-400" size={36} />
              )}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {user?.companyProfile?.companyName}
              </h3>
              <p className="text-xs text-slate-500 capitalize">
                Verification status: {' '}
                <span className={`
                  font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded-full
                  ${user?.companyProfile?.status === 'approved' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'}
                  ${user?.companyProfile?.status === 'pending' && 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'}
                  ${user?.companyProfile?.status === 'rejected' && 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'}
                `}>
                  {user?.companyProfile?.status}
                </span>
              </p>
            </div>
          </GlassCard>

          {/* Logo Upload Dropzone */}
          <GlassCard className="space-y-4">
            <h3 className="font-bold text-sm font-display uppercase tracking-wide text-primary-500">
              Company Logo Image
            </h3>

            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-850 hover:border-primary-500 rounded-2xl p-6 text-center cursor-pointer transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={logoUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <UploadCloud className="mx-auto text-slate-400" size={28} />
                <p className="text-xs font-semibold text-slate-650 dark:text-slate-350">
                  {logoUploading ? 'Uploading Logo...' : 'Upload Logo PNG/JPG'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">JPEG, PNG, or WEBP, max 2MB</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right: Main Profile form */}
        <div className="lg:col-span-2">
          <GlassCard>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building size={16} />
                    </div>
                    <input
                      type="text"
                      {...register('companyName', { required: 'Company name is required' })}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                        errors.companyName ? 'border-rose-500' : 'focus:border-primary-500'
                      }`}
                    />
                  </div>
                  {errors.companyName && <p className="mt-1 text-xs text-rose-500">{errors.companyName.message}</p>}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin size={16} />
                    </div>
                    <input
                      type="text"
                      {...register('location', { required: 'Location is required' })}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                        errors.location ? 'border-rose-500' : 'focus:border-primary-500'
                      }`}
                    />
                  </div>
                  {errors.location && <p className="mt-1 text-xs text-rose-500">{errors.location.message}</p>}
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Website URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe size={16} />
                  </div>
                  <input
                    type="url"
                    {...register('website')}
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500"
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Company Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-slate-400">
                    <ClipboardList size={16} />
                  </div>
                  <textarea
                    rows={6}
                    {...register('description', { required: 'Description is required' })}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                      errors.description ? 'border-rose-500' : 'focus:border-primary-500'
                    }`}
                    placeholder="Tell us about your organization..."
                  />
                </div>
                {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>}
              </div>

              {/* Save Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
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

export default CompanyProfile;
