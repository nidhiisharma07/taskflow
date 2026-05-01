import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  createTask,
  getTaskDashboard,
  getTasks,
  updateTask
} from "../controllers/taskController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.get("/dashboard", getTaskDashboard);
router.post("/", roleMiddleware("Admin"), createTask);
router.put("/:id", updateTask);

export default router;
