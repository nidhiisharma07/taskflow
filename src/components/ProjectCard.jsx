const ProjectCard = ({ project, onDelete }) => {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800">{project.title}</h3>
        <button
          type="button"
          onClick={() => onDelete(project._id)}
          className="rounded-md bg-rose-600 px-3 py-1 text-sm text-white hover:bg-rose-700"
        >
          Delete
        </button>
      </div>
      <p className="mb-3 text-sm text-slate-600">{project.description || "No description."}</p>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Members</p>
        <ul className="space-y-1">
          {project.members?.map((member) => (
            <li key={member.userId?._id || member.userId} className="text-sm text-slate-700">
              {(member.userId?.name || "Unknown User") + " - " + member.role}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectCard;
