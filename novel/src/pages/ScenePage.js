import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api_access";
import Cookies from "js-cookie";
import Scene from "./SceneView";

const ScenePage = () => {
    const { sceneId } = useParams();
    const [currentScene, setCurrentScene] = useState(null);
    const [formData, setFormData] = useState({
        name: "-",
        url_background: "-",
        url_text_box: "-",
        url_character_left: "-",
        url_character_middle: "-",
        url_character_right: "-",
        text: "-",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const accessToken = Cookies.get("accessToken");

    // Fetch the scene data
    const fetchScene = async () => {
        try {
            const response = await api.get(`/list/scene?id=${sceneId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const sceneData = response.data[0]; // Supondo que seja o primeiro item da lista
            setCurrentScene(sceneData);

            // Preenche o formulário com os dados existentes
            setFormData({
                name: sceneData.name || "-",
                url_background: sceneData.url_background || "-",
                url_text_box: sceneData.url_text_box || "-",
                url_character_left: sceneData.url_character_left || "-",
                url_character_middle: sceneData.url_character_middle || "-",
                url_character_right: sceneData.url_character_right || "-",
                text: sceneData.text || "-",
                project: sceneData.project,
            });
        } catch (err) {
            console.error("Erro ao buscar a cena:", err?.response?.data || err.message);
            setError("Não foi possível carregar a cena.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScene();
    }, [sceneId]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission for updating the scene
    const handleUpdateScene = async (e) => {
        e.preventDefault();
    
        // Normaliza os valores do formData, substituindo null por "-"
        const normalizedFormData = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, value || "-"])
        );
        console.log(normalizedFormData)
        try {
            await api.put(`/update/scene/${sceneId}/`, normalizedFormData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            alert("Cena atualizada com sucesso!");
            await fetchScene(); // Recarrega a cena após a atualização
        } catch (err) {
            console.error("Erro ao atualizar a cena:", err?.response?.data || err.message);
            alert("Não foi possível atualizar a cena.");
        }
    };
    

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2>Atualizar Cena</h2>
                <form onSubmit={handleUpdateScene} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label>Nome:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>URL do Background:</label>
                        <input
                            type="text"
                            name="url_background"
                            value={formData.url_background}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>URL da Caixa de Texto:</label>
                        <input
                            type="text"
                            name="url_text_box"
                            value={formData.url_text_box}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>URL do Personagem à Esquerda:</label>
                        <input
                            type="text"
                            name="url_character_left"
                            value={formData.url_character_left}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>URL do Personagem do Meio:</label>
                        <input
                            type="text"
                            name="url_character_middle"
                            value={formData.url_character_middle}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>URL do Personagem à Direita:</label>
                        <input
                            type="text"
                            name="url_character_right"
                            value={formData.url_character_right}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>Texto:</label>
                        <textarea
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            style={styles.textarea}
                        />
                    </div>
                    <button type="submit" style={styles.button}>
                        Atualizar Cena
                    </button>
                </form>
            </div>
            <div style={styles.sceneContainer}>
                <h1>Detalhes da Cena</h1>
                {currentScene && (
                    <Scene
                        name={currentScene.name}
                        urlBackground={currentScene.url_background}
                        urlTextBox={currentScene.url_text_box}
                        urlCharacterLeft={currentScene.url_character_left}
                        urlCharacterMiddle={currentScene.url_character_middle}
                        urlCharacterRight={currentScene.url_character_right}
                        text={currentScene.text}
                    />
                )}
            </div>
        </div>
    );
};

export default ScenePage;

const styles = {
    container: {
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
    },
    formContainer: {
        flex: 1,
        marginRight: "20px",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    formGroup: {
        marginBottom: "15px",
    },
    input: {
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        width: "100%",
    },
    textarea: {
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        width: "100%",
        height: "80px",
    },
    button: {
        padding: "10px",
        borderRadius: "4px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        cursor: "pointer",
    },
    sceneContainer: {
        flex: 2,
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
    },
};
