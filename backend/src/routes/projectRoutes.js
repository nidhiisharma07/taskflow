import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProjects,
  removeProjectMember
} from "../controllers/projectController.js";

const router = Router();

// 🔐 Apply authentication to all routes
router.use(authMiddleware);

// 📂 Get all projects
router.get("/", getProjects);

// ➕ Create project (Admin only)
router.post("/", roleMiddleware("admin"), createProject);

// ❌ Delete project (Admin only)
router.delete("/:id", roleMiddleware("admin"), deleteProject);

// 👥 Add member to project (Admin only)
router.post("/:id/members", roleMiddleware("admin"), addProjectMember);

// ❌ Remove member (Admin only)
router.delete("/:id/members/:userId", roleMiddleware("admin"), removeProjectMember);

export default router;