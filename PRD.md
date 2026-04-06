# Product Requirements Document (PRD)
## Distributed Task Management System - Multi-Cloud Architecture

**Version:** 1.0  
**Date:** April 2026  
**Project Duration:** 15 days  
**Team Size:** 2-3 students  
**Status:** Planning Phase

---

## 1. Executive Summary

The **Distributed Task Management System** is a proof-of-concept multi-cloud application demonstrating how to build scalable, resilient systems across multiple cloud environments. The system allows users to create, manage, and track tasks while leveraging cloud-specific services for task management and notifications.

**Core Value Proposition:**
- Scalable task management system split across two cloud environments
- Real-time notifications triggered by task events
- Demonstrates production-grade multi-cloud architecture patterns
- Showcases microservices communication and distributed systems design

---

## 2. Project Objectives

### Primary Objectives
1. **Demonstrate Multi-Cloud Architecture** - Deploy identical business logic on two separate cloud environments
2. **Implement Service-to-Service Communication** - Establish reliable REST API communication between geographically distributed services
3. **Ensure System Resilience** - Handle failures gracefully when one cloud becomes unavailable
4. **Manage Distributed Data** - Split data appropriately across PostgreSQL (Cloud A) and MongoDB (Cloud B)
5. **Build Professional-Grade Code** - Follow industry best practices for code quality and structure

### Learning Outcomes
By completing this project, you will understand:
- Multi-cloud deployment strategies
- Microservices architecture patterns
- Distributed system communication patterns
- Database selection for different use cases (relational vs. document)
- Cross-cloud resilience and failover mechanisms
- DevOps and infrastructure as code concepts

---

## 3. System Architecture Overview

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│                    (Web/Mobile Applications)                         │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                    Load Balancer / Router
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
┌──────────────────────┐            ┌──────────────────────┐
│    CLOUD A (AWS)     │            │  CLOUD B (Azure)     │
│                      │            │                      │
│  ┌────────────────┐  │            │  ┌────────────────┐  │
│  │ Task Service   │  │            │  │ Notification   │  │
│  │ (Port 3000)    │  │────REST API───│ Service        │  │
│  │                │  │            │  │ (Port 3001)    │  │
│  │ • POST /tasks  │  │◄────────────┤  │                │  │
│  │ • GET /tasks   │  │            │  │ • Email alerts │  │
│  │ • PUT /tasks   │  │            │  │ • Task reports │  │
│  │ • DELETE /task │  │            │  │ • Archives     │  │
│  └────────┬────────┘  │            │  └────────┬────────┘  │
│           │           │            │           │           │
│           ▼           │            │           ▼           │
│  ┌──────────────────┐ │            │  ┌──────────────────┐ │
│  │  PostgreSQL DB   │ │            │  │   MongoDB DB     │ │
│  │                  │ │            │  │                  │ │
│  │ • Users          │ │            │  │ • Notifications  │ │
│  │ • Tasks          │ │            │  │ • Email Logs     │ │
│  │ • Assignments    │ │            │  │ • Task Archives  │ │
│  │ • Task Status    │ │            │  │ • Reports Data   │ │
│  └──────────────────┘ │            │  └──────────────────┘ │
│                      │            │                      │
└──────────────────────┘            └──────────────────────┘
```

### 3.2 Service Responsibilities

#### **Cloud A: Task Service (AWS)**
**Primary Responsibility:** CRUD operations, task assignments, real-time task management

**Hosted On:** AWS EC2 (or Elastic Beanstalk)
**Database:** PostgreSQL RDS (AWS)

**Key Responsibilities:**
- User account management and authentication
- Create, Read, Update, Delete (CRUD) tasks
- Task assignment to users
- Task status tracking (Not Started → In Progress → Completed → Archived)
- Deadline tracking and management
- Task priority levels
- Task categorization/tags
- Real-time synchronization with Cloud B for notifications

**API Endpoints:**
```
Authentication:
  POST /api/auth/register         - Register new user
  POST /api/auth/login            - User login
  POST /api/auth/logout           - User logout
  GET  /api/auth/verify           - Verify JWT token

Task Management:
  POST /api/tasks                 - Create new task
  GET  /api/tasks                 - List all tasks (with filters)
  GET  /api/tasks/:taskId         - Get single task details
  PUT  /api/tasks/:taskId         - Update task
  DELETE /api/tasks/:taskId       - Delete/Archive task
  PUT  /api/tasks/:taskId/status  - Update task status
  PUT  /api/tasks/:taskId/assign  - Assign task to user

