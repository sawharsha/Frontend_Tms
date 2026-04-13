import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrainerLayout from "../layouts/TrainerLayout";
import Loader from "../components/Loader";
import { fetchTrainees } from "../service/store";

function TraineeList() {
  const dispatch = useDispatch();

  const { trainees, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTrainees());
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
          <h2 className="text-3xl font-bold text-slate-800">Trainee List</h2>
          <p className="text-gray-500 mt-2">
            View all registered trainees in the system.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {trainees.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border shadow-sm text-gray-500">
            No trainees found.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-100 font-semibold text-slate-700 p-4 gap-4">
              <p>Name</p>
              <p>Email</p>
              <p>Role</p>
            </div>

            {trainees.map((trainee) => (
              <div
                key={trainee._id}
                className="grid grid-cols-3 p-4 border-t text-slate-700 gap-4 items-center"
              >
                <p className="break-words">{trainee.name}</p>

                <p
                  className="max-w-[320px] truncate"
                  title={trainee.email}
                >
                  {trainee.email}
                </p>

                <p className="capitalize break-words">{trainee.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </TrainerLayout>
  );
}

export default TraineeList;