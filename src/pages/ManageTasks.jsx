import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrainerLayout from "../layouts/TrainerLayout";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import { fetchTasks } from "../service/store";

function ManageTasks() {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) {
    return (
      <TrainerLayout>
        <Loader />
      </TrainerLayout>
    );
  }

  return (
    <TrainerLayout>
      <div className="space-y-6">
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-3xl font-bold text-slate-800">Manage Tasks</h2>
          <p className="text-gray-500 mt-2">
            View, edit, and delete all tasks from one place.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border shadow-sm text-gray-500">
            No tasks available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </TrainerLayout>
  );
}

export default ManageTasks;