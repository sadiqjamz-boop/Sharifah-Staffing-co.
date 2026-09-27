import { useState } from 'react';
import { supabase, ROLES } from '../lib/supabaseClient';

export default function ClientRequestPage() {
  const [form, setForm] = useState({
    client_name: '', phone: '', role: ROLES[0], location: '', notes: '',
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
      notes: form.notes.trim() || null,
    });
    setSaving(false);
        if (insertError) {
      setError('Error: ' + insertError.message);
      console.error(insertError);
      return;
    }

    }
    setSubmitted(true);
    setForm({ client_name: '', phone: '', role: ROLES[0], location: '', notes: '' });
  }

  return (
    <div className="card">
      <div className="row-title">New request</div>
      <label>Your name / business</label>
      <input value={form.client_name} onChange={(e) => update('client_name', e.target.value)} placeholder="e.g. Mrs. Adeyemi" />
      <label>Phone number</label>
      <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="080..." />
      <label>Type of staff needed</label>
      <select value={form.role} onChange={(e) => update('role', e.target.value)}>
        {ROLES.map((r) => <option key={r}>{r}</option>)}
      </select>
      <label>Location</label>
      <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Lekki Phase 1" />
      <label>Notes (schedule, requirements, etc.)</label>
      <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Full-time, live-in, experience with kids..." />
      {error && <div className="err">{error}</div>}
      {submitted && <div className="success">Request submitted. We'll be in touch on the phone number you provided once a match is found.</div>}
      <button className="primary" onClick={submit} disabled={saving}>
        {saving ? 'Submitting...' : 'Submit request'}
      </button>
    </div>
  );
}
