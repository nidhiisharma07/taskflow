import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../socket"; // 🔥 ADD THIS

const statusStyles = {
  "To Do": "bg-gray-100 text-gray-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Done: "bg-green-100 text-green-700"
};

const priorityStyles = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-yellow-100 text-yellow-600",
  Low: "bg-green-100 text-green-600"
};

const TaskCard = ({ task }) => {
  const [open, setOpen] = useState(false);

  // 💬 COMMENTS STATE
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Done";

  // 🔄 FETCH COMMENTS
  useEffect(() => {
    if (open) {
      api.get(`/comments/${task._id}`).then(res => {
        setComments(res.data.data || []);
      });
    }
  }, [open, task._id]);

  // 🔥 REAL-TIME COMMENTS LISTENER
  useEffect(() => {
    socket.on("newComment", (newComment) => {
      if (newComment.taskId === task._id) {
        setComments(prev => [newComment, ...prev]);
      }
    });

    return () => {
      socket.off("newComment");
    };
  }, [task._id]);

  // ➕ ADD COMMENT
  const addComment = async () => {
    if (!text.trim()) return;

    await api.post("/comments", {
      taskId: task._id,
      text
    });

    setText(""); // no manual update → socket handles it
  };

  return (
    <>
      {/* CARD */}
      <motion.div
        layout
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setOpen(true)}
        className={`bg-white/80 backdrop-blur-md border rounded-xl p-5 shadow cursor-pointer
        ${isOverdue ? "border-red-400" : ""}`}
      >
        {/* TITLE */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-800">
            {task.title}
          </h3>

          <span className={`px-3 py-1 text-xs rounded-full ${statusStyles[task.status]}`}>
            {task.status}
          </span>
        </div>

        {/* DESC */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description || "No description"}
        </p>

        {/* META */}
        <div className="flex justify-between items-center text-xs">

          {/* 👤 AVATAR */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
              {task.assignedTo?.name?.charAt(0) || "U"}
            </div>

            <span>{task.assignedTo?.name || "Unassigned"}</span>
          </div>

          {/* PRIORITY */}
          {task.priority && (
            <span className={`px-2 py-1 rounded ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>
          )}
        </div>

        {/* OVERDUE */}
        {isOverdue && (
          <p className="text-red-500 text-xs mt-2 font-medium">
            ⚠ Overdue
          </p>
        )}
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="bg-white p-6 rounded-xl w-[420px] shadow-xl"
            >
              <h2 className="text-xl font-bold mb-2">{task.title}</h2>
              <p className="text-gray-600 mb-4">{task.description}</p>

              <div className="text-sm space-y-2 mb-4">
                <p>👤 {task.assignedTo?.name}</p>
                <p>
                  📅{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>Status: {task.status}</p>
                <p>Priority: {task.priority || "None"}</p>
              </div>

              {/* 💬 COMMENTS */}
              <div className="border-t pt-3">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">
                  Comments
                </h4>

                <div className="space-y-2 max-h-32 overflow-y-auto mb-2">
                  {comments.map(c => (
                    <div key={c._id} className="bg-gray-100 p-2 rounded text-xs">
                      <span className="font-medium">{c.userId?.name}: </span>
                      {c.text}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add comment..."
                    className="flex-1 border px-2 py-1 rounded text-sm"
                  />

                  <button
                    onClick={addComment}
                    className="bg-indigo-600 text-white px-3 rounded text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>

              {/* CLOSE */}
              <button
                onClick={() => setOpen(false)}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TaskCard;