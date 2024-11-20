import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Login from "./Login";
import Header from "./Header";
import Register from "./Register";
import Project from "./Project";
import ProtectedRoute from "../services/ProtectedRoute";
import React from "react";

function App() {
  return (
    <Router>
      {/* O Header estará sempre visível */}
      <Header /> 

      <Routes>
        {/* Página de Login - acessível para todos */}
        <Route path="/login" element={<Login />} />

        {/* Página de Registro - acessível para todos */}
        <Route path="/register" element={<Register />} /> {/* Adiciona a rota de registro */}

        {/* Página de Registro - acessível para todos */}
        <Route path="/project" element={<Project />} /> {/* Adiciona a rota de registro */}

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
