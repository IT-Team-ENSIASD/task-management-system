import { useMemo, useState } from 'react';
import { AppLayout } from '../../components/layout';
import { Badge, Button, Card, CardBody } from '../../components/common';
import {
  ArrowUpRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  DownloadIcon,
  ExpandIcon,
  MessageIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  ShareIcon,
  SparklesIcon,
  XIcon,
} from '../../components/icons';
import {
  dashboardAttachmentItems,
  dashboardComments,
  dashboardFilterTabs,
  dashboardMetricCards,
  dashboardTasks,
} from '../../data/dashboard-data';

type Priority = 'urgent' | 'high' | 'medium' | 'low';
type Lane = 'completed' | 'in_progress' | 'todo';

function getPriorityVariant(priority: Priority) {
  if (priority === 'urgent') return 'error' as const;
  if (priority === 'high') return 'warning' as const;
  if (priority === 'medium') return 'primary' as const;
  return 'success' as const;
}

function getLaneVariant(lane: Lane) {
  if (lane === 'completed') return 'success' as const;
  if (lane === 'in_progress') return 'primary' as const;
  return 'neutral' as const;
}

const laneMeta = [
  { key: 'todo', title: 'Todo', count: dashboardTasks.filter((task) => task.lane === 'todo').length },
  {
    key: 'in_progress',
    title: 'In Progress',
    count: dashboardTasks.filter((task) => task.lane === 'in_progress').length,
  },
  {
    key: 'completed',
    title: 'Completed',
    count: dashboardTasks.filter((task) => task.lane === 'completed').length,
  },
] as const;

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof dashboardFilterTabs)[number]>('All');
  const [selectedTaskId, setSelectedTaskId] = useState(dashboardTasks[0].id);

  const selectedTask = useMemo(
    () => dashboardTasks.find((task) => task.id === selectedTaskId) ?? dashboardTasks[0],
    [selectedTaskId]
  );

  const handleLogout = () => {
    console.log('Logout');
  };

  return (
    <AppLayout
      userName="John Doe"
      onLogout={handleLogout}
      headerProps={{
        title: 'My Events',
        subtitle: 'A calm command center for task flow, reviews, and project updates.',
        showSearch: false,
      }}
    >
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.95fr]">
        <section className="app-panel overflow-hidden">
          <div className="border-b border-slate-200/70 px-5 py-5 md:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">Workspace</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  Schedule, track, and close work without friction.
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 rounded-full px-4">
                  <ShareIcon size={16} />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="gap-2 rounded-full px-4">
                  <ExpandIcon size={16} />
                  Expand
                </Button>
                <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50">
                  <MoreHorizontalIcon size={18} />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {dashboardFilterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`section-pill ${activeFilter === tab ? 'section-pill-active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[calc(100vh-21rem)] overflow-auto px-5 py-5 md:px-6 scrollbar-thin">
            <div className="space-y-6">
              {laneMeta.map((lane) => {
                const laneTasks = dashboardTasks.filter((task) => task.lane === lane.key);

                return (
                  <div key={lane.key}>
                    <div className="mb-4 flex items-center gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                        {lane.title}
                      </p>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        {lane.count}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {laneTasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          className={`soft-card w-full p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] ${
                            selectedTaskId === task.id ? 'border-slate-900 ring-1 ring-slate-900/10' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate text-[15px] font-semibold text-slate-900">{task.title}</p>
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                {task.description}
                              </p>
                            </div>
                            <Badge variant={getPriorityVariant(task.priority)}>
                              {task.priority} priority
                            </Badge>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarIcon size={14} />
                              {task.dueText}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MessageIcon size={14} />
                              {task.comments}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <PaperclipIcon size={14} />
                              {task.attachments}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="app-panel overflow-hidden">
          <div className="border-b border-slate-200/70 px-5 py-5 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {selectedTask.category}
                </p>
                <h3 className="mt-2 text-[28px] font-semibold tracking-tight text-slate-900">
                  {selectedTask.title}
                </h3>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50">
                <XIcon size={18} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant={getLaneVariant(selectedTask.lane)}>
                {selectedTask.lane.replace('_', ' ')}
              </Badge>
              <Badge variant={getPriorityVariant(selectedTask.priority)}>
                {selectedTask.priority} priority
              </Badge>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                Jul 10 - 14
              </span>
            </div>
          </div>

          <div className="space-y-5 px-5 py-5 md:px-6">
            <div className="detail-strip flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/15">
                  <ClockIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Time spent on this project</p>
                  <p className="text-xs text-slate-500">Tracked automatically across the sprint</p>
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-slate-900">{selectedTask.spent}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Description</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">{selectedTask.details}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">{selectedTask.description}</p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Attachments
                </h4>
                <Button variant="ghost" size="sm" className="rounded-full text-slate-600">
                  View all
                </Button>
              </div>

              <div className="space-y-3">
                {dashboardAttachmentItems.map((file) => (
                  <div
                    key={file.title}
                    className="flex items-center justify-between rounded-[22px] border border-slate-200/70 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid h-11 w-11 place-items-center rounded-2xl ${file.tone} text-slate-900`}
                      >
                        <PaperclipIcon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{file.title}</p>
                        <p className="text-xs text-slate-500">{file.meta}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <button className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-slate-100">
                        <ArrowUpRightIcon size={16} />
                        View
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-slate-100">
                        <DownloadIcon size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-6 border-b border-slate-200 pb-3 text-sm font-medium">
                <button className="border-b-2 border-slate-900 pb-2 text-slate-900">Comments</button>
                <button className="pb-2 text-slate-400">Updates</button>
              </div>

              <div className="mt-4 space-y-4">
                {dashboardComments.map((comment, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-semibold text-white">
                      JS
                    </div>
                    <div className="flex-1 rounded-[20px] border border-slate-200/70 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-slate-900">{comment.name}</p>
                        <p className="text-xs text-slate-400">{comment.date}</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                Add a comment...
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {dashboardMetricCards.map((item) => (
          <Card key={item.label} className="metric-surface border-0">
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
     </AppLayout>
   );
 }
