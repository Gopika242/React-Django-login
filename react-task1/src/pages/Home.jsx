import React from "react";
import { useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
// import { useState } from "react";

function Home(){
  const navigate=useNavigate();
  const [username, setUsername] = useState("");
  useEffect(()=>{
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/"); 
    } else {
      setUsername(storedUsername); 
    }
  },[navigate]); 
  const handleLogout=()=>{
    navigate("/");
  };
  return (
    <div>
      <Navbar />
    <div style={{ textAlign: "center", marginTop: "300px" }}>
      <h2>Welcome {username}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
    </div>
  );
}
export default Home;