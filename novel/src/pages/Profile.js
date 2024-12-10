import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import api from '../api_access';

const Profile = () => {
  const [profile, setProfile] = useState(null); // Estado para armazenar dados do perfil
  const navigate = useNavigate();

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
  }, []);

  const handleEditProfile = () => {
    navigate("/profile/edit"); // Redireciona para a página de edição de perfil
  };

  if (!profile) {
    return <p style={styles.loadingText}>Carregando informações do perfil...</p>;
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
};

export default Profile;
