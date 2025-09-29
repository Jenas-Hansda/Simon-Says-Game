import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Game from "./pages/Game";

// PrivateRoute component to protect routes that need auth
const PrivateRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("token")); // simple auth check
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Redirect root to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected route */}
      <Route
        path="/game"
        element={
          <PrivateRoute>
            <Game />
          </PrivateRoute>
        }
      />

      {/* Catch-all route for 404 redirects to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
