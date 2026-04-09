import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppLayout } from '../../components/layout';
import { Button, Card, CardBody, Input, Modal, Select, TextArea } from '../../components/common';
import {
  CalendarIcon, ClockIcon, PlusIcon, SearchIcon, FilterIcon,
  MoreHorizontalIcon, CheckCircle2Icon, CircleIcon, ArchiveIcon,
  PlayCircleIcon, SparklesIcon, CheckIcon,
} from '../../components/icons';
import { taskPriorityOptions, taskStatusOptions } from '../../data/tasks-data';
import { tasksApi, type ApiTask, type ApiUser } from '../../api';
import { getUser, logout } from '../../auth';

/* ─── Display configs (unchanged) ─────────────────────────────────────── */

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2Icon, dot: 'bg-emerald-500' },
  in_progress: { label: 'In Progress', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: PlayCircleIcon, dot: 'bg-blue-500' },
  not_started: { label: 'Not Started', color: 'bg-slate-50 text-slate-600 border-slate-200', icon: CircleIcon, dot: 'bg-slate-400' },
  archived: { label: 'Archived', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: ArchiveIcon, dot: 'bg-slate-400' },
};

const priorityConfig = {
  urgent: { label: 'Urgent', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  high: { label: 'High', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  low: { label: 'Low', color: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

/* ─── Helpers ──────────────────────────────────────────────────────────── */

const formatDate = (iso: string | null) => {
  if (!iso) return 'No date';
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(iso));
  } catch {
    return 'Invalid date';
  }
};

const deadlineText = (iso: string | null): string => {
  if (!iso) return 'No deadline';
  const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `${diff} days left`;
};

/* ─── Component ────────────────────────────────────────────────────────── */

export default function TasksPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Create modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<ApiTask['priority']>('medium');
  const [newDeadline, setNewDeadline] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  /* ── Load tasks ──────────────────────────────────────────────────────── */

  const loadTasks = () => {
    setLoading(true);
    setApiError('');
    tasksApi.getAll()
      .then((res) => {
        setTasks(res.tasks);
        if (res.tasks.length > 0 && selectedTaskId === null) {
          setSelectedTaskId(res.tasks[0].id);
        }
      })
      .catch((err) => setApiError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setUser(getUser());
    loadTasks();
  }, []);

  /* ── Derived state ───────────────────────────────────────────────────── */

  const filteredTasks = useMemo(() =>
    tasks.filter((task) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || task.title.toLowerCase().includes(q) ||
        (task.assignee_name ?? '').toLowerCase().includes(q);
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    }),
    [tasks, searchQuery, statusFilter, priorityFilter]
  );

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? filteredTasks[0] ?? null,
    [tasks, selectedTaskId, filteredTasks]
  );

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
  }), [tasks]);

  const metricCards = useMemo(() => [
    { label: 'Total tasks', value: loading ? '…' : String(stats.total), iconKey: 'sparkles' as const },
    { label: 'Completed', value: loading ? '…' : String(stats.completed), iconKey: 'check' as const },
    { label: 'In Progress', value: loading ? '…' : String(stats.inProgress), iconKey: 'calendar' as const },
  ], [loading, stats]);

  /* ── Handlers ────────────────────────────────────────────────────────── */

  const handleStatusChange = async (taskId: number, status: ApiTask['status']) => {
    try {
      const { task } = await tasksApi.update(taskId, { status });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? task : t)));
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  const handleArchive = async (taskId: number) => {
    try {
      await tasksApi.archive(taskId);
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: 'archived' } : t));
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Archive failed');
    }
  };

  const openCreateModal = () => {
    setFormError('');
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');
    setNewDeadline('');
    setIsCreateModalOpen(true);
  };

  const handleCreateTask = async () => {
    if (!newTitle.trim()) { setFormError('Task title is required'); return; }
    if (!user) { navigate('/auth/login', { replace: true }); return; }

    setSaving(true);
    setFormError('');
    try {
      const { task } = await tasksApi.create({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        priority: newPriority,
        deadline: newDeadline || undefined,
        creatorId: user.id,
        assignedTo: user.id,
      });
      setTasks((prev) => [task, ...prev]);
      setSelectedTaskId(task.id);
      setIsCreateModalOpen(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  const clearFilters = () => { setStatusFilter(''); setPriorityFilter(''); setSearchQuery(''); };
  const hasFilters = statusFilter || priorityFilter || searchQuery;

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <AppLayout
      userName={user?.username ?? 'User'}
      onLogout={handleLogout}
      headerProps={{ title: 'Tasks', subtitle: "Manage and track your team's work", showSearch: false }}
    >
      <div className="h-[calc(100vh-10rem)] grid grid-cols-12 gap-6">
        {/* ── Task List column ── */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
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

          {/* API error banner */}
          {apiError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-center justify-between">
              <span>⚠ {apiError}</span>
              <button onClick={() => setApiError('')} className="ml-4 underline text-xs">Dismiss</button>
            </div>
          )}

          {/* Filters */}
          <div className="soft-card p-4">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon size={18} className="text-slate-400" />
                </div>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks by title or assignee..."
                  className="pl-10 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FilterIcon size={16} className="text-slate-400" />
                  <Select
                    options={[{ label: 'All Status', value: '' }, ...taskStatusOptions.filter((o) => o.value)]}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border-slate-200 rounded-lg text-sm min-w-35"
                  />
                  <Select
                    options={[{ label: 'All Priorities', value: '' }, ...taskPriorityOptions.filter((o) => o.value)]}
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border-slate-200 rounded-lg text-sm min-w-35"
                  />
                </div>

                {hasFilters && (
                  <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-slate-900 underline underline-offset-4">
                    Clear filters
                  </button>
                )}

                <Button onClick={openCreateModal} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2 gap-2 shadow-lg shadow-slate-900/10">
                  <PlusIcon size={18} />
                  <span className="hidden sm:inline">New Task</span>
                </Button>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-600">
                <span>Showing {filteredTasks.length} of {tasks.length} tasks</span>
              </div>
            )}
          </div>

          {/* Task list */}
          <div className="soft-card flex flex-1 flex-col overflow-hidden">
            <div className="flex px-6 py-4 items-center justify-between gap-4">
              <div className='flex justify-between items-center w-full pb-4 border-b border-slate-200/70'>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 pt-4">All Tasks</p>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {filteredTasks.length} tasks
                </span>
              </div>
            </div>

            <div className="scrollbar-thin flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">Loading tasks…</div>
              ) : !filteredTasks.length ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <SearchIcon size={24} className="text-slate-300" />
                  </div>
                  <h4 className="text-slate-900 font-medium mb-1">No tasks found</h4>
                  <p className="text-slate-500 text-sm max-w-sm">
                    {hasFilters ? "Try adjusting your filters." : "Create your first task to get started."}
                  </p>
                  {hasFilters && (
                    <Button variant="outline" onClick={clearFilters} className="mt-4 rounded-lg">
                      Clear all filters
                    </Button>
                  )}
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isSelected = selectedTask?.id === task.id;
                  const StatusIcon = statusConfig[task.status].icon;

                  return (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className={`soft-card w-full p-4 text-left transition-all duration-200 ${isSelected ? 'border-slate-900 ring-1 ring-slate-900/10' : 'hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]'
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${priorityConfig[task.priority].dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className={`font-semibold text-base truncate ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                              {task.title}
                            </h4>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[task.status].color} whitespace-nowrap`}>
                              <StatusIcon size={12} />
                              {statusConfig[task.status].label}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {task.description || 'No description.'}
                          </p>

                          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600">
                                {(task.assignee_name ?? 'U').charAt(0).toUpperCase()}
                              </div>
                              <span>{task.assignee_name ?? '—'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <ClockIcon size={13} className="text-slate-400" />
                              <span>{deadlineText(task.deadline)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CalendarIcon size={13} className="text-slate-400" />
                              <span>{formatDate(task.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ── Details Panel ── */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden sticky top-6">
            {!selectedTask ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2Icon size={32} className="text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg mb-2">No task selected</h3>
                <p className="text-slate-500 text-sm">Select a task from the list to view its details.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-6 py-6 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${priorityConfig[selectedTask.priority].color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[selectedTask.priority].dot}`} />
                      {priorityConfig[selectedTask.priority].label} Priority
                    </span>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontalIcon size={20} />
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-3">{selectedTask.title}</h2>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Created {formatDate(selectedTask.created_at)}</span>
                    <span>•</span>
                    <span>Due {deadlineText(selectedTask.deadline)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  {/* Status */}
                  <div>
                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3 block">
                      Current Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {taskStatusOptions.filter((o) => o.value).map((option) => {
                        const isActive = selectedTask.status === option.value;
                        const config = statusConfig[option.value as ApiTask['status']];
                        const Icon = config.icon;

                        return (
                          <button
                            key={option.value}
                            onClick={() => handleStatusChange(selectedTask.id, option.value as ApiTask['status'])}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${isActive ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                          >
                            <Icon size={16} />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3 block">Description</label>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {selectedTask.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Assignee & Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                          {(selectedTask.assignee_name ?? 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wider">Assignee</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{selectedTask.assignee_name ?? '—'}</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <CalendarIcon size={16} />
                        <span className="text-xs font-medium uppercase tracking-wider">Deadline</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{formatDate(selectedTask.deadline)}</p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Task ID</span>
                      <span className="font-mono text-slate-700">#{selectedTask.id}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-300 hover:bg-white hover:border-slate-400"
                    onClick={() => handleArchive(selectedTask.id)}
                  >
                    <ArchiveIcon size={16} className="mr-2" />
                    Archive Task
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Task" description="Add a new task to your workflow.">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title *</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter a clear, actionable title..."
              className="rounded-xl border-slate-200 focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Deadline</label>
              <Input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="rounded-xl border-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
              <div className="flex gap-1">
                {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewPriority(p)}
                    className={`flex-1 py-2 px-1 rounded-lg border text-xs font-medium capitalize transition-all ${newPriority === p ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <TextArea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Add details about this task..."
              className="min-h-[100px] rounded-xl border-slate-200 focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>

          {formError && (
            <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">{formError}</div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" className="rounded-xl px-6 hover:bg-slate-100" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateTask}
              isLoading={saving}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 shadow-lg shadow-slate-900/10"
            >
              {saving ? 'Creating…' : 'Create Task'}
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}