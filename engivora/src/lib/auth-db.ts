// Shared mock database for authentication (replace with actual database in production)

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  department: string;
  year?: string;
  rollNumber?: string;
  profilePicture?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationToken {
  userId: string;
  email: string;
  expires: Date;
}

// Mock user database
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'student@example.com',
    password: '$2b$10$Nc6rPZe4SfSPmZzktfQ1B.xj0rWmKM3wpDzUGT1DxPw5p15odCvqa', // hashed 'password123'
    name: 'John Doe',
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    rollNumber: 'CS2021001',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'admin@engivora.com',
    password: '$2b$10$Lf7tXXgYcPccwKTspN3nceK/AgwH7y1Tp8JF8VFEKJGSuVQwhAzue', // hashed 'admin123'
    name: 'Engivora Admin',
    role: 'admin',
    department: 'Administration',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'xyz@gmail.com',
    password: '$2b$10$ysjwopMMgzoAOe7VlqNeA.ZYXeTS68Cl9.dYCn6JN8JOUl8uAu03m', // hashed 'Xyz@123'
    name: 'XYZ User',
    role: 'student',
    department: 'Engineering',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Email verification tokens storage (in production, use Redis or database)
export const verificationTokens = new Map<string, VerificationToken>();

// Helper function to find user by email
export function findUserByEmail(email: string): User | undefined {
  return mockUsers.find(user => user.email === email);
}

// Helper function to find user by ID
export function findUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}

// Helper function to add new user
export function addUser(user: User): void {
  mockUsers.push(user);
}

// Helper function to update user
export function updateUser(userId: string, updates: Partial<User>): boolean {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    return false;
  }
  
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return true;
}

