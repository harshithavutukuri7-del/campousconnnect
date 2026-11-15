export type Role = 'student' | 'admin';

export type Student = {
  id: string;
  name: string;
  email: string;
  college: string;
  department: string;
  year: string;
  bio: string;
  skills: string[];
  softSkills: string[];
  interests: string[];
  languages: string[];
  github: string;
  linkedin: string;
  portfolio: string;
  availability: 'Available' | 'Busy' | 'Open to discuss';
  avatar: string;
  role?: Role;
  password?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  teamSize: number;
  duration: string;
  preferredDepartment: string;
  deadline: string;
  collaborationMode: string;
  ownerId: string;
  ownerName: string;
  status: 'Open' | 'In Progress' | 'Completed';
  members: string[];
};

export type TaskItem = {
  id: string;
  title: string;
  assigneeId: string;
  assigneeName: string;
  deadline: string;
  status: 'To Do' | 'In Progress' | 'Completed';
};

export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: 'Internships' | 'Hackathons' | 'Workshops' | 'Competitions' | 'Events' | 'Scholarships' | 'Student Programs';
  eligibility: string;
  deadline: string;
  location: string;
  applicationLink: string;
  savedBy?: string[];
};

export type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage: string;
  updatedAt: string;
};

export type ExchangeRequest = {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  skillOffered: string;
  skillWanted: string;
  department: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
};

export type AppState = {
  students: Student[];
  currentUserId: string | null;
  projects: Project[];
  opportunities: Opportunity[];
  notifications: NotificationItem[];
  conversations: Conversation[];
  messages: Message[];
  exchangeRequests: ExchangeRequest[];
};
