import { useState } from 'react';
import { supabase, ROLES } from '../lib/supabaseClient';

export default function WorkerRegisterPage() {
  const [form, setForm] = useState({
    name: '', phone: '', role: ROLES[0], experience: '', location: '',
  });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit() {
    if (!form.name.trim() || !form.phone.trim() || !form.location.trim()) {
      setError('Please fill in your name, phone and location.');
      return;
    }
    setError('');
    setSaving(true);
    const { error: insertError } = await supabase.from('workers').insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      role: form.role,
      experience: form.experience.trim() || null,
      location: form.location.trim(),
    });
    setSaving(false);
    if (insertError) {
      setError('Something went wrong registering you. Please try again.');
      console.error(insertError);
      return;
    }
    setSubmitted(true);
    setForm({ name: '', phone: '', role: ROLES[0], experience: '', location: '' });
  }

  return (
    <div className="card">
      <div className="row-title">Register as staff</div>
      <label>Full name</label>
      <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" />
      <label>Phone number</label>
      <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="080..." />
      <label>Role</label>
      <select value={form.role} onChange={(e) => update('role', e.target.value)}>
        {ROLES.map((r) => <option key={r}>{r}</option>)}
      </select>
      <label>Experience</label>
      <input value={form.experience} onChange={(e) => update('experience', e.target.value)} placeholder="e.g. 3 years" />
      <label>Location</label>
      <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Ikeja" />
      {error && <div className="err">{error}</div>}
      {submitted && <div className="success">You're registered. You'll be contacted about the next step for your medical check.</div>}
      <button className="primary" onClick={submit} disabled={saving}>
        {saving ? 'Submitting...' : 'Register'}
      </button>
    </div>
  );
}
