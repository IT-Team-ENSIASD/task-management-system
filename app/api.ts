/**
 * api.ts — Central API client for the Multi-Cloud Task System
 */

// Detect if we are in development mode (npm run dev)
const isDev = import.meta.env.DEV;
// Use your Railway URL for production, and localhost for development
const BASE_TASK = isDev
  ? 'http://localhost:3000'
  : 'https://task-service-backend-production.up.railway.app';
const BASE_NOTIF = isDev
  ? 'http://localhost:3001'
  : 'https://0139-105-69-85-28.ngrok-free.app';


async function request<T>(base: string, path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `Request failed: ${res.status}`);
  return json as T;
}

/* ─── Auth ─────────────────────────────────────────────────────────────── */

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export const authApi = {
  register: (username: string, email: string, password: string) =>
    request<{ success: boolean; user: ApiUser }>(BASE_TASK, '/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ success: boolean; user: ApiUser }>(BASE_TASK, '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

/* ─── Tasks ─────────────────────────────────────────────────────────────── */

export interface ApiTask {
  id: number;
  title: string;
  description: string | null;
  status: 'not_started' | 'in_progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  creator_id: number;
  assigned_to: number | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  creator_name?: string;
  assignee_name?: string;
}

export interface TasksFilter {
  status?: string;
  priority?: string;
  assignedTo?: number;
  creatorId?: number;
}

export const tasksApi = {
  getAll: (filters: TasksFilter = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.assignedTo) params.set('assignedTo', String(filters.assignedTo));
    if (filters.creatorId) params.set('creatorId', String(filters.creatorId));
    return request<{ success: boolean; tasks: ApiTask[]; count: number }>(BASE_TASK, `/api/tasks?${params.toString()}`);
  },
  getById: (id: number) =>
    request<{ success: boolean; task: ApiTask }>(BASE_TASK, `/api/tasks/${id}`),
  create: (data: any) =>
    request<{ success: boolean; task: ApiTask }>(BASE_TASK, '/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    request<{ success: boolean; task: ApiTask }>(BASE_TASK, `/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  archive: (id: number) =>
    request<{ success: boolean; task: ApiTask }>(BASE_TASK, `/api/tasks/${id}`, { method: 'DELETE' }),
};

/* ─── Users ─────────────────────────────────────────────────────────────── */

export const usersApi = {
  getAll: () => request<{ success: boolean; users: ApiUser[] }>(BASE_TASK, '/api/users'),
  getById: (id: number) => request<{ success: boolean; user: ApiUser }>(BASE_TASK, `/api/users/${id}`),
  update: (id: number, data: { username?: string; email?: string }) =>
    request<{ success: boolean; user: ApiUser }>(BASE_TASK, `/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

/* ─── Notifications (Cloud B) ─────────────────────────────────────────── */

export interface ApiNotification {
  id: number;
  user_id: number;
  task_id: number | null;
  type: 'reminder' | 'completion' | 'assignment' | 'due_soon';
  title: string;
  message: string;
  email_sent: boolean;
  is_read: boolean;
  created_at: string;
}

export const notifApi = {
  getAll: (userId: number, filters: any = {}) => {
    const params = new URLSearchParams(filters);
    return request<{ success: boolean; notifications: ApiNotification[]; count: number }>(
      BASE_NOTIF, `/api/notifications/${userId}?${params.toString()}`
    );
  },
  getUnreadCount: (userId: number) =>
    request<{ success: boolean; count: number }>(BASE_NOTIF, `/api/notifications/unread-count/${userId}`),
  markAsRead: (id: number) =>
    request<{ success: boolean; notification: ApiNotification }>(BASE_NOTIF, `/api/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: (userId: number) =>
    request<{ success: boolean; updated: number }>(BASE_NOTIF, `/api/notifications/read-all/${userId}`, { method: 'PUT' }),
  delete: (id: number) =>
    request<{ success: boolean; message: string }>(BASE_NOTIF, `/api/notifications/${id}`, { method: 'DELETE' }),
};

/* ─── Preferences (Cloud B) ─────────────────────────────────────────── */

export interface ApiPreferences {
  userId: number;
  emailOnTaskAssigned: boolean;
  emailOnTaskCompleted: boolean;
  reminderHoursBefore: number;
  dailySummary: boolean;
  weeklySummary: boolean;
  notificationFrequency: 'immediate' | 'daily_digest' | 'off';
}

export const prefApi = {
  get: (userId: number) =>
    request<{ success: boolean; data: ApiPreferences }>(BASE_NOTIF, `/api/preferences/${userId}`),
  update: (userId: number, data: Partial<ApiPreferences>) =>
    request<{ success: boolean; message: string; data: ApiPreferences }>(BASE_NOTIF, `/api/preferences/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
