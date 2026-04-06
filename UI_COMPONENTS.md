# TaskHub UI Component Library

A modern, elegant, and responsive UI component library for the TaskHub Task Management System built with React, TypeScript, and Tailwind CSS.

## Table of Contents

- [Getting Started](#getting-started)
- [Components](#components)
- [Color System](#color-system)
- [Design Principles](#design-principles)
- [Usage Examples](#usage-examples)

## Getting Started

### Installation

All dependencies are already included in `package.json`:
- React 19+
- React Router 7+
- TypeScript 5+
- Tailwind CSS 4+

### Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Components

### Base Components

#### Button

A versatile button component with multiple variants and sizes.

**Props:**
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'error'` (default: 'primary')
- `size?: 'sm' | 'md' | 'lg'` (default: 'md')
- `isLoading?: boolean` (default: false)
- `disabled?: boolean`
- `className?: string`
- All standard HTML button attributes

**Examples:**

```tsx
import { Button } from '@/components/common';

// Primary button
<Button variant="primary" onClick={() => {}}>
  Click me
</Button>

// Secondary button
<Button variant="secondary" size="sm">
  Small button
</Button>

// Loading state
<Button isLoading={true}>Saving...</Button>

// Disabled state
<Button disabled>Disabled</Button>
```

---

#### Input

A controlled input component with label, error message, and helper text support.

**Props:**
- `label?: string` - Label text above the input
- `error?: string` - Error message below the input
- `helperText?: string` - Helper text below the input
- `type?: string` (default: 'text')
- `placeholder?: string`
- `disabled?: boolean`
- All standard HTML input attributes

**Examples:**

```tsx
import { Input } from '@/components/common';

// Basic input
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Input with error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// Input with helper text
<Input
  label="Username"
  helperText="3-20 characters, alphanumeric only"
/>
```

---

#### Card

A flexible card component for containing content sections.

**Components:**
- `Card` - Main container
- `CardHeader` - Header section with border
- `CardBody` - Main content area
- `CardFooter` - Footer with border

**Props:**
- `children: React.ReactNode`
- `className?: string`
- `clickable?: boolean` - Makes the card interactive
- `hoverable?: boolean` (default: true)

**Examples:**

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common';

<Card>
  <CardHeader>
    <h2>Card Title</h2>
  </CardHeader>
  <CardBody>
    <p>Card content goes here</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

#### Badge

A small, colored label component for status and priority indicators.

**Props:**
- `variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral'` (default: 'neutral')
- `size?: 'sm' | 'md'` (default: 'md')
- `children: React.ReactNode`
- `className?: string`

**Examples:**

```tsx
import { Badge } from '@/components/common';

<Badge variant="primary">In Progress</Badge>
<Badge variant="success" size="sm">Completed</Badge>
<Badge variant="error">Urgent</Badge>
```

---

#### TextArea

A textarea component with the same API as Input.

**Examples:**

```tsx
import { TextArea } from '@/components/common';

<TextArea
  label="Description"
  placeholder="Enter task description"
  rows={5}
/>
```

---

#### Select

A dropdown select component with standard HTML options.

**Props:**
- `label?: string`
- `error?: string`
- `placeholder?: string`
- `options: { value: string | number; label: string }[]`
- All standard HTML select attributes

**Examples:**

```tsx
import { Select } from '@/components/common';

<Select
  label="Priority"
  options={[
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ]}
  value={priority}
  onChange={(e) => setPriority(e.target.value)}
/>
```

---

#### Checkbox

A checkbox component with label support.

**Props:**
- `label?: string`
- `error?: string`
- `checked?: boolean`
- All standard HTML input[type="checkbox"] attributes

**Examples:**

```tsx
import { Checkbox } from '@/components/common';

<Checkbox
  label="I agree to the terms"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
```

---

### Layout Components

#### AppLayout

Main layout component that wraps pages with sidebar and header.

**Props:**
- `children: React.ReactNode`
- `userName?: string` - Name to display in sidebar
- `onLogout: () => void` - Logout handler
- `headerProps?: HeaderProps` - Props for the header component

**Example:**

```tsx
import { AppLayout } from '@/components/layout';

export default function MyPage() {
  return (
    <AppLayout
      userName="John Doe"
      onLogout={() => navigate('/auth/login')}
      headerProps={{
        title: 'My Tasks',
        subtitle: 'Manage your tasks',
        showSearch: true,
      }}
    >
      {/* Page content */}
    </AppLayout>
  );
}
```

---

#### Header

Top navigation bar with search, notifications, and user menu.

**Props:**
- `title?: string` (default: 'Dashboard')
- `subtitle?: string`
- `showSearch?: boolean` (default: true)
- `onSearch?: (query: string) => void`

---

#### Sidebar

Left navigation sidebar with menu items and user info.

**Props:**
- `userName?: string`
- `onLogout: () => void`

---

### Icon Components

All icons are available in `@/components/icons`:

- `SearchIcon`
- `BellIcon`
- `UserIcon`
- `LogoutIcon`
- `SettingsIcon`
- `MenuIcon`
- `XIcon`
- `CheckIcon`
- `ChevronDownIcon`
- `ChevronRightIcon`
- `CalendarIcon`
- `ClockIcon`
- `PlusIcon`
- `EditIcon`
- `TrashIcon`
- `FilterIcon`
- `HomeIcon`
- `ListIcon`
- `EyeIcon`
- `EyeOffIcon`

**Icon Props:**
- `size?: number` (default: 20)
- `className?: string`
- `strokeWidth?: number`

**Example:**

```tsx
import { PlusIcon, SearchIcon } from '@/components/icons';

<button className="flex items-center gap-2">
  <PlusIcon size={20} />
  New Task
</button>
```

## Color System

### Semantic Colors

The app uses a carefully chosen color palette:

- **Primary (Blue)**: `#3B82F6` - Main actions and highlights
- **Secondary (Indigo)**: `#6366F1` - Alternative highlights
- **Success (Green)**: `#22C55E` - Positive actions
- **Warning (Amber)**: `#F59E0B` - Caution states
- **Error (Red)**: `#EF4444` - Destructive actions
- **Neutral (Gray)**: Various shades for text and backgrounds

### Tailwind Color Utilities

All colors map directly to Tailwind classes:

```tsx
// Background
className="bg-blue-600"
className="bg-green-100"

// Text
className="text-red-700"
className="text-gray-500"

// Borders
className="border-blue-200"

// Hover states
className="hover:bg-primary-700"
```

### Color Constants

Import predefined color mappings:

```tsx
import { STATUS_COLORS, PRIORITY_COLORS } from '@/lib/colors';

// Status colors
const statusColor = STATUS_COLORS['in_progress']; // Returns color object

// Priority colors
const priorityColor = PRIORITY_COLORS['urgent']; // Returns color object
```

## Design Principles

### 1. **Light Mode First**

The app uses light mode as the default theme with a clean, minimal aesthetic.

### 2. **Responsive Design**

All components are fully responsive:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts

### 3. **Accessibility**

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

### 4. **Consistency**

- Unified spacing using a 4px scale (4, 8, 12, 16, 20, 24, 32, 40...)
- Consistent typography sizes and weights
- Standard border-radius values (4px, 6px, 8px, 12px, 16px...)

### 5. **Micro-interactions**

- Smooth transitions (200-300ms)
- Hover states on interactive elements
- Loading states for async actions
- Visual feedback for user actions

## Usage Examples

### Example 1: Login Form

```tsx
import { useState } from 'react';
import { Button, Input } from '@/components/common';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and submit
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-8">Welcome Back</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Button variant="primary" size="lg" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
```

### Example 2: Dashboard Card

```tsx
import { Card, CardBody, Badge } from '@/components/common';
import { PRIORITY_COLORS } from '@/lib/colors';

export default function TaskCard({ task }) {
  const priorityColor = PRIORITY_COLORS[task.priority];

  return (
    <Card>
      <CardBody>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{task.description}</p>
          </div>
          <Badge variant={priorityColor.badge}>
            {task.priority}
          </Badge>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <span className="text-xs text-gray-500">{task.dueDate}</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs font-medium text-gray-700">
            {task.assignee}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
```

### Example 3: Task List with Filters

```tsx
import { useState } from 'react';
import { Button, Select, Input } from '@/components/common';
import { PlusIcon } from '@/components/icons';

export default function TaskList({ tasks }) {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-3">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'in_progress', label: 'In Progress' },
          ]}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button variant="primary" className="flex items-center gap-2">
          <PlusIcon size={18} />
          New Task
        </Button>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

1. **Import from component barrels** - Use `/components/common` and `/components/icons`
2. **Use semantic classs** - Prefer `.btn-primary` over `.bg-blue-600 text-white`
3. **Leverage color constants** - Use `COLORS`, `STATUS_COLORS`, `PRIORITY_COLORS`
4. **Keep spacing consistent** - Use values from the spacing scale
5. **Use descriptive names** - Component names should describe their purpose
6. **Compose components** - Build complex UIs by combining simple components
7. **Test accessibility** - Ensure keyboard navigation and screen reader support

## Theme Customization

To customize colors or theme:

1. **Edit `tailwind.config.ts`** - Modify the `theme.extend.colors` object
2. **Update `app/app.css`** - Modify component-level utilities
3. **Update color constants** - Edit `lib/colors.ts` for semantic colors

---

For more information, refer to the individual component files in `app/components/`.
