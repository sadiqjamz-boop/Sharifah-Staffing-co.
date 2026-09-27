import { useState } from 'react';
import { supabase, ROLES } from '../lib/supabaseClient';

export default function ClientRequestPage() {
  const [form, setForm] = useState({
    client_name: '', role: ROLES[0], location: '', start_date: '', phone: '', notes: '',
  });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit() {
    if (!form.client_name.trim() || !form.phone.trim() || !form.location.trim()) {
      setError('Please fill in your name, phone and location.');
      return;
    }
    setError('');
    setSaving(true);
    const { error: insertError } = await supabase.from('requests').insert({
      client_name: form.client_name.trim(),
      phone: form.phone.trim(),
      role: form.role,
      location: form.location.trim(),
      start_date: form.start_date || null,
      notes: form.notes.trim() || null,
    });
    setSaving(false);
    if (insertError) {
      setError('Error: ' + insertError.message);
      console.error(insertError);
      return;
    }
    setSubmitted(true);
    setForm({ client_name: '', role: ROLES[0], location: '', start_date: '', phone: '', notes: '' });
  }

  return (
    <div className="card">
      <div className="row-title">Request Staff</div>
      <div className="row-sub" style={{ marginBottom: 6 }}>
        Tell us what you need and we'll find the right match.
      </div>
      <label>Staff Role</label>
      <select value={form.role} onChange={(e) => update('role', e.target.value)}>
        {ROLES.map((r) => <option key={r}>{r}</option>)}
      </select>
      <label>Location</label>
      <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Abuja, Nigeria" />
      <label>Start Date</label>
      <input value={form.start_date} onChange={(e) => update('start_date', e.target.value)} type="date" />
      <label>Your name / business</label>
      <input value={form.client_name} onChange={(e) => update('client_name', e.target.value)} placeholder="e.g. Mrs. Adeyemi" />
      <label>Phone number</label>
      <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="080..." />
      <label>Notes (schedule, requirements, etc.)</label>
      <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Full-time, live-in, experience with kids..." />
      {error && <div className="err">{error}</div>}
      {submitted && <div className="success">Request submitted. We'll be in touch on the phone number you provided once a match is found.</div>}
      <button className="primary" onClick={submit} disabled={saving}>
        {saving ? 'Submitting...' : 'Submit Request'}
      </button>
    </div>
  );
}
