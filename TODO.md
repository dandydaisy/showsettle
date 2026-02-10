# ShowSettle TODO

## ✅ Completed (Session 1)
- [x] Fix calculator to show commas as you type
- [x] Allow multiple votes on same feature (up or down)
- [x] Reduce colors (remove purple/pink gradients)
- [x] Email capture after 2+ votes (store in Supabase)
- [x] Confetti + highlight when feature approved via chat

## 🚧 Next Session
- [ ] Move leaderboard to top of page (first thing visitors see)
- [ ] Admin mode (password: "password")
  - Button in top right corner
  - Delete features from leaderboard
  - Overwrite vote counts manually
- [ ] Auto-build features at 10 votes
  - Detect when feature hits 10 votes
  - Move to "building" status
- [ ] Individual feature pages `/feature/[id]`
  - Show build progress
  - Link from leaderboard items
- [ ] Blog page `/blog`
  - First post: "How ShowSettle is changing the game for tour managers"
  - Talk about simplicity vs MasterTour

## Database Changes Needed
- [x] Create `emails` table in Supabase (SQL ready, needs to be run)
- [ ] Create `features_in_progress` table for tracking builds
- [ ] Create `blog_posts` table for blog content

## Notes
- See PROGRESS.md for detailed implementation notes
- Supabase migration files in `/supabase-migrations/`
- All changes pushed to GitHub (auto-deploys to Vercel)
