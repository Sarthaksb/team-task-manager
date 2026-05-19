const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// all routes require authentication
router.use(protect);

// get all projects / create project
router.route('/')
  .get(getProjects)
  .post(adminOnly, [
    body('title').notEmpty().withMessage('Project title is required')
  ], createProject);

// get, update, delete project by id
router.route('/:id')
  .get(getProjectById)
  .put(adminOnly, updateProject)
  .delete(adminOnly, deleteProject);

// add member to project
router.put('/:id/add-member', adminOnly, addMember);

module.exports = router;
