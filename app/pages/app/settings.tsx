import { useState } from 'react';
import { AppLayout } from '../../components/layout';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Input, Select } from '../../components/common';
import {
  defaultPreferencesData,
  defaultProfileData,
  notificationFrequencyOptions,
  reminderHourOptions,
  settingsTabs,
  teamMembers,
} from '../../data/settings-data';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [savedMessage, setSavedMessage] = useState('');

  const [profile, setProfile] = useState(defaultProfileData);

  const [preferences, setPreferences] = useState(defaultPreferencesData);

  const handleLogout = () => {
    console.log('Logout');
  };

  const triggerSave = (section: string) => {
    setSavedMessage(section);
    window.setTimeout(() => setSavedMessage(''), 2000);
  };

  return (
    <AppLayout
      userName="John Doe"
      onLogout={handleLogout}
      headerProps={{
        title: 'Settings',
        subtitle: 'Fine tune your workspace, alerts, and account preferences.',
        showSearch: false,
      }}

    >
      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr] h-0.5">
        <aside className="app-pane overflow-hidden ">
          <div className="rounded-[26px] border border-slate-200/70 bg-linear-to-br from-[#f8f3ff] to-[#eef4ff] p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-slate-900 shadow-sm">
                JD
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">John Doe</p>
                <p className="text-xs text-slate-500">Product lead</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="primary">Active workspace</Badge>
              <Badge variant="neutral">Cloud sync on</Badge>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-[22px] px-4 py-4 text-left transition-all duration-200 ${active
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'border border-transparent bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <span className={`grid h-10 w-10 place-items-center rounded-2xl ${active ? 'bg-white/10' : 'bg-slate-100'}`}>
                    <Icon size={18} />
                  </span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-6">
          {activeTab === 'profile' && (
            <Card className="soft-card border-0">
              <CardHeader className="flex items-center justify-between border-slate-200/70">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Profile</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Profile information</h2>
                </div>
                {savedMessage === 'profile' && <Badge variant="success">Saved</Badge>}
              </CardHeader>
              <CardBody className="space-y-5">
                <div className="flex items-center gap-5 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-5">
                  <div className="grid h-20 w-20 place-items-center rounded-[26px] bg-linear-to-br from-slate-900 to-slate-600 text-xl font-semibold text-white shadow-lg shadow-slate-900/10">
                    JD
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">Profile photo</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Upload a new avatar to personalize the workspace.</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full px-4">
                    Upload image
                  </Button>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Full name"
                    value={profile.fullName}
                    onChange={(e) => setProfile((current) => ({ ...current, fullName: e.target.value }))}
                  />
                  <Input
                    label="Email address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((current) => ({ ...current, email: e.target.value }))}
                  />
                </div>

                <Input
                  label="Phone number"
                  value={profile.phone}
                  onChange={(e) => setProfile((current) => ({ ...current, phone: e.target.value }))}
                />
              </CardBody>
              <CardFooter>
                <span className="text-sm text-slate-500">Keep this information up to date.</span>
                <Button variant="primary" size="md" className="rounded-full px-5" onClick={() => triggerSave('profile')}>
                  Save changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card className="soft-card border-0">
                <CardHeader>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Alerts</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Notification preferences</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Checkbox
                    label="Email when a task is assigned to me"
                    checked={preferences.emailOnTaskAssigned}
                    onChange={(e) => setPreferences((current) => ({ ...current, emailOnTaskAssigned: e.target.checked }))}
                  />
                  <Checkbox
                    label="Email when I complete a task"
                    checked={preferences.emailOnTaskCompleted}
                    onChange={(e) => setPreferences((current) => ({ ...current, emailOnTaskCompleted: e.target.checked }))}
                  />
                  <Checkbox
                    label="Send daily summary"
                    checked={preferences.dailySummary}
                    onChange={(e) => setPreferences((current) => ({ ...current, dailySummary: e.target.checked }))}
                  />
                  <Checkbox
                    label="Send weekly summary"
                    checked={preferences.weeklySummary}
                    onChange={(e) => setPreferences((current) => ({ ...current, weeklySummary: e.target.checked }))}
                  />
                </CardBody>
              </Card>

              <Card className="soft-card border-0">
                <CardHeader>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Delivery</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Notification timing</h2>
                </CardHeader>
                <CardBody className="grid gap-5 md:grid-cols-2">
                  <Select
                    label="Reminder hours before deadline"
                    value={preferences.reminderHours}
                    onChange={(e) => setPreferences((current) => ({ ...current, reminderHours: e.target.value }))}
                    options={reminderHourOptions}
                  />
                  <Select
                    label="Notification frequency"
                    value={preferences.notificationFrequency}
                    onChange={(e) => setPreferences((current) => ({ ...current, notificationFrequency: e.target.value }))}
                    options={notificationFrequencyOptions}
                  />
                </CardBody>
                <CardFooter>
                  <span className="text-sm text-slate-500">Notification rules are stored per user and checked before dispatch.</span>
                  <Button variant="primary" size="md" className="rounded-full px-5" onClick={() => triggerSave('notifications')}>
                    Save preferences
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card className="soft-card border-0">
                <CardHeader>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Security</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Password management</h2>
                </CardHeader>
                <CardBody className="space-y-5">
                  <Input label="Current password" type="password" placeholder="••••••••" />
                  <Input label="New password" type="password" placeholder="••••••••" helperText="Use at least 8 characters with mixed case and numbers." />
                  <Input label="Confirm password" type="password" placeholder="••••••••" />
                </CardBody>
                <CardFooter>
                  <span className="text-sm text-slate-500">Keep your account credentials strong and private.</span>
                  <Button variant="primary" size="md" className="rounded-full px-5">Update password</Button>
                </CardFooter>
              </Card>

              <Card className="soft-card border-rose-200 bg-rose-50/60">
                <CardHeader className="border-rose-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Danger zone</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Delete account</h2>
                </CardHeader>
                <CardBody>
                  <p className="max-w-2xl text-sm leading-7 text-slate-600">
                    Removing your account will permanently erase your workspace access, profile data, and saved settings.
                  </p>
                </CardBody>
                <CardFooter>
                  <span className="text-sm text-slate-500">This action cannot be undone.</span>
                  <Button variant="error" size="md" className="rounded-full px-5">Delete account</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* {activeTab === 'team' && (
            <Card className="soft-card border-0">
              <CardHeader>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Team</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Team members and sharing</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={member.email} className="flex items-center justify-between rounded-[22px] border border-slate-200/70 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                    <div>
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? 'primary' : 'neutral'}>{member.role}</Badge>
                      {index !== 0 && <Button variant="ghost" size="sm" className="rounded-full">Remove</Button>}
                    </div>
                  </div>
                ))}
              </CardBody>
              <CardFooter>
                <span className="text-sm text-slate-500">Invite collaborators and keep access controlled.</span>
                <Button variant="primary" size="md" className="rounded-full px-5">Invite member</Button>
              </CardFooter>
            </Card>
          )} */}
        </div>
      </div>
    </AppLayout>
  );
}
