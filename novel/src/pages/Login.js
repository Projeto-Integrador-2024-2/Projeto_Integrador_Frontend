import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api_access';
import Cookies from 'js-cookie';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('token/', {
                username,
                password
            });
            if (response.status === 200) {
                const { refresh, access } = response.data;
                Cookies.set('refreshToken', refresh, { expires: 1, sameSite: 'none', secure: true });
                Cookies.set('accessToken', access, { expires: 1, sameSite: 'none', secure: true });
                window.location.href = '/';
            }
        } catch (error) {
            console.error(error);
        }
    };

    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end', // Alinha o conteúdo à direita
            minHeight: '100vh',
            backgroundImage: `url('/images/2.png'), linear-gradient(to right, transparent 40%, #ff00d6)`,
            backgroundBlendMode: 'overlay',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: '"Poppins", sans-serif', // Aplica a fonte 'Poppins' globalmente
            paddingTop: '20px', // Reduz o padding superior
        },
        title: { 
            fontSize: '60px',
            fontWeight: 'bold',
            color: '#ff00ff',
            marginBottom: '10px', // Espaço entre o título e o formulário
            textAlign: 'right', // Alinha o título à direita
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            fontFamily: '"Chewy", sans-serif',
            position: 'absolute', // Fixa o título no topo da página
            top: '40px', // Ajuste a distância do topo conforme necessário
            right: '100px', // Alinha o título à direita
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
            {/* Seção à direita */}
            <div style={styles.formContainer}>
                {/* Logo */}
                <h1 style={styles.title}>
                    <span style={{ color: 'white' }}>YOUR
                    </span> <span style={{ color: '#7e005f' }}>NOVEL
                    </span> <img src="/images/coracao.png" alt="coração" style={{ width: '65px', height: 'auto' }} />
                </h1>

                {/* Título de login */}
                <h2 style={styles.loginTitle}>Login To Your Account</h2>

                {/* Formulário */}
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
                        LOGIN
                    </button>
                </form>
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={styles.signupText}>
                        Don't have an account?{' '}
                        <Link to="/register" style={styles.signupLink}>
                            Sign Up now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
