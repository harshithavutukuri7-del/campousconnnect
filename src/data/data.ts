import type { AppState, ExchangeRequest, NotificationItem, Opportunity, Project, Student } from './types';

export const demoStudents: Student[] = [
  {
    id: 's1',
    name: 'Aisha Patel',
    email: 'aisha@campus.edu',
    college: 'NIT Trichy',
    department: 'Computer Science',
    year: '3rd Year',
    bio: 'Frontend developer exploring AI-driven student platforms and intuitive product experiences.',
    skills: ['React', 'TypeScript', 'UI/UX', 'Node.js'],
    softSkills: ['Leadership', 'Communication'],
    interests: ['AI', 'Startups', 'Hackathons'],
    languages: ['English', 'Hindi'],
    github: 'https://github.com/aisha',
    linkedin: 'https://linkedin.com/in/aisha',
    portfolio: 'https://aisha.dev',
    availability: 'Available',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    role: 'student',
    password: 'demo123'
  },
  {
    id: 's2',
    name: 'Rohit Sharma',
    email: 'rohit@campus.edu',
    college: 'IIT Delhi',
    department: 'Mechanical Engineering',
    year: '2nd Year',
    bio: 'Building maker projects and learning product design to solve real-world campus issues.',
    skills: ['CAD', '3D Printing', 'Python', 'Product Design'],
    softSkills: ['Problem Solving', 'Teamwork'],
    interests: ['Robotics', 'Design', 'Campus Innovation'],
    languages: ['English', 'Hindi'],
    github: 'https://github.com/rohit',
    linkedin: 'https://linkedin.com/in/rohit',
    portfolio: 'https://rohit.design',
    availability: 'Open to discuss',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    role: 'student',
    password: 'demo123'
  },
  {
    id: 's3',
    name: 'Meera Iyer',
    email: 'meera@campus.edu',
    college: 'BITS Pilani',
    department: 'Electronics',
    year: '4th Year',
    bio: 'Electronics enthusiast building embedded systems, hardware prototypes, and connected devices.',
    skills: ['Embedded C', 'IoT', 'Circuit Design', 'Python'],
    softSkills: ['Analytical Thinking', 'Mentoring'],
    interests: ['IoT', 'Robotics', 'Innovation'],
    languages: ['English', 'Tamil'],
    github: 'https://github.com/meera',
    linkedin: 'https://linkedin.com/in/meera',
    portfolio: 'https://meera.tech',
    availability: 'Busy',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
    role: 'student',
    password: 'demo123'
  },
  {
    id: 's4',
    name: 'Karan Singh',
    email: 'karan@campus.edu',
    college: 'VIT Vellore',
    department: 'Information Technology',
    year: '3rd Year',
    bio: 'Full-stack dev focused on scalable apps, backend APIs, and community-driven products.',
    skills: ['Java', 'Spring Boot', 'React', 'Firebase'],
    softSkills: ['Mentorship', 'Collaboration'],
    interests: ['Web Apps', 'Cloud', 'Hackathons'],
    languages: ['English', 'Punjabi'],
    github: 'https://github.com/karan',
    linkedin: 'https://linkedin.com/in/karan',
    portfolio: 'https://karan.dev',
    availability: 'Available',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    role: 'student',
    password: 'demo123'
  }
];

export const demoProjects: Project[] = [
  {
    id: 'p1',
    title: 'Campus Safety App',
    description: 'Create a smart safety alert system for students with emergency reporting and route assistance.',
    category: 'Product',
    requiredSkills: ['React', 'Firebase', 'UI/UX'],
    teamSize: 4,
    duration: '8 weeks',
    preferredDepartment: 'Computer Science',
    deadline: '2026-12-15',
    collaborationMode: 'Hybrid',
    ownerId: 's1',
    ownerName: 'Aisha Patel',
    status: 'Open',
    members: ['s1']
  },
  {
    id: 'p2',
    title: 'Smart Study Planner',
    description: 'Develop a productivity dashboard that matches study plans to your academic schedule.',
    category: 'Productivity',
    requiredSkills: ['Python', 'React', 'Product Design'],
    teamSize: 3,
    duration: '6 weeks',
    preferredDepartment: 'IT',
    deadline: '2026-11-28',
    collaborationMode: 'Remote',
    ownerId: 's2',
    ownerName: 'Rohit Sharma',
    status: 'Open',
    members: ['s2']
  }
];

export const demoOpportunities: Opportunity[] = [
  {
    id: 'o1',
    title: 'AI Product Intern',
    organization: 'NovaLabs',
    description: 'Work on AI-enabled student platforms and user research for education products.',
    category: 'Internships',
    eligibility: 'Open to 2nd and 3rd year students',
    deadline: '2026-11-22',
    location: 'Bengaluru',
    applicationLink: 'https://example.com/internship',
    savedBy: []
  },
  {
    id: 'o2',
    title: 'HackOn 2026',
    organization: 'CodeSprint',
    description: 'Inter-college hackathon focusing on sustainability and AI.',
    category: 'Hackathons',
    eligibility: 'Teams of 2-5 members',
    deadline: '2026-12-05',
    location: 'Online + Hyderabad',
    applicationLink: 'https://example.com/hackathon',
    savedBy: []
  }
];

export const demoNotifications: NotificationItem[] = [
  {
    id: 'n1',
    userId: 's1',
    title: 'Project invitation',
    message: 'Karan invited you to join Smart Study Planner.',
    type: 'project',
    createdAt: '2026-11-10',
    read: false
  },
  {
    id: 'n2',
    userId: 's1',
    title: 'Exchange request',
    message: 'Meera wants to exchange UI/UX skills for Python.',
    type: 'exchange',
    createdAt: '2026-11-12',
    read: true
  }
];

export const demoConversations = [
  {
    id: 'c1',
    participants: ['s1', 's4'],
    participantNames: ['Aisha Patel', 'Karan Singh'],
    lastMessage: 'Let’s finalize the product pitch on Friday.',
    updatedAt: '2026-11-13T10:00:00.000Z'
  }
];

export const demoMessages = [
  {
    id: 'm1',
    conversationId: 'c1',
    senderId: 's1',
    senderName: 'Aisha Patel',
    text: 'Let’s finalize the product pitch on Friday.',
    createdAt: '2026-11-13T09:30:00.000Z'
  },
  {
    id: 'm2',
    conversationId: 'c1',
    senderId: 's4',
    senderName: 'Karan Singh',
    text: 'Sounds great, I will prepare the demo deck.',
    createdAt: '2026-11-13T10:00:00.000Z'
  }
];

export const demoExchangeRequests: ExchangeRequest[] = [
  {
    id: 'e1',
    fromId: 's1',
    fromName: 'Aisha Patel',
    toId: 's3',
    toName: 'Meera Iyer',
    skillOffered: 'UI/UX',
    skillWanted: 'Embedded C',
    department: 'Computer Science',
    status: 'Pending'
  }
];

export const defaultState: AppState = {
  students: demoStudents,
  currentUserId: 's1',
  projects: demoProjects,
  opportunities: demoOpportunities,
  notifications: demoNotifications,
  conversations: demoConversations,
  messages: demoMessages,
  exchangeRequests: demoExchangeRequests
};
