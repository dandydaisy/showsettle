# ShowSettle Setup Guide

## Quick Deploy (5 minutes)

### 1. Push to GitHub

```bash
cd /root/.openclaw/workspace/showsettle
git init
git add .
git commit -m "Initial commit: ShowSettle MVP"

# Create repo (using GitHub CLI)
gh repo create showsettle --public --source=. --push

# Or manually:
# 1. Go to github.com/new
# 2. Name: showsettle
# 3. Copy the remote URL
# 4. git remote add origin <url>
# 5. git push -u origin main
```

### 2. Deploy to Vercel

**Option A: CLI (Fastest)**
```bash
npm install -g vercel
vercel
# Follow prompts, link to your GitHub repo
vercel --prod
```

**Option B: Web UI**
1. Go to vercel.com
2. "New Project"
3. Import from GitHub → `showsettle`
4. Framework Preset: Next.js (auto-detected)
5. Click "Deploy"

### 3. Add Custom Domain

In Vercel dashboard:
1. Project Settings → Domains
2. Add: `showsettle.com`
3. Copy the DNS records shown
4. Go to your domain registrar (Namecheap/Porkbun/etc)
5. Add the A/CNAME records
6. Wait 5-10 min for propagation

### 4. Setup Supabase (Optional - for user accounts & voting persistence)

1. Go to supabase.com → New Project
2. Name: `showsettle`
3. Generate strong password
4. Wait for database to spin up (~2 min)
5. Copy:
   - Project URL
   - Anon/public key
6. Add to Vercel → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
   ```
7. Redeploy in Vercel

### 5. Create Database Tables (Supabase)

Run this SQL in Supabase SQL Editor:

```sql
-- Feature requests table
create table feature_requests (
  id bigserial primary key,
  title text not null,
  description text,
  votes int default 1,
  status text default 'pending',
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id)
);

-- Enable Row Level Security
alter table feature_requests enable row level security;

-- Policy: Anyone can read
create policy "Feature requests are viewable by everyone"
  on feature_requests for select
  using (true);

-- Policy: Authenticated users can insert
create policy "Authenticated users can create features"
  on feature_requests for insert
  with check (auth.role() = 'authenticated');

-- Votes table
create table feature_votes (
  id bigserial primary key,
  feature_id bigint references feature_requests(id) on delete cascade,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  unique(feature_id, user_id)
);

alter table feature_votes enable row level security;

create policy "Votes are viewable by everyone"
  on feature_votes for select
  using (true);

create policy "Authenticated users can vote"
  on feature_votes for insert
  with check (auth.role() = 'authenticated');
```

---

## Current Status

✅ Next.js app created  
✅ Calculator component built  
✅ Feature voting page created  
✅ UI components (Card, Button, Input, Label)  
✅ Tailwind configured  

**Next: Push to GitHub + Deploy to Vercel**

---

## Test Locally

```bash
cd /root/.openclaw/workspace/showsettle
npm run dev
```

Open http://localhost:3000

---

## What's Working Now

- Settlement calculator (GBOR, Guarantee, Expenses, Split %)
- Results display (Profit, Band Take, Promoter Take)
- Feature voting page (5 pre-loaded suggestions)
- Upvote functionality (client-side for now)
- Submit custom feature requests

## What's Next (After Deploy)

1. Connect Supabase for persistence
2. Add AI chat widget
3. Build the automation loop (OpenClaw cron → build features)
4. Marketing content generation
