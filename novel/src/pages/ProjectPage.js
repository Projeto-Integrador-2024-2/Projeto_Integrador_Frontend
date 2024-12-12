import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ProjectBlock3 } from "./ProjectBlock";
import api from "../api_access";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ProjectPage = () => {
    const { projectId } = useParams();
    const [scenes, setScenes] = useState([]);
    const [positions, setPositions] = useState({});
    const [menuVisible, setMenuVisible] = useState(null);
    const [dragging, setDragging] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [connections, setConnections] = useState([]);
    const [selectedScene, setSelectedScene] = useState(null);
    const [tool, setTool] = useState("move"); // "move" ou "connect"
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const screenBounds = { width: window.innerWidth * 0.8, height: window.innerHeight * 0.8 };

    useEffect(() => {
        const fetchScenes = async () => {
            const accessToken = Cookies.get("accessToken");
            try {
                const response = await api.get(`/list/scene/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setScenes(response.data);
                const initialPositions = {};
                response.data.forEach((scene, index) => {
                    initialPositions[scene.id] = {
                        x: 20 + (index % 4) * 180,
                        y: 20 + Math.floor(index / 4) * 180,
                    };
                });
                setPositions(initialPositions);
            } catch (err) {
                console.error("Erro ao buscar projetos:", err?.response?.data || err.message);
                setError("Não foi possível carregar os projetos.");
            } finally {
                setLoading(false);
            }
        };

        fetchScenes();
    }, [projectId]);

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
                const newConnection = {
                    start: selectedScene,
                    end: id,
                    line: calculateLine(positions, selectedScene, id),
                };
                setConnections((prev) => [...prev, newConnection]);
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

    const handleDelete = (id) => {
        setScenes((prevScenes) => prevScenes.filter((scene) => scene.id !== id));
        setMenuVisible(null);
        setConnections((prevConnections) =>
            prevConnections.filter((connection) => connection.start !== id && connection.end !== id)
        );
    };

    const handleEdit = (id) => {
        navigate(`/scene/${id}/edit`);
    };

    const closeMenu = () => {
        setMenuVisible(null);
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
                <div style={styles.newProject} onClick={() => navigate("/scene/create")}>+</div>
            </div>
            <div style={{ ...styles.screen, width: `${screenBounds.width}px`, height: `${screenBounds.height}px` }}>
                <svg style={styles.lineContainer}>
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                        </marker>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: "#eda1d5", stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: "#7e005f", stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {connections.map((connection, index) => (
                        <line
                            key={index}
                            x1={connection.line.x1}
                            y1={connection.line.y1}
                            x2={connection.line.x2}
                            y2={connection.line.y2}
                            style={{ ...styles.line, stroke: "url(#gradient)" }}
                        />
                    ))}
                </svg>
                {scenes.map((scene) => (
                    <div
                        key={scene.id}
                        style={{
                            ...styles.draggable,
                            left: `${positions[scene.id]?.x || 0}px`,
                            top: `${positions[scene.id]?.y || 0}px`,
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
                                <button onClick={() => handleDelete(scene.id)}>Deletar</button>
                            </div>
                        )}
                    </div>
                ))}
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
};

export default ProjectPage;
