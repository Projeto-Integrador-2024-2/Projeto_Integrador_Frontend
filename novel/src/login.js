import React, { useState } from 'react';
import api from './api_access';
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
                window.location.href = '/create/project';
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center">Login</h2>
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
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
