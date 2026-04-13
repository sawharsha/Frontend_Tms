import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TraineeLayout from "../layouts/TraineeLayout";
import { clearSubmissionState, submitTask } from "../service/store";

function SubmitTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector(
    (state) => state.submissions
  );

  const [formData, setFormData] = useState({
    fileUrl: "",
    comment: "",
  });

  useEffect(() => {
    if (success) {
      dispatch(clearSubmissionState());
      navigate("/trainee");
    }
  }, [success, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      submitTask({
        taskId: id,
        fileUrl: formData.fileUrl,
        comment: formData.comment,
      })
    );
  };

  return (
    <TraineeLayout>
      <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Submit Task</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="fileUrl"
            placeholder="Paste GitHub link or Drive link"
            value={formData.fileUrl}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <textarea
            name="comment"
            placeholder="Write your submission comment"
            rows="5"
            value={formData.comment}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Submitting..." : "Submit Task"}
          </button>
        </form>
      </div>
    </TraineeLayout>
  );
}

export default SubmitTask;