-- StaffLink database schema
-- Run this in your Supabase project: SQL Editor -> New query -> paste -> Run

create extension if not exists "pgcrypto";

-- Workers (staff who register: cooks, drivers, gatemen, house help)
create table workers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  role text not null,
  experience text,
  location text not null,
  medical_status text not null default 'pending' check (medical_status in ('pending', 'cleared')),
  created_at timestamptz not null default now()
);

-- Client requests
create table requests (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  phone text not null,
  role text not null,
  location text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'matched', 'closed')),
  matched_worker_id uuid references workers(id) on delete set null,
  invoice_amount numeric(12,2),
  invoice_status text not null default 'unpaid' check (invoice_status in ('unpaid', 'paid', 'waived')),
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table workers enable row level security;
alter table requests enable row level security;

-- Public (anon key) can INSERT their own registration/request, but cannot read others' data.
-- This keeps phone numbers and personal notes private from other clients/workers.
create policy "anyone can register as a worker"
  on workers for insert
  to anon
  with check (true);

create policy "anyone can submit a request"
  on requests for insert
  to anon
  with check (true);

-- Only authenticated users (your sister's admin login) can read/update/delete everything.
create policy "admin can read workers"
  on workers for select
  to authenticated
  using (true);

create policy "admin can update workers"
  on workers for update
  to authenticated
  using (true);

create policy "admin can read requests"
  on requests for select
  to authenticated
  using (true);

create policy "admin can update requests"
  on requests for update
  to authenticated
  using (true);

create policy "admin can delete requests"
  on requests for delete
  to authenticated
  using (true);
