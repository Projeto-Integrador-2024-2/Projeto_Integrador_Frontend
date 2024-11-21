import React, { useState, useEffect } from 'react';
import api from '../api_access';
import Cookies from 'js-cookie';

export default function Choice() {
    const [createFormVisible, setCreateFormVisible] = useState(false);
    const [listVisible, setListVisible] = useState(false);
    const [updateFormVisible, setUpdateFormVisible] = useState(false);
    const [deleteFormVisible, setDeleteFormVisible] = useState(false);

    const [text, setText] = useState('');
    const [fromScene, setFromScene] = useState('');
    const [toScene, setToScene] = useState('');
    const [choices, setChoices] = useState([]);
    const [scenes, setScenes] = useState([]);

    const [selectedChoice, setSelectedChoice] = useState('');
    const [newText, setNewText] = useState('');
    const [newFromScene, setNewFromScene] = useState('');
    const [newToScene, setNewToScene] = useState('');

    // Fetch scenes and choices on mount
    useEffect(() => {
        const fetchScenes = async () => {
            try {
                const response = await api.get('/list/scene');
                setScenes(response.data);
            } catch (error) {
                console.error('Erro ao buscar cenas:', error);
            }
        };

        const fetchChoices = async () => {
            try {
                const response = await api.get('/list/choice');
                setChoices(response.data);
            } catch (error) {
                console.error('Erro ao buscar escolhas:', error);
            }
        };

        fetchScenes();
        fetchChoices();
    }, []);

    // Create choice
    const handleCreate = async (e) => {
        e.preventDefault();

        if (!text.trim() || !fromScene) {
            console.error("Os campos 'Texto' e 'Cena de Origem' são obrigatórios.");
            return;
        }

        try {
            const response = await api.post('/create/choice', {
                text,
                from_scene: fromScene,
                to_scene: toScene || null, // Opcional
            });
            if (response.status === 201) {
                console.log('Escolha criada com sucesso!');
                setCreateFormVisible(false);
                setChoices([...choices, response.data]);
            }
        } catch (error) {
            console.error('Erro ao criar escolha:', error.response?.data || error.message);
        }
    };

    // Update choice
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedChoice) {
            console.error('Nenhuma escolha selecionada.');
            return;
        }

        try {
            const response = await api.patch(`/update/choice?id=${selectedChoice}`, {
                text: newText || undefined,
                from_scene: newFromScene || undefined,
                to_scene: newToScene || undefined,
            });

            if (response.status === 200) {
                console.log('Escolha atualizada com sucesso!');
                setUpdateFormVisible(false);
                window.location.reload(); // Atualiza a lista após alteração
            }
        } catch (error) {
            console.error('Erro ao atualizar escolha:', error.response?.data || error.message);
        }
    };

    // Delete choice
    const handleDelete = async (e) => {
        e.preventDefault();

        if (!selectedChoice) {
            console.error('Nenhuma escolha selecionada.');
            return;
        }

        try {
            const response = await api.delete(`/delete/choice?id=${selectedChoice}`);
            if (response.status === 204) {
                console.log('Escolha deletada com sucesso!');
                setChoices(choices.filter((choice) => choice.id !== selectedChoice));
                setDeleteFormVisible(false);
            }
        } catch (error) {
            console.error('Erro ao deletar escolha:', error.response?.data || error.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Choice Management</h2>
            <div className="d-flex justify-content-around mt-4">
                <button
                    className="btn btn-primary"
                    onClick={() => setCreateFormVisible(!createFormVisible)}
                >
                    {createFormVisible ? 'Hide Create Form' : 'Create Choice'}
                </button>
                <button
                    className="btn btn-success"
                    onClick={() => setListVisible(!listVisible)}
                >
                    {listVisible ? 'Hide Choices' : 'List Choices'}
                </button>
                <button
                    className="btn btn-warning"
                    onClick={() => setUpdateFormVisible(!updateFormVisible)}
                >
                    {updateFormVisible ? 'Hide Update Form' : 'Update Choice'}
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => setDeleteFormVisible(!deleteFormVisible)}
                >
                    {deleteFormVisible ? 'Hide Delete Form' : 'Delete Choice'}
                </button>
            </div>

            {createFormVisible && (
                <form onSubmit={handleCreate} className="mt-4">
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Texto da Escolha"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                        <label>Texto da Escolha</label>
                    </div>
                    <div className="form-floating mb-2">
                        <select
                            className="form-select"
                            value={fromScene}
                            onChange={(e) => setFromScene(e.target.value)}
                            required
                        >
                            <option value="">Selecione a Cena de Origem</option>
                            {scenes.map((scene) => (
                                <option key={scene.id} value={scene.id}>
                                    {scene.name}
                                </option>
                            ))}
                        </select>
                        <label>Cena de Origem</label>
                    </div>
                    <div className="form-floating mb-2">
                        <select
                            className="form-select"
                            value={toScene}
                            onChange={(e) => setToScene(e.target.value)}
                        >
                            <option value="">Selecione a Cena de Destino (opcional)</option>
                            {scenes.map((scene) => (
                                <option key={scene.id} value={scene.id}>
                                    {scene.name}
                                </option>
                            ))}
                        </select>
                        <label>Cena de Destino</label>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Registrar
                    </button>
                </form>
            )}

            {listVisible && (
                <div className="mt-4">
                    <h4>Choices:</h4>
                    <ul className="list-group">
                        {choices.map((choice) => (
                            <li key={choice.id} className="list-group-item">
                                {choice.text} (De: {choice.from_scene} Para: {choice.to_scene || 'N/A'})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {updateFormVisible && (
                <form onSubmit={handleUpdate} className="mt-4">
                    <div className="form-floating mb-2">
                        <select
                            className="form-select"
                            value={selectedChoice}
                            onChange={(e) => setSelectedChoice(e.target.value)}
                            required
                        >
                            <option value="">Selecione a Escolha</option>
                            {choices.map((choice) => (
                                <option key={choice.id} value={choice.id}>
                                    {choice.text}
                                </option>
                            ))}
                        </select>
                        <label>Escolha para Atualizar</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Novo Texto"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                        />
                        <label>Novo Texto</label>
                    </div>
                    <div className="form-floating mb-2">
                        <select
                            className="form-select"
                            value={newFromScene}
                            onChange={(e) => setNewFromScene(e.target.value)}
                        >
                            <option value="">Nova Cena de Origem</option>
                            {scenes.map((scene) => (
                                <option key={scene.id} value={scene.id}>
                                    {scene.name}
                                </option>
                            ))}
                        </select>
                        <label>Cena de Origem</label>
                    </div>
                    <div className="form-floating mb-2">
                        <select
                            className="form-select"
                            value={newToScene}
                            onChange={(e) => setNewToScene(e.target.value)}
                        >
                            <option value="">Nova Cena de Destino (opcional)</option>
                            {scenes.map((scene) => (
                                <option key={scene.id} value={scene.id}>
                                    {scene.name}
                                </option>
                            ))}
                        </select>
                        <label>Cena de Destino</label>
                    </div>
                    <button type="submit" className="btn btn-warning mt-2">
                        Atualizar
                    </button>
                </form>
            )}

            {deleteFormVisible && (
                <form onSubmit={handleDelete} className="mt-4">
                    <div className="form-floating mb-2">
                        <select
                            className="form-select"
                            value={selectedChoice}
                            onChange={(e) => setSelectedChoice(e.target.value)}
                            required
                        >
                            <option value="">Selecione a Escolha</option>
                            {choices.map((choice) => (
                                <option key={choice.id} value={choice.id}>
                                    {choice.text}
                                </option>
                            ))}
                        </select>
                        <label>Escolha para Deletar</label>
                    </div>
                    <button type="submit" className="btn btn-danger mt-2">
                        Deletar
                    </button>
                </form>
            )}
        </div>
    );
}
