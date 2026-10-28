import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>CloudVault Dashboard</h1>

      <p>Welcome, {user.name}</p>

      <p>Email: {user.email}</p>

      <button>Upload File</button>

      <button>New Folder</button>

      <button onClick={handleLogout}>
        Logout
      </button>

      <h2>My Files</h2>

      <p>No files uploaded yet.</p>
    </div>
  );
}

export default Dashboard;