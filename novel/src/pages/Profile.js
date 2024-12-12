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
    // Busca de dados do perfil a partir do backend
    const fetchProfile = async () => {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        console.error("Token de acesso não encontrado");
        return;
      }
      
      try {
        // Busca o perfil associado ao token
        const userResponse = await api.get("/list/user/current", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        const profileData = userResponse.data; // Pegando o primeiro usuário

        if (profileData) {
          let description = "Nenhuma descrição disponível.";

          // Busca a descrição associada ao usuário
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
        //console.log(response.data);
        setProjects(response.data); 
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
    navigate("/profile/edit"); // Redireciona para a página de edição de perfil
  };

  const handleNewProject = () => {
    navigate("/project/create"); // Redireciona para a página de criação de projeto
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

  const settings = {
    dots: true, // Exibe pontos de navegação
    infinite: true, // Habilita o loop infinito
    speed: 500, // Velocidade da transição
    slidesToShow: 1, // Número de slides visíveis por vez
    slidesToScroll: 1, // Número de slides a serem rolados por vez
    autoplay: true, // Ativa o autoplay
    autoplaySpeed: 2000, // Intervalo do autoplay (em milissegundos)
    arrows: true, // Habilita setas de navegação
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <div style={styles.avatar}>
            {profile.name.charAt(0).toUpperCase()} {/* Exibe a inicial do nome */}
          </div>
          <h1 style={styles.name}>{profile.name}</h1>
          <p style={styles.info}>{profile.description}</p>
          <button style={styles.button} onClick={handleEditProfile}>
            Editar Perfil
          </button>
          <button style={styles.button} onClick={handleNewProject}> {/* Redireciona para a criação de projeto */}
            New Project
          </button>
        </div>
        <div style={styles.rightSection}>
          <div style={styles.projectsContainer}>
            {/* Blocos de projetos */}
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
      </div>
    </div>
  );
};

// Estilos para a página
const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderRight: '1px solid #ddd',
  },
  rightSection: {
    flex: '70%',
    padding: '20px',
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
    justifyContent: "center",  // Alinha os itens horizontalmente no centro
    flexWrap: "wrap",          // Permite que os itens que não cabem na linha sejam movidos para a próxima linha
    gap: "16px",               // Espaço entre os itens
    marginTop: "50px",
    marginLeft: "50px",
    width: "80%",              // Pode ajustar conforme necessário
    padding: "10px 0",         // Ajuste de padding conforme necessário
  }
};

export default Profile;
