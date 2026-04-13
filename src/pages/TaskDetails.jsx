import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import TrainerLayout from "../layouts/TrainerLayout";
import TraineeLayout from "../layouts/TraineeLayout";
import Loader from "../components/Loader";
import { clearSelectedTask, fetchTaskById } from "../service/store";
import { formatDate } from "../utils/helpers";

function TaskDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { selectedTask, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTaskById(id));

    return () => {
      dispatch(clearSelectedTask());
    };
  }, [dispatch, id]);

  const Wrapper =
    userInfo?.role === "trainer" ? TrainerLayout : TraineeLayout;

  if (loading) return <Loader />;

  if (!selectedTask) {
    return (
      <Wrapper>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          Task not found
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="bg-white max-w-3xl p-8 rounded-2xl shadow-sm border">
        <h2 className="text-3xl font-bold text-slate-800">
          {selectedTask.title}
        </h2>

        <p className="text-gray-600 mt-4">{selectedTask.description}</p>

        <div className="mt-6 space-y-2 text-gray-600">
          <p>Deadline: {formatDate(selectedTask.deadline)}</p>
          <p>Status: {selectedTask.status}</p>
        </div>

        {userInfo?.role === "trainee" && (
          <Link
            to={`/task/${selectedTask._id}/submit`}
            className="inline-block mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Task
          </Link>
        )}
      </div>
    </Wrapper>
  );
}

export default TaskDetails;