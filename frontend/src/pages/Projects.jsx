import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import api from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/projects", { title: title.trim(), description: description.trim() });
      setTitle("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((project) => project._id !== projectId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">Projects</h2>
        {error && <p className="mb-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <form
          onSubmit={handleCreateProject}
          className="mb-6 grid gap-3 rounded-xl border bg-white p-4 shadow-sm md:grid-cols-3"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
            className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description"
            className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} onDelete={handleDeleteProject} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Projects;
