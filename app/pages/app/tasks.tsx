import { useMemo, useState } from 'react';
import { AppLayout } from '../../components/layout';
import { Badge, Button, Card, CardBody, Select, Input } from '../../components/common';
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  FilterIcon,
  MessageIcon,
  PaperclipIcon,
  PlusIcon,
  SearchIcon,
  ShareIcon,
  MoreHorizontalIcon,
  ArrowUpRightIcon,
  DownloadIcon,
} from '../../components/icons';
import {
  taskBoardItems,
  taskDetailsComments,
  taskDetailsFiles,
  taskMetrics,
  taskPriorityOptions,
  taskStatusOptions,
  type TaskItem,
} from '../../data/tasks-data';

const badgeVariant = (priority: TaskItem['priority']) => {
  if (priority === 'urgent') return 'error';
  if (priority === 'high') return 'warning';
  if (priority === 'medium') return 'primary';
  return 'success';
};

const statusBadgeVariant = (status: TaskItem['status']) => {
  if (status === 'completed') return 'success';
  if (status === 'in_progress') return 'primary';
  if (status === 'archived') return 'neutral';
  return 'neutral';
};

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(taskBoardItems[0].id);

  const filteredTasks = useMemo(
    () =>
      taskBoardItems.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || task.status === statusFilter;
        const matchesPriority = !priorityFilter || task.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
      }),
    [priorityFilter, searchQuery, statusFilter]
  );

  const selectedTask = useMemo(
    () => filteredTasks.find((task) => task.id === selectedTaskId) ?? filteredTasks[0] ?? taskBoardItems[0],
    [filteredTasks, selectedTaskId]
  );

  const handleLogout = () => {
    console.log('Logout');
  };

  return (
    <AppLayout
      userName="John Doe"
      onLogout={handleLogout}
      headerProps={{
        title: 'Task Board',
        subtitle: 'Filter, review, and inspect each task in a focused workspace.',
        showSearch: false,
      }}
    >
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <section className="app-panel overflow-hidden">
          <div className="border-b border-slate-200/70 px-5 py-5 md:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">All tasks</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Task list and quick filters</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 rounded-full px-4">
                  <ShareIcon size={16} />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="gap-2 rounded-full px-4">
                  <PlusIcon size={16} />
                  New task
                </Button>
                <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50">
                  <MoreHorizontalIcon size={18} />
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1.4fr_0.7fr_0.7fr]">
              <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-3">
                  <SearchIcon size={18} className="text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks, assignees, or keywords"
                    className="border-0 p-0 shadow-none focus:ring-0"
                  />
                </div>
              </div>

              <Select
                options={taskStatusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-[20px]"
                placeholder="Status"
              />

              <Select
                options={taskPriorityOptions}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-[20px]"
                placeholder="Priority"
              />
            </div>
          </div>

          <div className="max-h-[calc(100vh-20.5rem)] overflow-auto px-5 py-5 md:px-6 scrollbar-thin">
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const isSelected = selectedTask.id === task.id;

                return (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`soft-card w-full p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] ${
                      isSelected ? 'border-slate-900 ring-1 ring-slate-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={statusBadgeVariant(task.status)} size="sm">
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant={badgeVariant(task.priority)} size="sm">
                            {task.priority} priority
                          </Badge>
                        </div>
                        <p className="mt-3 truncate text-[15px] font-semibold text-slate-900">{task.title}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{task.description}</p>
                      </div>
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                        <ArrowUpRightIcon size={18} />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarIcon size={14} />
                          {task.createdAt}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <ClockIcon size={14} />
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
                      <span className="font-medium text-slate-700">{task.assignee}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="app-panel overflow-hidden">
          <div className="border-b border-slate-200/70 px-5 py-5 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Task details</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{selectedTask.title}</h3>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50">
                <FilterIcon size={16} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant={statusBadgeVariant(selectedTask.status)}>
                {selectedTask.status.replace('_', ' ')}
              </Badge>
              <Badge variant={badgeVariant(selectedTask.priority)}>
                {selectedTask.priority} priority
              </Badge>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                Due {selectedTask.dueText}
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
                  <p className="text-sm font-medium text-slate-700">Time spent on task</p>
                  <p className="text-xs text-slate-500">Tracked across the workflow</p>
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-slate-900">{selectedTask.spent}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Description</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">{selectedTask.description}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                This task is part of the larger release plan. Keep the scope tight, align the handoff, and close the loop with the owner before moving it forward.
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Attachments</h4>
                <Button variant="ghost" size="sm" className="rounded-full text-slate-600">
                  View all
                </Button>
              </div>

              <div className="space-y-3">
                {taskDetailsFiles.map((file) => (
                  <div
                    key={file.title}
                    className="flex items-center justify-between rounded-[22px] border border-slate-200/70 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`grid h-11 w-11 place-items-center rounded-2xl ${file.tone} text-slate-900`}>
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
                {taskDetailsComments.map((comment, index) => (
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
        {taskMetrics.map((item) => (
          <Card key={item.label} className="metric-surface border-0">
            <CardBody className="p-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{item.value}</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">
                  <CheckIcon size={18} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
