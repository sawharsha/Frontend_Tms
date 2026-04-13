import { Link, useNavigate } from "react-router-dom";
import { formatDate, getStatusClass } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, fetchTasks } from "../service/store";

function TaskCard({ task }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    await dispatch(deleteTask(task._id));
    dispatch(fetchTasks());
  };

  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-lg font-bold text-slate-800">{task.title}</h3>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>

      <p className="text-gray-600 mt-3">{task.description}</p>

      <p className="text-sm text-gray-500 mt-4">
        Deadline: {formatDate(task.deadline)}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to={`/task/${task._id}`}
          className="text-blue-600 font-medium hover:underline"
        >
          View Details
        </Link>

        {userInfo?.role === "trainer" && (
          <>
            <button
              onClick={() => navigate(`/trainer/edit-task/${task._id}`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;