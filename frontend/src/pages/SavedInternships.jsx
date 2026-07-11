import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Bookmark, MapPin, Briefcase, DollarSign, Calendar, Eye, Trash2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const SavedInternships = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/internships/student/bookmarks');
      if (res.data.success) {
        setBookmarks(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load saved bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (id, e) => {
    e.preventDefault();
    try {
      const res = await api.delete(`/internships/${id}/bookmark`);
      if (res.data.success) {
        setBookmarks(prev => prev.filter(job => job._id !== id));
        toast.success('Removed from bookmarks');
      }
    } catch (err) {
      toast.error('Failed to remove bookmark');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Bookmarked Internships
        </h1>
        <p className="text-sm text-slate-500">
          A list of jobs you saved for later review or applications.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <GlassCard className="text-center py-16 space-y-4">
          <Bookmark className="mx-auto text-slate-300 dark:text-slate-750 animate-bounce" size={40} />
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Your bookmark folder is currently empty.
          </p>
          <Link
            to="/dashboard/student/search"
            className="inline-block px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-primary-500/10"
          >
            Find Internships
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarks.map((job) => (
            <GlassCard key={job._id} className="flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-primary-500">
                    {job.company?.companyName}
                  </h4>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
                    {job.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <p className="flex items-center gap-1"><MapPin size={12} /> {job.location}</p>
                  <p className="flex items-center gap-1"><Briefcase size={12} /> {job.workMode}</p>
                  <p className="flex items-center gap-1"><DollarSign size={12} /> ${job.stipend}/mo</p>
                  <p className="flex items-center gap-1"><Calendar size={12} /> {job.duration}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={(e) => handleRemoveBookmark(job._id, e)}
                  className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold transition"
                >
                  <Trash2 size={14} /> Remove
                </button>
                <Link
                  to={`/dashboard/student/internship/${job._id}`}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-white rounded-xl text-xs font-bold transition"
                >
                  <Eye size={12} /> Details
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedInternships;
