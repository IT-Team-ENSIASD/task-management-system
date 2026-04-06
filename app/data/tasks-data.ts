export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  dueText: string;
  comments: number;
  attachments: number;
  spent: string;
  createdAt: string;
}

export interface TaskFileItem {
  title: string;
  meta: string;
  tone: string;
}

export interface TaskCommentItem {
  name: string;
  date: string;
  text: string;
}

export const taskBoardItems: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Implement user authentication flow',
    description: 'JWT login, register, refresh flow, and route protection for the app shell.',
    status: 'in_progress',
    priority: 'urgent',
    assignee: 'John Doe',
    dueText: 'Today',
    comments: 17,
    attachments: 6,
    spent: '12:45:00',
    createdAt: 'Apr 2',
  },
  {
    id: 'task-2',
    title: 'Refine dashboard split view',
    description: 'Bring the board, detail pane, and cards into a cleaner composition.',
    status: 'not_started',
    priority: 'high',
    assignee: 'You',
    dueText: 'Tomorrow',
    comments: 10,
    attachments: 4,
    spent: '06:10:00',
    createdAt: 'Apr 4',
  },
  {
    id: 'task-3',
    title: 'Audit notification events',
    description: 'Confirm event retries and delivery logging in the Azure service.',
    status: 'completed',
    priority: 'medium',
    assignee: 'Jane Smith',
    dueText: 'Completed',
    comments: 5,
    attachments: 2,
    spent: '04:55:00',
    createdAt: 'Apr 1',
  },
  {
    id: 'task-4',
    title: 'Document deployment checklist',
    description: 'Add AWS, Azure, and local steps to the final delivery notes.',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Alex Rodriguez',
    dueText: '3 days left',
    comments: 8,
    attachments: 1,
    spent: '03:20:00',
    createdAt: 'Apr 5',
  },
];

export const taskStatusOptions = [
  { value: '', label: 'All Status' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

export const taskPriorityOptions = [
  { value: '', label: 'All Priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const taskDetailsFiles: TaskFileItem[] = [
  { title: 'Project brief.pdf', meta: '12:32 PM, 22 Aug', tone: 'bg-rose-100' },
  { title: 'Sprint notes.pdf', meta: '14:35 PM, 24 Aug', tone: 'bg-violet-100' },
];

export const taskDetailsComments: TaskCommentItem[] = [
  { name: 'John Smith', date: '17th Feb 2024', text: 'I want a complete diet plan.' },
  { name: 'John Smith', date: 'Just now', text: 'Do you have any update?' },
];

export const taskMetrics = [
  { label: 'Open tasks', value: '24' },
  { label: 'Completed today', value: '16' },
  { label: 'Due soon', value: '6' },
] as const;
