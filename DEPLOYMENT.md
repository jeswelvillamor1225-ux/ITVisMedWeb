# Vercel Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```
VITE_FIREBASE_API_KEY=AIzaSyADJPo270xFJWb4LvdwsT0bFfBX6ZmRwEk
VITE_FIREBASE_AUTH_DOMAIN=website-7e897.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=website-7e897
VITE_FIREBASE_STORAGE_BUCKET=website-7e897.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=519082781158
VITE_FIREBASE_APP_ID=1:519082781158:web:6bfe071df3173616bc4e27
VITE_FIREBASE_MEASUREMENT_ID=G-0G5X9GDDLM
```

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment issues"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to your Vercel dashboard
   - Select your repository
   - Vercel will automatically detect it's a Vite + React project
   - Add the environment variables in the project settings
   - Deploy

### Fixed Issues

✅ **Client-side routing** - Added `vercel.json` for proper SPA routing
✅ **Environment variables** - Firebase config now uses environment variables
✅ **Build optimization** - Updated Vite config for production builds
✅ **TypeScript errors** - Fixed manualChunks syntax

### Routes Configuration

The `vercel.json` handles these routes:
- `/` → Main website
- `/admin` → Admin portal
- `/tickets` → Ticket management
- `/dashboard` → User dashboard
- All other routes → Fallback to `index.html` (SPA routing)

### Troubleshooting

If you still encounter errors:

1. **Check environment variables** in Vercel dashboard
2. **Verify build logs** in Vercel deployment tab
3. **Check Firebase configuration** is correct
4. **Ensure all dependencies** are installed

### Build Commands Used

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
