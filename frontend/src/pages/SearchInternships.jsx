import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import api, { getAssetUrl } from '../services/api';
=======
import api from '../services/api';
>>>>>>> 5ad54ac356437c46391d42f18547dd0a7250531b
import { Search, MapPin, Briefcase, DollarSign, Calendar, SlidersHorizontal, Eye, Tag } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const SearchInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    workMode: '',
    minStipend: '',
    skills: '',
  });

  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const fetchInternships = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.workMode) queryParams.append('workMode', filters.workMode);
      if (filters.minStipend) queryParams.append('minStipend', filters.minStipend);
      if (filters.skills) queryParams.append('skills', filters.skills);
      queryParams.append('page', page);
      queryParams.append('limit', 6);

      const res = await api.get(`/internships?${queryParams.toString()}`);
      if (res.data.success) {
        setInternships(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships(1);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternships(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      workMode: '',
      minStipend: '',
      skills: '',
    });
    // Triggers fetch next tick
    setTimeout(() => {
      fetchInternships(1);
    }, 50);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Find Internships
          </h1>
          <p className="text-sm text-slate-500">
            Browse verified listings and submit applications in seconds.
          </p>
        </div>
        <button
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="lg:hidden flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <div className={`
          lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-6
          ${showFiltersMobile ? 'block' : 'hidden lg:block'}
        `}>
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm font-display tracking-wide uppercase text-primary-500">
              Filter Options
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-slate-450 hover:text-primary-500 hover:underline"
            >
              Clear all
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Keyword Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                  placeholder="e.g. Frontend developer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                placeholder="e.g. San Francisco"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Work Mode
              </label>
              <select
                name="workMode"
                value={filters.workMode}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
              >
                <option value="">Any Mode</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Minimum Stipend ($ / Month)
              </label>
              <input
                type="number"
                name="minStipend"
                value={filters.minStipend}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                placeholder="e.g. 500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Skills Required (Comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={filters.skills}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                placeholder="e.g. React, Node"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-primary-500/10"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Results Catalog */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : internships.length === 0 ? (
            <GlassCard className="text-center py-16 space-y-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No internships match your filter criteria at this time.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 text-xs font-semibold rounded-xl transition"
              >
                Clear Filters
              </button>
            </GlassCard>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {internships.map((job) => (
                  <GlassCard hoverEffect={true} key={job._id} className="flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Logo and company */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-center border border-slate-200/50 dark:border-slate-800 overflow-hidden">
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
                            <Briefcase className="text-slate-400" size={20} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs uppercase tracking-wider text-primary-500">
                            {job.company?.companyName}
                          </h4>
                          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
                            {job.title}
                          </h3>
                        </div>
                      </div>

                      {/* Info Pills */}
                      <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-slate-400" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Briefcase size={14} className="text-slate-400" />
                          <span>{job.workMode}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign size={14} className="text-slate-400" />
                          <span>{job.stipend ? `$${job.stipend}/mo` : 'Unpaid'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" />
                          <span>{job.duration}</span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-md"
                          >
                            <Tag size={8} /> {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/dashboard/student/internship/${job._id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <Eye size={12} /> View Details
                      </Link>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-4">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => fetchInternships(pagination.page - 1)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold disabled:opacity-50 transition"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-slate-500">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    disabled={pagination.page === pagination.pages}
                    onClick={() => fetchInternships(pagination.page + 1)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold disabled:opacity-50 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchInternships;
