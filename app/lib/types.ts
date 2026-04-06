// Type definitions for the application

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  creatorId: string;
  assignedToId: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  tags?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  taskId: string;
  type: 'reminder' | 'completion' | 'assignment' | 'due_soon';
  title: string;
  message: string;
  emailSent: boolean;
  sentAt?: Date;
  readAt?: Date;
  createdAt: Date;
}

export interface NotificationPreference {
  userId: string;
  emailOnTaskAssigned: boolean;
  emailOnTaskCompleted: boolean;
  reminderHoursBefore: number;
  dailySummary: boolean;
  weeklySummary: boolean;
  notificationFrequency: 'immediate' | 'daily_digest' | 'weekly_digest' | 'off';
  updatedAt: Date;
}

export interface Report {
  id: string;
  userId: string;
  reportType: 'daily' | 'weekly' | 'monthly';
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  generatedAt: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
