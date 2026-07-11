import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import { LogoIcon } from './Landing';

const ForgotPassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post('/auth/forgotpassword', { email: data.email });
      if (res.data.success) {
        setSuccess(true);
        toast.success('Mock reset email sent successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to request reset link.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 grid-bg">
      <div className="absolute top-6 left-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold font-display shadow-lg shadow-primary-500/20 mx-auto mb-4">
          <LogoIcon size={24} className="text-white" />
        </div>
        <h2 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Recover Password
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Enter your email to receive a password reset verification.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <GlassCard>
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Check your inbox
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A verification link has been dispatched to your email with instruction guidelines.
              </p>
              <Link
                to="/login"
                className="inline-block mt-4 text-sm font-bold text-primary-500 hover:underline"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={`
                      block w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50/50 dark:bg-slate-950/40 
                      text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25
                      ${errors.email ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'}
                    `}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 transition-all duration-200 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Request Password Reset'
                )}
              </button>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default ForgotPassword;
