const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats
} = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// all routes require authentication
router.use(protect);

// dashboard stats - this must be before /:id route
router.get('/dashboard/stats', getDashboardStats);

// get all tasks / create task
router.route('/')
  .get(getTasks)
  .post(adminOnly, [
    body('title').notEmpty().withMessage('Task title is required'),
    body('assignedTo').notEmpty().withMessage('Assigned user is required'),
    body('project').notEmpty().withMessage('Project is required'),
    body('dueDate').notEmpty().withMessage('Due date is required')
  ], createTask);

// get, update, delete task by id
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(adminOnly, deleteTask);

module.exports = router;
