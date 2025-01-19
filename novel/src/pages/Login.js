import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api_access';
import Cookies from 'js-cookie';
import './styles/Login.css';

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
            if (error.response && (error.response.status === 400 || error.response.status === 401)) {
                alert('Usuário ou senha incorretos. Por favor, tente novamente.');
            } else {
                console.error(error);
            }
        }
    };

    return (
        <div className="login-container">
            {/* Seção à direita */}
            <div className="form-container">
                {/* Logo */}
                <h1 className="title">
                    <span className="title-white">YOUR</span> 
                    <span className="title-pink">NOVEL</span> 
                    <img src="/images/coracao.png" alt="coração" className="title-image" />
                </h1>

                {/* Título de login */}
                <h2 className="login-title">Login To Your Account</h2>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="input-label">Username :</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="input-label">Password :</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="input-field"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        LOGIN
                    </button>
                </form>
                <div className="signup-container">
                    <p className="signup-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="signup-link">
                            Sign Up now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
