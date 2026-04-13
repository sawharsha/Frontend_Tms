import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "../pages/Login";
import Register from "../pages/Register";
import TrainerDashboard from "../pages/TrainerDashboard";
import TraineeDashboard from "../pages/TraineeDashboard";
import CreateTask from "../pages/CreateTask";
import TaskDetails from "../pages/TaskDetails";
import SubmitTask from "../pages/SubmitTask";
import EditTask from "../pages/EditTask";
import ManageTasks from "../pages/ManageTasks";
import ManageSubmissions from "../pages/ManageSubmissions";
import TraineeList from "../pages/TraineeList";

function AppRoutes() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/trainer"
        element={
          userInfo?.role === "trainer" ? <TrainerDashboard /> : <Navigate to="/" />
        }
      />

      <Route
        path="/trainer/create-task"
        element={
          userInfo?.role === "trainer" ? <CreateTask /> : <Navigate to="/" />
        }
      />

      <Route
        path="/trainer/edit-task/:id"
        element={
          userInfo?.role === "trainer" ? <EditTask /> : <Navigate to="/" />
        }
      />

      <Route
        path="/trainer/tasks"
        element={
          userInfo?.role === "trainer" ? <ManageTasks /> : <Navigate to="/" />
        }
      />

      <Route
        path="/trainer/submissions"
        element={
          userInfo?.role === "trainer" ? (
            <ManageSubmissions />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/trainer/trainees"
        element={
          userInfo?.role === "trainer" ? <TraineeList /> : <Navigate to="/" />
        }
      />

      <Route
        path="/trainee"
        element={
          userInfo?.role === "trainee" ? <TraineeDashboard /> : <Navigate to="/" />
        }
      />

      <Route
        path="/task/:id"
        element={userInfo ? <TaskDetails /> : <Navigate to="/" />}
      />

      <Route
        path="/task/:id/submit"
        element={
          userInfo?.role === "trainee" ? <SubmitTask /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
}

export default AppRoutes;