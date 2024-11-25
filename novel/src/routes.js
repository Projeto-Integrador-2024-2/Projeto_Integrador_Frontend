// adicionando/alterando imports:
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./login";
import Project from "./project";
import isAuthenticated from "./services/auth";

function ProtectedRoutes() {
  return (
    <>
      {
        isAuthenticated() ? (
          <Routes>
            <Route path="/project/" element={<Project />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/project/new/" element={<ProjectNew />} />
            <Route path="/project/:id/edit/" element={<ProjectNew />} />
          </Routes>
        ) : (
          <Navigate to="/login" replace />
        )
      }
    </>
  );
}

export default function MyRoutes() {
  return (
    <Router>
      <div className="container">
        <div className="row-1">
          <br />
          <Nav />
          <br />
          <div className="col-12">
            <Routes>
              <Route path="/project/" element={<Project />} />
              <Route path="/" element={<Principal />} />
              <Route path="/*" element={<ProtectedRoutes />} />
              <Route path="/login/" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
