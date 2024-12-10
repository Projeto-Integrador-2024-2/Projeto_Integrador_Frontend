import React, { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Certifique-se de que esta biblioteca está instalada
import ProjectBlock from "./ProjectBlock";
import api from "../api_access";
import { useParams } from 'react-router-dom';

const ProjectPage = () => {
    const { projectId } = useParams()
    const [scenes, setScenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
        return <p>Carregando projetos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={styles.container}>
            {scenes.map((scene) => (
                <ProjectBlock key={scene.id} id={scene.id} name={scene.name} imageUrl={scene.url_background} />
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
};

export default ProjectPage;
