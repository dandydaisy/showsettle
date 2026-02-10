#!/bin/bash

echo "🚀 ShowSettle Quick Deploy"
echo ""
echo "Step 1/2: Installing Vercel CLI..."
npm install -g vercel

echo ""
echo "Step 2/2: Deploying to Vercel..."
echo "When prompted:"
echo "  - Set up and deploy? → Yes"
echo "  - Which scope? → Your username"
echo "  - Link to existing project? → No"
echo "  - Project name: → showsettle"
echo "  - Directory: → ./ (default)"
echo "  - Override settings? → No"
echo ""

vercel --prod

echo ""
echo "✅ DONE!"
echo ""
echo "Next: Add your custom domain in Vercel dashboard"
echo "Then update DNS at your registrar"
