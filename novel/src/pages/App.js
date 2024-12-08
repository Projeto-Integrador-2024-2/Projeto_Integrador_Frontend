import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Login from "./Login";
import Header from "./Header";
import Register from "./Register";
import ProjectPage from "./ProjectPage";
import Scene from "../velho/Scene";
import Choice from "../velho/Choice";
import Project from "../velho/Project";

import ProtectedRoute from "../services/ProtectedRoute";
import React from "react";

const globalStyles = {
  margin: 0,
  padding: 0,
  width: '100%',
  height: '100%',
  boxSizing: 'border-box', // Garante que padding e bordas sejam contadas no tamanho total
  overflowX: 'hidden', // Remove barras de rolagem horizontais
};

function App() {
  return (
    <div style={globalStyles}>
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
            path="/project/:projectId" 
            element={
              <ProtectedRoute> 
                <ProjectPage/> 
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
    </div>
  );
}

export default App;
