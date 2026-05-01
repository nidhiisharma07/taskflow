import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const isProjectAdmin = (project, userId) => {
  return project.members.some(
    (member) =>
      member.userId.toString() === userId.toString() && member.role === "Admin"
  );
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email role")
      .populate("members.userId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required"
      });
    }

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: [{ userId: req.user._id, role: "Admin" }]
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid project id" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (!isProjectAdmin(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only project admins can delete project"
      });
    }

    await Task.deleteMany({ projectId: id });
    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

const addProjectMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid id provided" });
    }

    const [project, user] = await Promise.all([Project.findById(id), User.findById(userId)]);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!isProjectAdmin(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only project admins can add members"
      });
    }

    const exists = project.members.some((member) => member.userId.toString() === userId);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User is already part of this project"
      });
    }

    project.members.push({ userId, role: role === "Admin" ? "Admin" : "Member" });
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member added successfully",
      data: project
    });
  } catch (error) {
    next(error);
  }
};

const removeProjectMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid id provided" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (!isProjectAdmin(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only project admins can remove members"
      });
    }

    const isCreator = project.createdBy.toString() === userId;
    if (isCreator) {
      return res.status(400).json({
        success: false,
        message: "Project creator cannot be removed"
      });
    }

    const initialCount = project.members.length;
    project.members = project.members.filter((member) => member.userId.toString() !== userId);

    if (project.members.length === initialCount) {
      return res.status(404).json({
        success: false,
        message: "Member not found in this project"
      });
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: project
    });
  } catch (error) {
    next(error);
  }
};

export {
  getProjects,
  createProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
};
