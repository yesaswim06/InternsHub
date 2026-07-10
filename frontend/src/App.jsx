import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Layouts & Guard
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Student pages
import StudentDashboard from './pages/StudentDashboard';
import SearchInternships from './pages/SearchInternships';
import InternshipDetail from './pages/InternshipDetail';
import StudentProfile from './pages/StudentProfile';
import SavedInternships from './pages/SavedInternships';
import AppliedInternships from './pages/AppliedInternships';

// Company pages
import CompanyDashboard from './pages/CompanyDashboard';
import PostInternship from './pages/PostInternship';
import InternshipApplicants from './pages/InternshipApplicants';
import CompanyProfile from './pages/CompanyProfile';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageCompanies from './pages/ManageCompanies';

// Error pages
import NotFound from './pages/NotFound';

// Dashboard router index redirector
const DashboardIndexRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'student') return <Navigate to="/dashboard/student" replace />;
  if (user.role === 'company') return <Navigate to="/dashboard/company" replace />;
  if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Secure Dashboards */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Redirect Handler */}
            <Route index element={<DashboardIndexRedirect />} />

            {/* Student Hub Routes */}
            <Route
              path="student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/search"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <SearchInternships />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/internship/:id"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <InternshipDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/applied"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AppliedInternships />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/bookmarks"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <SavedInternships />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            {/* Company Hub Routes */}
            <Route
              path="company"
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="company/post"
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <PostInternship />
                </ProtectedRoute>
              }
            />
            <Route
              path="company/post/:id"
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <PostInternship />
                </ProtectedRoute>
              }
            />
            <Route
              path="company/applicants"
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <InternshipApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="company/profile"
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />

            {/* Admin Hub Routes */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/companies"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageCompanies />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      {/* Global Notifications Alert Handler */}
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'dark:bg-slate-900 dark:text-white dark:border dark:border-slate-800 text-sm font-sans',
          duration: 3000,
        }}
      />
    </AuthProvider>
  );
}

export default App;
