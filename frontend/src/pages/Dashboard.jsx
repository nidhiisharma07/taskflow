import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import api from "../services/api";
import Skeleton from "../components/Skeleton";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const COLORS = ["#6366f1", "#f59e0b", "#10b981"];

// 🎯 animations
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0 }
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const projectRes = await api.get("/projects");
      const projects = projectRes.data.data || [];

      let allTasks = [];

      for (let project of projects) {
        const res = await api.get(`/tasks?projectId=${project._id}`);
        allTasks = [...allTasks, ...(res.data.data || [])];
      }

      setTasks(allTasks);
    } catch (err) {
      console.log("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    window.addEventListener("focus", fetchTasks);
    return () => window.removeEventListener("focus", fetchTasks);
  }, []);

  // 🔍 FILTER
  const filteredTasks = useMemo(() => {
    const now = new Date();

    if (filter === "Overdue") {
      return tasks.filter(
        t => t.dueDate && new Date(t.dueDate) < now && t.status !== "Done"
      );
    }

    if (filter === "Today") {
      return tasks.filter(t =>
        new Date(t.dueDate).toDateString() === now.toDateString()
      );
    }

    if (filter === "This Week") {
      const weekEnd = new Date();
      weekEnd.setDate(now.getDate() + 7);

      return tasks.filter(t => {
        const d = new Date(t.dueDate);
        return d >= now && d <= weekEnd;
      });
    }

    return tasks;
  }, [tasks, filter]);

  // 📊 STATS
  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.status === "Done").length;
    const inProgress = filteredTasks.filter(t => t.status === "In Progress").length;
    const todo = filteredTasks.filter(t => t.status === "To Do").length;

    return { total, completed, inProgress, todo };
  }, [filteredTasks]);

  const progress = stats.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const chartData = [
    { name: "To Do", value: stats.todo },
    { name: "In Progress", value: stats.inProgress },
    { name: "Done", value: stats.completed }
  ];

  const trendData = [
    { day: "Mon", tasks: 2 },
    { day: "Tue", tasks: 4 },
    { day: "Wed", tasks: 3 },
    { day: "Thu", tasks: 5 },
    { day: "Fri", tasks: 6 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-10"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Dashboard 📊
          </h2>

          <div className="flex gap-2">
            {["All", "Today", "This Week", "Overdue"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-800 border dark:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* KPI */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-lg border">
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
          >
            {[
              { label: "Total", value: stats.total },
              { label: "Completed", value: stats.completed },
              { label: "In Progress", value: stats.inProgress },
              { label: "To Do", value: stats.todo }
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-slate-800 p-5 rounded-lg border shadow-sm hover:shadow-xl"
              >
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {card.label}
                </p>
                <h3 className="text-2xl font-semibold">{card.value}</h3>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* PROGRESS */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border shadow-sm mb-10">
          {loading ? (
            <Skeleton className="h-3 w-full" />
          ) : (
            <>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-indigo-600 h-3 rounded-full"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                {progress}% completed
              </p>
            </>
          )}
        </div>

        {/* CHARTS */}
        {loading ? (
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            <Skeleton className="h-[250px] w-full" />
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 mb-10">

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border shadow-sm">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" outerRadius={90}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border shadow-sm">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tasks" stroke="#6366f1" />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

        {/* RECENT TASKS */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border shadow-sm">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            filteredTasks.slice(0, 5).map(task => (
              <div key={task._id} className="flex justify-between border-b pb-2">
                <span>{task.title}</span>
                <span className="text-xs text-gray-500">{task.status}</span>
              </div>
            ))
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default Dashboard;