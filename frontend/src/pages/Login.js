import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/chat");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      
      <div style={{
        width: "350px",
        padding: "30px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>

        <h2 style={{ marginBottom: "20px" }}>Chat App</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown} 
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none"
          }}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#25d366",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Login
        </button>

        <p
          onClick={() => navigate("/register")}
          style={{
            marginTop: "15px",
            color: "#1890ff",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Don’t have an account? Register
        </p>

      </div>
    </div>
  );
}

export default Login;