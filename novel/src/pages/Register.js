import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api_access';
import './Register.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Novo estado para o email
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Novo estado para confirmação da senha

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('As senhas não coincidem. Por favor, tente novamente.');
            return;
        }
        try {
            const response = await api.post('create/user', { username, email, password });
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

    return (
        <div className="register-container">
            <div className="form-container">
                <h1 className="signup-title register-title-position">
                    <span className="title-white">YOUR</span>{' '}
                    <span className="title-pink">NOVEL</span>{' '}
                    <img src="/images/coracao.png" alt="coração" className="title-image" />
                </h1>
                <h2 className="login-title">Create Your Account</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label className="input-label">Username :</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="signup-input-field"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="input-label">Email :</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="signup-input-field"
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
                            className="signup-input-field"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="input-label">Confirm Password :</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="signup-input-field"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        REGISTER
                    </button>
                </form>
                <div className="signup-container">
                    <p className="signup-text">
                        Already have an account?{' '}
                        <Link to="/login" className="signup-link">
                            Login now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
