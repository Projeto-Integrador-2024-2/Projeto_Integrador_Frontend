import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import api from '../api_access';
import { ProjectBlock2 }  from "./ProjectBlock";

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
        const response = await api.get("/list/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Verifique a resposta da API
        console.log("Resposta da API:", response);

        // Supondo que a resposta seja um array de usuários
        const profileData = response.data[0]; // Pegando o primeiro usuário

        // Verifique se o usuário existe e se possui o campo 'username'
        if (profileData && profileData.username) {
          setProfile({
            name: profileData.username || "Nome indisponível", // Usando 'username' ao invés de 'name'
            description: profileData.description || "Nenhuma descrição disponível.", // Caso não haja descrição
          });
        } else {
          console.error("Dados de perfil não encontrados:", profileData);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error.response?.data || error.message);
      }
    };

    fetchProfile();

    const fetchProjects = async () => {
      const accessToken = Cookies.get("accessToken");
      try {
        const response = await api.get("list/project", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data)
        setProjects(response.data); 
      } catch (err) {
        console.error("Erro ao buscar projetos:", err.response?.data || err.message);
        setError("Não foi possível carregar os projetos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleEditProfile = () => {
    navigate("/profile/edit"); // Redireciona para a página de edição de perfil
  };

  if (!profile) {
    return <p style={styles.loadingText}>Carregando informações do perfil...</p>;
  }

  const handleNewNovelClick = () => {
    navigate("/project/create"); // Redireciona para o caminho especificado
  };

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
            {profile.name.charAt(0).toUpperCase()} {/* Exibe a inicial do nome */}
          </div>
          <h1 style={styles.name}>{profile.name}</h1>
          <p style={styles.info}>{profile.description}</p>
          <button style={styles.button} onClick={handleEditProfile}>
            Editar Perfil
          </button>
        </div>
        <div style={styles.rightSection}>
          <p style={styles.details}>
            Aqui você pode exibir informações adicionais, como histórico, atividades recentes ou outras funcionalidades do perfil.
          </p>
        </div>
      </div>

      <div style={styles.container}>
        {/* Bloco "NEW NOVEL" */}
        <div style={styles.newProject} onClick={handleNewNovelClick}>
          <div style={styles.plusIcon}>+</div>
        </div>
        <p style={styles.newText}>NEW NOVEL</p> {/* Texto fora do bloco, abaixo */}

        {/* Blocos de projetos */}
        <div style={styles.projectsContainer}>
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
  );
};

// Estilos para a página
const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '90px 20px',
  },
  container: {
    display: 'flex',
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
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
  details: {
    fontSize: '16px',
    color: '#333',
    lineHeight: '1.5',
  },
  loadingText: {
    fontSize: '18px',
    color: '#333',
    fontWeight: 'bold',
  },
  newText: {
    marginTop: "0.5px", // Ajuste para mover o texto para baixo do bloco
    marginLeft: "22px", // Ajuste para mover o texto para a direita
    color: "#000000", // Cor do texto "NEW NOVEL" com correspondência ao bloco
    fontWeight: "bold",
    textAlign: "left", // Alinha o texto à esquerda para o efeito de deslocamento para a direita
    fontFamily: '"Poppins", sans-serif',
  },
  plusIcon: {
    fontSize: "100px", // Aumenta o tamanho do ícone
    fontWeight: "bold", // Torna o ícone mais grosso (se o ícone suportar)
    color: "#ffff",
    position: "absolute", // Centraliza o ícone dentro do bloco
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  newProject: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eda1d5",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    width: "100px",
    height: "100px",
    position: "relative", // Para manter o ícone centralizado dentro do bloco
    marginTop: "15px",
  },
  projectsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    justifyContent: "center",
    width: "100%",
  }, 
};

export default Profile;
