import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Building, MapPin, Globe, ArrowLeft, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import { LogoIcon } from './Landing';

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Set default tab based on query param or default to student
  const [role, setRole] = useState(searchParams.get('role') || 'student');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const queryRole = searchParams.get('role');
    if (queryRole && ['student', 'company'].includes(queryRole)) {
      setRole(queryRole);
    }
  }, [searchParams]);

  const password = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    
    // Structure payload based on role
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: role,
    };

    if (role === 'company') {
      payload.companyName = data.companyName;
      payload.description = data.description;
      payload.location = data.location;
      payload.website = data.website;
    }

    const res = await registerAuth(payload);
    setSubmitting(false);

    if (res.success) {
      toast.success('Registration successful!');
      setTimeout(() => {
        window.location.href = '/dashboard'; // Redirect to dashboard wrapper
      }, 100);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 grid-bg">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} /> Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold font-display shadow-lg shadow-primary-500/20 mx-auto mb-4">
          <LogoIcon size={24} className="text-white" />
        </div>
        <h2 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Create a new account
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        {/* Role Toggle Tabs */}
        <div className="flex bg-slate-200/60 dark:bg-slate-900/60 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
              role === 'student'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-450 dark:hover:text-slate-300'
            }`}
          >
            Student Sign Up
          </button>
          <button
            type="button"
            onClick={() => setRole('company')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
              role === 'company'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-450 dark:hover:text-slate-300'
            }`}
          >
            Company Sign Up
          </button>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Core User Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                      errors.name ? 'border-rose-500' : 'focus:border-primary-500'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email',
                      },
                    })}
                    className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                      errors.email ? 'border-rose-500' : 'focus:border-primary-500'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Must be at least 6 chars' },
                    })}
                    className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                      errors.password ? 'border-rose-500' : 'focus:border-primary-500'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: value => value === password || 'Passwords do not match',
                    })}
                    className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                      errors.confirmPassword ? 'border-rose-500' : 'focus:border-primary-500'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Company Specific Profile Fields */}
            {role === 'company' && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-primary-500">
                  Company Details
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Company Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Building size={16} />
                      </div>
                      <input
                        type="text"
                        {...register('companyName', { required: 'Company Name is required' })}
                        className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                          errors.companyName ? 'border-rose-500' : 'focus:border-primary-500'
                        }`}
                        placeholder="Google"
                      />
                    </div>
                    {errors.companyName && (
                      <p className="mt-1 text-xs text-rose-500">{errors.companyName.message}</p>
                    )}
                  </div>

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
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-xs text-rose-500">{errors.location.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Website URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Globe size={16} />
                    </div>
                    <input
                      type="text"
                      {...register('website')}
                      className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500"
                      placeholder="https://google.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Company Description
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-slate-400">
                      <ClipboardList size={16} />
                    </div>
                    <textarea
                      rows={3}
                      {...register('description', { required: 'Description is required' })}
                      className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${
                        errors.description ? 'border-rose-500' : 'focus:border-primary-500'
                      }`}
                      placeholder="Tell us about your organization..."
                    />
                  </div>
                  {errors.description && (
                    <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default Register;
