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
  user_id text not null,
  vote_direction int check (vote_direction in (-1, 1)),
  created_at timestamp with time zone default now(),
  unique(feature_id, user_id)
);

-- Enable Row Level Security
alter table feature_requests enable row level security;
alter table feature_votes enable row level security;

-- Drop existing policies if they exist (safe - won't error if they don't exist)
drop policy if exists "Feature requests are viewable by everyone" on feature_requests;
drop policy if exists "Anyone can insert features" on feature_requests;
drop policy if exists "Anyone can update feature vote counts" on feature_requests;
drop policy if exists "Votes are viewable by everyone" on feature_votes;
drop policy if exists "Anyone can vote" on feature_votes;

-- Create policies
create policy "Feature requests are viewable by everyone"
  on feature_requests for select
  using (true);

create policy "Anyone can insert features"
  on feature_requests for insert
  with check (true);

create policy "Anyone can update feature vote counts"
  on feature_requests for update
  using (true);

create policy "Votes are viewable by everyone"
  on feature_votes for select
  using (true);

create policy "Anyone can vote"
  on feature_votes for insert
  with check (true);

-- Insert initial features (only if table is empty)
insert into feature_requests (title, description, votes)
select * from (values
  ('Save settlement history', 'Track all your past settlements in one place', 12),
  ('Export to PDF', 'Download settlement sheets as PDF documents', 8),
  ('Multi-show tour tracking', 'Manage entire tours with calendar view', 15),
  ('Expense categories breakdown', 'Organize expenses by category (sound, lights, catering, etc.)', 6),
  ('Multiple deal structures', 'Support for 90/10, 85/15, vs vs, and custom splits', 10)
) as t(title, description, votes)
where not exists (select 1 from feature_requests limit 1);
