# Career Roadmap Tool - Frontend Setup Guide
## For Yigit - Group 31

---

## 🎯 What I Did For You

I've set up your complete React frontend in the `frontend` folder of your Career Roadmap project!

---

## 📁 Your Project Structure Now

```
Career-Roadmap-TU-Darmstadt/
├── backend/                 ← Django backend (Amine, Emir, Stas)
│   ├── api/
│   ├── config/
│   ├── db.sqlite3
│   └── manage.py
│
└── frontend/                ← YOUR WORK IS HERE!
    ├── package.json
    ├── README.md
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js          ← Main app with navigation
        ├── index.js        ← React entry point
        ├── mocks/          ← Mock data for testing
        │   └── mockData.js
        ├── services/       ← API integration (YOUR MAIN JOB!)
        │   ├── api.js      ← Axios config for Django
        │   ├── moduleService.js
        │   ├── milestoneService.js
        │   ├── userService.js
        │   └── ... (4 more)
        ├── hooks/          ← Custom React hooks
        │   ├── useModules.js
        │   ├── useMilestones.js
        │   └── ... (2 more)
        └── components/     ← UI Components
            ├── Dashboard.js
            ├── ModuleList.js
            ├── MilestoneTracker.js
            └── ... (2 more)
```

---

## 🚀 How to Run Your Frontend

### Step 1: Navigate to frontend folder
```bash
cd Career-Roadmap-TU-Darmstadt/frontend
```

### Step 2: Install dependencies (first time only)
```bash
npm install
```

This will install:
- React 18
- React DOM
- React Scripts

### Step 3: Start the development server
```bash
npm start
```

Your app will open at `http://localhost:3000`

---

## 🔧 How to Run Backend + Frontend Together

### Terminal 1 (Backend):
```bash
cd Career-Roadmap-TU-Darmstadt/backend
python manage.py runserver
```
Backend runs on `http://localhost:8000`

### Terminal 2 (Frontend):
```bash
cd Career-Roadmap-TU-Darmstadt/frontend
npm start
```
Frontend runs on `http://localhost:3000`

---

## 📊 What's Working Right Now

### ✅ Immediately Works:
- Dashboard with mock data
- Module list display
- Milestone tracker
- Navigation between pages
- Loading states
- Error handling

### 🔄 Needs Backend Team:
When Amine/Emir/Stas create the Django API endpoints, you'll connect them.

---

## 🎯 Your Integration Tasks

### Currently Using Mock Data

All services (in `src/services/`) currently use mock data:
```javascript
// Current (Mock)
import mockData from '../mocks/mockData';
return mockData.modules;
```

### When Backend is Ready

Update services to use real API:
```javascript
// Future (Real API)
import api from './api';
const response = await api.get('/modules/');
return response.data;
```

---

## 📋 Checklist for Backend Integration

### Step 1: Confirm Backend Endpoints (Ask Amine/Emir)

```
□ Get base API URL (probably http://localhost:8000/api)
□ Get list of available endpoints:
  - /modules/
  - /milestones/
  - /users/{id}/progress/
  - /recommendations/
  - etc.
□ Get example JSON responses
□ Test endpoints in browser or Postman
```

### Step 2: Update Your Code

File: `src/services/api.js`
```javascript
const BASE_URL = 'http://localhost:8000/api'; // ← Update this
```

### Step 3: Update Each Service

Example for `moduleService.js`:

**Before (Mock):**
```javascript
getAllModules: async () => {
  await delay(800);
  return mockData.modules;
}
```

**After (Real API):**
```javascript
getAllModules: async () => {
  try {
    const response = await api.get('/modules/');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch modules: ${error.message}`);
  }
}
```

### Step 4: Test Everything

```
□ Test Dashboard loads
□ Test Module list loads
□ Test Milestones load
□ Test error handling (stop backend and see errors)
□ Test loading states
```

---

## 🐛 Common Issues & Solutions

### Issue: "CORS Error"
**Symptom:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Ask Amine/Emir to add this to Django `settings.py`:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Issue: "Backend not running"
**Symptom:** Network error, can't connect

**Solution:**
1. Check Django is running: `python manage.py runserver`
2. Check URL in `src/services/api.js` is correct
3. Try accessing `http://localhost:8000/api/` in browser

### Issue: "Module not found"
**Solution:** Run `npm install`

---

## 📞 Who to Ask for What

### Amine & Emir (Backend API):
- "What's the API base URL?"
- "Which endpoints are ready?"
- "Can you show me example responses?"
- "Can you add CORS headers?"

### Alp (Frontend Lead):
- "Should I use this component structure?"
- "Where should I put new components?"
- "Can we review the code together?"

### Stas (Database):
- "What fields does Module model have?"
- "What's the data structure?"
- "How are models related?"

---

## 📦 Files You Can Edit

### Your Main Work Files:

**Services** (Connect to Django API):
- `src/services/api.js` ← Update BASE_URL
- `src/services/moduleService.js` ← Update to use real API
- `src/services/milestoneService.js` ← Update to use real API
- `src/services/userService.js` ← Update to use real API
- (+ 4 more service files)

**Hooks** (Already done, no changes needed):
- `src/hooks/useModules.js`
- `src/hooks/useMilestones.js`
- etc.

**Components** (Already done, works with any data source):
- `src/components/Dashboard.js`
- `src/components/ModuleList.js`
- etc.

---

## 🎓 Learning Resources

### Understanding the Architecture:

```
User clicks button
    ↓
Component (Dashboard.js)
    ↓
Custom Hook (useModules)
    ↓
Service (moduleService)
    ↓
API call (axios)
    ↓
Django Backend
    ↓
Returns data
    ↓
Component displays it
```

---

## ✅ Success Criteria

You've completed your tasks when:

1. ✅ Frontend runs without errors
2. ✅ Can fetch data from Django backend
3. ✅ Loading states show while fetching
4. ✅ Errors are handled gracefully
5. ✅ All components display real data
6. ✅ Navigation works
7. ✅ Can demo to team

---

## 🎉 What You Have Now

- ✅ Complete React setup
- ✅ 23 files, 1,649 lines of code
- ✅ 3 working pages
- ✅ Professional UI
- ✅ Mock data for testing
- ✅ Ready to connect to backend

**You're 80% done!** Just need to connect to Django API when it's ready.

---

## 📝 Next Steps

### This Week:
1. ✅ Run `npm install` in frontend folder
2. ✅ Run `npm start` and see it working
3. ✅ Explore the code
4. ✅ Show your team

### When Backend is Ready:
1. Get API URLs from team
2. Update `src/services/api.js`
3. Update service files (10 min each)
4. Test everything
5. Fix any issues
6. Demo!

---

## 🆘 Need Help?

### Can't get it running?
- Make sure you're in `/frontend` folder
- Run `npm install` first
- Check Node.js is installed: `node --version`

### Backend integration questions?
- Ask Amine/Emir for API docs
- Test endpoints in browser first
- Check CORS is configured

### Code questions?
- Read comments in the code
- Check README.md in frontend folder
- Ask Alp for frontend structure questions

---

**You're all set! Your frontend is ready to go!** 🚀

Good luck with the project!

