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

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = Cookies.get("accessToken");
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

  const handleNewProject = () => {
    navigate("/project/create");
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
        </div>
      </div>
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
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginTop: "50px",
    marginLeft: "50px",
    width: "80%",
    padding: "10px 0",
  }
};

export default Profile;
