import React, { useState } from 'react';
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
            console.error(error);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center">Registrar</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite seu username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label>Username</label>
                        </div>
                        <div className="form-floating mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label>Password</label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">
                            Registrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
