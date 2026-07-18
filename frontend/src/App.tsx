import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { PatternLibrary } from './pages/PatternLibrary';
import { PatternDetail } from './pages/PatternDetail';
import { ProblemDetail } from './pages/ProblemDetail';
import { Companies } from './pages/Companies';
import { CompanyDetail } from './pages/CompanyDetail';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#080C14]">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Main Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patterns"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PatternLibrary />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patterns/:slug"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PatternDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/problems/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProblemDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Companies />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies/:slug"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CompanyDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
