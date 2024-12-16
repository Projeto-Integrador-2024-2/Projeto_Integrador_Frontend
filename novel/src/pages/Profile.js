import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import api from '../api_access';
import { ProjectBlock2 } from "./ProjectBlock";

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
    return <p style={styles.loadingText}>Carregando informações do perfil...</p>;
  }

  if (loading) {
    return <p>Carregando projetos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <div style={styles.avatar}>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h1 style={styles.name}>{profile.name}</h1>
          <p style={styles.info}>{profile.description}</p>
          <button style={styles.button} onClick={handleEditProfile}>Editar Perfil</button>
          <button style={styles.button} onClick={handleNewProject}>New Project</button>
        </div>
        <div style={styles.rightSection}>
          <div style={styles.projectsContainer}>
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
          <button style={styles.viewMoreButton} onClick={toggleGallery}>
            {isGalleryOpen ? "Fechar Galeria" : "Ver Mais"}
          </button>
        </div>
      </div>

      {isGalleryOpen && (
        <div style={styles.galleryPopup}>
          <div style={styles.galleryContainer}>
            {/* Botão para fechar o popup dentro da galeria */}
            <button style={styles.closeButton} onClick={closeGallery}>X</button>
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

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: "#fff0f8",
    padding: '0',
    margin: '0',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    marginBottom: '20px',
    position: 'absolute',
    top: '150px',
  },
  leftSection: {
    flex: '30%',
    backgroundColor: '#f7d0e5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderRight: '1px solid #ddd',
  },
  rightSection: {
    flex: '70%',
    padding: '20px',
    backgroundColor: '#fce1f0',
    position: 'relative',
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7e005f',
    color: '#fff',
    fontSize: '50px',
    fontWeight: 'bold',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '20px',
  },
  name: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  info: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '8px',
    textAlign: 'center',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#7e005f',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  loadingText: {
    fontSize: '18px',
    color: '#333',
    fontWeight: 'bold',
  },
  projectsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 3 colunas por linha
    gap: "16px",
    marginTop: "50px",
    marginLeft: "50px",
    width: "80%",
    padding: "10px 0",
  },
  viewMoreButton: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#7e005f',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  galleryPopup: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Cor do fundo do popup, altere para a cor desejada
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: '30px',
    border: 'none',
    cursor: 'pointer',
    zIndex: '1010',
  },
  galleryContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 3 colunas por linha
    gap: "16px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    overflowY: "auto",
    maxHeight: "80vh",
    maxWidth: "90%",
    position: 'relative', // Permite o posicionamento absoluto do X
  },
};

export default Profile;
