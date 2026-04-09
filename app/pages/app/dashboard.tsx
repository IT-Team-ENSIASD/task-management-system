import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppLayout } from '../../components/layout';
import { Badge, Button, Card, CardBody } from '../../components/common';
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  PlusIcon,
  ListIcon,
  SettingsIcon,
  SparklesIcon,
} from '../../components/icons';
import { tasksApi, type ApiTask, type ApiUser } from '../../api';
import { getUser, logout } from '../../auth';

const quickActions = [
  {
    id: 'create-task',
    title: 'Create task',
    description: 'Add a new task and assign it to a teammate.',
    buttonLabel: 'New task',
    icon: PlusIcon,
    tone: 'bg-blue-50',
  },
  {
    id: 'view-tasks',
    title: 'Manage tasks',
    description: 'Open the task page to update status and priorities.',
    buttonLabel: 'Open tasks',
    icon: ListIcon,
    tone: 'bg-emerald-50',
  },
  {
    id: 'settings',
    title: 'Notification settings',
    description: 'Prepare reminders for the notification service workflow.',
    buttonLabel: 'Open settings',
    icon: SettingsIcon,
    tone: 'bg-amber-50',
  },
] as const;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
    tasksApi.getAll().then((res) => {
      setTasks(res.tasks);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const overdue = tasks.filter(
      (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed' && t.status !== 'archived'
    ).length;
    return { total, completed, inProgress, overdue };
  }, [tasks]);

  const metricCards = useMemo(
    () => [
      { label: 'Total tasks', value: loading ? '…' : String(stats.total), iconKey: 'sparkles' as const },
      { label: 'Completed', value: loading ? '…' : String(stats.completed), iconKey: 'check' as const },
      { label: 'In Progress', value: loading ? '…' : String(stats.inProgress), iconKey: 'calendar' as const },
    ],
    [loading, stats]
  );

  const handleAction = (actionId: (typeof quickActions)[number]['id']) => {
    if (actionId === 'settings') { navigate('/app/settings'); return; }
    navigate('/app/tasks');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  const statusIndicators = useMemo(
    () => [
      { label: 'Task Service (Cloud A)', state: 'Connected', variant: 'success' as const },
      { label: 'Notification Service (Cloud B)', state: 'Integrated', variant: 'success' as const },
      { label: 'Cross-cloud Sync', state: `${stats.overdue} overdue`, variant: stats.overdue > 0 ? 'warning' as const : 'neutral' as const },
    ],
    [stats.overdue]
  );

  return (
    <AppLayout
      userName={user?.username ?? 'User'}
      onLogout={handleLogout}
      headerProps={{
        title: 'Dashboard',
        subtitle: 'Simple project overview for the multi-cloud task management prototype.',
        showSearch: false,
      }}
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {metricCards.map((item) => (
          <Card key={item.label} className="metric-surface">
            <CardBody className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{item.value}</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">
                  {item.iconKey === 'sparkles' && <SparklesIcon size={18} />}
                  {item.iconKey === 'check' && <CheckIcon size={18} />}
                  {item.iconKey === 'calendar' && <CalendarIcon size={18} />}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="app-panel px-5 py-5 md:px-6">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Quick actions</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                Keep execution in the tasks page
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.id} className="soft-card border border-slate-200/70">
                  <CardBody className="px-5 py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`grid h-11 w-11 place-items-center rounded-2xl ${action.tone} text-slate-800`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{action.description}</p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-4"
                        onClick={() => handleAction(action.id)}
                      >
                        {action.buttonLabel}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>

        <aside className="app-panel px-5 py-5 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Build focus</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Multi-cloud progress</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Live stats from Cloud A (PostgreSQL) — logged in as <strong>{user?.username}</strong>.
          </p>

          <div className="mt-5 space-y-3">
            {statusIndicators.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                <Badge variant={item.variant}>{item.state}</Badge>
              </div>
            ))}
          </div>

          <div className="mt-5 detail-strip flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white">
                <ClockIcon size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Sprint focus</p>
                <p className="text-xs text-slate-500">Cloud A + Cloud B communication</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <CalendarIcon size={14} />
              15-day project
            </span>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
