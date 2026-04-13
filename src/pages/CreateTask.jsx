import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import TrainerLayout from "../layouts/TrainerLayout";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../service/store";

function CreateTask() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.tasks);

  const [trainees, setTrainees] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedTo: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/auth/all-users");
        const traineeUsers = data.filter((user) => user.role === "trainee");
        setTrainees(traineeUsers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (traineeId) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(traineeId)
        ? prev.assignedTo.filter((id) => id !== traineeId)
        : [...prev.assignedTo, traineeId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(createTask(formData));

    if (createTask.fulfilled.match(result)) {
      navigate("/trainer");
    }
  };

  return (
    <TrainerLayout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <textarea
            name="description"
            placeholder="Enter task description"
            rows="5"
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

          <div>
            <h3 className="font-semibold mb-3">Assign to Trainees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trainees.map((trainee) => (
                <label
                  key={trainee._id}
                  className="flex items-center gap-3 border p-3 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={formData.assignedTo.includes(trainee._id)}
                    onChange={() => handleCheckboxChange(trainee._id)}
                  />
                  <span>
                    {trainee.name} ({trainee.email})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </TrainerLayout>
  );
}

export default CreateTask;