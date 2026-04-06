export interface BoardTask {
  id: string;
  lane: 'todo' | 'in_progress' | 'completed';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueText: string;
  comments: number;
  attachments: number;
  spent: string;
  category: string;
  details: string;
}

export interface DashboardAttachment {
  title: string;
  meta: string;
  tone: string;
}

export interface DashboardComment {
  name: string;
  date: string;
  text: string;
}

export const dashboardTasks: BoardTask[] = [
  {
    id: 'task-1',
    lane: 'todo',
    title: 'Schedule the client kickoff with the product owner',
    description: 'Prepare the agenda, confirm the attendees, and reserve the workshop room.',
    priority: 'high',
    dueText: '15 days left',
    comments: 17,
    attachments: 6,
    spent: '12:45:00',
    category: 'Appointments',
    details:
      'Specialize in the planning and alignment of requirements for the first delivery cycle. Confirm scope, team assignments, and the cloud rollout timeline before the sprint begins.',
  },
  {
    id: 'task-2',
    lane: 'todo',
    title: 'Refine landing page content blocks',
    description: 'Tighten hero messaging, replace placeholder sections, and review CTA placement.',
    priority: 'medium',
    dueText: '11 days left',
    comments: 12,
    attachments: 3,
    spent: '08:20:00',
    category: 'Marketing',
    details:
      'Align the landing page with the new product story and ensure the content hierarchy is consistent across desktop and mobile breakpoints.',
  },
  {
    id: 'task-3',
    lane: 'in_progress',
    title: 'Implement team notifications and retry queue',
    description: 'Wire the notification service to the task lifecycle events.',
    priority: 'urgent',
    dueText: '6 days left',
    comments: 32,
    attachments: 7,
    spent: '18:10:00',
    category: 'Engineering',
    details:
      'Coordinate the event dispatcher, persistence, and retry behavior so the notification path remains resilient when the task service is unavailable.',
  },
  {
    id: 'task-4',
    lane: 'in_progress',
    title: 'Review database indexes and query paths',
    description: 'Check the main queries and tighten the critical read operations.',
    priority: 'low',
    dueText: '8 days left',
    comments: 8,
    attachments: 2,
    spent: '05:12:00',
    category: 'Database',
    details:
      'Validate schema indexing on the task service side and document any read-heavy paths that need optimization before demo day.',
  },
  {
    id: 'task-5',
    lane: 'completed',
    title: 'Finalize onboarding checklist',
    description: 'Document setup, local env, and the handoff process for the team.',
    priority: 'medium',
    dueText: 'Completed today',
    comments: 4,
    attachments: 1,
    spent: '03:32:00',
    category: 'Operations',
    details:
      'The onboarding checklist now covers setup, validation, and the rollback notes needed to keep the release process predictable.',
  },
];

export const dashboardFilterTabs = ['All', 'Remote', 'In Person'] as const;

export const dashboardAttachmentItems: DashboardAttachment[] = [
  { title: 'Project brief.pdf', meta: '12:32 PM, 22 Aug', tone: 'bg-rose-100' },
  { title: 'Design notes.fig', meta: '14:35 PM, 24 Aug', tone: 'bg-violet-100' },
];

export const dashboardComments: DashboardComment[] = [
  { name: 'John Smith', date: '17th Feb 2024', text: 'I want a complete diet plan.' },
  { name: 'John Smith', date: 'Just now', text: 'Do you have any update?' },
];

export const dashboardMetricCards = [
  { label: 'Total tasks', value: '24', iconKey: 'sparkles' },
  { label: 'Completed', value: '16', iconKey: 'check' },
  { label: 'Due soon', value: '6', iconKey: 'calendar' },
] as const;
