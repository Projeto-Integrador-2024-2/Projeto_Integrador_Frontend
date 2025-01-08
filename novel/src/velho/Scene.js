import React, { useState, useEffect } from 'react';
import api from '../api_access';
import Cookies from 'js-cookie';

export default function Scene() {
    const [createFormVisible, setCreateFormVisible] = useState(false);
    const [listVisible, setListVisible] = useState(false);
    const [updateFormVisible, setUpdateFormVisible] = useState(false);
    const [deleteFormVisible, setDeleteFormVisible] = useState(false);

    const [name, setName] = useState('');
    const [urlBackground, setUrlBackground] = useState('');
    const [urlTextBox, setUrlTextBox] = useState('');
    const [urlCharacterLeft, setUrlCharacterLeft] = useState('');
    const [urlCharacterMiddle, setUrlCharacterMiddle] = useState('');
    const [urlCharacterRight, setUrlCharacterRight] = useState('');
    const [text, setText] = useState('');

    const [scenes, setScenes] = useState([]);

    const [selectedScene, setSelectedScene] = useState('');
    const [newName, setNewName] = useState('');
    const [newUrlBackground, setNewUrlBackground] = useState('');
    const [newUrlTextBox, setNewUrlTextBox] = useState('');
    const [newUrlCharacterLeft, setNewUrlCharacterLeft] = useState('');
    const [newUrlCharacterMiddle, setNewUrlCharacterMiddle] = useState('');
    const [newUrlCharacterRight, setNewUrlCharacterRight] = useState('');
    const [newText, setNewText] = useState('');

    // Fetch scenes on mount
    useEffect(() => {
        const fetchScenes = async () => {
            try {
                const response = await api.get('/list/scene');
                setScenes(response.data);
            } catch (error) {
                console.error('Erro ao buscar cenas:', error);
            }
        };

        fetchScenes();
    }, []);

    // Create scene
    const handleCreate = async (e) => {
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
            url_background: urlBackground,
            url_text_box: urlTextBox,
            url_character_left: urlCharacterLeft,
            url_character_middle: urlCharacterMiddle,
            url_character_right: urlCharacterRight,
            text,
        };

        try {
            const response = await api.post('create/scene', payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.status === 201) {
                console.log('Cena criada com sucesso!');
                setCreateFormVisible(false);
                window.location.href = '/scene';
            }
        } catch (error) {
            console.error("Erro ao criar a cena:", error.response?.data || error.message);
        }
    };

    // Update scene
    const handleUpdate = async (e) => {
        e.preventDefault();

        const accessToken = Cookies.get('accessToken');
        if (!selectedScene) {
            console.error("Nenhuma cena selecionada.");
            return;
        }

        if (!accessToken) {
            console.error("Usuário não autenticado.");
            return;
        }

        const payload = {
            name: newName || undefined,
            url_background: newUrlBackground || undefined,
            url_text_box: newUrlTextBox || undefined,
            url_character_left: newUrlCharacterLeft || undefined,
            url_character_middle: newUrlCharacterMiddle || undefined,
            url_character_right: newUrlCharacterRight || undefined,
            text: newText || undefined,
        };

        try {
            const response = await api.patch(`/update/scene?id=${selectedScene}`, payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                console.log('Cena atualizada com sucesso!');
                setUpdateFormVisible(false);
                window.location.href = '/scene';
            }
        } catch (error) {
            console.error('Erro ao atualizar a cena:', error.response?.data || error.message);
        }
    };

    // Delete scene (Usando o segundo método)
    const handleDelete = async (e) => {
        e.preventDefault();

        const accessToken = Cookies.get('accessToken');
        if (!selectedScene) {
            console.error("Nenhuma cena selecionada para exclusão.");
            return;
        }

        if (!accessToken) {
            console.error("Usuário não autenticado.");
            return;
        }

        try {
            const response = await api.delete(`/delete/scene?id=${selectedScene}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 204) {
                console.log('Cena deletada com sucesso!');
                setDeleteFormVisible(false);
                setScenes(scenes.filter((scene) => scene.id !== selectedScene)); // Remove a cena deletada da lista
                window.location.href = '/scene';
            }
        } catch (error) {
            console.error('Erro ao deletar a cena:', error.response?.data || error.message);
        }
    };

    // HTML
    return (
        <div className="container mt-5">
            <h2 className="text-center">Scene Management</h2>
            <div className="d-flex justify-content-around mt-4">
                {/* Botão Create */}
                <button
                    className="btn btn-primary"
                    onClick={() => setCreateFormVisible(!createFormVisible)}
                >
                    {createFormVisible ? 'Hide Create Form' : 'Create Scene'}
                </button>

                {/* Botão List */}
                <button
                    className="btn btn-success"
                    onClick={() => setListVisible(!listVisible)}
                >
                    {listVisible ? 'Hide Scenes' : 'List Scenes'}
                </button>

                {/* Botão Update */}
                <button
                    className="btn btn-warning"
                    onClick={() => setUpdateFormVisible(!updateFormVisible)}
                >
                    {updateFormVisible ? 'Hide Update Form' : 'Update Scene'}
                </button>

                {/* Botão Delete */}
                <button
                    className="btn btn-danger"
                    onClick={() => setDeleteFormVisible(!deleteFormVisible)}
                >
                    {deleteFormVisible ? 'Hide Delete Form' : 'Delete Scene'}
                </button>
            </div>

            {/* Formulário Create */}
            {createFormVisible && (
                <form onSubmit={handleCreate} className="mt-4">
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Digite o Nome da Cena"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <label>Nome da Cena</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="URL do Background"
                            value={urlBackground}
                            onChange={(e) => setUrlBackground(e.target.value)}
                        />
                        <label>URL do Background</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="URL da Caixa de Texto"
                            value={urlTextBox}
                            onChange={(e) => setUrlTextBox(e.target.value)}
                        />
                        <label>URL da Caixa de Texto</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="URL do Personagem à Esquerda"
                            value={urlCharacterLeft}
                            onChange={(e) => setUrlCharacterLeft(e.target.value)}
                        />
                        <label>URL do Personagem à Esquerda</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="URL do Personagem ao Centro"
                            value={urlCharacterMiddle}
                            onChange={(e) => setUrlCharacterMiddle(e.target.value)}
                        />
                        <label>URL do Personagem ao Centro</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="URL do Personagem à Direita"
                            value={urlCharacterRight}
                            onChange={(e) => setUrlCharacterRight(e.target.value)}
                        />
                        <label>URL do Personagem à Direita</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Texto da Cena"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <label>Texto da Cena</label>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Criar Cena
                    </button>
                </form>
            )}

            {/* Listar cenas */}
            {listVisible && (
                <div className="mt-4">
                    <h4>Cenas Cadastradas</h4>
                    <ul>
                        {scenes.map((scene) => (
                            <li key={scene.id}>
                                {scene.name} -{' '}
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => {
                                        setSelectedScene(scene.id);
                                        setUpdateFormVisible(true);
                                    }}
                                >
                                    Editar
                                </button>{' '}
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => {
                                        setSelectedScene(scene.id);
                                        setDeleteFormVisible(true);
                                    }}
                                >
                                    Excluir
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Atualizar Cena */}
            {updateFormVisible && selectedScene && (
                <form onSubmit={handleUpdate} className="mt-4">
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Novo Nome"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <label>Nome da Cena</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nova URL do Background"
                            value={newUrlBackground}
                            onChange={(e) => setNewUrlBackground(e.target.value)}
                        />
                        <label>URL do Background</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nova URL da Caixa de Texto"
                            value={newUrlTextBox}
                            onChange={(e) => setNewUrlTextBox(e.target.value)}
                        />
                        <label>URL da Caixa de Texto</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nova URL do Personagem à Esquerda"
                            value={newUrlCharacterLeft}
                            onChange={(e) => setNewUrlCharacterLeft(e.target.value)}
                        />
                        <label>URL do Personagem à Esquerda</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nova URL do Personagem ao Centro"
                            value={newUrlCharacterMiddle}
                            onChange={(e) => setNewUrlCharacterMiddle(e.target.value)}
                        />
                        <label>URL do Personagem ao Centro</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nova URL do Personagem à Direita"
                            value={newUrlCharacterRight}
                            onChange={(e) => setNewUrlCharacterRight(e.target.value)}
                        />
                        <label>URL do Personagem à Direita</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Novo Texto da Cena"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                        />
                        <label>Texto da Cena</label>
                    </div>
                    <button type="submit" className="btn btn-warning">
                        Atualizar Cena
                    </button>
                </form>
            )}

            {/* Excluir Cena */}
            {deleteFormVisible && selectedScene && (
                <div className="mt-4">
                    <h4>Tem certeza que deseja excluir esta cena?</h4>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        Confirmar Exclusão
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setDeleteFormVisible(false)}
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
}