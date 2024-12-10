import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom'; // Adicionando useNavigate
import { FaTwitter, FaInstagram, FaFacebook, FaUser } from 'react-icons/fa';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Hook de navegação
    const [menuOpen, setMenuOpen] = useState(false); // Controle do estado do menu suspenso

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
            {/* Ícone de perfil */}
            <div style={styles.profileContainer}>
                <FaUser 
                    style={styles.profileIcon} 
                    onClick={() => setMenuOpen(!menuOpen)} // Alterna o estado do menu
                />
                {menuOpen && (
                    <div style={styles.dropdownMenu}>
                        <div
                            style={styles.menuItem}
                            onClick={() => {
                                setMenuOpen(false); // Fecha o menu
                                navigate('/profile'); // Redireciona para a página de perfil
                            }}
                        >
                            Perfil
                        </div>
                        <div style={styles.menuItem}>Settings</div>
                        <div style={styles.menuItem} onClick={handleLogout}>Logout</div>
                    </div>
                )}
            </div>
        </div>
    );


    // Função para lidar com o logout
    const handleLogout = () => {
        // Redireciona para a tela de login e limpa dados de sessão
        Cookies.remove('refreshToken');
        Cookies.remove('accessToken');
        window.location.href = '/login'; // Redireciona para a página de login
    };

    // Função para redirecionar para a página de perfil
    const handleProfileClick = () => {
        navigate('/profile'); // Usando o hook useNavigate para navegar para a tela de perfil
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
    profileContainer: {
        position: 'relative', // Para o menu suspenso aparecer em relação ao ícone
    },
    profileIcon: {
        fontSize: '30px',
        color: '#fff',
        cursor: 'pointer',
        transition: 'color 0.3s',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '35px',
        right: '0',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        width: '180px',
        zIndex: 10,
        opacity: 1,
        animation: 'fadeIn 0.3s ease-out', // Animação para abrir o menu
    },
    menuItem: {
        padding: '12px 16px', // Maior padding para espaçamento entre itens
        cursor: 'pointer',
        transition: 'background-color 0.3s, padding-left 0.2s',
    },
    menuItemHover: {
        backgroundColor: '#f1f1f1',
        paddingLeft: '20px', // Efeito de deslocamento à esquerda no hover
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
