const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new project (admin only)
// @route   POST /api/projects
const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, teamMembers } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      teamMembers: teamMembers || []
    });

    const populated = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'admin') {
      // admin sees all projects
      projects = await Project.find()
        .populate('createdBy', 'name email')
        .populate('teamMembers', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // members see only projects they are part of
      projects = await Project.find({ teamMembers: req.user._id })
        .populate('createdBy', 'name email')
        .populate('teamMembers', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single project by id
// @route   GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update project (admin only)
// @route   PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const { title, description, teamMembers } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    if (teamMembers) project.teamMembers = teamMembers;

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete project (admin only)
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add member to project (admin only)
// @route   PUT /api/projects/:id/add-member
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // check if member already exists in project
    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({ message: 'User is already a team member' });
    }

    project.teamMembers.push(userId);
    await project.save();

    const updated = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember
};
