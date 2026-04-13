import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TrainerLayout from "../layouts/TrainerLayout";
import { fetchTaskById, updateTask, clearSelectedTask } from "../service/store";

function EditTask() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedTask, loading } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedTo: "",
  });

  useEffect(() => {
    dispatch(fetchTaskById(id));

    return () => {
      dispatch(clearSelectedTask());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        deadline: selectedTask.deadline
          ? selectedTask.deadline.split("T")[0]
          : "",
        assignedTo: selectedTask.assignedTo?._id || selectedTask.assignedTo || "",
      });
    }
  }, [selectedTask]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      updateTask({
        id,
        taskData: formData,
      })
    );

    if (updateTask.fulfilled.match(result)) {
      navigate("/trainer");
    }
  };

  return (
    <TrainerLayout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Edit Task</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <textarea
            name="description"
            rows="5"
            placeholder="Task description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Task"}
          </button>
        </form>
      </div>
    </TrainerLayout>
  );
}

export default EditTask;