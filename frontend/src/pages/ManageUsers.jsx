import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Trash2, Mail, ShieldAlert, Calendar } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { TableRowSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user account? All associated profile data, applications, and postings will be permanently deleted.')) {
      return;
    }

    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        toast.success('User account removed successfully');
        setUsers(prev => prev.filter(u => u._id !== id));
      }
    } catch (err) {
      toast.error('Failed to remove user account');
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Manage Users
          </h1>
          <p className="text-sm text-slate-500">
            View system profiles and revoke portal access.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, or role..."
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 max-w-xs"
        />
      </div>

      {/* Grid Table */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-150 dark:divide-slate-800 text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {loading ? (
                <>
                  <TableRowSkeleton cols={5} />
                  <TableRowSkeleton cols={5} />
                </>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-450">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 text-slate-650 dark:text-slate-350 flex items-center gap-1">
                      <Mail size={12} className="text-slate-400" /> {u.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                        ${u.role === 'student' && 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'}
                        ${u.role === 'company' && 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400'}
                      `}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 border border-rose-250 hover:bg-rose-50 text-rose-500 dark:border-rose-950/40 dark:hover:bg-rose-950/20 rounded-lg transition"
                        title="Delete User Account"
                      >
                        <Trash2 size={14} />
                      </button>
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

export default ManageUsers;
