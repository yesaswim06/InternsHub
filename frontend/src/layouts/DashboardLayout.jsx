import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  Bookmark,
  FileSpreadsheet,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Building,
  PlusCircle,
  Users,
  Briefcase,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import toast from 'react-hot-toast';

const LogoIcon = ({ size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ width: size, height: size }}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M5 17c0 1.5 3 3 7 3s7-1.5 7-3" />
    <path d="M2 17l10 5 10-5" />
    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to InternsHub!', read: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sync Dark/Light theme class on HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getNavigation = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'student':
        return [
          { name: 'Overview', path: '/dashboard/student', icon: LayoutDashboard },
          { name: 'Search Internships', path: '/dashboard/student/search', icon: Search },
          { name: 'Applied Internships', path: '/dashboard/student/applied', icon: FileSpreadsheet },
          { name: 'Bookmarks', path: '/dashboard/student/bookmarks', icon: Bookmark },
          { name: 'My Profile', path: '/dashboard/student/profile', icon: User },
        ];
      case 'company':
        return [
          { name: 'Overview', path: '/dashboard/company', icon: LayoutDashboard },
          { name: 'Post Internship', path: '/dashboard/company/post', icon: PlusCircle },
          { name: 'Applicants List', path: '/dashboard/company/applicants', icon: Users },
          { name: 'Company Profile', path: '/dashboard/company/profile', icon: Building },
        ];
      case 'admin':
        return [
          { name: 'Overview', path: '/dashboard/admin', icon: LayoutDashboard },
          { name: 'Manage Users', path: '/dashboard/admin/users', icon: Users },
          { name: 'Manage Companies', path: '/dashboard/admin/companies', icon: ShieldCheck },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans grid-bg">
      {/* Sidebar for Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80
        flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold font-display shadow-md shadow-primary-500/20">
              <LogoIcon size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
              InternsHub
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 shadow-sm shadow-primary-500/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50 border border-transparent'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-primary-500' : 'text-slate-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950/60 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold font-display shadow-inner">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                {user?.name || 'User'}
              </p>
              <p className="text-xs truncate text-slate-500 dark:text-slate-400 capitalize">
                {user?.role || 'Guest'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-950/40 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 text-sm font-semibold transition"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Menu size={20} />
            </button>
            <h2 className="hidden sm:block text-lg font-bold font-display tracking-tight text-slate-800 dark:text-white">
              {navigation.find((n) => n.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition relative"
              >
                <Bell size={18} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm font-display">Notifications</span>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                      className="text-xs text-primary-500 font-semibold hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl text-xs flex gap-2 ${n.read ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-500' : 'bg-primary-500/10 text-slate-800 dark:text-slate-200 font-medium border border-primary-500/10'}`}
                      >
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <p>{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
