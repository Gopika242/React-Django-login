import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
    const [counts, setCounts] = useState({
        total_notes: 0,
        completed_notes: 0,
        inprogress_notes: 0,
    });
    const [error, setError] = useState('');
    const token = localStorage.getItem('access');

    const fetchNotesCounts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/notes-count/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCounts(response.data);
        } catch (err) {
            console.error("Error fetching notes counts:", err);
            setError("Failed to fetch notes counts.");
        }
    };

    useEffect(() => {
        fetchNotesCounts();
    }, []);

    return (
        <div className="min-h-screen flex">
            <div className="fixed left-0 top-0 h-screen w-64 z-20">
                <Sidebar />
            </div>
            <div className="fixed top-0 left-64 right-0 z-10">
                <Navbar />
            </div>

            <div className="dashboard-container">
  <h1 className="dashboard-title">Dashboard</h1>

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
    );
}

export default Dashboard;
