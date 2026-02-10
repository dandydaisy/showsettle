# 🚀 Deploy ShowSettle in 5 Minutes

## What's Ready

✅ Full Next.js app  
✅ Settlement calculator (working)  
✅ Feature voting page (working)  
✅ Beautiful UI  
✅ Git repo initialized  
✅ Production build tested  

---

## Step 1: Push to GitHub (2 minutes)

### Option A: GitHub CLI (Easiest)

```bash
cd /root/.openclaw/workspace/showsettle
gh auth login
gh repo create showsettle --public --source=. --push
```

### Option B: Manual

1. Go to https://github.com/new
2. Repository name: `showsettle`
3. Public
4. Don't initialize with README (we have one)
5. Create repository
6. Copy the commands shown, then run:

```bash
cd /root/.openclaw/workspace/showsettle
git remote add origin https://github.com/YOUR_USERNAME/showsettle.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel (2 minutes)

### Option A: CLI (Faster)

```bash
npm install -g vercel
cd /root/.openclaw/workspace/showsettle
vercel login
vercel --prod
```

### Option B: Web UI (Easier)

1. Go to https://vercel.com/new
2. Import Git Repository → select `showsettle`
3. Framework Preset: Next.js ✅ (auto-detected)
4. Click **Deploy**
5. Wait 60 seconds → Done!

You'll get a URL like: `showsettle.vercel.app`

---

## Step 3: Add Your Domain (1 minute)

In Vercel:

1. Project Settings → Domains
2. Add Domain: `showsettle.com`
3. Copy the DNS records

Then at your domain registrar (where you bought showsettle.com):

**Add these DNS records:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Wait 5-10 minutes → `showsettle.com` will be live!

---

## What You'll See

### Homepage (showsettle.com)
- Big headline: "ShowSettle - Settle shows in 30 seconds"
- Calculator form:
  - GBOR input
  - Guarantee input
  - Expenses input
  - Split % input
  - Calculate button
- Results display:
  - Total Profit
  - Your Take (highlighted in green)
  - Promoter Take
- CTA: "What should we build next?" → links to /features

### Features Page (showsettle.com/features)
- "What should we build next?" headline
- 5 pre-loaded feature suggestions:
  1. Save settlement history (12 votes)
  2. Export to PDF (8 votes)
  3. Multi-show tour tracking (15 votes) ← top voted
  4. Expense categories (6 votes)
  5. Multiple deal structures (10 votes)
- Submit custom feature form
- Upvote buttons

---

## Next: Make It Persistent (Supabase)

Right now votes are client-side only (refresh = reset). To make it real:

1. Create Supabase project (free): https://supabase.com/dashboard
2. Run the SQL schema (in SETUP.md)
3. Add env vars to Vercel
4. Redeploy

**But the MVP works NOW** — you can start showing it to people immediately!

---

## Test It Locally First

```bash
cd /root/.openclaw/workspace/showsettle
npm run dev
```

Open: http://localhost:3000

Try calculating a settlement → see if it works → then deploy!

---

## Current Status

📍 **Location:** `/root/.openclaw/workspace/showsettle`  
✅ **Build:** Passing  
✅ **Components:** All working  
⏳ **GitHub:** Waiting for you to push  
⏳ **Live:** Waiting for Vercel deploy  

**Total build time:** ~45 minutes

**You're literally 3 commands away from having this live:**

```bash
gh repo create showsettle --public --source=. --push
vercel --prod
# Add domain in Vercel UI
```

Let me know when it's live! 🚀
