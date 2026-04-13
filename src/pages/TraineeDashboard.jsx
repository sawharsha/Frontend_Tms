import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TraineeLayout from "../layouts/TraineeLayout";
import Loader from "../components/Loader";
import { fetchTasks, fetchSubmissions } from "../service/store";
import { Link } from "react-router-dom";

function TraineeDashboard() {
  const dispatch = useDispatch();

  const { tasks, loading: taskLoading } = useSelector((state) => state.tasks);
  const { submissions, loading: submissionLoading } = useSelector(
    (state) => state.submissions
  );

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchSubmissions());
  }, [dispatch]);

  const getSubmissionForTask = (taskId) => {
    return submissions.find(
      (submission) => submission.taskId?._id === taskId || submission.taskId === taskId
    );
  };

  if (taskLoading || submissionLoading) return <Loader />;

  return (
    <TraineeLayout>
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Assigned Tasks</h2>
        <p className="text-gray-500 mt-1">
          View your task status and submit only when needed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tasks.map((task) => {
          const submission = getSubmissionForTask(task._id);

          return (
            <div key={task._id} className="bg-white rounded-2xl p-6 border shadow-sm">
              <h3 className="text-xl font-bold">{task.title}</h3>
              <p className="text-gray-600 mt-3">{task.description}</p>
              <p className="mt-4 text-gray-500">
                Deadline: {new Date(task.deadline).toLocaleDateString()}
              </p>

              <p className="mt-3">
                Submission Status:{" "}
                <span className="font-semibold">
                  {submission ? submission.status : "not submitted"}
                </span>
              </p>

              {!submission && (
                <Link
                  to={`/task/${task._id}/submit`}
                  className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg"
                >
                  Submit Task
                </Link>
              )}

              {submission?.status === "rejected" && (
                <Link
                  to={`/task/${task._id}/submit`}
                  className="inline-block mt-5 bg-orange-500 text-white px-5 py-3 rounded-lg"
                >
                  Resubmit Task
                </Link>
              )}

              {submission?.status === "submitted" && (
                <button
                  disabled
                  className="inline-block mt-5 bg-gray-400 text-white px-5 py-3 rounded-lg cursor-not-allowed"
                >
                  Waiting for Review
                </button>
              )}

              {submission?.status === "approved" && (
                <button
                  disabled
                  className="inline-block mt-5 bg-green-600 text-white px-5 py-3 rounded-lg cursor-not-allowed"
                >
                  Approved
                </button>
              )}
            </div>
          );
        })}
      </div>
    </TraineeLayout>
  );
}

export default TraineeDashboard;