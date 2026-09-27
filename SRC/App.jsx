import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import ClientRequestPage from './pages/ClientRequestPage';
import WorkerRegisterPage from './pages/WorkerRegisterPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckedSession(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div>
      <header>
        <h1>🏠 STAFFLINK</h1>
        <p className="tagline">The right help. Complete peace of mind.</p>
        <nav>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Request Staff</Link>
          <Link to="/join" className={location.pathname === '/join' ? 'active' : ''}>Join Our Team</Link>
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ClientRequestPage />} />
          <Route path="/join" element={<WorkerRegisterPage />} />
          <Route
            path="/admin"
            element={
              !checkedSession ? (
                <div className="empty">Loading...</div>
              ) : session ? (
                <AdminDashboard />
              ) : (
                <AdminLogin onLoggedIn={() => {}} />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}
