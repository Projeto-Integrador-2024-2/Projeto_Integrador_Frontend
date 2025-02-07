import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Login from "./Login";
import Header from "./Header";
import Register from "./Register";
import ProjectPage from "./ProjectPage";
import ScenePage from "./ScenePage";
import SceneCreate from "./SceneCreate";
import ProjectView from "./ProjectView";
import './styles/styles.css';
import ProtectedRoute from "../services/ProtectedRoute";
import React from "react";
import Profile from "./Profile";
import ProfileEdit from "./ProfileEdit";
import ProjectCreate from "./ProjectCreate";

//import "slick-carousel/slick/slick.css"; 
//import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <div className="app-container">
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
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/edit" 
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/create" 
            element={
              <ProtectedRoute>
                <ProjectCreate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/view/:projectId" 
            element={
              <ProtectedRoute>
                <ProjectView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scene/:sceneId" 
            element={
              <ProtectedRoute>
                <ScenePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scene/create" 
            element={
              <ProtectedRoute>
                <SceneCreate />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
