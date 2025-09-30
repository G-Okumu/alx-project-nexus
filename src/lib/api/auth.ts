import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    createdAt: new Date().toISOString(),
  },
];

// Mock JWT token generation
const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  };
  return btoa(JSON.stringify(payload));
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await delay(800); // Simulate network delay
    
    const { email, password } = credentials;
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // For demo, accept any password for demo@example.com
    if (email === 'demo@example.com') {
      const user = mockUsers[0];
      const token = generateToken(user);
      
      return {
        user,
        token,
        message: 'Login successful',
      };
    }
    
    // Check if user exists
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // In a real app, you'd verify the password hash
    if (password.length < 6) {
      throw new Error('Invalid email or password');
    }
    
    const token = generateToken(user);
    
    return {
      user,
      token,
      message: 'Login successful',
    };
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await delay(1000); // Simulate network delay
    
    const { name, email, password, confirmPassword } = data;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      throw new Error('All fields are required');
    }
    
    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    if (name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    
    // Add to mock database
    mockUsers.push(newUser);
    
    const token = generateToken(newUser);
    
    return {
      user: newUser,
      token,
      message: 'Registration successful',
    };
  },

  async logout(): Promise<void> {
    await delay(300);
    //  invalidate the token on the server
    return;
  },

  async verifyToken(token: string): Promise<User | null> {
    try {
      const payload = JSON.parse(atob(token));
      
      // Check if token is expired
      if (payload.exp < Date.now()) {
        return null;
      }
      
      // Find user
      const user = mockUsers.find(u => u.id === payload.id);
      return user || null;
    } catch {
      return null;
    }
  },
};