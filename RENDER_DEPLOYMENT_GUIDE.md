# Complete Guide: Deploy ML Platform on Render (FREE)

## 📋 Pre-Requirements
✅ GitHub account (already have it)
✅ Render account (free)
✅ Project pushed to GitHub (already done)

---

## 🚀 Step-by-Step Deployment Guide

### **STEP 1: Create Render Account**

1. Go to https://render.com
2. Click "Sign Up"
3. Select "Sign up with GitHub"
4. Authorize Render to access your GitHub account
5. Complete registration

---

### **STEP 2: Create Backend Service**

1. **Go to Dashboard**: https://dashboard.render.com
2. **Click "+ New"** → Select **"Web Service"**
3. **Connect Repository**:
   - Search: "AlgorithmAnalysis"
   - Click "Connect"
   - Grant permissions if prompted

4. **Configure Backend**:
   ```
   Name: ml-platform-backend
   Runtime: Python 3.11
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   
   Environment Variables:
   PYTHONUNBUFFERED = 1
   ```

5. **Plan**: Keep "Free" selected
6. **Create Web Service**

7. **Wait for deployment** (5-10 minutes)
8. **Copy the URL** that appears (e.g., `https://ml-platform-backend.onrender.com`)

---

### **STEP 3: Create Frontend Service**

1. **Go to Dashboard**: https://dashboard.render.com
2. **Click "+ New"** → Select **"Static Site"** OR **"Web Service"**

**Option A: Static Site (Simpler)**
```
Name: ml-platform-frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

**Option B: Web Service (More control)**
```
Name: ml-platform-frontend
Runtime: Node
Root Directory: app
Build Command: npm install && npm run build
Start Command: npx serve -s dist -l $PORT

Environment Variable:
VITE_API_BASE_URL = https://ml-platform-backend.onrender.com
```

3. **Create Service**
4. **Wait for deployment** (5-10 minutes)
5. **Get Frontend URL** (e.g., `https://ml-platform-frontend.onrender.com`)

---

### **STEP 4: Configure Environment Variables**

#### **Backend Service**:
1. Go to Backend service settings
2. **Environment** tab
3. Add variables:
```
PYTHONUNBUFFERED = 1
```

#### **Frontend Service** (if Web Service):
1. Go to Frontend service settings
2. **Environment** tab
3. Add variable:
```
VITE_API_BASE_URL = https://ml-platform-backend.onrender.com
```

---

### **STEP 5: Update API Configuration**

Already done! The `app/src/api.js` now uses:
```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
```

This automatically switches between:
- **Local**: `http://localhost:8000` (development)
- **Production**: Backend service URL (on Render)

---

### **STEP 6: Test the Deployment**

1. **Visit your frontend URL**: `https://ml-platform-frontend.onrender.com`
2. **Try uploading data**:
   - Download `sample_data.csv` from project
   - Upload it to the platform
   - Select "Species" as target
   - Click "Train & Compare"

3. **Check for errors**:
   - Browser Console: Press `F12`
   - Check Network tab if upload fails
   - Backend logs: Go to service → Logs

---

## ⚠️ Common Issues & Solutions

### **Issue: "Cannot connect to backend"**
**Solution**:
1. Check if backend is deployed (should say "Live")
2. Verify `VITE_API_BASE_URL` is set correctly in frontend
3. Check backend logs for errors
4. Restart both services

### **Issue: "Build failed"**
**Solution**:
1. Check build logs for specific error
2. Ensure `requirements.txt` has all dependencies
3. For Node issues: Delete `node_modules` locally, push again

### **Issue: "Spins down after 15 minutes"**
- **This is normal on free tier**
- First request will take 30+ seconds (cold start)
- Subsequent requests are fast
- **Upgrade to paid** to avoid this ($7/month per service)

### **Issue: "CORS error when uploading"**
**Solution**: Backend already has CORS enabled
- If still issues, check backend logs
- API should be accessible

### **Issue: Vite API URL not working**
**Solution**: Make sure `.env` file structure:
```
Frontend needs to access: import.meta.env.VITE_API_BASE_URL
```
This is already configured in the provided files.

---

## 📊 Architecture on Render

```
Your Domain
    ↓
GitHub Repository
    ├────────────────────────┐
    │                        │
    ↓                        ↓
Backend Service        Frontend Service
(Python/FastAPI)       (React/Node)
Port: auto             Port: auto

When frontend loads:
→ User opens frontend.onrender.com
→ React app loads and points to backend.onrender.com
→ Uploads CSV to backend API
→ Gets ML results
→ Displays visualizations
```

---

## 🎯 Deployment Checklist

- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create backend service (Python)
- [ ] Wait for backend deployment (5-10 min)
- [ ] Copy backend URL
- [ ] Create frontend service (Node/Static)
- [ ] Set `VITE_API_BASE_URL` env variable
- [ ] Wait for frontend deployment (5-10 min)
- [ ] Visit frontend URL
- [ ] Test with sample_data.csv
- [ ] Check browser console (F12) for errors
- [ ] Verify both services show "Live"

---

## 🚀 Advanced: Custom Domain

If you want a custom domain (e.g., `ml-platform.com`):

1. **Buy domain** from Namecheap, GoDaddy, etc.
2. **In Render Dashboard**:
   - Go to Frontend service
   - Settings → Custom Domain
   - Enter your domain
   - Follow DNS configuration steps
3. Same for backend if needed

---

## 📈 Monitoring & Logs

**Backend Logs**:
1. Dashboard → Backend service
2. Click "Logs" tab
3. See FastAPI startup messages and errors

**Frontend Logs**:
1. Dashboard → Frontend service
2. Click "Logs" tab
3. See build process and errors

**Browser Console**:
1. Visit your frontend URL
2. Press `F12`
3. Go to "Console" tab
4. See any JavaScript errors

---

## 💡 Tips for Success

1. **First request takes time** (cold start on free tier)
   - Wait 30+ seconds for first request
   - Subsequent requests are instant

2. **Keep servers alive**
   - Free tier spins down after 15 minutes of inactivity
   - Upgrade to paid ($7/month) to keep always running

3. **Monitor resource usage**
   - Render dashboard shows CPU/RAM usage
   - ml-platform should use minimal resources

4. **Update code**:
   ```bash
   git add .
   git commit -m "Update for Render deployment"
   git push origin main
   ```
   - Render auto-deploys on push!

5. **Test locally first**:
   ```bash
   npm run dev  # Frontend
   python -m uvicorn backend.main:app --reload  # Backend
   ```
   - Ensure it works locally before deploying

---

## 🎉 You're Done!

Your ML Platform is now live on Render! 🚀

**Access it at**: `https://ml-platform-frontend.onrender.com`

**Share with anyone**: The URL works anywhere!

---

## 📞 Support

**If deployment fails**:
1. Check Render logs (in dashboard)
2. Check browser console (F12)
3. Verify all environment variables are set
4. Ensure GitHub repository is up to date

**Need help?** Check Render documentation: https://render.com/docs

---

## ✨ What's Deployed

- ✅ **Backend**: FastAPI with 13 ML algorithms
- ✅ **Frontend**: React with visualizations  
- ✅ **Data**: Live CSV processing
- ✅ **Models**: Real ML training and comparison
- ✅ **Download**: Export trained models

**Everything works exactly like locally!**

Enjoy your live ML Platform! 🎊
