# ShowSettle TODO

## ✅ Completed
- [x] Fix calculator to show commas as you type
- [x] Allow multiple votes on same feature (up or down)
- [x] Reduce colors (remove purple/pink gradients)

## 🚧 In Progress
- [ ] Email capture after 2+ votes (store in Supabase)
- [ ] Confetti + highlight when feature approved via chat
- [ ] Move leaderboard to top of page
- [ ] Auto-build features at 10 votes
- [ ] Individual feature pages
- [ ] Admin mode (password: "password")
  - Delete features
  - Overwrite vote counts
- [ ] Blog page
  - First post: "How ShowSettle is changing the game for tour managers"

## Database Changes Needed
- [ ] Create `emails` table in Supabase
- [ ] Create `features_in_progress` table for building features
- [ ] Create `blog_posts` table

## Notes
- Email prompt: After user casts 2nd vote total
- Confetti library: canvas-confetti
- Admin button: Top right corner, simple password check
- Feature pages: `/feature/[id]` with build progress
