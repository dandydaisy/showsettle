# 🤖 AI Chat Widget - Setup Guide

## What I Just Built

✅ **Floating chat button** (bottom right corner)  
✅ **Chat panel** with conversation UI  
✅ **AI-powered responses** (connects to OpenClaw)  
✅ **Feature extraction** (auto-creates feature requests from chat)  
✅ **Beautiful design** (matches the site aesthetic)  

---

## How It Works (User Perspective)

### **User Flow:**

1. **User clicks blue chat button** (bottom right)
2. **Chat opens** with greeting:
   > "Hey! 👋 I'm here to help you shape ShowSettle. What feature would make your life easier?"
3. **User types:** "Can you add PDF export?"
4. **AI responds:** "Great idea! Do you want it to include just the summary or itemized expenses too?"
5. **User answers:** "Itemized expenses would be helpful"
6. **AI responds:** "Perfect! I've logged this as 'PDF export with itemized expenses' - it'll show up on the voting board soon!"

### **Behind the Scenes:**

- Chat calls `/api/chat` endpoint
- API forwards to OpenClaw
- OpenClaw (you!) responds
- When feature is clear, AI extracts structured data:
  ```json
  {
    "title": "PDF export with itemized expenses",
    "description": "...",
    "priority": "high",
    "category": "export"
  }
  ```
- Feature gets added to voting board automatically

---

## What You Need to Enable It

### **Option 1: Use Your Local OpenClaw (Easiest)**

The app is configured to use `http://localhost:18789` by default.

**In Vercel:**
1. Settings → Environment Variables
2. Add:
   ```
   OPENCLAW_API_URL=http://localhost:18789
   OPENCLAW_API_TOKEN=<your-openclaw-token>
   ```

**Problem:** This won't work for production (localhost isn't accessible from Vercel).

---

### **Option 2: Expose OpenClaw Publicly (Recommended)**

You need OpenClaw accessible from the internet. Options:

#### **A. Ngrok (5 min setup)**
```bash
ngrok http 18789
```

Copy the https URL (e.g., `https://abc123.ngrok.io`)

**In Vercel env vars:**
```
OPENCLAW_API_URL=https://abc123.ngrok.io
OPENCLAW_API_TOKEN=<your-token>
```

#### **B. Tailscale Funnel (if you use Tailscale)**
```bash
tailscale funnel 18789
```

Gets you a public URL.

#### **C. Deploy OpenClaw on a VPS**
If you're already running OpenClaw on a server with a public IP, just use that URL.

---

### **Option 3: Use OpenRouter Directly (Simpler but Less Control)**

Skip OpenClaw entirely and call OpenRouter from the app:

**In Vercel env vars:**
```
OPENROUTER_API_KEY=<your-openrouter-key>
```

**Modify `/app/api/chat/route.ts`:**
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({...})
})
```

**Pro:** Works immediately  
**Con:** You don't get full control over the AI (can't see conversations, can't customize as easily)

---

## Current Status

✅ Chat widget built  
✅ UI working  
✅ API route created  
✅ Feature extraction logic ready  
⏳ **Needs:** OpenClaw endpoint URL + token (in Vercel env vars)  

---

## To Deploy the Update:

```bash
cd /root/.openclaw/workspace/showsettle
git push origin main
```

Vercel will auto-deploy the new version with the chat widget!

---

## Testing Locally

Want to see it work before deploying?

```bash
cd /root/.openclaw/workspace/showsettle
npm run dev
```

Open http://localhost:3000

Click the blue chat button → try chatting!

(It'll fail to connect unless you add the env vars, but you can see the UI)

---

## What Happens When Chat Works:

**Scenario 1: User asks about a feature**
```
User: "Can you track multiple shows?"
AI: "Absolutely! Would you prefer a list view or calendar?"
User: "Calendar"
AI: "Got it - logging 'Multi-show calendar view' as a feature request!"
→ Auto-added to /features voting board
```

**Scenario 2: User is vague**
```
User: "Make it better"
AI: "I'd love to help! What part of the settlement process feels clunky?"
User: "Entering expenses is annoying"
AI: "Would expense templates help? Like pre-defined categories?"
User: "Yes!"
AI: "Logging 'Expense templates by category' - thanks!"
```

**Scenario 3: User just wants to chat**
```
User: "Is this free?"
AI: "Yep! The calculator is free forever. We'll add premium features based on what users vote for."
```

---

## Next Step

**Choose your path:**

1. **Quick test:** Use OpenRouter directly (I can modify the code now)
2. **Full control:** Set up ngrok/tailscale to expose OpenClaw
3. **Later:** Skip chat for now, just ship the voting board

What do you want to do?
