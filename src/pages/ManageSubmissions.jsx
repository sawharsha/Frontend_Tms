import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrainerLayout from "../layouts/TrainerLayout";
import Loader from "../components/Loader";
import { fetchSubmissions, reviewSubmission } from "../service/store";

function ManageSubmissions() {
  const dispatch = useDispatch();

  const { submissions, loading, error } = useSelector(
    (state) => state.submissions
  );

  useEffect(() => {
    dispatch(fetchSubmissions());
  }, [dispatch]);

  const handleReview = async (id, status) => {
    const result = await dispatch(reviewSubmission({ id, status }));

    if (reviewSubmission.fulfilled.match(result)) {
      dispatch(fetchSubmissions());
    } else {
      alert(result.payload || "Failed to update submission");
    }
  };

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
          <h2 className="text-3xl font-bold text-slate-800">
            Manage Submissions
          </h2>
          <p className="text-gray-500 mt-2">
            Review and manage all trainee task submissions.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border shadow-sm text-gray-500">
            No submissions available.
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
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
                      {submission.traineeId?.name} ({submission.traineeId?.email})
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
    </TrainerLayout>
  );
}

export default ManageSubmissions;