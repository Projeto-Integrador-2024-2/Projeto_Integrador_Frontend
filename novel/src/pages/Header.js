import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom'; // Adicionando useNavigate
import { FaTwitter, FaInstagram, FaFacebook, FaUser } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5'; // Ícone de seta de voltar

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
            {/* Container para a seta de navegação e o título */}
            {location.pathname !== '/login' && location.pathname !== '/register' && (
                <div style={styles.navContainer}>
                    <IoArrowBack 
                        style={styles.backButton} 
                        onClick={() => navigate(-1)} // Navega para a página anterior
                    />
                    <h1 
                        style={{ ...styles.title, ...styles.mainTitle }} 
                        onClick={() => window.location.href = '/'}
                        >Your Novel
                    </h1>
                </div>
            )}
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
                        <div
                            style={styles.menuItem}
                            onClick={() => {
                                setMenuOpen(false); // Fecha o menu
                                navigate('/profile/edit'); // Redireciona para a tela de edição de perfil
                            }}
                        >
                            Settings
                        </div>
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
        cursor: 'pointer', // Adiciona um cursor de ponteiro para indicar que é clicável
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
        animation: 'fadeIn 0.3s ease-out',
    },
    menuItem: {
        padding: '12px 16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, padding-left 0.2s',
    },
    backButton: {
        fontSize: '24px',
        color: '#fff',
        cursor: 'pointer',
        marginRight: '10px', // Ajuste da posição da seta
    },
    navContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    loginRegisterContainer: {
        backgroundColor: '#fff', 
    },
    loginRegisterTitle: {
        color: '#7e005f',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    },
    mainContainer: {
        backgroundColor: '#7e005f',
    },
    mainTitle: {
        color: '#fff',
        marginLeft: '10px', // Espaço entre a seta e o título
    },
};

export default Header;