Task Queries:
  GET /api/tasks/user/:userId     - Get tasks for specific user
  GET /api/tasks/overdue          - Get overdue tasks
  GET /api/tasks/status/:status   - Get tasks by status
```

---

#### **Cloud B: Notification Service (Azure/Local)**
**Primary Responsibility:** Notifications, reminders, reporting, data archival

**Hosted On:** Azure App Service (or Local Server)
**Database:** MongoDB (Azure/Local)

**Key Responsibilities:**
- Email notification system
- Task reminder scheduling
- Report generation (daily, weekly summaries)
- Task archival management
- Notification history tracking
- User notification preferences
- Analytics and insights
- Audit logging

**API Endpoints:**
```
Notifications:
  POST /api/notifications         - Manually trigger notification
  GET  /api/notifications/:userId - Get notification history
  PUT  /api/notifications/:id/read- Mark notification as read
  DELETE /api/notifications/:id   - Delete notification

Reminders:
  GET /api/reminders/schedule     - Get scheduled reminders
  POST /api/reminders/set         - Set up task reminder
  PUT  /api/reminders/:id         - Update reminder
  DELETE /api/reminders/:id       - Cancel reminder

Reports:
  GET /api/reports/daily/:userId  - Daily task summary
  GET /api/reports/weekly/:userId - Weekly summary
  GET /api/reports/productivity   - Productivity analytics

Preferences:
  GET  /api/preferences/:userId   - Get notification preferences
  PUT  /api/preferences/:userId   - Update preferences

Internal (called by Cloud A):
  POST /api/events/task-created   - Receive task-created event
  POST /api/events/task-due-soon  - Receive due-soon event
  POST /api/events/task-completed - Receive completion event
```

---

### 3.3 Communication Flow

#### **Scenario 1: User Creates New Task**
```
1. User → Cloud A: POST /api/tasks { title, description, deadline, assignee }
2. Cloud A: Save task to PostgreSQL
3. Cloud A → Cloud B: POST /api/events/task-created { taskId, userId, deadline }
4. Cloud B: Store notification event in MongoDB
5. Cloud B: Schedule reminder email
6. Cloud B → Cloud A: Return { status: 'success', notificationId: '...' }
7. Cloud A → User: Return created task + notificationId
```

#### **Scenario 2: Task Deadline Approaching**
```
1. Cloud B: Scheduled job runs daily (cron job)
2. Cloud B: Query MongoDB for tasks due in next 24 hours
3. Cloud B → Cloud A: GET /api/tasks/due-tomorrow
4. Cloud A: Return list of tasks with assignees
5. Cloud B: Send reminder emails to assignees
6. Cloud B: Log notification sent in MongoDB
```

#### **Scenario 3: Task Completed**
```
1. User → Cloud A: PUT /api/tasks/:id/status { status: 'completed' }
2. Cloud A: Update task status in PostgreSQL
3. Cloud A → Cloud B: POST /api/events/task-completed { taskId, userId }
4. Cloud B: Send completion confirmation email
5. Cloud B: Update productivity analytics
6. Cloud B: Archive task metadata (optional)
```

#### **Scenario 4: Cloud A is Down**
```
1. User tries to access Cloud A
2. Requests timeout after 5 seconds
3. Load balancer redirects to failover endpoint (or cache)
4. System returns cached data or graceful degradation message
5. Cloud B continues to send notifications based on last known state
6. All events are queued and processed once Cloud A recovers
```

---

## 4. Technology Stack

### 4.1 Backend & Runtime
| Component | Technology | Version | Justification |
|-----------|-----------|---------|---------------|
| Runtime | Node.js | 18+ LTS | Fast development, event-driven I/O, excellent async support |
| Framework | Express.js | 4.18+ | Lightweight, industry-standard, excellent middleware ecosystem |
| Language | JavaScript (ES6+) | ES2020+ | Reduces context switching, modern features, great tooling |

### 4.2 Databases

#### **Cloud A: PostgreSQL**
| Aspect | Details |
|--------|---------|
| **Version** | PostgreSQL 14+ |
| **Hosting** | AWS RDS (managed service) or EC2 self-hosted |
| **Why PostgreSQL?** | ACID compliance, strong consistency needed for task data, relational data fits structured tasks |
| **Connection Pool** | pg (npm package) with pooling, 10-20 connections |

**Schema Overview:**
```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id),
  assigned_to INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, completed, archived
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
  deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Task Tags Table
