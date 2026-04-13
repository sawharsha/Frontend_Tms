import { useDispatch, useSelector } from "react-redux";
import { logout } from "../service/store";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 border-b shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src="\assets\logo.png"
          alt="Sivion Global Technologies Logo"
          className="h-16 object-contain"
        />

        <div>
          <h1 className="text-2xl font-bold text-blue-600">
            Sivion Global Technologies
          </h1>
          <p className="text-sm text-gray-700">
            Task Portal
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {userInfo?.name} ({userInfo?.role})
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;