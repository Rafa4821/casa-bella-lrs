# 🔴 Security Incident - API Key Rotation Required

## Incident Details

**Date:** March 14, 2026  
**Severity:** HIGH  
**Type:** Exposed Firebase API Key  
**Status:** REMEDIATION IN PROGRESS

---

## What Happened

GitHub's secret scanning detected that the Firebase API Key was hardcoded in `src/shared/config/firebase.js` and committed to the public repository.

**Exposed Key:** `AIzaSyAC000bdv5DvpSEJO4uylF3FmAg8rNG4Kc`  
**Commit:** First deploy (aa75309)  
**Repository:** https://github.com/Rafa4821/casa-bella-lrs

---

## Immediate Actions Taken

✅ **1. Removed hardcoded credentials from code**
- Updated `firebase.js` to use environment variables
- All credentials now sourced from `.env` file

✅ **2. Verified .gitignore**
- `.env` is properly ignored
- Documentation files excluded

---

## ⚠️ URGENT: Required Actions

### 1. Rotate Firebase API Key (CRITICAL)

Firebase API Keys are designed to be public for client-side apps, BUT you should still rotate and restrict them:

#### Restrict API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: `casa-bella-lrs`
3. Navigate to: **APIs & Services** → **Credentials**
4. Find the API Key: `Browser key (auto created by Firebase)`
5. Click **Edit** (pencil icon)
6. Under **Application restrictions**:
   - Select: **HTTP referrers (web sites)**
   - Add allowed domains:
     ```
     https://casa-bella-lrs.vercel.app/*
     http://localhost:5173/*
     http://localhost:3000/*
     ```
7. Under **API restrictions**:
   - Select: **Restrict key**
   - Enable only:
     - Firebase Authentication API
     - Cloud Firestore API
     - Firebase Installations API
     - Token Service API
8. Click **Save**

#### Create New API Key (Optional but Recommended)

1. Same console → **Create Credentials** → **API Key**
2. Apply restrictions immediately (as above)
3. Update `.env` with new key
4. Update Vercel environment variables
5. Delete old API key after 24-48 hours

### 2. Update Vercel Environment Variables

If you created a new API key:

```bash
vercel env rm VITE_FIREBASE_API_KEY production
vercel env add VITE_FIREBASE_API_KEY production
# Enter new API key value
```

Or via Dashboard:
1. Vercel → Project Settings → Environment Variables
2. Edit `VITE_FIREBASE_API_KEY`
3. Enter new value
4. Redeploy

### 3. Review Firestore Security Rules

Ensure they are deployed and active:

```bash
firebase deploy --only firestore:rules
```

### 4. Monitor Firebase Usage

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select `casa-bella-lrs` project
3. Check **Usage** tab for anomalies
4. Review **Authentication** for unauthorized users
5. Check **Firestore** for unexpected writes

### 5. Close GitHub Alert

Once API key is restricted:
1. Go to GitHub repository → Security → Secret scanning alerts
2. Click on the alert
3. Click **Close as** → **Revoked**
4. Add comment: "API key restricted to authorized domains"

---

## Prevention Measures

### Already Implemented

✅ Environment variables for all secrets  
✅ `.env` in .gitignore  
✅ `.env.example` template without secrets  
✅ Documentation files excluded from repo

### Additional Recommendations

1. **Pre-commit Hooks**
   ```bash
   npm install --save-dev husky
   npx husky init
   echo "npm run lint" > .husky/pre-commit
   ```

2. **Git Secrets Scanning**
   ```bash
   npm install --save-dev @commitlint/cli
   ```

3. **Environment Variable Validation**
   Add to `firebase.js`:
   ```javascript
   if (!import.meta.env.VITE_FIREBASE_API_KEY) {
     throw new Error('Missing VITE_FIREBASE_API_KEY');
   }
   ```

---

## Important Notes

### Firebase API Keys are Different

Unlike typical API keys, Firebase API keys are **designed to be included in client-side code**. They identify your Firebase project, but:

- ✅ They are NOT secret
- ✅ Security comes from Firestore Rules, not the API key
- ⚠️ BUT should still be restricted to prevent abuse

### Your Security Relies On

1. **Firestore Security Rules** ← PRIMARY DEFENSE
2. **API Key Restrictions** ← Domain allowlist
3. **Firebase App Check** ← Bot protection (optional)

---

## Timeline

**9:32 PM** - Initial commit with exposed key  
**9:35 PM** - GitHub alert detected  
**9:36 PM** - Code updated to use environment variables  
**9:37 PM** - Security incident documented  

**PENDING:**
- [ ] API Key restricted in Google Cloud Console
- [ ] Firebase usage monitored for anomalies
- [ ] GitHub alert closed

---

## Contact

For questions about this incident:
- Developer: rafaellucero998@gmail.com
- Repository: https://github.com/Rafa4821/casa-bella-lrs

---

## References

- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/api-keys)
- [Restricting API Keys](https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**STATUS: Action Required**  
**Priority: HIGH**  
**Next Review: After API key restriction**
