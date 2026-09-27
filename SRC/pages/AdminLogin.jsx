import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminLogin({ onLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signInError) {
      setError('Incorrect email or password.');
      return;
    }
    onLoggedIn();
  }

  return (
    <div className="card">
      <div className="row-title">Admin sign in</div>
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
      <label>Password</label>
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" onKeyDown={(e) => e.key === 'Enter' && submit()} />
      {error && <div className="err">{error}</div>}
      <button className="primary" onClick={submit} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </div>
  );
}
