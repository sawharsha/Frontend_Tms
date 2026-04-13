import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar() {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  const trainerLinks = [
    { name: "Dashboard", path: "/trainer" },
    { name: "Create Task", path: "/trainer/create-task" },
    { name: "View Tasks", path: "/trainer/tasks" },
    { name: "View Submissions", path: "/trainer/submissions" },
    { name: "Trainees", path: "/trainer/trainees" },
  ];

  const traineeLinks = [{ name: "Dashboard", path: "/trainee" }];

  const links = userInfo?.role === "trainer" ? trainerLinks : traineeLinks;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">
      <h2 className="text-xl font-semibold mb-8">Navigation</h2>

      <div className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-3 rounded-lg transition ${
              location.pathname === link.path
                ? "bg-blue-600"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;