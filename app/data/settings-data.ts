import { BellIcon, SettingsIcon, ShieldIcon, UserIcon } from '../components/icons';

export const defaultProfileData = {
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
};

export const defaultPreferencesData = {
  emailOnTaskAssigned: true,
  emailOnTaskCompleted: true,
  dailySummary: true,
  weeklySummary: false,
  reminderHours: '24',
  notificationFrequency: 'immediate',
};

export const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'security', label: 'Security', icon: ShieldIcon },
  // { id: 'team', label: 'Team', icon: SettingsIcon },
] as const;

export const reminderHourOptions = [
  { value: '1', label: '1 hour before' },
  { value: '6', label: '6 hours before' },
  { value: '12', label: '12 hours before' },
  { value: '24', label: '24 hours before' },
];

export const notificationFrequencyOptions = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'daily_digest', label: 'Daily digest' },
  { value: 'off', label: 'Off' },
];

export const teamMembers = [
  { name: 'You (Owner)', email: 'john@example.com', role: 'Owner' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
  { name: 'Alex Rodriguez', email: 'alex@example.com', role: 'Member' },
];
