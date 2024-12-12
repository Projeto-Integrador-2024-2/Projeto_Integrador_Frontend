import React, { useState, useEffect } from 'react';
import api from '../api_access';
import Cookies from 'js-cookie';


export default function Project() {
    const [createFormVisible, setCreateFormVisible] = useState(false);
    const [listVisible, setListVisible] = useState(false);
    const [updateFormVisible, setUpdateFormVisible] = useState(false);
    const [deleteFormVisible, setDeleteFormVisible] = useState(false);

    const [name, setName] = useState('');
    const [privacy, setPrivacy] = useState(false);
    const [firstScene, setFirstScene] = useState(0);
    const [scenes, setScenes] = useState([]);
    const [projects, setProjects] = useState([]);

    const [selectedProject, setSelectedProject] = useState('');
    const [newName, setNewName] = useState('');
    const [newPrivacy, setNewPrivacy] = useState(false);
    const [newFirstScene, setNewFirstScene] = useState(0);

    // Fetch scenes and projects on mount
    useEffect(() => {
        const fetchScenes = async () => {
            try {
                const response = await api.get('/list/scene');
                setScenes(response.data);
            } catch (error) {
                console.error('Erro ao buscar cenas:', error);
            }
        };

        const fetchProjects = async () => {
            const accessToken = Cookies.get('accessToken');
            if (!accessToken) {
                console.error("Usuário não autenticado.");
                return;
            }

            try {
                const response = await api.get('/list/project', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setProjects(response.data);
            } catch (error) {
                console.error('Erro ao buscar projetos:', error.response?.data || error.message);
            }
        };

        fetchScenes();
        fetchProjects();
    }, []);

    // Create project
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
            privacy,
            first_scene: firstScene,
        };

        try {
            const response = await api.post('create/project', payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.status === 201) {
                console.log('Projeto criado com sucesso!');
                setCreateFormVisible(false);
                window.location.href = '/project';
            }
        } catch (error) {
            console.error("Erro ao criar o projeto:", error.response?.data || error.message);
        }
    };

    // Update project
    const handleUpdate = async (e) => {
        e.preventDefault();

        const accessToken = Cookies.get('accessToken');
        if (!selectedProject) {
            console.error("Nenhum projeto selecionado.");
            return;
        }

        if (!accessToken) {
            console.error("Usuário não autenticado.");
            return;
        }

        const payload = {
            name: newName || undefined,
            privacy: newPrivacy,
            first_scene: newFirstScene || undefined,
        };

        try {
            const response = await api.patch(`/update/project?id=${selectedProject}`, payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                console.log('Projeto atualizado com sucesso!');
                setUpdateFormVisible(false);
                window.location.href = '/project';
            }
        } catch (error) {
            console.error('Erro ao atualizar o projeto:', error.response?.data || error.message);
        }
    };

    // Delete project
    const handleDelete = async (e) => {
        e.preventDefault();

        const accessToken = Cookies.get('accessToken');
        if (!selectedProject) {
            console.error("Nenhum projeto selecionado para exclusão.");
            return;
        }

        if (!accessToken) {
            console.error("Usuário não autenticado.");
            return;
        }

        try {
            const response = await api.delete(`/delete/project?id=${selectedProject}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 204) {
                console.log('Projeto deletado com sucesso!');
                setDeleteFormVisible(false);
                setProjects(projects.filter((project) => project.id !== selectedProject)); // Remove o projeto deletado da lista
                window.location.href = '/project';
            }
        } catch (error) {
            console.error('Erro ao deletar o projeto:', error.response?.data || error.message);
        }
    };


    // Html
    return (
        <div className="container mt-5">
            <h2 className="text-center">Project Management</h2>
            <div className="d-flex justify-content-around mt-4">
                {/* Botão Create */}
                <button
                    className="btn btn-primary"
                    onClick={() => setCreateFormVisible(!createFormVisible)}
                >
                    {createFormVisible ? 'Hide Create Form' : 'Create Project'}
                </button>

                {/* Botão List */}
                <button
                    className="btn btn-success"
                    onClick={() => setListVisible(!listVisible)}
                >
                    {listVisible ? 'Hide Projects' : 'List Projects'}
                </button>

                {/* Botão Update */}
                <button
                    className="btn btn-warning"
                    onClick={() => setUpdateFormVisible(!updateFormVisible)}
                >
                    {updateFormVisible ? 'Hide Update Form' : 'Update Project'}
                </button>

                {/* Botão Delete */}
                <button
                    className="btn btn-danger"
                    onClick={() => setDeleteFormVisible(!deleteFormVisible)}
                >
                    {deleteFormVisible ? 'Hide Delete Form' : 'Delete Project'}
                </button>
            </div>

            {/* Formulário Create */}
            {createFormVisible && (
                <form onSubmit={handleCreate} className="mt-4">
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
                            checked={privacy}
                            onChange={(e) => setPrivacy(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="booleanAttribute">
                            Privado
                        </label>
                    </div>
                    <div className="form-floating mb-2">
                        <select
                            className="form-select"
                            value={firstScene}
                            onChange={(e) => setFirstScene(parseInt(e.target.value))}
                            required
                        >
                            <option value="">Selecione a Primeira Cena</option>
                            {scenes.map((scene) => (
                                <option key={scene.id} value={scene.id}>
                                    {scene.name}
                                </option>
                            ))}
                        </select>
                        <label>Primeira Cena</label>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Registrar
                    </button>
                </form>
            )}

            {/* Lista de Projetos */}
            {listVisible && (
                <div className="mt-4">
                    <h4>Projects:</h4>
                    <ul className="list-group">
                        {projects.map((project) => (
                            <li key={project.id} className="list-group-item">
                                {project.name} - {project.privacy ? 'Private' : 'Public'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Formulário Update */}
            {updateFormVisible && (
                <form onSubmit={handleUpdate} className="mt-4">
                    <div className="form-floating mb-2">
                        <select
                            className="form-select"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            required
                        >
                            <option value="">Selecione o Projeto</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        <label>Projeto para Atualizar</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            id="newName"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Digite o novo nome do projeto"
                        />
                        <label htmlFor="newName">Novo Nome do Projeto</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="newPrivacy"
                            checked={newPrivacy}
                            onChange={(e) => setNewPrivacy(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="newPrivacy">
                            Privado
                        </label>
                    </div>
                    <div className="form-floating mb-2">
                        <select
                            className="form-select"
                            value={newFirstScene}
                            onChange={(e) => setNewFirstScene(parseInt(e.target.value))}
                            required
                        >
                            <option value="">Selecione a Nova Primeira Cena</option>
                            {scenes.map((scene) => (
                                <option key={scene.id} value={scene.id}>
                                    {scene.name}
                                </option>
                            ))}
                        </select>
                        <label>Nova Primeira Cena</label>
                    </div>
                    <button type="submit" className="btn btn-warning mt-3">
                        Atualizar Projeto
                    </button>
                </form>
            )}

            {/* Formulário Delete */}
            {deleteFormVisible && (
                <form onSubmit={handleDelete} className="mt-4">
                    <div className="form-floating mb-2">
                        <select
                            className="form-select"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            required
                        >
                            <option value="">Selecione o Projeto para Deletar</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        <label>Projeto para Deletar</label>
                    </div>

                    <button type="submit" className="btn btn-danger mt-3">
                        Deletar Projeto
                    </button>
                </form>
            )}
        </div>
    );
}
