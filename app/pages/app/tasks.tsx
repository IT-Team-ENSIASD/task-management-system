import { useMemo, useState } from 'react';
import { AppLayout } from '../../components/layout';
import { Button, Input, Modal, Select, TextArea } from '../../components/common';
import { CalendarIcon, ClockIcon, PlusIcon, SearchIcon, FilterIcon, MoreHorizontalIcon, CheckCircle2Icon, CircleIcon, ArchiveIcon, PlayCircleIcon } from '../../components/icons';
import { taskBoardItems, taskPriorityOptions, taskStatusOptions, type TaskItem } from '../../data/tasks-data';

const statusConfig = {
  completed: { 
    label: 'Completed', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2Icon,
    dot: 'bg-emerald-500'
  },
  in_progress: { 
    label: 'In Progress', 
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: PlayCircleIcon,
    dot: 'bg-blue-500'
  },
  not_started: { 
    label: 'Not Started', 
    color: 'bg-slate-50 text-slate-600 border-slate-200',
    icon: CircleIcon,
    dot: 'bg-slate-400'
  },
  archived: { 
    label: 'Archived', 
    color: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: ArchiveIcon,
    dot: 'bg-slate-400'
  },
};

const priorityConfig = {
  urgent: { 
    label: 'Urgent', 
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500'
  },
  high: { 
    label: 'High', 
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500'
  },
  medium: { 
    label: 'Medium', 
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  low: { 
    label: 'Low', 
    color: 'bg-slate-50 text-slate-600 border-slate-200',
    dot: 'bg-slate-400'
  },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(taskBoardItems);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(taskBoardItems[0]?.id ?? '');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('You');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem['priority']>('medium');
  const [newTaskDueText, setNewTaskDueText] = useState('3 days left');
  const [formError, setFormError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = () => {
    setFormError('');
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssignee('You');
    setNewTaskPriority('medium');
    setNewTaskDueText('3 days left');
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const normalizedQuery = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !normalizedQuery ||
          task.title.toLowerCase().includes(normalizedQuery) ||
          task.assignee.toLowerCase().includes(normalizedQuery);
        const matchesStatus = !statusFilter || task.status === statusFilter;
        const matchesPriority = !priorityFilter || task.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
      }),
    [priorityFilter, searchQuery, statusFilter, tasks]
  );

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? filteredTasks[0] ?? tasks[0],
    [filteredTasks, selectedTaskId, tasks]
  );

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const archived = tasks.filter((t) => t.status === 'archived').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, inProgress, archived, completionRate };
  }, [tasks]);

  const handleCreateTask = () => {
    const title = newTaskTitle.trim();
    const description = newTaskDescription.trim();

    if (!title) {
      setFormError('Task title is required');
      return;
    }

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      description: description || 'No description provided.',
      status: 'not_started',
      priority: newTaskPriority,
      assignee: newTaskAssignee.trim() || 'You',
      dueText: newTaskDueText.trim() || 'No deadline',
      comments: 0,
      attachments: 0,
      spent: '00:00:00',
      createdAt: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date()),
    };

    setTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
    closeCreateModal();
  };

  const handleStatusChange = (taskId: string, status: TaskItem['status']) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
  };

  const handleLogout = () => {
    console.log('Logout');
  };

  const clearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setSearchQuery('');
  };

  const hasFilters = statusFilter || priorityFilter || searchQuery;

  return (
    <AppLayout
      userName="John Doe"
      onLogout={handleLogout}
      headerProps={{
        title: 'Tasks',
        subtitle: 'Manage and track your team\'s work',
        showSearch: false,
      }}
    >
      <div className="h-[calc(100vh-10rem)] grid grid-cols-12 gap-6">
        {/* Main Content - Task List */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Tasks</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-slate-900">{stats.total}</span>
                <span className="text-xs text-slate-500">tasks</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">In Progress</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-blue-600">{stats.inProgress}</span>
                <span className="text-xs text-slate-500">active</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completed</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-emerald-600">{stats.completed}</span>
                <span className="text-xs text-emerald-600 font-medium">{stats.completionRate}%</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Archived</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-slate-600">{stats.archived}</span>
                <span className="text-xs text-slate-500">stored</span>
              </div>
            </div>
          </div>

          {/* Filters & Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
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
                    options={[{ label: 'All Status', value: '' }, ...taskStatusOptions.filter(o => o.value)]}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border-slate-200 rounded-lg text-sm min-w-[140px]"
                  />
                  <Select
                    options={[{ label: 'All Priorities', value: '' }, ...taskPriorityOptions.filter(o => o.value)]}
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border-slate-200 rounded-lg text-sm min-w-[140px]"
                  />
                </div>
                
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-slate-500 hover:text-slate-900 underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                )}
                
                <Button 
                  onClick={openCreateModal} 
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2 gap-2 shadow-lg shadow-slate-900/10"
                >
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

          {/* Task List */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-900">All Tasks</h3>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {filteredTasks.length} tasks
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!filteredTasks.length ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <SearchIcon size={24} className="text-slate-300" />
                  </div>
                  <h4 className="text-slate-900 font-medium mb-1">No tasks found</h4>
                  <p className="text-slate-500 text-sm max-w-sm">
                    {hasFilters 
                      ? "Try adjusting your filters or search query to find what you're looking for."
                      : "Get started by creating your first task to track your work."}
                  </p>
                  {hasFilters && (
                    <Button 
                      variant="outline" 
                      onClick={clearFilters} 
                      className="mt-4 rounded-lg"
                    >
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
                      className={`w-full text-left group transition-all duration-200 rounded-xl border ${
                        isSelected 
                          ? 'bg-slate-50 border-slate-900 shadow-md' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      } p-4`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${priorityConfig[task.priority].dot}`} />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className={`font-semibold text-base truncate ${
                              isSelected ? 'text-slate-900' : 'text-slate-800'
                            }`}>
                              {task.title}
                            </h4>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[task.status].color} whitespace-nowrap`}>
                              <StatusIcon size={12} />
                              {statusConfig[task.status].label}
                            </span>
                          </div>
                          
                          <p className="mt-1 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                          
                          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600">
                                {task.assignee.charAt(0).toUpperCase()}
                              </div>
                              <span>{task.assignee}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <ClockIcon size={13} className="text-slate-400" />
                              <span>{task.dueText}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CalendarIcon size={13} className="text-slate-400" />
                              <span>{task.createdAt}</span>
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

        {/* Details Panel */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden sticky top-6">
            {!selectedTask ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2Icon size={32} className="text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg mb-2">No task selected</h3>
                <p className="text-slate-500 text-sm">Select a task from the list to view its details and manage its status.</p>
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
                  
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-3">
                    {selectedTask.title}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Created {selectedTask.createdAt}</span>
                    <span>•</span>
                    <span>Due {selectedTask.dueText}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  {/* Status Management */}
                  <div>
                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3 block">
                      Current Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {taskStatusOptions
                        .filter((option) => option.value)
                        .map((option) => {
                          const isActive = selectedTask.status === option.value;
                          const config = statusConfig[option.value as TaskItem['status']];
                          const Icon = config.icon;
                          
                          return (
                            <button
                              key={option.value}
                              onClick={() => handleStatusChange(selectedTask.id, option.value as TaskItem['status'])}
                              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                                isActive
                                  ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
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
                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3 block">
                      Description
                    </label>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {selectedTask.description}
                      </p>
                    </div>
                  </div>

                  {/* Assignee & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                          {selectedTask.assignee.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wider">Assignee</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{selectedTask.assignee}</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <ClockIcon size={16} />
                        <span className="text-xs font-medium uppercase tracking-wider">Time Spent</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 font-mono">{selectedTask.spent}</p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Task ID</span>
                      <span className="font-mono text-slate-700">{selectedTask.id}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl border-slate-300 hover:bg-white hover:border-slate-400"
                    onClick={() => handleStatusChange(selectedTask.id, 'archived')}
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
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        title="Create New Task"
        description="Add a new task to your workflow. Fill in the details below."
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title *</label>
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter a clear, actionable title..."
              className="rounded-xl border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Assignee</label>
              <Input
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                placeholder="Assign to..."
                className="rounded-xl border-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
              <Input
                value={newTaskDueText}
                onChange={(e) => setNewTaskDueText(e.target.value)}
                placeholder="e.g. 3 days left"
                className="rounded-xl border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setNewTaskPriority(p)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                    newTaskPriority === p
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <TextArea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Add details about this task..."
              className="min-h-[120px] rounded-xl border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
            />
          </div>

          {formError && (
            <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
              {formError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button 
              type="button" 
              variant="ghost" 
              className="rounded-xl px-6 hover:bg-slate-100" 
              onClick={closeCreateModal}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleCreateTask} 
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 shadow-lg shadow-slate-900/10"
            >
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}