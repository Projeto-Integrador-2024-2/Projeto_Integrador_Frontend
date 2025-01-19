import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import api from '../api_access';
import { ProjectBlock2 } from "./ProjectBlock";
import './styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null); // Estado para armazenar dados do perfil
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); // Estado para controlar se a galeria está aberta
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) {
        console.error("Token de acesso não encontrado");
        return;
      }

      try {
        const userResponse = await api.get("/list/user/current", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const profileData = userResponse.data;

        if (profileData) {
          let description = "Nenhuma descrição disponível.";

          try {
            const descriptionResponse = await api.get(`/list/description?user_id=${profileData.id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            description = descriptionResponse.data[0].description || description;
          } catch (descError) {
            console.error("Erro ao buscar descrição:", descError.response?.data || descError.message);
          }

          setProfile({
            name: profileData.username || "Nome indisponível",
            description: description,
          });
        } else {
          console.error("Dados de perfil não encontrados:", profileData);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error.response?.data || error.message);
      }
    };

    const fetchProjects = async () => {
      const accessToken = Cookies.get("accessToken");
      try {
        const response = await api.get("list/project", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const updatedProjects = response.data.map(project => {
          if (project.first_scene === null) {
            project.first_scene = {
              url_background: "-"
            };
          }
          return project;
        });
        setProjects(updatedProjects)
      } catch (err) {
        console.error("Erro ao buscar projetos:", err.response?.data || err.message);
        setError("Não foi possível carregar os projetos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchProjects();
  }, []);

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const handleNewProject = async () => {
    const projectData = {
      name: "Novo Projeto",
      privacy: true, // Altere conforme os campos esperados pelo backend
      genres: [],
    };
  
    try {
      const response = await api.post("/create/project", projectData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      });
  
      alert("Novo Projeto Criado!")
  
      // Recarregar a página
      window.location.reload(); // Isso vai recarregar a página inteira
      
    } catch (error) {
      console.error("Erro ao criar projeto:", error.response?.data || error.message);
      alert("Não foi possível criar o projeto.");
    }
  };

  const toggleGallery = () => {
    setIsGalleryOpen(!isGalleryOpen);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  if (!profile) {
    return <p className="loadingText">Carregando informações do perfil...</p>;
  }

  if (loading) {
    return <p>Carregando projetos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container1">
        <div className="profile-leftSection">
          <div className="profile-avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-info">{profile.description}</p>
          <button className="profile-button" onClick={handleEditProfile}>Editar Perfil</button>
          <button className="profile-button" onClick={handleNewProject}>New Project</button>
        </div>
        <div className="profile-rightSection">
          <div className="profile-projectsContainer">
            {/* Exibindo no máximo 3 blocos de projetos */}
            {projects.slice(0, 3).map((project) => (
              <ProjectBlock2
                key={project.id}
                id={project.id}
                name={project.name}
                imageUrl={project.first_scene.url_background}
              />
            ))}
          </div>
          <button className="profile-viewMoreButton" onClick={toggleGallery}>
            {isGalleryOpen ? "Fechar Galeria" : "Ver Mais"}
          </button>
        </div>
      </div>

      {isGalleryOpen && (
        <div className="profile-galleryPopup">
          <div className="profile-galleryContainer">
            {/* Botão para fechar o popup dentro da galeria */}
            <button className="profile-closeButton" onClick={closeGallery}>X</button>
            {/* Exibição dos projetos dentro da galeria */}
            {projects.map((project) => (
              <ProjectBlock2
                key={project.id}
                id={project.id}
                name={project.name}
                imageUrl={project.first_scene.url_background}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
