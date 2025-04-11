// Note.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import "./notes.css";
import { Edit3, Trash2, Filter, XCircle } from "lucide-react";
import Swal from "sweetalert2";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", status: "" });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedNote, setEditedNote] = useState({ title: "", content: "", status: "" });
  const [error, setError] = useState("");
  const [filterUsername, setFilterUsername] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("access");

  const fetchNotes = async () => {
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/notes_post/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notesWithStatus = response.data.data?.map(note => ({
        ...note,
        status: note.status || "Unknown",
      })) || [];
      setNotes(notesWithStatus);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch notes.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/notes_post/", newNote, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewNote({ title: "", content: "", status: "" });
      fetchNotes();
      setIsModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Note Created",
        text: "Your note was successfully added!",
      });
    } catch (err) {
      console.error("Create error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to create note.",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/notes/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Note deleted successfully!",
      });
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to delete note.",
      });
    }
  };

  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditedNote({
      title: note.title,
      content: note.content,
      status: note.status || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/notes/${editingNoteId}/`, editedNote, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingNoteId(null);
      setEditedNote({ title: "", content: "", status: "" });
      fetchNotes();
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Note was successfully updated!",
      });
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to update note.",
      });
    }
  };

  const fetchFilteredNotes = async () => {
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/filter-notes/", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          username: filterUsername,
          status: filterStatus,
        },
      });
      setNotes(response.data);
    } catch (err) {
      console.error("Filter error:", err);
      setError("Failed to fetch filtered notes.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="fixed left-0 top-0 h-screen w-64 sidebar">
        <Sidebar />
      </div>
      <div className="flex-1 content">
        <div className="fixed top-0 left-0 w-full navbar z-10">
          <Navbar />
        </div>
        <div className="p-6 mt-16 ml-64">
          <h1 className="text-2xl font-bold mb-4">Notes</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Filter Section */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Filter by Username"
              value={filterUsername}
              onChange={(e) => setFilterUsername(e.target.value)}
              className="border p-2 mr-2"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border p-2 mr-2"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="inprogress">In Progress</option>
            </select>
            <div className="flex gap-4 mt-4">
              <button
                onClick={fetchFilteredNotes}
                className="bg-blue-800 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                Apply Filter <Filter size={18} />
              </button>
              <button
                onClick={() => {
                  setFilterUsername("");
                  setFilterStatus("");
                  fetchNotes();
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                Clear Filter <XCircle size={18} />
              </button>
            </div>
          </div>

          {/* Add Note Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
          >
            Add Note
          </button>

          {/* Notes List */}
          {Array.isArray(notes) && notes.length > 0 ? (
            <div className="notes-container">
              {notes.map((note) => (
                <div key={note.id} className="note-card">
                  {editingNoteId === note.id ? (
                    <>
                      <input
                        type="text"
                        value={editedNote.title}
                        onChange={(e) =>
                          setEditedNote({ ...editedNote, title: e.target.value })
                        }
                        className="border p-1 mb-2 w-full"
                      />
                      <input
                        type="text"
                        value={editedNote.content}
                        onChange={(e) =>
                          setEditedNote({ ...editedNote, content: e.target.value })
                        }
                        className="border p-1 mb-2 w-full"
                      />
                      <select
                        value={editedNote.status || ""}
                        onChange={(e) =>
                          setEditedNote({ ...editedNote, status: e.target.value })
                        }
                        className="border p-1 mb-2 w-full"
                      >
                        <option value="">Select Status</option>
                        <option value="completed">Completed</option>
                        <option value="inprogress">In Progress</option>
                      </select>
                      <div className="flex justify-between">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg font-semibold mb-1">{note.title}</h2>
                      <p className="mb-2">{note.content}</p>
                      <p className="text-sm text-gray-600 mb-2">{note.status}</p>
                      <p className="text-sm text-gray-600 mb-2">By: {note.username || "Unknown"}</p>
                      <div className="flex flex-row items-center gap-4 mt-auto">
                        <button
                          onClick={() => startEditing(note)}
                          className="bg-yellow-400 text-white px-2 py-1 rounded"
                        >
                          Edit <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete <Trash2 size={15} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No notes found.</p>
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
              onClick={() => setIsModalOpen(false)}
            >
              <XCircle />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Add New Note</h2>
            <form onSubmit={handleCreate} className="flex flex-col space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              {/* Content Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <input
                  type="text"
                  placeholder="Content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newNote.status}
                  onChange={(e) => setNewNote({ ...newNote, status: e.target.value })}
                  className="border p-2 w-full rounded"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="completed">Completed</option>
                  <option value="inprogress">In Progress</option>
                </select>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
              >
                Save Note
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Note;
