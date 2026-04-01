import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      alert("Error registering user");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRegister();
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
        width: "90%",
        maxWidth: "380px",
        padding: "30px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>

        <h2 style={{ marginBottom: "20px" }}>Create Account</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none"
          }}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
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
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#1890ff",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Register
        </button>

        <p
          onClick={() => navigate("/")}
          style={{
            marginTop: "15px",
            color: "#25d366",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Already have an account? Login
        </p>

      </div>
    </div>
  );
}

export default Register;