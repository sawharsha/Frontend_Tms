import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TrainerLayout from "../layouts/TrainerLayout";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import {
  fetchTasks,
  fetchSubmissions,
  reviewSubmission,
  fetchTrainees,
} from "../service/store";

function TrainerDashboard() {
  const dispatch = useDispatch();

  const { tasks, loading: taskLoading, error: taskError } = useSelector(
    (state) => state.tasks
  );

  const {
    submissions,
    loading: submissionLoading,
    error: submissionError,
  } = useSelector((state) => state.submissions);

  const { trainees } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchSubmissions());
    dispatch(fetchTrainees());
  }, [dispatch]);

  const handleReview = async (id, status) => {
    const result = await dispatch(reviewSubmission({ id, status }));

    if (reviewSubmission.fulfilled.match(result)) {
      dispatch(fetchSubmissions());
    } else {
      alert(result.payload || "Failed to update submission");
    }
  };

  if (taskLoading || submissionLoading) {
    return (
      <TrainerLayout>
        <Loader />
      </TrainerLayout>
    );
  }

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeSubmissions = Array.isArray(submissions) ? submissions : [];
  const safeTrainees = Array.isArray(trainees) ? trainees : [];

  const recentTasks = [...safeTasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const recentSubmissions = [...safeSubmissions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const pendingReviews = safeSubmissions.filter(
    (submission) => submission.status === "submitted"
  ).length;

  return (
    <TrainerLayout>
      <div className="space-y-8">
        {(taskError || submissionError) && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl border border-red-200">
            {taskError || submissionError}
          </div>
        )}

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-3xl font-bold text-slate-800">
            Sivion Global Technologies
          </h2>
          <p className="text-gray-500 mt-2">
            Trainer dashboard for managing tasks, monitoring trainees, and reviewing submissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <h3 className="text-4xl font-bold text-blue-600 mt-2">
              {safeTasks.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-gray-500 text-sm">Total Trainees</p>
            <h3 className="text-4xl font-bold text-purple-600 mt-2">
              {safeTrainees.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-gray-500 text-sm">Total Submissions</p>
            <h3 className="text-4xl font-bold text-emerald-600 mt-2">
              {safeSubmissions.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-gray-500 text-sm">Pending Reviews</p>
            <h3 className="text-4xl font-bold text-amber-500 mt-2">
              {pendingReviews}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/trainer/create-task"
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Create New Task
          </Link>

          <Link
            to="/trainer/tasks"
            className="bg-slate-800 text-white px-5 py-3 rounded-xl hover:bg-slate-900 transition"
          >
            View All Tasks
          </Link>

          <Link
            to="/trainer/submissions"
            className="bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 transition"
          >
            View All Submissions
          </Link>

          <Link
            to="/trainer/trainees"
            className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 transition"
          >
            View Trainees
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Recent Tasks</h2>
            <Link
              to="/trainer/tasks"
              className="text-blue-600 font-medium hover:underline"
            >
              See all
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border shadow-sm text-gray-500">
              No tasks created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {recentTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">
              Recent Submissions
            </h2>
            <Link
              to="/trainer/submissions"
              className="text-blue-600 font-medium hover:underline"
            >
              See all
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border shadow-sm text-gray-500">
              No submissions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission._id}
                  className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-800">
                        {submission.taskId?.title || "Task"}
                      </h3>

                      <p className="text-gray-600">
                        <span className="font-medium">Trainee:</span>{" "}
                        {submission.traineeId?.name || "Unknown"} (
                        {submission.traineeId?.email || "No email"})
                      </p>

                      <p className="text-gray-600">
                        <span className="font-medium">Comment:</span>{" "}
                        {submission.comment}
                      </p>

                      <p className="text-gray-600 break-all">
                        <span className="font-medium">File:</span>{" "}
                        {submission.fileUrl}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`font-semibold ${
                            submission.status === "approved"
                              ? "text-green-600"
                              : submission.status === "rejected"
                              ? "text-red-600"
                              : "text-amber-600"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </p>
                    </div>

                    {submission.status === "submitted" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleReview(submission._id, "approved")
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleReview(submission._id, "rejected")
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TrainerLayout>
  );
}

export default TrainerDashboard;