CREATE TABLE task_tags (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  tag_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Cloud B: MongoDB**
| Aspect | Details |
|--------|---------|
| **Version** | MongoDB 5.0+ |
| **Hosting** | Azure Cosmos DB (MongoDB API) or MongoDB Atlas |
| **Why MongoDB?** | Flexible schema for varied notification types, excellent for logging, scalable document storage |
| **Connection Pool** | mongoose with connection pooling, 10-20 connections |

**Collections Overview:**
```javascript
// Notifications Collection
db.notifications = {
  _id: ObjectId,
  userId: ObjectId,
  taskId: Integer,
  type: String, // 'reminder', 'completion', 'assignment', 'due_soon'
  title: String,
  message: String,
  emailSent: Boolean,
  sentAt: Date,
  readAt: Date,
  createdAt: Date
}

// Email Logs Collection
db.email_logs = {
  _id: ObjectId,
  userId: ObjectId,
  taskId: Integer,
  recipientEmail: String,
  subject: String,
  content: String,
  status: String, // 'sent', 'failed', 'bounced'
  sentAt: Date,
  errorMessage: String
}

// Task Archives Collection
db.task_archives = {
  _id: ObjectId,
  taskId: Integer,
  taskData: Object, // Complete snapshot of task from Cloud A
  completedAt: Date,
  archivedAt: Date,
  completionTime: Number, // milliseconds
  productivity_score: Number
}

// Notification Preferences Collection
db.notification_preferences = {
  _id: ObjectId,
  userId: Integer,
  emailOnTaskAssigned: Boolean,
  emailOnTaskCompleted: Boolean,
  reminderHoursBefore: Number, // 24, 12, 6, 1
  dailySummary: Boolean,
  weeklySummary: Boolean,
  notificationFrequency: String, // 'immediate', 'daily_digest', 'off'
  updatedAt: Date
}

// Reports Collection
db.reports = {
  _id: ObjectId,
  userId: Integer,
  reportType: String, // 'daily', 'weekly', 'monthly'
  totalTasks: Number,
  completedTasks: Number,
  completionRate: Number,
  averageCompletionTime: Number,
  generatedAt: Date,
  period: {
    startDate: Date,
    endDate: Date
  }
}
```

### 4.3 Authentication & Security
| Component | Technology | Purpose |
|-----------|-----------|---------|
| JWT (JSON Web Tokens) | jsonwebtoken (npm) | Stateless authentication across services |
| Password Hashing | bcryptjs (npm) | Secure password storage |
| Environment Variables | dotenv (npm) | Secure credential management |
| HTTPS | Built-in Node.js / ngrok for local | Secure communication between clouds |

### 4.4 Email & Notifications
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Email Sending | Nodemailer (npm) | Send reminder and notification emails |
| Email Service | Gmail SMTP / SendGrid API | Actual email delivery provider |
| Scheduling | node-cron (npm) | Schedule daily/weekly reminder jobs |
| Queue (Optional) | Bull/Redis (npm) | Queue email jobs for retry logic |

### 4.5 Testing & Quality
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Unit Testing | Jest (npm) | Test individual functions and services |
| Integration Testing | Supertest (npm) | Test API endpoints |
| API Documentation | Postman / Swagger | Document and test APIs |
| Code Linting | ESLint (npm) | Maintain code quality |
| Version Control | Git / GitHub | Source code management |

### 4.6 Deployment & DevOps
| Component | Cloud A (AWS) | Cloud B (Azure/Local) |
|-----------|--------------|----------------------|
| Compute | EC2 t3.micro | App Service / Local VM |
| Database | RDS PostgreSQL | Azure Database / Local MongoDB |
| Storage (optional) | S3 | Azure Blob Storage |
| Monitoring | CloudWatch | Application Insights |
| CI/CD | GitHub Actions | GitHub Actions |
| DNS & Load Balancing | Route53 / ALB | Azure Traffic Manager / Local |

### 4.7 Development Tools
| Tool | Purpose |
|------|---------|
| Visual Studio Code | Code editor |
| Postman | API testing and documentation |
| DBeaver / pgAdmin | Database management and visualization |
| Git / GitHub | Version control and collaboration |
| Docker | Containerization for consistency |
| Docker Compose | Local multi-service orchestration |
| Thunder Client / Insomnia | REST client for API testing |

---

## 5. Detailed Requirements

### 5.1 Functional Requirements

#### **FR1: User Management (Cloud A)**
- **FR1.1** Users can register with email and password
- **FR1.2** Users can log in with email/password and receive JWT token
- **FR1.3** Users can update their profile (name, email, password)
- **FR1.4** Users can view other users (for task assignment)
- **FR1.5** Passwords are hashed using bcrypt with salt rounds ≥ 10

#### **FR2: Task Management (Cloud A)**
- **FR2.1** Users can create tasks with title, description, deadline, priority, tags
- **FR2.2** Users can view all their tasks with filtering (status, priority, assignee, date range)
- **FR2.3** Users can update any aspect of a task (title, description, status, deadline, assignment)
- **FR2.4** Users can delete/archive tasks
- **FR2.5** Users can assign tasks to other users
- **FR2.6** Task status follows strict workflow: Not Started → In Progress → Completed → Archived
- **FR2.7** Tasks automatically transition to "overdue" if deadline passed and not completed
- **FR2.8** Completion timestamp is recorded when task marked complete

#### **FR3: Notifications (Cloud B)**
- **FR3.1** User receives email notification when task is assigned to them
- **FR3.2** User receives reminder email 24 hours before task deadline
- **FR3.3** User receives completion confirmation when task is marked complete
- **FR3.4** All notifications are logged in MongoDB with timestamp and delivery status
- **FR3.5** Failed notifications are retried (max 3 attempts)
- **FR3.6** Users can mark notifications as read/unread

#### **FR4: Reports & Analytics (Cloud B)**
- **FR4.1** Users can view daily task summary (total tasks, completed today, pending)
- **FR4.2** Users can view weekly task summary with completion rate
- **FR4.3** System can generate productivity analytics (completion trends, average task completion time)
- **FR4.4** Reports are generated automatically and cached for 1 hour

#### **FR5: Preferences (Cloud B)**
- **FR5.1** Users can set notification preferences (on/off, frequency, reminder timing)
- **FR5.2** Users can choose between immediate or daily digest notifications
- **FR5.3** Preferences are stored in MongoDB and consulted before sending notifications

#### **FR6: Inter-Service Communication**
- **FR6.1** Cloud A → Cloud B: Task created event (async)
- **FR6.2** Cloud A → Cloud B: Task completed event (async)
- **FR6.3** Cloud A → Cloud B: Task deadline approaching event (scheduled)
- **FR6.4** Cloud B → Cloud A: Query tasks for reporting (sync)
- **FR6.5** All cross-service calls have timeout (5 seconds) and retry logic

#### **FR7: Error Handling & Resilience**
- **FR7.1** System handles Cloud A unavailability gracefully (queue events, retry later)
- **FR7.2** System handles Cloud B unavailability gracefully (allow task creation, fail notifications)
- **FR7.3** Failed notifications are logged and retried
- **FR7.4** Network failures trigger proper error responses (500, 503, etc.)

---

### 5.2 Non-Functional Requirements

#### **NFR1: Performance**
- **NFR1.1** API response time ≤ 500ms (95th percentile)
- **NFR1.2** Homepage/task list loads in ≤ 2 seconds
- **NFR1.3** Database queries use proper indexing
- **NFR1.4** Email notifications sent within 1 minute of event

#### **NFR2: Reliability**
- **NFR2.1** System availability ≥ 99% uptime
- **NFR2.2** Data loss probability = 0% (ACID compliance, backups)
- **NFR2.3** Network failures between clouds don't cause data loss

#### **NFR2.3** Security**
- **NFR2.3.1** All passwords hashed with bcrypt (salt rounds ≥ 10)
- **NFR2.3.2** API endpoints protected with JWT authentication
- **NFR2.3.3** Environment variables for credentials (never hardcoded)
- **NFR2.3.4** HTTPS/TLS for all communication between clouds
- **NFR2.3.5** SQL injection prevention (parameterized queries)
- **NFR2.3.6** Cross-origin resource sharing (CORS) properly configured

#### **NFR3: Scalability**
- **NFR3.1** Support for 1,000+ concurrent users
- **NFR3.2** Handle 10,000+ tasks in system
- **NFR3.3** Database connection pooling for efficient resource usage
- **NFR3.4** Notification queue can handle 10,000 emails/day

#### **NFR4: Maintainability**
- **NFR4.1** Code follows consistent style (ESLint rules)
- **NFR4.2** Functions are documented with JSDoc comments
- **NFR4.3** Each service has clear README and documentation
- **NFR4.4** API endpoints documented in Postman/Swagger

#### **NFR5: Compatibility**
- **NFR5.1** Works on Windows, macOS, Linux
- **NFR5.2** Docker containers for consistent environment
- **NFR5.3** Node.js 18+ LTS compatibility

---

## 6. Data Flow & Integration Points

### 6.1 Task Creation Flow (Detailed)

```
USER INPUT (Frontend/Postman)
│
├─ POST /api/tasks
│  {
│    "title": "Design new UI mockups",
│    "description": "Create mockups for dashboard",
│    "deadline": "2026-04-15T17:00:00Z",
│    "priority": "high",
│    "assignedTo": 5,
│    "tags": ["design", "ui"]
│  }
│
▼
CLOUD A - Task Service (AWS)
├─ 1. Validate JWT token
├─ 2. Validate input (title required, valid date, etc.)
├─ 3. Check if assigned user exists in database
├─ 4. Insert into PostgreSQL:
│     INSERT INTO tasks VALUES (...)
│     INSERT INTO task_tags VALUES (...)
├─ 5. Return task object with ID
│
▼
CLOUD A - Event Dispatcher
├─ Prepare notification event:
│  {
│    "eventType": "task_created",
│    "taskId": 42,
│    "creatorId": 1,
│    "assignedToId": 5,
│    "deadline": "2026-04-15T17:00:00Z",
│    "title": "Design new UI mockups"
│  }
│
▼
CLOUD B - Notification Service (Azure)
├─ 1. Receive event via REST API
├─ 2. Check notification preferences for user 5
├─ 3. If email notifications enabled:
│     ├─ Generate email content
│     ├─ Send via Nodemailer/SendGrid
│     ├─ Log to MongoDB:
│        {
│          "userId": 5,
│          "taskId": 42,
│          "type": "task_assigned",
│          "status": "sent",
│          "sentAt": "2026-04-14T10:30:00Z"
│        }
│     └─ Schedule deadline reminder (24h before)
│
▼
RESPONSE to User
{
  "success": true,
  "task": {
    "id": 42,
    "title": "Design new UI mockups",
    "status": "not_started",
    "createdAt": "2026-04-14T10:30:00Z"
  },
  "notification": {
    "id": "notif_123",
    "status": "sent",
    "message": "Task assigned to user"
  }
}
```

### 6.2 Email Reminder Workflow

```
SCHEDULED JOB (Cloud B, runs daily at 9 AM)
│
├─ Query MongoDB for tasks due in 24 hours
├─ For each upcoming deadline:
│  ├─ Call Cloud A: GET /api/tasks/:taskId
│  ├─ Get task details & assignee info
│  ├─ Check notification preferences
│  └─ If enabled:
│      ├─ Compose reminder email
│      ├─ Send via Nodemailer
│      ├─ Log to MongoDB with status 'sent'
│      └─ Schedule retry if failed
│
└─ Report: "Sent 15 reminders, 3 failed"
```

### 6.3 Failure Recovery Pattern

```
SCENARIO: Cloud A (AWS) is down for 30 minutes

TIME 1: User creates task (Cloud A unavailable)
├─ Request times out after 5 seconds
├─ Return error: { error: "Service temporarily unavailable" }
└─ Frontend shows retry button

TIME 2: Cloud B continues operating
├─ Scheduled notification jobs run normally
├─ If old data cached, use cached task info
├─ Log failed notification attempts in MongoDB

TIME 3: Cloud A recovers
├─ Pending events queued in Cloud B are processed
├─ Any missed notifications are sent
├─ Data is resynchronized

RESULT: No data loss, eventual consistency achieved
```

---

## 7. Project Deliverables

### 7.1 Code Deliverables

**Repository Structure:**
```
distributed-task-management/
├── services/
│   ├── task-service/              # Cloud A
│   │   ├── src/
│   │   │   ├── server.js
│   │   │   ├── routes/
│   │   │   │   ├── auth.js
│   │   │   │   ├── tasks.js
│   │   │   │   └── users.js
│   │   │   ├── controllers/
│   │   │   │   ├── authController.js
│   │   │   │   ├── taskController.js
│   │   │   │   └── userController.js
│   │   │   ├── models/
│   │   │   │   └── database.js
│   │   │   ├── middleware/
│   │   │   │   ├── auth.js
│   │   │   │   └── errorHandler.js
│   │   │   ├── config/
│   │   │   │   └── config.js
│   │   │   └── utils/
│   │   │       ├── logger.js
│   │   │       └── validators.js
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── README.md
│   │
│   └── notification-service/      # Cloud B
│       ├── src/
│       │   ├── server.js
│       │   ├── routes/
│       │   │   ├── notifications.js
│       │   │   ├── reports.js
│       │   │   ├── preferences.js
│       │   │   └── events.js
│       │   ├── controllers/
│       │   │   ├── notificationController.js
│       │   │   ├── reportController.js
│       │   │   └── preferencesController.js
│       │   ├── services/
│       │   │   ├── emailService.js
│       │   │   ├── schedulerService.js
│       │   │   └── taskServiceClient.js
│       │   ├── models/
│       │   │   └── database.js
│       │   ├── config/
│       │   │   └── config.js
│       │   └── jobs/
│       │       ├── dailyReminder.js
│       │       └── reportGenerator.js
│       ├── package.json
│       ├── Dockerfile
│       ├── .env.example
│       └── README.md
│
├── docs/
│   ├── ARCHITECTURE.md           # Architecture document
│   ├── API_DOCUMENTATION.md      # API endpoints
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── DATABASE_SCHEMA.md        # Database designs
│   └── SETUP_GUIDE.md            # How to run locally
│
├── deployment/
│   ├── docker-compose.yml        # Local development setup
│   ├── aws/
│   │   ├── terraform/            # IaC for AWS resources
│   │   └── deployment-guide.md
│   └── azure/
│       ├── deployment-guide.md
│       └── terraform/            # IaC for Azure resources
│
├── .gitignore
├── README.md                      # Project overview
└── PRESENTATION.md               # For the 5-10 min presentation
```

**Code Quality Standards:**
- ESLint configuration for consistent code style
- JSDoc comments for all functions
- Error handling in every endpoint
- Input validation on all API requests
- Proper HTTP status codes (200, 201, 400, 401, 404, 500, etc.)

---

### 7.2 Documentation Deliverables

#### **1. Architecture Document (3-5 pages)**
Must contain:
- System overview with diagram
- Service responsibilities breakdown
- Data flow diagrams for key scenarios
- Multi-cloud deployment strategy
- Resilience and failover mechanisms
- Technology choices and justifications
- Database design rationale

#### **2. API Documentation**
Format: Postman collection + Markdown

**Postman Collection should include:**
- All endpoints documented
- Example requests/responses
- Environment variables for AWS/Azure URLs
- Pre-request scripts for authentication
- Tests to validate responses

**Markdown documentation should include:**
- Overview of each service
- Authentication method (JWT)
- All endpoints with examples
- Error codes and meanings
- Rate limiting (if applicable)

#### **3. Deployment Guide**
Must explain:
- Prerequisites (AWS account, Azure account, Node.js installation)
- Step-by-step deployment to AWS
- Step-by-step deployment to Azure/Local
- Environment variable setup
- Database initialization
- Service startup order
- Troubleshooting common issues

#### **4. Setup & Development Guide**
Must explain:
- How to clone and install locally
- Docker Compose setup for local development
- How to run both services on localhost
- How to run tests
- How to seed test data
- Common development commands

#### **5. README Files**
- **Root README:** Project overview, quick start, tech stack
- **Task Service README:** Service-specific setup, API details
- **Notification Service README:** Service-specific setup, API details

---

### 7.3 Presentation Deliverables

**Presentation Format:** 5-10 minutes

**Must Cover:**
1. **Problem Statement** (1 min)
   - Why multi-cloud architecture matters
   - Real-world use cases

2. **Solution Overview** (1 min)
   - High-level system design
   - Services and their roles

3. **Architecture Deep Dive** (2 min)
   - Service responsibilities
   - Communication patterns
   - Database design
   - Show architecture diagram

4. **Live Demo** (3-4 min)
   - Create a task in Cloud A
   - Show it triggered notification in Cloud B
   - Show reporting from Cloud B
   - Demonstrate failover (if possible)

5. **Technical Highlights** (1 min)
   - Key decisions and trade-offs
   - Challenges overcome
   - Technologies used

6. **Conclusion** (0.5 min)
   - Learning outcomes
   - Future improvements

**Presentation Tips:**
- Use visual diagrams (not just text)
- Live demo > screenshots
- Prepare fallback demo video if live demo might fail
- Practice timing
- Have backup slides for Q&A

---

## 8. Development Timeline (15 Days)

### **Days 1-2: Planning & Setup (Architecture)**
- [ ] Create GitHub repository
- [ ] Design database schemas (PostgreSQL + MongoDB)
- [ ] Design API endpoints for both services
- [ ] Set up local development environment (Docker Compose)
- [ ] Create project documentation structure
- [ ] Install dependencies (Node.js packages)
- **Deliverable:** Architecture document draft, API specification

### **Days 3-5: Task Service Development (Cloud A)**
- [ ] Set up Express.js server structure
- [ ] Implement user authentication (JWT)
- [ ] Implement user CRUD operations
- [ ] Implement task CRUD operations
- [ ] Implement task filtering and status workflow
- [ ] Add input validation and error handling
- [ ] Write unit tests for core functions
- **Deliverable:** Task Service working locally with full API

### **Days 6-7: Notification Service Development (Cloud B)**
- [ ] Set up Express.js server structure
- [ ] Implement MongoDB schema and models
- [ ] Implement notification endpoints
- [ ] Implement notification preferences
- [ ] Implement email sending functionality
- [ ] Add input validation and error handling
- **Deliverable:** Notification Service working locally

### **Days 8-9: Inter-Service Integration**
- [ ] Implement Cloud A → Cloud B event dispatcher
- [ ] Implement Cloud B event receiver endpoints
- [ ] Add error handling and retry logic
- [ ] Implement notification triggers on task events
- [ ] Test end-to-end workflows
- [ ] Add request logging and debugging
- **Deliverable:** Services can communicate successfully

### **Days 10-11: Deployment**
- [ ] Deploy Task Service to AWS (EC2/RDS)
- [ ] Deploy Notification Service to Azure (or local)
- [ ] Set up environment variables in both clouds
- [ ] Test inter-cloud communication with real URLs
- [ ] Set up GitHub Actions for CI/CD (optional)
- [ ] Document deployment steps
- **Deliverable:** Services running on actual clouds with public URLs

### **Days 12-13: Testing & Polish**
- [ ] Create comprehensive Postman collection
- [ ] Write integration tests
- [ ] Test failure scenarios (one cloud down)
- [ ] Performance testing (response times)
- [ ] Security review (no hardcoded secrets, etc.)
- [ ] Code cleanup and refactoring
- **Deliverable:** All tests passing, Postman collection complete

### **Days 14-15: Documentation & Presentation**
- [ ] Finalize architecture document
- [ ] Complete API documentation
- [ ] Write deployment guides
- [ ] Create presentation slides
- [ ] Record demo video (backup)
- [ ] Practice presentation
- **Deliverable:** All documentation complete, presentation ready

---

## 9. Success Criteria & Evaluation Rubric

### **Evaluation Rubric (100 points total)**

| Criterion | Weight | Points | Evaluation |
|-----------|--------|--------|-----------|
| **Architecture (30%)** | 30% | 30 pts | Multi-cloud design clarity, service separation, communication patterns |
| **Communication (25%)** | 25% | 25 pts | Services actually communicate, error handling, inter-cloud sync |
| **Deployment (20%)** | 20% | 20 pts | Services deployed to real clouds, public URLs work, documented |
| **Code Quality (15%)** | 15% | 15 pts | Clean code, error handling, validation, no hardcoded secrets |
| **Presentation (10%)** | 10% | 10 pts | Clear explanation, live demo, answers Q&A, professional |

**Grading Scale:**
- 90-100: Excellent (A) - All requirements met, extra features, professional quality
- 80-89: Good (B) - All requirements met, minor issues, good quality
- 70-79: Satisfactory (C) - Core requirements met, some issues, acceptable quality
- 60-69: Poor (D) - Missing some requirements, significant issues
- <60: Failing (F) - Major missing components

### **Bonus Points (Optional)**
- **Load Balancing:** +5 points (AWS ALB between regions)
- **Automated Failover:** +5 points (if one cloud down, graceful degradation)
- **Advanced Monitoring:** +5 points (dashboards, alerting)
- **Message Queue:** +5 points (Redis/RabbitMQ for reliable notifications)
- **Containerization Excellence:** +3 points (well-structured Dockerfiles, security)

---

## 10. Risk Assessment & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| AWS/Azure account issues | Medium | High | Set up accounts early, have free tier alerts |
| Network latency between clouds | High | Medium | Plan for timeouts, implement retries |
| Database connectivity failures | Medium | High | Use connection pooling, implement fallback logic |
| Email service (SMTP) failures | Low | Medium | Have multiple SMTP providers or SendGrid |
| Time management | High | High | Follow timeline strictly, set daily checkpoints |
| Team coordination | Medium | Medium | Use GitHub issues, communicate daily |
| Deployment complexity | Medium | High | Document steps, test locally first |

---

## 11. Assumptions & Constraints

### **Assumptions**
- Team members have basic Node.js knowledge
- AWS/Azure free tier accounts available
- Internet connection stable
- ~20-30 hours available per team member

### **Constraints**
- 15-day timeline (non-negotiable)
- 2-3 person team (not scalable beyond this)
- Must use Node.js and Express.js
- Must have 2+ environments
- PostgreSQL + MongoDB for databases

---

## 12. Success Metrics

By the end of the project, you should be able to:

**Technical Metrics:**
- ✅ API response time < 500ms
- ✅ 95% test coverage for critical paths
- ✅ Zero data loss across cloud failures
- ✅ Services communicate successfully
- ✅ Deployed to public cloud URLs

**Professional Metrics:**
- ✅ Clean, well-documented codebase
- ✅ Comprehensive API documentation
- ✅ Professional architecture diagrams
- ✅ Successful live demo
- ✅ 5-10 minute polished presentation

**Learning Metrics:**
- ✅ Understanding of multi-cloud architecture
- ✅ Ability to design microservices
- ✅ Knowledge of distributed system patterns
- ✅ Cloud deployment experience
- ✅ Inter-service communication patterns

---

## 13. Next Steps

### **Immediate Actions (Before coding starts):**
1. ✅ Review and approve this PRD
2. ✅ Create GitHub repository
3. ✅ Set up AWS and Azure accounts (or use local)
4. ✅ Create database schemas
5. ✅ Design detailed API specifications
6. ✅ Set up local Docker Compose environment

### **Questions to Answer Before Starting:**
1. Will you use AWS + Azure, or AWS + Local?
2. Do you have budget for cloud resources, or use free tier?
3. What's the preferred email service (Gmail SMTP, SendGrid, etc.)?
4. Any specific monitoring/logging requirements?

---

## Appendix A: Technology Glossary

| Term | Definition |
|------|-----------|
| **Microservices** | Small, independent services that work together |
| **Multi-cloud** | Application deployed across 2+ cloud providers |
| **REST API** | HTTP-based communication between services |
| **JWT** | JSON Web Token for stateless authentication |
| **ACID** | Atomicity, Consistency, Isolation, Durability (database properties) |
| **Failover** | Automatic switching to backup system |
| **Latency** | Time delay in network communication |
| **Connection Pooling** | Reusing database connections efficiently |
| **Cron Job** | Scheduled task that runs at specific times |
| **Load Balancing** | Distributing traffic across multiple servers |

---

## Appendix B: Useful Resources

**Node.js & Express:**
- Express.js documentation: https://expressjs.com/
- Node.js best practices: https://github.com/goldbergyoni/nodebestpractices

**Databases:**
- PostgreSQL documentation: https://www.postgresql.org/docs/
- MongoDB documentation: https://docs.mongodb.com/

**Cloud Deployment:**
- AWS Getting Started: https://aws.amazon.com/getting-started/
- Azure Getting Started: https://azure.microsoft.com/en-us/get-started/

**Authentication:**
- JWT explanation: https://jwt.io/introduction
- bcrypt guide: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

**Testing:**
- Jest documentation: https://jestjs.io/
- Supertest guide: https://github.com/visionmedia/supertest

---

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Prepared for:** Cloud Computing Course - Multi-Cloud Project  
**Status:** Ready for Development Phase