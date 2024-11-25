import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

const Header = () => {
    const location = useLocation();

    // Função para renderizar o conteúdo para Login e Register
    const renderContentForLoginAndRegister = () => (
        <div style={{ ...styles.container, ...styles.loginRegisterContainer }}>
            <h1 style={{ ...styles.title, ...styles.loginRegisterTitle }}>Your Novel</h1>
            <div style={styles.socialIcons}>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <FaTwitter style={styles.icon} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram style={styles.icon} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebook style={styles.icon} />
                </a>
            </div>
        </div>
    );

    // Função para renderizar o conteúdo padrão do Header
    const renderContentForMainScreens = () => (
        <div style={{ ...styles.container, ...styles.mainContainer }}>
            <h1 style={{ ...styles.title, ...styles.mainTitle }}>Your Novel</h1>
            <div style={styles.logoutContainer}>
                <span style={styles.logoutText} onClick={handleLogout}>
                    Logout
                </span>
            </div>
        </div>
    );

    // Função para lidar com o logout
    const handleLogout = () => {
        // Redirecione para a tela de login ou limpe dados de sessão
        window.location.href = '/login';
    };

    // Verifica se a página atual é Login ou Register
    if (location.pathname === '/login' || location.pathname === '/register') {
        return renderContentForLoginAndRegister();
    }

    // Caso contrário, renderiza o conteúdo padrão do Header
    return renderContentForMainScreens();
};

// Estilos do Header ajustados
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 20px',
        height: '60px',
    },
    title: {
        fontSize: '55px',
        fontWeight: 'bold',
        fontFamily: '"Chewy", sans-serif',
    },
    socialIcons: {
        display: 'flex',
        gap: '15px',
    },
    icon: {
        fontSize: '20px',
        color: '#7e005f',
        cursor: 'pointer',
        transition: 'color 0.3s',
    },
    logoutContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logoutText: {
        fontSize: '20px',
        color: '#fff', // Cor branca para o texto de Logout
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'underline',
        transition: 'color 0.3s',
    },
    // Estilos específicos para Login e Register
    loginRegisterContainer: {
        backgroundColor: '#fff', // Fundo branco
    },
    loginRegisterTitle: {
        color: '#7e005f', // Título colorido
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    },
    // Estilos específicos para as telas principais
    mainContainer: {
        backgroundColor: '#7e005f', // Fundo colorido
    },
    mainTitle: {
        color: '#fff', // Título branco
    },
};

export default Header;
