import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../api_access';
import './styles/ProfileEdit.css'; // Importar o CSS

const ProfileEdit = () => {
  const [user, setUser] = useState({ id: null, username: '', email: '', password: '', description: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        console.error('Usuário não autenticado.');
        navigate('/login');
        return;
      }

      try {
        const userResponse = await api.get('/list/user/current', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userData = userResponse.data;
        if (userData) {
          let description = '';
          try {
            const descriptionResponse = await api.get(`/list/description?user_id=${userData.id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            description = descriptionResponse.data[0].description || '';
          } catch (descError) {
            console.error('Erro ao buscar descrição:', descError.response?.data || descError.message);
          }
          setUser({
            id: userData.id,
            username: userData.username || '',
            email: userData.email || '',
            password: '',
            description: description,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error.response?.data || error.message);
        setError('Erro ao carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      console.error('Usuário não autenticado.');
      return;
    }

    if (!user.id) {
      console.error('ID do usuário não definido.');
      setError('Erro ao atualizar: ID do usuário não definido.');
      return;
    }

    if (user.password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    const payload = {
      username: user.username || undefined,
      email: user.email || undefined,
      password: user.password || undefined,
      description: user.description || undefined,
    };

    try {
      const response = await api.patch(`/update/user?id=${user.id}`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        console.log('Usuário atualizado com sucesso!');
        setSuccessMessage('Perfil atualizado com sucesso!');
        setTimeout(() => navigate('/profile'), 2000);
      }
    } catch (error) {
      console.error('Erro ao atualizar os dados do usuário:', error.response?.data || error.message);
      setError('Erro ao atualizar os dados do usuário.');
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (loading) return <p>Carregando dados do usuário...</p>;

  if (error) return <p className="errorText">{error}</p>;

  return (
    <div className="page">
      <div className="titleContainer">
        <h1 className="title">Editar Perfil</h1>
      </div>
      <div className="formContainer">
        {successMessage && <p className="successText">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="form">
          <label className="label">Nome de Usuário:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            className="input"
          />

          <label className="label">Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className="input"
          />

          <label className="label">Nova Senha:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            className="input"
          />

          <label className="label">Confirme sua Nova Senha:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="input"
          />

          <label className="label">Descrição:</label>
          <textarea
            name="description"
            value={user.description}
            onChange={handleInputChange}
            className="textarea"
          />

          <div className="buttonContainer">
            <button type="button" onClick={handleCancel} className="cancelButton">
              Cancelar
            </button>
            <button type="submit" className="saveButton">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
