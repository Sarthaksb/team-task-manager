import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// auth api calls
export const loginUser = (data) => API.post('/auth/login', data);
export const signupUser = (data) => API.post('/auth/signup', data);

// project api calls
export const getProjects = () => API.get('/projects');
export const getProjectById = (id) => API.get(`/projects/${id}`);
export const createProject = (data) => API.post('/projects', data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const addMemberToProject = (id, userId) => API.put(`/projects/${id}/add-member`, { userId });

// task api calls
export const getTasks = (projectId) => {
  const params = projectId ? `?project=${projectId}` : '';
  return API.get(`/tasks${params}`);
};
export const getTaskById = (id) => API.get(`/tasks/${id}`);
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const getDashboardStats = () => API.get('/tasks/dashboard/stats');

// user api calls
export const getUsers = () => API.get('/users');
