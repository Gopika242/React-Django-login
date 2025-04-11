import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home"; 
import Profile from './pages/profile.jsx'; 
import Note from './pages/notes.jsx';
import Dashboard from './pages/dashboard.jsx';
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile/>}></Route>
      <Route path="/notes" element={<Note/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
    </Routes>
  );
}

export default App;
