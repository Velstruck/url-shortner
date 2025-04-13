import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { loadUser } from './store/features/authSlice';

import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import UrlShortener from './components/url/UrlShortener';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) return <div className="text-center py-10">Checking authentication...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    dispatch(loadUser()).finally(() => setInitialLoadComplete(true));
  }, [dispatch]);

  if (!initialLoadComplete) {
    return <div className="text-center py-10">Loading App...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <UrlShortener />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
