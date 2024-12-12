import React, { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Certifique-se de que esta biblioteca está instalada
import { ProjectBlock3 }  from "./ProjectBlock";
import api from "../api_access";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ProjectPage = () => {
    const { projectId } = useParams()
    const [scenes, setScenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScenes = async () => {
            console.log({projectId})

            const accessToken = Cookies.get("accessToken");
            try {
                const response = await api.get(`/list/scene/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                
                setScenes(response.data);
            } catch (err) {
                console.error("Erro ao buscar projetos:", err?.response?.data || err.message);
                setError("Não foi possível carregar os projetos.");
            } finally {
                setLoading(false);
            }
        };

        fetchScenes();
    }, [projectId]); // Rodar novamente quando 'projectId' mudar

    const handleNewNovelClick = () => {
        navigate("/scene/create"); // Redireciona para o caminho especificado
      };

    if (loading) {
        return <p>Carregando projetos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.newProject} onClick={handleNewNovelClick}>
                <div style={styles.plusIcon}>+</div>
            </div>
            {scenes.map((scene) => (
                <ProjectBlock3 key={scene.id} id={scene.id} name={scene.name} imageUrl={scene.url_background} />
            ))}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "center",
        padding: "16px",
    },
    name: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    info: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '8px',
        textAlign: 'center',
    },
    button: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#7e005f',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    details: {
        fontSize: '16px',
        color: '#333',
        lineHeight: '1.5',
    },
    loadingText: {
        fontSize: '18px',
        color: '#333',
        fontWeight: 'bold',
    },
    plusIcon: {
        fontSize: "100px", // Aumenta o tamanho do ícone
        fontWeight: "bold", // Torna o ícone mais grosso (se o ícone suportar)
        color: "#ffff",
        position: "absolute", // Centraliza o ícone dentro do bloco
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
    newProject: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eda1d5",
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        width: "100px",
        height: "100px",
        position: "relative", // Para manter o ícone centralizado dentro do bloco
        marginTop: "15px",
    },
    projectsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        justifyContent: "center",
        width: "100%",
    }, 
};

export default ProjectPage;
