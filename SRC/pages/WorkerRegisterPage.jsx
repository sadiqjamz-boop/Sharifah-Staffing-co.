import { useState } from 'react';
import { supabase, ROLES, AVAILABILITY } from '../lib/supabaseClient';

export default function WorkerRegisterPage() {
  const [form, setForm] = useState({
    name: '', phone: '', location: '', age: '', role: ROLES[0],
    experience: '', availability: AVAILABILITY[0], references: '',
  });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit() {
    if (!form.name.trim() || !form.location.trim() || !form.age.trim()) {
      setError('Please fill in your name, location and age.');
      return;
    }
    setError('');
    setSaving(true);
    const { error: insertError } = await supabase.from('workers').insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      age: form.age ? Number(form.age) : null,
      role: form.role,
      experience: form.experience.trim() || null,
      availability: form.availability,
      references_count: form.references ? Number(form.references) : null,
    });
    setSaving(false);
    if (insertError) {
      setError('Error: ' + insertError.message);
      console.error(insertError);
      return;
    }
    setSubmitted(true);
    setForm({
      name: '', phone: '', location: '', age: '', role: ROLES[0],
      experience: '', availability: AVAILABILITY[0], references: '',
    });
  }

  return (
    <div className="card">
      <div className="row-title">Create Your Profile</div>
      <div className="row-sub" style={{ marginBottom: 6 }}>
        Tell us about yourself. We'll match you with the right opportunities.
      </div>
      <label>Full Name</label>
      <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Enter your full name" />
      <label>Phone number</label>
      <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="080..." />
      <label>Location</label>
      <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Select your location" />
      <label>Age</label>
      <input value={form.age} onChange={(e) => update('age', e.target.value)} type="number" placeholder="Enter your age" />
      <label>Preferred Role</label>
      <select value={form.role} onChange={(e) => update('role', e.target.value)}>
        {ROLES.map((r) => <option key={r}>{r}</option>)}
      </select>
      <label>Years of Experience</label>
      <input value={form.experience} onChange={(e) => update('experience', e.target.value)} placeholder="Select experience" />
      <label>Availability</label>
      <select value={form.availability} onChange={(e) => update('availability', e.target.value)}>
        {AVAILABILITY.map((a) => <option key={a}>{a}</option>)}
      </select>
      <label>References</label>
      <input value={form.references} onChange={(e) => update('references', e.target.value)} type="number" placeholder="Number of references" />
      {error && <div className="err">{error}</div>}
      {submitted && <div className="success">You're registered. You'll be contacted about the next step for your medical check.</div>}
      <button className="primary" onClick={submit} disabled={saving}>
        {saving ? 'Submitting...' : 'Submit Profile'}
      </button>
    </div>
  );
}
