import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom'; // Adicionando useNavigate
import { FaTwitter, FaInstagram, FaFacebook, FaUser } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5'; // Ícone de seta de voltar
import './styles/Header.css';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Hook de navegação
    const [menuOpen, setMenuOpen] = useState(false); // Controle do estado do menu suspenso

    // Função para renderizar o conteúdo para Login e Register
    const renderContentForLoginAndRegister = () => (
        <div className="header-container login-register-container">
            <h1 className="header-title login-register-title">
                Your Novel
                <img src="/images/coracao_roxo.png" alt="coração roxo" className="header-image" />
            </h1>
            <div className="social-icons">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <FaTwitter className="icon" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="icon" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="icon" />
                </a>
            </div>
        </div>
    );

    // Função para renderizar o conteúdo padrão do Header
    const renderContentForMainScreens = () => (
        <div className="header-container main-container">
            {/* Container para a seta de navegação e o título */}
            {location.pathname !== '/login' && location.pathname !== '/register' && (
                <div className="nav-container">
                    <IoArrowBack 
                        className="back-button" 
                        onClick={() => navigate(-1)} // Navega para a página anterior
                    />
                    <h1 
                        className="header-title main-title" 
                        onClick={() => window.location.href = '/'}
                    >
                        Your Novel
                        <img src="/images/coracao_roxo.png" alt="coração roxo" className="header-image" />
                    </h1>
                </div>
            )}
            {/* Ícone de perfil */}
            <div className="profile-container">
                <FaUser 
                    className="profile-icon" 
                    onClick={() => setMenuOpen(!menuOpen)} // Alterna o estado do menu
                />
                {menuOpen && (
                    <div className="dropdown-menu">
                        <div
                            className="menu-item"
                            onClick={() => {
                                setMenuOpen(false); // Fecha o menu
                                navigate('/profile'); // Redireciona para a página de perfil
                            }}
                        >
                            Perfil
                        </div>
                        <div
                            className="menu-item"
                            onClick={() => {
                                setMenuOpen(false); // Fecha o menu
                                navigate('/profile/edit'); // Redireciona para a tela de edição de perfil
                            }}
                        >
                            Settings
                        </div>
                        <div className="menu-item" onClick={handleLogout}>Logout</div>
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

export default Header;
