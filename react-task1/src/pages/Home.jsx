import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import "./Dashboard.css"; 
import "./Home.css"; 

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [counts, setCounts] = useState({
    total_notes: 0,
    completed_notes: 0,
    inprogress_notes: 0,
  });
  const [error, setError] = useState("");

  const token = localStorage.getItem("access");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/");
    } else {
      setUsername(storedUsername);
    }

    // Fetch the counts
    fetchNotesCounts();
  }, [navigate]);

  const fetchNotesCounts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/notes-count/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCounts(data);
    } catch (err) {
      console.error("Error fetching counts:", err);
      setError("Failed to fetch notes counts.");
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="home-container">
      <Navbar />
      <Sidebar />

      <div className="home-content">
      <div className="welcome-section">
  <h2>Welcome {username}</h2>
  <button onClick={handleLogout}>Logout</button>
</div>

        <div className="dashboard-container">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h2>Total Notes</h2>
              <p>{counts.total_notes}</p>
            </div>

            <div className="dashboard-card">
              <h2>Completed Notes</h2>
              <p>{counts.completed_notes}</p>
            </div>

            <div className="dashboard-card">
              <h2>In Progress Notes</h2>
              <p>{counts.inprogress_notes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
