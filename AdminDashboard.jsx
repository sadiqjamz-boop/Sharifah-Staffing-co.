import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function esc(s) { return s || ''; }

export default function AdminDashboard() {
  const [workers, setWorkers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    const [{ data: w }, { data: r }] = await Promise.all([
      supabase.from('workers').select('*').order('created_at', { ascending: false }),
      supabase.from('requests').select('*').order('created_at', { ascending: false }),
    ]);
    setWorkers(w || []);
    setRequests(r || []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  async function toggleMedical(worker) {
    const next = worker.medical_status === 'cleared' ? 'pending' : 'cleared';
    await supabase.from('workers').update({ medical_status: next }).eq('id', worker.id);
    loadAll();
  }

  async function assign(requestId, workerId) {
    if (!workerId) return;
    await supabase.from('requests').update({ status: 'matched', matched_worker_id: workerId }).eq('id', requestId);
    loadAll();
  }

  async function markClosed(requestId) {
    await supabase.from('requests').update({ status: 'closed' }).eq('id', requestId);
    loadAll();
  }

  async function setInvoice(requestId, amount, invoiceStatus) {
    await supabase.from('requests').update({ invoice_amount: amount, invoice_status: invoiceStatus }).eq('id', requestId);
    loadAll();
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (loading) return <div className="empty">Loading...</div>;

  const openReqs = requests.filter((r) => r.status !== 'closed').length;
  const clearedWorkers = workers.filter((w) => w.medical_status === 'cleared').length;
  const matched = requests.filter((r) => r.status === 'matched' || r.status === 'closed').length;
  const revenue = requests
    .filter((r) => r.invoice_status === 'paid')
    .reduce((sum, r) => sum + (Number(r.invoice_amount) || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="small-btn" onClick={signOut}>Sign out</button>
      </div>

      <div className="stats">
        <div className="stat"><div className="n">{requests.length}</div><div className="l">Total requests</div></div>
        <div className="stat"><div className="n">{openReqs}</div><div className="l">Open</div></div>
        <div className="stat"><div className="n">{workers.length}</div><div className="l">Registered staff</div></div>
        <div className="stat"><div className="n">{clearedWorkers}</div><div className="l">Medically cleared</div></div>
        <div className="stat"><div className="n">{matched}</div><div className="l">Placements made</div></div>
        <div className="stat"><div className="n">₦{revenue.toLocaleString()}</div><div className="l">Revenue collected</div></div>
      </div>

      <div className="section-h">Client requests</div>
      {requests.length ? requests.map((r) => (
        <RequestRow
          key={r.id}
          request={r}
          workers={workers}
          onAssign={assign}
          onClose={markClosed}
          onInvoice={setInvoice}
        />
      )) : <div className="empty">No requests yet</div>}

      <div className="section-h">Staff — medical clearance</div>
      {workers.length ? workers.map((w) => (
        <div className="card" key={w.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="row-title">{esc(w.name)}</div>
              <div className="row-sub">{esc(w.role)} · {esc(w.location)} · {esc(w.phone)} · {esc(w.experience)}</div>
            </div>
            <button className="small-btn" onClick={() => toggleMedical(w)}>
              {w.medical_status === 'cleared' ? 'Revert' : 'Clear'}
            </button>
          </div>
        </div>
      )) : <div className="empty">No staff registered yet</div>}
    </div>
  );
}

function RequestRow({ request: r, workers, onAssign, onClose, onInvoice }) {
  const [pickedWorker, setPickedWorker] = useState('');
  const [amount, setAmount] = useState(r.invoice_amount || '');
  const eligible = workers.filter((w) => w.role === r.role && w.medical_status === 'cleared');
  const matchedWorker = workers.find((w) => w.id === r.matched_worker_id);
  const statusClass = r.status === 'matched' ? 'b-matched' : r.status === 'closed' ? 'b-closed' : 'b-pending';

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="row-title">{esc(r.role)} for {esc(r.client_name)}</div>
          <div className="row-sub">{esc(r.phone)} · {esc(r.location)}</div>
          {r.notes && <div className="row-sub">{esc(r.notes)}</div>}
          {matchedWorker && <div className="row-sub">Matched: {esc(matchedWorker.name)}</div>}
        </div>
        <span className={`badge ${statusClass}`}>{r.status}</span>
      </div>

      {r.status !== 'closed' && (
        <div style={{ marginTop: 8 }}>
          <select value={pickedWorker} onChange={(e) => setPickedWorker(e.target.value)}>
            <option value="">{eligible.length ? 'Assign cleared staff...' : 'No cleared staff for this role yet'}</option>
            {eligible.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="small-btn" style={{ flex: 1 }} onClick={() => onAssign(r.id, pickedWorker)}>Assign</button>
            {r.status === 'matched' && (
              <button className="small-btn" style={{ flex: 1 }} onClick={() => onClose(r.id)}>Mark closed</button>
            )}
          </div>
        </div>
      )}

      {r.status === 'matched' || r.status === 'closed' ? (
        <div style={{ marginTop: 10, borderTop: '0.5px solid var(--border)', paddingTop: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Invoice amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ flex: 1 }}
            />
            <span className={`badge ${r.invoice_status === 'paid' ? 'b-paid' : 'b-unpaid'}`}>{r.invoice_status}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="small-btn" style={{ flex: 1 }} onClick={() => onInvoice(r.id, amount || null, 'unpaid')}>Save amount</button>
            <button className="small-btn" style={{ flex: 1 }} onClick={() => onInvoice(r.id, amount || r.invoice_amount, 'paid')}>Mark paid</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
