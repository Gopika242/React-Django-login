import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Stores username
  const [password, setPassword] = useState(""); // Stores password
  const [captchaVerified, setCaptchaVerified] = useState(false); // CAPTCHA status

  const validUser = { username: "gopika", password: "pass123" }; // Hardcoded user

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!captchaVerified) {
      alert("Please verify CAPTCHA!");
      return;
    }
    try{
      const response=await axios.post("http://127.0.0.1:8000/api/login/",{
        username: username,
        password: password,
      })
      if (response.status==200){
        alert("Login successful!");
        localStorage.setItem("username",username);
        navigate("/home");
      }
    }catch(error){
      setError("Invalid credentials!")
    }
};

  return (
    <div style={{ textAlign: "center", marginTop: "200px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required style={{ width: "300px",height:"40px",borderRadius: "15px"}}
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required style={{ width: "300px",height:"40px",borderRadius: "15px",}}
        />
        <br /><br />
        <div style={{ marginBottom: "15px", display: "flex", justifyContent: "center" }}>
           <ReCAPTCHA
            sitekey="6LcRWgcrAAAAABCVrrPG13WDpc0YgxBlBRK7y9jv"
            onChange={() => setCaptchaVerified(true)}
          /></div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
