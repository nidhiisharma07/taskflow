import mongoose from "mongoose";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

const getProjectMemberRole = (project, userId) => {
  const member = project.members.find(
    (item) => item.userId.toString() === userId.toString()
  );
  return member ? member.role : null;
};

// ✅ GET TASKS
const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.query;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Valid projectId query param is required"
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const memberRole = getProjectMemberRole(project, req.user._id);
    if (!memberRole) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this project"
      });
    }

    const query = { projectId };
    if (memberRole === "Member") {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email role")
      .sort({ dueDate: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// ✅ CREATE TASK
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, status, dueDate, projectId } = req.body;

    if (!title || !assignedTo || !dueDate || !projectId) {
      return res.status(400).json({
        success: false,
        message: "title, assignedTo, dueDate and projectId are required"
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const creatorRole = getProjectMemberRole(project, req.user._id);
    if (creatorRole !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only project admins can create tasks"
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      status,
      dueDate,
      projectId
    });

    // 🔥 REAL-TIME (SAFE)
    if (global.io) {
      global.io.emit("taskCreated", task);
    }

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATE TASK
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, status, dueDate } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const project = await Project.findById(task.projectId);
    const memberRole = getProjectMemberRole(project, req.user._id);

    const isTaskAssignee = task.assignedTo.toString() === req.user._id.toString();
    const isAdmin = memberRole === "Admin";

    if (!isAdmin && !isTaskAssignee) {
      return res.status(403).json({
        success: false,
        message: "You can only update your assigned tasks"
      });
    }

    if (title !== undefined && isAdmin) task.title = title;
    if (description !== undefined && isAdmin) task.description = description;
    if (dueDate !== undefined && isAdmin) task.dueDate = dueDate;
    if (status !== undefined) task.status = status;

    await task.save();

    // 🔥 REAL-TIME (SAFE)
    if (global.io) {
      global.io.emit("taskUpdated", task);
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// ✅ DASHBOARD
const getTaskDashboard = async (req, res, next) => {
  try {
    const now = new Date();

    const projects = await Project.find({ "members.userId": req.user._id });
    const projectIds = projects.map(p => p._id);

    const filter = { projectId: { $in: projectIds } };

    const [total, completed, pending, overdue] = await Promise.all([
      Task.countDocuments(filter),
      Task.countDocuments({ ...filter, status: "Done" }),
      Task.countDocuments({ ...filter, status: { $ne: "Done" } }),
      Task.countDocuments({
        ...filter,
        status: { $ne: "Done" },
        dueDate: { $lt: now }
      })
    ]);

    return res.status(200).json({
      success: true,
      data: { total, completed, pending, overdue }
    });
  } catch (error) {
    next(error);
  }
};

export { getTasks, createTask, updateTask, getTaskDashboard };