-- Feature requests table
create table if not exists feature_requests (
  id bigserial primary key,
  title text not null,
  description text,
  votes int default 0,
  status text default 'pending',
  category text default 'general',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Votes table (track individual votes)
create table if not exists feature_votes (
  id bigserial primary key,
  feature_id bigint references feature_requests(id) on delete cascade,
  user_id text not null, -- fingerprint or session ID for now (no auth yet)
  vote_direction int check (vote_direction in (-1, 1)),
  created_at timestamp with time zone default now(),
  unique(feature_id, user_id)
);

-- Enable Row Level Security
alter table feature_requests enable row level security;
alter table feature_votes enable row level security;

-- Policies: Anyone can read
create policy if not exists "Feature requests are viewable by everyone"
  on feature_requests for select
  using (true);

create policy if not exists "Anyone can insert features"
  on feature_requests for insert
  with check (true);

create policy if not exists "Anyone can update feature vote counts"
  on feature_requests for update
  using (true);

create policy if not exists "Votes are viewable by everyone"
  on feature_votes for select
  using (true);

create policy if not exists "Anyone can vote"
  on feature_votes for insert
  with check (true);

-- Insert initial features
insert into feature_requests (title, description, votes) values
  ('Save settlement history', 'Track all your past settlements in one place', 12),
  ('Export to PDF', 'Download settlement sheets as PDF documents', 8),
  ('Multi-show tour tracking', 'Manage entire tours with calendar view', 15),
  ('Expense categories breakdown', 'Organize expenses by category (sound, lights, catering, etc.)', 6),
  ('Multiple deal structures', 'Support for 90/10, 85/15, vs vs, and custom splits', 10)
on conflict do nothing;
