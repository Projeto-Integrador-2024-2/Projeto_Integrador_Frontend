import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api_access';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('create/user', { username, password });
            if (response.status === 201) {
                // Redireciona para a página de login após o sucesso
                window.location.href = '/login';
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert('O nome de usuário já está em uso. Por favor, escolha outro.');
            } else {
                console.error(error);
            }
        }
    };

    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundImage: `url('/images/2.png'), linear-gradient(to right, transparent 40%, #ff00d6)`,
            backgroundBlendMode: 'overlay',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: '"Poppins", sans-serif',
            paddingTop: '20px',
        },
        title: {
            fontSize: '60px',
            fontWeight: 'bold',
            color: '#ff00ff',
            marginBottom: '10px',
            textAlign: 'center', // Centraliza o texto
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            fontFamily: '"Chewy", sans-serif',
            position: 'absolute', // Permite personalizar a posição
            top: '10%', // Move para o topo da tela
            left: '50%', // Centraliza horizontalmente
            transform: 'translate(-50%, -50%)', // Corrige o alinhamento central
            display: 'flex',
            alignItems: 'center',
            gap: '10px', // Espaçamento entre o texto e a imagem
        },
        formContainer: {
            width: '25%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 171, 226)',
            borderRadius: '20px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
            padding: '40px',
            marginRight: '5%',
            marginLeft: '5%', // Adiciona um pequeno deslocamento à esquerda
        },
        inputLabel: {
            display: 'block',
            fontWeight: 'bold',
            marginBottom: '5px',
            fontFamily: '"Poppins", sans-serif',
        },
        inputField: {
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            outline: 'none',
            boxShadow: 'inset 0px 2px 5px rgba(0, 0, 0, 0.1)',
            fontFamily: '"Poppins", sans-serif',
        },
        submitButton: {
            width: '100%',
            padding: '12px',
            borderRadius: '35px',
            backgroundColor: '#fff', // Cor do fundo do botão em branco
            color: '#7e005f', // Cor do texto do botão em rosa
            fontWeight: 'bold',
            border: 'none',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            fontSize: '16px',
            fontFamily: '"Poppins", sans-serif',
        },
        signupText: {
            fontSize: '14px',
            color: '#555',
            fontFamily: '"Poppins", sans-serif',
        },
        signupLink: {
            color: '#7e005f',
            fontWeight: 'bold',
            fontFamily: '"Poppins", sans-serif',
        },
        loginTitle: {
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#7e005f',
            marginBottom: '20px', // Distância maior entre o título e o formulário
            fontFamily: '"Signika Negative", sans-serif', // Fonte usada aqui
            textAlign: 'center',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h1 style={styles.title}>
                    <span style={{ color: 'white' }}>YOUR</span>{' '}
                    <span style={{ color: '#7e005f' }}>NOVEL</span>{' '}
                    <img src="/images/coracao.png" alt="coração" style={{ width: '65px', height: 'auto' }} />
                </h1>
                <h2 style={styles.loginTitle}>Create Your Account</h2>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={styles.inputLabel}>Username :</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            style={styles.inputField}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={styles.inputLabel}>Password :</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            style={styles.inputField}
                            required
                        />
                    </div>
                    <button type="submit" style={styles.submitButton}>
                        REGISTER
                    </button>
                </form>
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={styles.signupText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.signupLink}>
                            Login now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
