import {
    DndContext,
    closestCenter
  } from "@dnd-kit/core";
  import { useState, useEffect } from "react";
  import TaskCard from "./TaskCard";
  import { motion } from "framer-motion";
  
  const columns = ["To Do", "In Progress", "Done"];
  
  const KanbanBoard = ({ tasks, onStatusChange }) => {
    const [items, setItems] = useState([]);
  
    useEffect(() => {
      setItems(tasks);
    }, [tasks]);
  
    const handleDragEnd = (event) => {
      const { active, over } = event;
      if (!over) return;
  
      const taskId = active.id;
      const newStatus = over.id;
  
      setItems((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? { ...task, status: newStatus }
            : task
        )
      );
  
      onStatusChange(taskId, newStatus);
    };
  
    return (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-3 gap-6">
  
          {columns.map((column, index) => (
            <motion.div
              key={column}
              id={column}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-md rounded-xl p-4 shadow min-h-[400px]"
            >
              <h2 className="font-semibold mb-4 text-gray-700">
                {column}
              </h2>
  
              <div className="space-y-4">
                {items
                  .filter((task) => task.status === column)
                  .map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={onStatusChange}
                    />
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </DndContext>
    );
  };
  
  export default KanbanBoard;