import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ProjectBlock3 } from "./ProjectBlock";
import api from "../api_access";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ProjectPage = () => {
    const { projectId } = useParams();
    const [scenes, setScenes] = useState([]);
    const [choices, setChoices] = useState([]);
    const [positions, setPositions] = useState({});
    const [menuVisible, setMenuVisible] = useState(null);
    const [dragging, setDragging] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [connections, setConnections] = useState([]);
    const [selectedScene, setSelectedScene] = useState(null);
    const [tool, setTool] = useState("move"); // "move" ou "connect"
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [project, setProject] = useState(null); // Para armazenar os detalhes do projeto
    const [selectedConnection, setSelectedConnection] = useState(null);
    const [newConnectionName, setNewConnectionName] = useState(""); // Nome da conexão ao criar
    const [showNameInput, setShowNameInput] = useState(false); // Exibir input de texto
    const [pendingConnection, setPendingConnection] = useState(null);
    const [editingConnection, setEditingConnection] = useState(null); // Para controlar a conexão sendo editada
    const [editedConnectionName, setEditedConnectionName] = useState(""); // Para armazenar o nome editado
    const navigate = useNavigate();

    const screenBounds = { width: window.innerWidth * 0.8, height: window.innerHeight * 0.8 };
    const accessToken = Cookies.get("accessToken");

    const loadChoicesAndConnections = async () => {
        try {
            const response = await api.get("/list/choice", {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Certifique-se de usar o token correto
                },
            });

            if (response.status === 200) {
                const fetchedChoices = response.data;
                setChoices(fetchedChoices); // Atualiza o estado das choices

                // Cria conexões a partir das choices carregadas
                const generatedConnections = fetchedChoices.map((choice) => ({
                    id: choice.id,
                    name: choice.text, // Usa o texto da choice como nome da conexão
                    start: choice.from_scene,
                    end: choice.to_scene,
                    choiceId: choice.id, // Relaciona a conexão com a choice
                }));

                setConnections(generatedConnections); // Atualiza o estado das conexões
                console.log("Choices e conexões carregadas com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao carregar choices:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        const fetchScenes = async () => {
            try {
                const projectResponse = await api.get(`/list/project/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setProject(projectResponse.data);
    
                const response = await api.get(`/list/scene/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
    
                // Armazenar cenas e suas posições inicializadas, mas sem sobrescrever as posições
                if (response.data.length > 0 && Object.keys(positions).length === 0) {
                    const initialPositions = {};
                    response.data.forEach((scene, index) => {
                        initialPositions[scene.id] = {
                            x: 20 + (index % 4) * 180,
                            y: 20 + Math.floor(index / 4) * 180,
                        };
                    });
                    setPositions(initialPositions);
                }
    
                setScenes(response.data);
            } catch (err) {
                console.error("Erro ao buscar projetos:", err?.response?.data || err.message);
                setError("Não foi possível carregar os projetos.");
            } finally {
                setLoading(false);
            }
        };

        // Dar um jeito de n ficar pedindo td vez q mexe um quadrado nesta merda, coitado dos get do backend
        fetchScenes();
        loadChoicesAndConnections();
        
        const handleClickOutside = (e) => {
            // Verifique se o clique foi fora da linha ou do botão de deletar
            if (!e.target.closest('line') && !e.target.closest('.delete-button') && selectedConnection !== null) {
                setSelectedConnection(null); // Desmarca a linha
            }
        };
    
        // Adiciona o evento de clique fora da linha
        document.addEventListener('click', handleClickOutside);
    
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [projectId, selectedConnection, positions]);

    const handleNewScene = async () => {
        const payload = {
            name: "-",
            url_background: "-",
            url_text_box: "-",
            url_character_left: "-",
            url_character_middle: "-",
            url_character_right: "-",
            text: "-",
            project: project[0].id, // Substitua pelo ID do projeto correspondente
        };

        if (!project[0]) {
            alert("Erro ao criar nova cena");
            return;
        }

        try {
            const newSceneResponse = await api.post(`/create/scene`, payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setScenes((prevScenes) => [...prevScenes, newSceneResponse.data]);
            const newSceneId = newSceneResponse.data.id;
            setPositions((prevPositions) => ({
                ...prevPositions,
                [newSceneId]: { x: 20, y: 20 },
            }));
        } catch (error) {
            console.error("Erro ao criar a cena:", error.response?.data || error.message);
        }
    };

    const handleMouseDown = (id, event) => {
        if (tool === "move") {
            event.stopPropagation();
            setDragging(id);
            setOffset({
                x: event.clientX - (positions[id]?.x || 0),
                y: event.clientY - (positions[id]?.y || 0),
            });
        }
    };

    const handleMouseMove = (event) => {
        if (dragging && tool === "move") {
            const newX = Math.min(
                Math.max(0, event.clientX - offset.x),
                screenBounds.width - 150
            );
            const newY = Math.min(
                Math.max(0, event.clientY - offset.y),
                screenBounds.height - 150
            );

            setPositions((prevPositions) => {
                const updatedPositions = {
                    ...prevPositions,
                    [dragging]: { x: newX, y: newY },
                };

                setConnections((prevConnections) =>
                    prevConnections.map((connection) => ({
                        ...connection,
                        line: calculateLine(updatedPositions, connection.start, connection.end),
                        arrow: calculateArrowPosition(updatedPositions, connection.start, connection.end),
                    }))
                );

                return updatedPositions;
            });
        }
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    const handleSceneClick = (id, event) => {
        event.stopPropagation();
        if (tool === "connect") {
            if (selectedScene === null) {
                setSelectedScene(id);
            } else if (selectedScene !== id) {
                handleCreateConnection(selectedScene, id);
                setSelectedScene(null);
            }
        } else if (tool === "move" && !dragging) {
            setMenuVisible(id === menuVisible ? null : id);
        }
    };

    const calculateLine = (positions, startId, endId) => {
        const start = positions[startId];
        const end = positions[endId];

        if (!start || !end) return null;
        return {
            x1: start.x + 75,
            y1: start.y + 75,
            x2: end.x + 75,
            y2: end.y + 75,
        };
    };

    const calculateArrowPosition = (positions, startId, endId) => {
        const start = positions[startId];
        const end = positions[endId];
        if (!start || !end) return null;
        return {
            x: (start.x + end.x) / 2 + 75,
            y: (start.y + end.y) / 2 + 75,
        };
    };

    const handleDeleteScene = async (id) => {
        try {
            // Realizar a requisição DELETE para deletar a cena no backend
            const response = await api.delete(`/delete/scene?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
    
            // Se a exclusão no backend foi bem-sucedida, chama o handleDelete para atualizar o estado
            handleDelete(id);
    
            // Fechar o menu após a exclusão
            setMenuVisible(null);
        } catch (error) {
            console.error("Erro ao deletar cena:", error?.response?.data || error.message);
            alert("Erro ao deletar a cena.");
        }
    };
    
    const handleDelete = (id) => {
        setScenes((prevScenes) => prevScenes.filter((scene) => scene.id !== id)); // Remove a cena do estado
        setConnections((prevConnections) =>
            prevConnections.filter((connection) => connection.start !== id && connection.end !== id) // Remove conexões associadas à cena
        );
    };

    const handleEdit = (id) => {
        navigate(`/scene/${id}`);
    };

    const closeMenu = () => {
        setMenuVisible(null);
    };
    
    const handleDeleteChoice = async (selectedChoice) => {
        if (!selectedChoice) {
            console.error('Nenhuma escolha selecionada.');
            return;
        }
    
        try {
            const response = await api.delete(`/delete/choice?id=${selectedChoice}`);
            if (response.status === 204) {
                console.log('Escolha deletada com sucesso!');
                setChoices((prevChoices) =>
                    prevChoices.filter((choice) => choice.id !== selectedChoice)
                );
            }
        } catch (error) {
            console.error('Erro ao deletar escolha:', error.response?.data || error.message);
        }
    };
    
    const handleDeleteConnection = async () => {
        if (!selectedConnection) {
            alert('Nenhuma conexão selecionada para deletar.');
            return;
        }
    
        const { choiceId } = selectedConnection; // Extraia o ID da escolha associada à conexão
    
        try {
            // Deleta a escolha correspondente
            if (choiceId) {
                await handleDeleteChoice(choiceId);
            }
    
            // Atualiza o estado das conexões após a exclusão
            setConnections((prevConnections) =>
                prevConnections.filter((connection) => connection !== selectedConnection)
            );
    
            console.log('Conexão deletada com sucesso!');
            setSelectedConnection(null); // Limpa a seleção após a exclusão
        } catch (error) {
            console.error('Erro ao deletar conexão:', error.message);
        }
    };

    const handleCreateChoice = async (fromScene, toScene, text) => {
        const payload = {
            text: text,
            from_scene: fromScene,
            to_scene: toScene
        };

        try {
            const newChoiceResponse = await api.post(`/create/choice`, payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (newChoiceResponse.status === 201) {
                console.log('Escolha criada com sucesso!');
                const newChoice = newChoiceResponse.data; // Inclui o ID da choice
                setChoices([...choices, newChoice]);
                return newChoice.id; // Retorna o ID da choice criada
            }
        } catch (error) {
            console.error("Erro ao criar a cena:", error.response?.data || error.message);
        }
    };

    const handleCreateConnection = (fromScene, toScene) => {
        console.log(`Creating connection from ${fromScene} to ${toScene}`);
        setShowNameInput(true);
        setNewConnectionName("");
        setPendingConnection({ start: fromScene, end: toScene });
    };
    
    const confirmConnectionCreation = async () => {
        const text = newConnectionName;
    
        if (!newConnectionName.trim()) {
            alert("O nome da conexão é obrigatório!");
            setShowNameInput(false);
            setPendingConnection(null);
            return;
        }
    
        try {
            // Cria a choice e obtém o ID correspondente
            const choiceId = await handleCreateChoice(pendingConnection.start, pendingConnection.end, text);
    
            // Atualiza o estado das conexões com o ID da choice
            setConnections((prevConnections) => [
                ...prevConnections,
                {
                    id: choiceId, // Use o mesmo ID da choice
                    name: newConnectionName.trim(),
                    start: pendingConnection.start,
                    end: pendingConnection.end,
                    choiceId: choiceId, // Relacione explicitamente ao ID da choice
                },
            ]);
    
            setShowNameInput(false);
            setPendingConnection(null);
        } catch (error) {
            console.error("Erro ao confirmar a criação da conexão:", error.message);
        }
    };

    const handleEditChoice = async (selectedChoice, newText) => {
        if (!selectedChoice) {
            console.error('Nenhuma escolha selecionada.');
            return;
        }

        try {
            const response = await api.patch(`/update/choice?id=${selectedChoice}`, {
                text: newText || undefined,
            });

            if (response.status === 200) {
                console.log('Escolha atualizada com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao atualizar escolha:', error.response?.data || error.message);
        }
    };

    const handleEditConnectionName = (connection) => {
        setEditingConnection(connection); // Defina a conexão a ser editada
        setEditedConnectionName(connection.name); // Preenche o input com o nome atual
    };

    const handleConfirmEditConnection = () => {
        if (!editedConnectionName.trim()) {
            alert("O nome da conexão não pode estar vazio!");
            return;
        }
    
        // Atualiza o estado local das conexões
        setConnections((prevConnections) =>
            prevConnections.map((connection) =>
                connection === editingConnection
                    ? { ...connection, name: editedConnectionName.trim() }
                    : connection
            )
        );
    
        // Atualiza o campo `text` da `choice` correspondente no backend
        handleEditChoice(editingConnection.id, editedConnectionName.trim());
    
        setEditingConnection(null); // Fecha a edição
        setEditedConnectionName(""); // Limpa o input
    };
    
    const handleCancelEditConnection = () => {
        setEditingConnection(null); // Fecha a edição sem salvar
        setEditedConnectionName(""); // Limpa o input
    };    

    if (loading) return <p>Carregando projetos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div
            style={styles.container}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={closeMenu}
        >
            <div style={styles.sidebar}>
                <div
                    style={tool === "move" ? styles.selectedTool : styles.tool}
                    onClick={() => setTool("move")}
                >
                    Mover
                </div>
                <div
                    style={tool === "connect" ? styles.selectedTool : styles.tool}
                    onClick={() => setTool("connect")}
                >
                    Conectar
                </div>
                <div
                    style={tool === "selectConnection" ? styles.selectedTool : styles.tool}
                    onClick={() => setTool("selectConnection")}
                >
                    Selecionar Conexão
                </div>
                <div style={styles.newProject} onClick={() => handleNewScene()}>+</div>
            </div>
            <div style={{ ...styles.screen, width: `${screenBounds.width}px`, height: `${screenBounds.height}px` }}>
                <svg style={styles.lineContainer}>
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                    </marker>
                </defs>
                {connections.map((connection, index) => {
                    const gradientId = `gradient-${index}`;
                    const start = positions[connection.start];
                    const end = positions[connection.end];

                    // Calcular a linha e a posição do triângulo
                    const line = calculateLine(positions, connection.start, connection.end);

                    // Verifique se 'line' contém as propriedades necessárias antes de usá-las
                    if (!line || typeof line.x1 === 'undefined' || typeof line.y1 === 'undefined' || typeof line.x2 === 'undefined' || typeof line.y2 === 'undefined') {
                        console.error("Invalid line data for connection:", connection);
                        return null; // Retorna null se o dado da linha não for válido
                    }

                    const arrowX = (line.x1 + line.x2) / 2;
                    const arrowY = (line.y1 + line.y2) / 2;

                    // Calcular o ângulo da linha
                    const angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);

                    // Tamanho do triângulo (ajuste conforme necessário)
                    const triangleSize = 10;

                    return (
                        <>
                            <defs key={`defs-${index}`}>
                                <linearGradient id={gradientId} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" style={{ stopColor: "#eda1d5", stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: "#7e005f", stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>
                            <line
                                key={`line-${index}`}
                                x1={line.x1}
                                y1={line.y1}
                                x2={line.x2}
                                y2={line.y2}
                                style={{
                                    ...styles.line,
                                    stroke: selectedConnection === connection ? "red" : `url(#${gradientId})`,
                                    cursor: tool === "selectConnection" ? "pointer" : "default",
                                }}
                                onClick={(e) => {
                                    if (tool === "selectConnection") {
                                        e.stopPropagation();
                                        setSelectedConnection(connection);
                                    }
                                }}
                            />
                            {/* Triângulo (seta) */}
                            <polygon
                                key={`arrow-${index}`}
                                points={`${arrowX - triangleSize},${arrowY - triangleSize / 2} ${arrowX + triangleSize},${arrowY} ${arrowX - triangleSize},${arrowY + triangleSize / 2}`}
                                fill="purple"
                                transform={`rotate(${angle * (180 / Math.PI)}, ${arrowX}, ${arrowY})`}
                            />
                            {selectedConnection === connection && (
                                <text
                                    x={(line.x1 + line.x2) / 2 - 2}
                                    y={(line.y1 + line.y2) / 2 - 20}
                                    style={styles.connectionName}
                                    onClick={() => handleEditConnectionName(connection)} // Adicionar evento de clique para editar
                                >
                                    {connection.name}
                                </text>
                            )}
                            {selectedConnection === connection && (
                                <foreignObject
                                    x={(line.x1 + line.x2) / 2 - 40} 
                                    y={(line.y1 + line.y2) / 2 + 10}
                                    width="100"
                                    height="40"
                                >
                                    <button onClick={handleDeleteConnection} style={styles.cancelButton}>Deletar</button>
                                </foreignObject>
                            )}
                            {editingConnection === connection && (
                                <foreignObject
                                    x={(line.x1 + line.x2) / 2 - 500} 
                                    y={(line.y1 + line.y2) / 2 - 150}
                                    width="1000"
                                    height="400"
                                >
                                    <div style={styles.inputContainer}>
                                        <input
                                            type="text"
                                            value={editedConnectionName}
                                            onChange={(e) => setEditedConnectionName(e.target.value)}
                                            style={styles.input}
                                        />
                                        <button onClick={handleConfirmEditConnection} style={styles.confirmButton}>Confirmar</button>
                                        <button onClick={handleCancelEditConnection} style={styles.cancelButton}>Cancelar</button>
                                    </div>
                                </foreignObject>
                            )}
                        </>
                    );
                })}
                </svg>
                {scenes.map((scene) => (
                    <div
                        key={scene.id}
                        style={{
                            ...styles.draggable,
                            left: `${positions[scene.id]?.x || 0}px`,
                            top: `${positions[scene.id]?.y || 0}px`,
                            border: selectedScene === scene.id ? "2px solid pink" : "none",
                        }}
                        onMouseDown={(e) => handleMouseDown(scene.id, e)}
                        onClick={(e) => handleSceneClick(scene.id, e)}
                    >
                        <ProjectBlock3
                            id={scene.id}
                            name={scene.name}
                            imageUrl={scene.url_background}
                        />
                        {menuVisible === scene.id && tool === "move" && (
                            <div style={styles.menu} onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => handleEdit(scene.id)}>Editar</button>
                                <button onClick={() => handleDeleteScene(scene.id)}>Deletar</button> {/* Passar o id aqui */}
                            </div>
                        )}
                    </div>
                ))}
                {showNameInput && (
                    <div style={styles.inputContainer}>
                        <input
                            type="text"
                            value={newConnectionName}
                            onChange={(e) => setNewConnectionName(e.target.value)}
                            placeholder="Digite o nome da conexão"
                            style={styles.input}
                        />
                        <button onClick={confirmConnectionCreation} style={styles.confirmButton}>
                            Confirmar
                        </button>
                        <button
                            onClick={() => {
                                setShowNameInput(false);
                                setPendingConnection(null);
                            }}
                            style={styles.cancelButton}
                        >
                            Cancelar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
    },
    sidebar: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px",
        backgroundColor: "#f8f8f8",
        borderRight: "2px solid #ccc",
        width: "100px",
        alignItems: "center",
    },
    screen: {
        position: "relative",
        backgroundColor: "#f0f0f0",
        border: "2px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        flex: 1,
    },
    draggable: {
        position: "absolute",
        cursor: "grab",
    },
    tool: {
        padding: "10px",
        backgroundColor: "#ddd",
        borderRadius: "4px",
        cursor: "pointer",
        textAlign: "center",
    },
    selectedTool: {
        padding: "10px",
        backgroundColor: "#7e005f",
        color: "#fff",
        borderRadius: "4px",
        cursor: "pointer",
        textAlign: "center",
    },
    newProject: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eda1d5",
        borderRadius: "8px",
        width: "50px",
        height: "50px",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#fff",
        cursor: "pointer",
    },
    menu: {
        position: "absolute",
        top: "120%",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
        padding: "8px",
        zIndex: 10,
    },
    lineContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    },
    line: {
        strokeWidth: 2,
        markerEnd: "url(#arrowhead)",
    },
    deleteButton: {
        padding: "10px",
        backgroundColor: "#ff5c5c",
        borderRadius: "4px",
        cursor: "pointer",
        color: "#fff",
        textAlign: "center",
        marginTop: "10px",
    },    
    inputContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    input: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "16px",
    },
    confirmButton: {
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "4px",
        cursor: "pointer",
    },
    cancelButton: {
        backgroundColor: "#f44336",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "4px",
        cursor: "pointer",
    },
    connectionName: {
        fill: "#000",
        fontSize: "14px",
        textAnchor: "middle",
        dominantBaseline: "middle",
    },
    confirmDeleteButton: {
        padding: "10px",
        backgroundColor: "#ff5c5c",
        borderRadius: "4px",
        cursor: "pointer",
        color: "#fff",
        textAlign: "center",
        marginTop: "10px",
    },
    connectionDelete: {
        fill: 'red', // Cor do texto
        backgroundColor: 'red', // Cor do fundo do "botão"
        padding: '5px 10px', // Espaçamento interno para parecer um botão
        borderRadius: '5px', // Bordas arredondadas
        fontWeight: 'bold', // Texto em negrito
        fontSize: '14px', // Tamanho da fonte
        cursor: 'pointer', // Cursor de ponteiro ao passar o mouse
        userSelect: 'none', // Impede que o texto seja selecionado
        textAnchor: 'middle', // Centraliza o texto no botão
        dominantBaseline: 'middle', // Centraliza verticalmente
    },
};

export default ProjectPage;