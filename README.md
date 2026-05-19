# Team Task Manager

A full-stack team task management application built with React, Node.js, Express, and MongoDB.

## Features

- User Signup/Login with JWT Authentication
- Role-based access (Admin & Member)
- Project Management (CRUD)
- Team Management (Add members to projects)
- Task Management (Create, Assign, Update, Delete)
- Task Status Tracking (Pending, In Progress, Completed)
- Dashboard with task statistics (Total, Completed, Pending, Overdue)

## Tech Stack

**Frontend:** React.js (Vite), Tailwind CSS, Axios, React Router DOM
**Backend:** Node.js, Express.js
**Database:** MongoDB Atlas
**Authentication:** JWT, bcrypt

## Folder Structure

```
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd team-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies API requests to `http://localhost:5000`.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project (Admin) |
| GET | /api/projects/:id | Get project by ID |
| PUT | /api/projects/:id | Update project (Admin) |
| DELETE | /api/projects/:id | Delete project (Admin) |
| PUT | /api/projects/:id/add-member | Add member (Admin) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task (Admin) |
| GET | /api/tasks/:id | Get task by ID |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task (Admin) |
| GET | /api/tasks/dashboard/stats | Get dashboard stats |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users (Admin) |

## Role-Based Access

**Admin** can:
- Create, edit, delete projects
- Add members to projects
- Create, assign, edit, delete tasks
- View dashboard with all stats

**Member** can:
- View assigned tasks
- Update own task status only
- View dashboard with personal stats

## Deployment (Railway)

1. Push code to GitHub
2. Go to [Railway](https://railway.app)
3. Create a new project → Deploy from GitHub
4. Add backend service:
   - Set root directory to `backend`
   - Add environment variables (PORT, MONGO_URI, JWT_SECRET)
5. Add frontend service:
   - Set root directory to `frontend`
   - Set build command: `npm run build`
   - Set start command: `npx serve dist`
   - Update API base URL in frontend to point to backend Railway URL

## License
This project is for educational purposes.
