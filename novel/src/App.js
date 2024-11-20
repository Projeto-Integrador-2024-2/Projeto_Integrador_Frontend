import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Login from "./login";
import ProtectedRoute from "./services/ProtectedRoute";
import React from "react";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de Login - acessível para todos */}
        <Route path="/login" element={<Login />} />
        
        {/* Página protegida */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
