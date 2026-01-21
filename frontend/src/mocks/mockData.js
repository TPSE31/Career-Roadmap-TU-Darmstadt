// ============================================
// MOCK DATA - Complete fake database
// Credits and progress are calculated dynamically
// ============================================

// Helper to calculate credits from modules
export const calculateCreditsFromModules = (modules) => {
  return modules
    .filter(m => m.completed)
    .reduce((sum, m) => sum + (m.credits || 0), 0);
};

export const mockModules = [
  {
    id: 1,
    name: "Web Engineering",
    code: "20-00-0123",
    credits: 6,
    semester: 3,
    description: "Introduction to modern web development technologies and frameworks",
    required: true,
    category: "Core",
    prerequisites: ["Programming 1", "Programming 2"],
    completed: true
  },
  {
    id: 2,
    name: "Databases",
    code: "20-00-0124",
    credits: 8,
    semester: 2,
    description: "Relational databases, SQL, database design and optimization",
    required: true,
    category: "Core",
    prerequisites: ["Programming 1"],
    completed: true
  },
  {
    id: 3,
    name: "Algorithms and Data Structures",
    code: "20-00-0125",
    credits: 9,
    semester: 1,
    description: "Fundamental algorithms, complexity analysis, and data structures",
    required: true,
    category: "Core",
    prerequisites: [],
    completed: true
  },
  {
    id: 4,
    name: "Software Engineering",
    code: "20-00-0126",
    credits: 6,
    semester: 4,
    description: "Software development processes, testing, and project management",
    required: true,
    category: "Core",
    prerequisites: ["Programming 2"],
    completed: false
  },
  {
    id: 5,
    name: "Machine Learning",
    code: "20-00-0127",
    credits: 6,
    semester: 5,
    description: "Introduction to machine learning algorithms and applications",
    required: false,
    category: "Elective",
    prerequisites: ["Mathematics", "Statistics"],
    completed: false
  }
];

export const mockMilestones = [
  {
    id: 1,
    title: "Complete Basic Programming Modules",
    description: "Finish Programming 1 and Programming 2",
    type: "academic",
    deadline: "2024-09-30",
    semester: 1,
    credits_required: 18,
    completed: true,
    completion_date: "2024-09-15"
  },
  {
    id: 2,
    title: "Reach 60 ECTS",
    description: "Accumulate 60 credit points",
    type: "credit",
    deadline: "2025-03-31",
    semester: 2,
    credits_required: 60,
    completed: true,
    completion_date: "2025-02-20"
  },
  {
    id: 3,
    title: "Choose Specialization",
    description: "Select your major focus area",
    type: "decision",
    deadline: "2025-06-30",
    semester: 3,
    credits_required: null,
    completed: false,
    completion_date: null
  },
  {
    id: 4,
    title: "Complete Core Modules",
    description: "Finish all mandatory core courses",
    type: "academic",
    deadline: "2025-12-31",
    semester: 4,
    credits_required: 120,
    completed: false,
    completion_date: null
  }
];

// Initial user profile - credits calculated dynamically from completed modules
export const mockUserProgress = {
  user_id: 1,
  student_name: "Max Mustermann",
  student_id: "12345678",
  program: "B.Sc. Computer Science",
  current_semester: 3,
  start_date: "2023-10-01",
  // total_credits is now calculated from completed modules
  get total_credits() {
    return calculateCreditsFromModules(mockModules);
  },
  required_credits: 180,
  get completed_modules() {
    return mockModules.filter(m => m.completed).length;
  },
  get in_progress_modules() {
    return mockModules.filter(m => !m.completed).length;
  },
  on_track: true,
  get completion_percentage() {
    return Math.round((calculateCreditsFromModules(mockModules) / 180) * 100);
  },
  expected_graduation: "2026-09-30",
  career_goal: "Software Engineer",
  specialization: "Web Development"
};

export const mockRecommendations = [
  {
    id: 1,
    type: "module",
    title: "Consider Taking 'Cloud Computing'",
    description: "Based on your interest in Web Engineering, this module complements your skills",
    priority: "high",
    reason: "Matches career goal and completed modules",
    action_url: "/modules/15",
    created_at: "2025-11-01"
  },
  {
    id: 2,
    type: "event",
    title: "Career Fair - Tech Companies",
    description: "Annual career fair with 50+ tech companies recruiting",
    priority: "medium",
    reason: "Relevant to your career goal: Software Engineer",
    action_url: "/events/career-fair-2025",
    date: "2025-12-15",
    created_at: "2025-11-05"
  },
  {
    id: 3,
    type: "deadline",
    title: "Module Registration Deadline Approaching",
    description: "Register for next semester by December 20th",
    priority: "high",
    reason: "Important deadline in 2 weeks",
    action_url: "/registration",
    deadline: "2025-12-20",
    created_at: "2025-12-05"
  }
];

export const mockSupportServices = [
  {
    id: 1,
    name: "Career Service",
    category: "Career",
    description: "Individual career counseling, resume review, and interview preparation",
    contact_email: "career@tu-darmstadt.de",
    website: "https://www.tu-darmstadt.de/career",
    location: "Building S1|03, Room 123"
  },
  {
    id: 2,
    name: "Study Counseling",
    category: "Academic",
    description: "Help with study planning, module selection, and academic challenges",
    contact_email: "studienberatung@cs.tu-darmstadt.de",
    website: "https://www.informatik.tu-darmstadt.de/fb20",
    location: "Building S2|02, Room 456"
  }
];

export const mockEvents = [
  {
    id: 1,
    title: "Python Workshop for Beginners",
    description: "Learn Python basics in this hands-on workshop",
    date: "2025-12-15",
    time: "14:00-17:00",
    location: "Room S2|02-101",
    organizer: "Department 20",
    category: "Workshop",
    registration_required: true
  },
  {
    id: 2,
    title: "Tech Talk: AI in Healthcare",
    description: "Guest speaker from leading AI research company",
    date: "2025-12-18",
    time: "18:00-20:00",
    location: "Audimax",
    organizer: "FEC Programme",
    category: "Talk",
    registration_required: false
  }
];

export const mockRoadmap = {
  user_id: 1,
  current_phase: "Core Studies",
  phases: [
    {
      id: 1,
      name: "Foundation",
      semester_range: "1-2",
      status: "completed",
      completion_percentage: 100,
      milestones: [1, 2]
    },
    {
      id: 2,
      name: "Core Studies",
      semester_range: "3-4",
      status: "in_progress",
      completion_percentage: 60,
      milestones: [3, 4]
    },
    {
      id: 3,
      name: "Specialization",
      semester_range: "5-6",
      status: "upcoming",
      completion_percentage: 0,
      milestones: []
    }
  ]
};

export default {
  modules: mockModules,
  milestones: mockMilestones,
  userProgress: mockUserProgress,
  recommendations: mockRecommendations,
  supportServices: mockSupportServices,
  events: mockEvents,
  roadmap: mockRoadmap,
  calculateCreditsFromModules
};
