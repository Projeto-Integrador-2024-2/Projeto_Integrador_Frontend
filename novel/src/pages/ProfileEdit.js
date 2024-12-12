import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../api_access';

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

  if (error) return <p style={styles.errorText}>{error}</p>;

  return (
    <div style={styles.page}>
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>Editar Perfil</h1>
      </div>
      <div style={styles.formContainer}>
        {successMessage && <p style={styles.successText}>{successMessage}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Nome de Usuário:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            style={styles.input}
          />

          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            style={styles.input}
          />

          <label style={styles.label}>Nova Senha:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            style={styles.input}
          />

          <label style={styles.label}>Confirme a Nova Senha:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            style={styles.input}
          />

          <label style={styles.label}>Descrição:</label>
          <textarea
            name="description"
            value={user.description}
            onChange={handleInputChange}
            style={styles.textarea}
          />

          <div style={styles.buttonContainer}>
            <button type="button" onClick={handleCancel} style={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" style={styles.saveButton}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: "#fff0f8",
    paddingTop: '40px',
  },
  titleContainer: {
    width: '40%',
    height: '30px',
    backgroundColor: '#f7d0e5',
    padding: '20px',
    borderRadius: '8px 8px 0 0',
    boxShadow: '0 0px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    marginTop: '-90px',
  },
  formContainer: {
    width: '40%',
    backgroundColor: '#fce1f0',
    padding: '20px',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    marginTop: '4px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    marginBottom: '8px',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0px',
    fontSize: '16px',
    height: '100px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'none',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  saveButton: {
    backgroundColor: '#7e005f',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  cancelButton: {
    backgroundColor: '#fc97e3',
    color: '#ffff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  successText: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
};

export default ProfileEdit;
