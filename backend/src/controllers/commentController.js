import mongoose from "mongoose";
import Comment from "../models/comment.js";

// ✅ ADD COMMENT + REAL-TIME
export const addComment = async (req, res) => {
  try {
    const { taskId, text } = req.body;

    // validation
    if (!taskId || !text) {
      return res.status(400).json({
        success: false,
        message: "taskId and text are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid taskId"
      });
    }

    const comment = await Comment.create({
      taskId,
      text,
      userId: req.user._id
    });

    // populate user name
    const populatedComment = await comment.populate("userId", "name");

    // 🔥 REAL-TIME EMIT (SAFE)
    if (global.io) {
      global.io.emit("newComment", populatedComment);
    }

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: populatedComment
    });

  } catch (err) {
    console.error("Add Comment Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to add comment"
    });
  }
};

// ✅ GET COMMENTS
export const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid taskId"
      });
    }

    const comments = await Comment.find({ taskId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: comments
    });

  } catch (err) {
    console.error("Get Comments Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments"
    });
  }
};