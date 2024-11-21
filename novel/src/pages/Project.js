import React, { useState, useEffect } from 'react';
import api from '../api_access';
import Cookies from 'js-cookie';

export default function Project() {
    const [name, setName] = useState('');
    const [privacy, setPrivacy] = useState(false);
    const [firstScene, setFirstScene] = useState(0);
    const [scenes, setScenes] = useState([]); // Lista de cenas disponíveis

    const handleSubmit = async (e) => {
        e.preventDefault();

        const accessToken = Cookies.get('accessToken');
        if (!name.trim()) {
            console.error("O campo 'name' está vazio.");
            return;
        }

        if (!accessToken) {
            console.error("Usuário não autenticado.");
            return;
        }

        const payload = {
            name,
            privacy,
            firstScene, // O ID da cena selecionada
        };

        console.log(payload)

        try {
            const response = await api.post('create/project', payload, {headers: {Authorization: `Bearer ${accessToken}`,},});
            if (response.status === 201) {
                console.log('test')
                // window.location.href = '/home';
            }
        } catch (error) {
            console.error("Erro ao criar o projeto:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        const fetchScenes = async () => {
            try {
                const response = await api.get('/list/scene'); // Faz a requisição para obter as cenas
                setScenes(response.data);
            } catch (error) {
                console.error('Erro ao buscar cenas:', error);
            }
        };
    
        fetchScenes();
    }, []);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center">Projects</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o Nome do Projeto"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <label>Nome do Projeto</label>
                        </div>
                        <div className="form-check mb-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="booleanAttribute"
                                checked={privacy} // Bind ao estado booleano
                                onChange={(e) => setPrivacy(e.target.checked)} // Atualiza o estado com true/false
                            />
                            <label className="form-check-label" htmlFor="booleanAttribute">
                                Privado
                            </label>
                        </div>
                        <div className="form-floating mb-2">
                            <select
                                className="form-select"
                                value={firstScene} // Armazena o ID da cena selecionada
                                onChange={(e) => setFirstScene(parseInt(e.target.value))} // Atualiza o estado com o ID selecionado
                                required
                            >
                                <option value="">Selecione a Primeira Cena</option>
                                {scenes.map((scene) => (
                                    <option key={scene.id} value={scene.id}>
                                        {scene.name} {/* Ajuste para o campo relevante no modelo Scene */}
                                    </option>
                                ))}
                            </select>
                            <label>Primeira Cena</label>
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
