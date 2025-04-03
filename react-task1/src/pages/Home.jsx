import React from "react";
import { useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";

function Home(){
  const navigate=useNavigate();
  const [username, setUsername] = useState("");
  useEffect(()=>{
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/"); // Redirect to login if no username is found
    } else {
      setUsername(storedUsername); // Set the username from local storage
    }
  },[navigate]); 
  const handleLogout=()=>{
    navigate("/");
  };
  return (
    <div style={{ textAlign: "center", marginTop: "300px" }}>
      <h2>Welcome {username}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
export default Home;