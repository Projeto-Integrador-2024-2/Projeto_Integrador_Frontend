import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Login from "./Login";
import Header from "./Header";
import Register from "./Register";
import Scene from "./Scene";
import Choice from "./Choice";
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
        <Route path="/register" element={<Register />} />

        {/* Rotas protegidas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/project" 
          element={
            <ProtectedRoute>
              <Project />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/scene" 
          element={
            <ProtectedRoute>
              <Scene />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/choice" 
          element={
            <ProtectedRoute>
              <Choice />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
