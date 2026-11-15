import { demoStudents, defaultState } from './data';
import type { Student } from './types';

const STORAGE_KEY = 'campusconnect-users';

const getStoredUsers = (): Student[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoStudents));
    return demoStudents;
  }
  try {
    return JSON.parse(stored) as Student[];
  } catch {
    return demoStudents;
  }
};

export const authService = {
  login(email: string, password: string) {
    const students = getStoredUsers();
    const user = students.find((student) => student.email.toLowerCase() === email.toLowerCase() && student.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    localStorage.setItem('campusconnect-current-user', JSON.stringify(user));
    return { success: true, user };
  },

  register(student: Student) {
    const students = getStoredUsers();
    const exists = students.some((item) => item.email.toLowerCase() === student.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'A user with this email already exists.' };
    }

    const nextUser = { ...student, id: `s${Date.now()}` };
    const updated = [...students, nextUser];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem('campusconnect-current-user', JSON.stringify(nextUser));
    return { success: true, user: nextUser };
  },

  getCurrentUser() {
    const value = localStorage.getItem('campusconnect-current-user');
    if (!value) return null;
    try {
      return JSON.parse(value) as Student;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('campusconnect-current-user');
    return true;
  },

  resetPassword(email: string) {
    const users = getStoredUsers();
    const exists = users.some((student) => student.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      return { success: false, message: 'No account found for this email.' };
    }
    return { success: true, message: 'Password reset link sent to your college email.' };
  }
};

export const syncDemoState = () => {
  localStorage.setItem('campusconnect-app-state', JSON.stringify(defaultState));
};
