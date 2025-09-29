import React, { useState, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ emailOrMobile: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", {
        email: form.emailOrMobile,
        mobile: form.emailOrMobile,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      navigate("/game");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  const handleGuest = () => {
    localStorage.setItem("guest", "true");
    navigate("/game");
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>

      <button onClick={handleGuest} style={{ margin: "10px" }}>
        Continue as Guest
      </button>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <input
          name="emailOrMobile"
          type="text"
          placeholder="Email or Mobile"
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit" style={{ marginTop: "10px" }}>
          Login
        </button>
      </form>

      <button onClick={goToSignup} style={{ marginTop: "20px" }}>
        Don't have an account? Sign Up
      </button>
    </div>
  );
};

export default Login;
