# Career Roadmap Tool - Frontend Integration

**Built by:** Yigit (Frontend Integration Team)  
**Project:** TU Darmstadt Career Roadmap Tool  
**Date:** December 2025

---

## 🎯 What's This?

This is your **complete frontend integration setup** with mock data. You can start building and testing immediately without waiting for the backend team!

---

## 📦 What's Included

### Mock Data Layer
- `src/mocks/mockData.js` - Complete fake database with realistic data

### Service Layer (API Integration)
- `src/services/moduleService.js` - Module data fetching
- `src/services/milestoneService.js` - Milestone data fetching
- `src/services/userService.js` - User progress data fetching
- `src/services/recommendationService.js` - Recommendation data fetching
- `src/services/supportService.js` - Support services data fetching
- `src/services/eventService.js` - Events data fetching
- `src/services/roadmapService.js` - Roadmap data fetching

### Custom Hooks
- `src/hooks/useModules.js` - Fetch and manage modules
- `src/hooks/useMilestones.js` - Fetch and manage milestones
- `src/hooks/useUserProgress.js` - Fetch user progress
- `src/hooks/useRecommendations.js` - Fetch recommendations

### Components
- `src/components/LoadingSpinner.js` - Reusable loading indicator
- `src/components/ErrorMessage.js` - Reusable error display
- `src/components/Dashboard.js` - Main dashboard with multiple data sources
- `src/components/ModuleList.js` - Display all modules
- `src/components/MilestoneTracker.js` - Interactive milestone tracking
- `src/App.js` - Main app with navigation

---

## 🚀 Quick Start

### Step 1: Copy Files to Your React Project

```bash
# Navigate to your React project
cd your-react-project

# Copy the src folder
cp -r /path/to/this/src/* ./src/
```

### Step 2: Install Dependencies (if needed)

```bash
npm install
# or
yarn install
```

### Step 3: Run the App

```bash
npm start
# or
yarn start
```

### Step 4: Open in Browser

Navigate to `http://localhost:3000`

You should see the working app with mock data! 🎉

---

## 📋 Features

### ✅ Already Working
- **Dashboard** with progress cards, milestones, and recommendations
- **Module List** with filtering and display
- **Milestone Tracker** with interactive checkboxes
- **Loading States** for all data fetching
- **Error Handling** with retry functionality
- **Mock API** with realistic delays and occasional errors (for testing)

### 🔄 Ready for Backend Integration
When your backend team has the API ready, just:

1. Create a new file `src/services/api.js`:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Get URL from backend team
  timeout: 10000,
});

export default api;
```

2. Update each service file to use real API:
```javascript
// Before (Mock)
import mockData from '../mocks/mockData';
return mockData.modules;

// After (Real API)
import api from './api';
const response = await api.get('/modules/');
return response.data;
```

**That's it!** No component changes needed. Everything just works.

---

## 🎨 How It Works

### Data Flow

```
Mock Data → Services → Custom Hooks → Components → UI
```

### Example: Fetching Modules

1. **Component** uses the hook:
```javascript
const { modules, loading, error } = useModules();
```

2. **Hook** calls the service:
```javascript
const data = await moduleService.getAllModules();
```

3. **Service** returns mock data (or real API data later):
```javascript
return mockData.modules; // Now
// return api.get('/modules/'); // Later
```

---

## 🧪 Testing Features

### Test Loading States
- Just reload the page - you'll see spinners while data loads

### Test Error States
- The mock service randomly fails ~10% of the time
- Click "Try Again" button to retry

### Test Different Data
- Edit `src/mocks/mockData.js` to change the data
- Add more modules, milestones, etc.

---

## 📱 What Each Component Does

### Dashboard
- Shows user progress overview
- Displays credit count, completion percentage
- Lists upcoming milestones
- Shows high-priority recommendations

### ModuleList
- Displays all modules in a grid
- Shows completed vs incomplete modules
- Filterable by category
- Has refresh button

### MilestoneTracker
- Lists all milestones
- Interactive checkboxes to mark complete
- Progress bar showing overall completion
- Detailed information for each milestone

---

## 🎓 Learning Resources

### Understanding Hooks
- `useState` - Manages component state
- `useEffect` - Runs side effects (API calls)
- Custom hooks - Reusable logic

### Understanding Services
- Centralized API logic
- Easy to swap mock → real API
- Error handling in one place

### Understanding Component Structure
- Separation of concerns
- Reusable components
- Props and state management

---

## 🛠️ Customization

### Change Mock Data
Edit `src/mocks/mockData.js` to add/modify:
- Modules
- Milestones
- User information
- Recommendations
- Events

### Change Styling
All components use inline styles. Change colors, sizes, layouts directly in component files.

### Add New Components
1. Create new component file
2. Create custom hook if needed
3. Import and use in App.js

---

## 📞 Next Steps

### This Week
- [x] Set up mock data ✓
- [x] Create service layer ✓
- [x] Build custom hooks ✓
- [x] Create example components ✓
- [ ] Add more components (you!)
- [ ] Customize styling
- [ ] Test all features

### Next Week
- [ ] Coordinate with backend team
- [ ] Get real API endpoints
- [ ] Switch from mock to real API
- [ ] Test integration
- [ ] Fix any bugs

---

## 🐛 Troubleshooting

### "Cannot find module"
**Fix:** Check import paths match your folder structure

### "modules.map is not a function"
**Fix:** Initialize state as empty array: `useState([])`

### Components not updating
**Fix:** Check useEffect dependency array

### Stuck on loading forever
**Fix:** Check browser console for errors

---

## 🎉 You're All Set!

You now have a **fully working frontend** with:
- ✅ Mock data
- ✅ Service layer
- ✅ Custom hooks
- ✅ Working components
- ✅ Loading & error states
- ✅ Professional UI

**Start building more components and features!**

When the backend is ready, integration will be **trivial** because you already have everything structured properly.

---

## 📧 Questions?

Ask your team:
- **Alp** - Frontend structure questions
- **Amine/Emir** - API endpoint questions (when ready)
- **Stas** - Data structure questions

---

**Happy Coding!** 🚀

Built with ❤️ for TU Darmstadt Career Roadmap Project
