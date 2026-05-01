import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Tasks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "To Do",
    priority: "Medium"
  });

  const currentUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const selectedProject = projects.find(
    (project) => project._id === selectedProjectId
  );

  const selectedMemberRole = selectedProject?.members?.find(
    (member) => member.userId?._id === currentUser?.id
  )?.role;

  const isAdmin = selectedMemberRole === "Admin";

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      const allProjects = data.data || [];
      setProjects(allProjects);

      if (allProjects.length && !selectedProjectId) {
        setSelectedProjectId(allProjects[0]._id);
      }
    } catch (err) {
      setError("Failed to fetch projects");
    }
  };

  const fetchTasks = async (projectId) => {
    if (!projectId) return;

    try {
      const { data } = await api.get(`/tasks?projectId=${projectId}`);
      setTasks(data.data || []);
    } catch (err) {
      setError("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks(selectedProjectId);
  }, [selectedProjectId]);

  const handleTaskFormChange = (e) => {
    setTaskForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      setError("Only admins can create tasks");
      return;
    }

    try {
      await api.post("/tasks", {
        ...taskForm,
        projectId: selectedProjectId
      });

      setTaskForm({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "To Do",
        priority: "Medium"
      });

      fetchTasks(selectedProjectId);
    } catch {
      setError("Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status } : task
        )
      );
    } catch {
      setError("Failed to update task");
    }
  };

  const priorityColor = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-600",
    Low: "bg-green-100 text-green-600"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Kanban Board
          </h2>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* CREATE TASK */}
        {isAdmin && (
          <form
            onSubmit={handleCreateTask}
            className="bg-white border rounded-xl p-6 mb-10"
          >
            <h3 className="font-medium mb-4">Create Task</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                name="title"
                value={taskForm.title}
                onChange={handleTaskFormChange}
                placeholder="Task title"
                className="border px-3 py-2 rounded-md"
              />

              <input
                type="date"
                name="dueDate"
                value={taskForm.dueDate}
                onChange={handleTaskFormChange}
                className="border px-3 py-2 rounded-md"
              />
            </div>

            <textarea
              name="description"
              value={taskForm.description}
              onChange={handleTaskFormChange}
              placeholder="Description"
              className="w-full border px-3 py-2 rounded-md mb-4"
            />

            <select
              name="priority"
              value={taskForm.priority}
              onChange={handleTaskFormChange}
              className="border px-3 py-2 rounded-md mb-4 w-full"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <button className="bg-indigo-600 text-white px-5 py-2 rounded-md">
              Create Task
            </button>
          </form>
        )}

        {/* BOARD */}
        <div className="grid md:grid-cols-3 gap-6">

          {["To Do", "In Progress", "Done"].map((status) => (
            <div
              key={status}
              className="bg-white border rounded-xl p-4"
            >
              <div className="flex justify-between mb-4">
                <h3 className="font-medium text-gray-700">{status}</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </div>

              <div className="space-y-4">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div
                      key={task._id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium text-gray-800">
                          {task.title}
                        </h4>

                        <span className={`text-xs px-2 py-1 rounded ${priorityColor[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {task.description || "No description"}
                      </p>

                      <div className="text-xs text-gray-500">
                        👤 {task.assignedTo?.name || "Unassigned"}
                      </div>

                      <div className="text-xs text-gray-500 mb-2">
                        📅{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No date"}
                      </div>

                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        className="w-full border rounded-md px-2 py-1 text-sm"
                      >
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Done</option>
                      </select>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Tasks;