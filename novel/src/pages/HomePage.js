import React, { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Certifique-se de que esta biblioteca está instalada
import ProjectBlock from "./ProjectBlock";
import api from "../api_access";

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const accessToken = Cookies.get("accessToken");
      //console.log(accessToken)
      try {
        const response = await api.get("/list/project", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data)
        setProjects(response.data); 
      } catch (err) {
        console.error("Erro ao buscar projetos:", err.response?.data || err.message);
        setError("Não foi possível carregar os projetos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p>Carregando projetos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={styles.container}>
      {projects.map((project) => (
        <ProjectBlock key={project.id} id={project.id} name={project.name} imageUrl={project.first_scene.url_background} />
      ))}
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#ffe4f2", // Fundo rosa claro
    minHeight: "100vh",
    padding: "16px",
  },
  container: {
    display: "flex",
    flexDirection: "column", // Alinha o conteúdo em coluna
    alignItems: "flex-start", // Alinha no topo
    gap: "16px",
    justifyContent: "flex-start", // Alinha à esquerda
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
  plusIcon: {
    fontSize: "100px", // Aumenta o tamanho do ícone
    fontWeight: "bold", // Torna o ícone mais grosso (se o ícone suportar)
    color: "#ffff",
    position: "absolute", // Centraliza o ícone dentro do bloco
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  newText: {
    marginTop: "0.5px", // Ajuste para mover o texto para baixo do bloco
    marginLeft: "22px", // Ajuste para mover o texto para a direita
    color: "#000000", // Cor do texto "NEW NOVEL" com correspondência ao bloco
    fontWeight: "bold",
    textAlign: "left", // Alinha o texto à esquerda para o efeito de deslocamento para a direita
    fontFamily: '"Poppins", sans-serif',
  },
  projectsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    justifyContent: "center",
    width: "100%",
  },
};

export default HomePage;
