import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addComment,
  getComments
} from "../controllers/commentController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", addComment);
router.get("/:taskId", getComments);

export default router;