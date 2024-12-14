import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Certifique-se de que esta biblioteca está instalada
import { ProjectBlock }  from "./ProjectBlock";
import api from "../api_access";

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]); // Estado para os gêneros disponíveis
  const [selectedGenres, setSelectedGenres] = useState([]); // Estado para os gêneros selecionados
  const [isStaff, setIsStaff] = useState(false); // Estado para verificar se o usuário é staff
  const accessToken = Cookies.get("accessToken");
  //const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("list/project/public/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const updatedProjects = response.data.map((project) => {
          if (project.first_scene === null) {
            project.first_scene = {
              url_background: "-",
            };
          }
          return project;
        });
        setProjects(updatedProjects);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err.response?.data || err.message);
        setError("Não foi possível carregar os projetos.");
      } finally {
        setLoading(false);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await api.get("list/genre", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setGenres(response.data);
      } catch (err) {
        console.error("Erro ao buscar gêneros:", err.response?.data || err.message);
        setError("Não foi possível carregar os gêneros.");
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/list/user/current", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }); // Requisição para a API
        const userInfo = response.data;
        setIsStaff(userInfo.is_staff); // Atualiza o estado com a propriedade `is_staff`
      } catch (error) {
        console.error("Erro ao verificar informações do usuário:", error);
        setIsStaff(false); // Garante que `isStaff` seja falso em caso de erro
      }
    };

    fetchUserInfo();
    fetchProjects();
    fetchGenres();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Função para lidar com a seleção de gêneros
  const handleGenreChange = (idGenre) => {
    setSelectedGenres((prevGenres) => {
      if (prevGenres.includes(idGenre)) {
        return prevGenres.filter((g) => g !== idGenre);
      } else {
        return [...prevGenres, idGenre];
      }
    });
  };
  
  // Filtrando os projetos com base nos gêneros selecionados
  const filteredProjects = projects.filter((project) => {
    return (
      selectedGenres.length === 0 || 
      project.genres.some((genre) => selectedGenres.includes(genre))
    );
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Seção esquerda (30%) - Filtros por gêneros */}
        <div style={styles.leftSection}>
          <h3 style={styles.filterTitle}>Filtrar por Gênero</h3>

          {/* Linha de separação */}
          <div style={styles.genreSeparator}></div>

          <div style={styles.genreList}>
            {genres.map((genre) => (
              <label key={genre.id} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  style={styles.checkbox}
                />
                {genre.name}
              </label>
            ))}
          </div>
        </div>

        {/* Seção direita (70%) com projetos */}
        <div style={styles.rightSection}>
          <h2>Projetos Recentes</h2>
          <div style={styles.projectsContainer}>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectBlock
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  imageUrl={project.first_scene.url_background}
                  isPrivate={project.privacy}
                  isStaff={isStaff}
                  accessToken={accessToken}
                />
              ))
            ) : (
              <p>Nenhum projeto encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#ffe4f2",
    minHeight: "100vh",
    margin: 0,
    display: "flex",
    padding: "20px",
  },
  container: {
    display: "flex",
    width: "100%",
    height: "100vh",
    gap: "20px", // Espaçamento entre as seções
  },
  leftSection: {
    width: "30%",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    height: "auto",
    boxSizing: "border-box",
    borderRight: "1px solid #ddd",
    transition: "all 0.3s ease-in-out",
  },
  rightSection: {
    width: "70%",
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px", // Espaçamento entre os projetos
  },
  genreList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  // Adicionando a linha
  genreSeparator: {
    borderTop: "2px solid #ddd", // Linha de separação
    margin: "10px 0", // Espaçamento acima e abaixo da linha
    width: "100%", // Garante que a linha ocupe toda a largura disponível
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start", // Alinha o conteúdo à esquerda
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
    transition: "background-color 0.3s, border-color 0.3s",
    flexDirection: "row-reverse", // Move a checkbox para a direita
    fontSize: "16px", // Aumenta o tamanho da fonte
    fontWeight: "500", // Deixa o texto mais forte
  },
  checkbox: {
    cursor: "pointer",
    transform: "scale(1.2)",
    accentColor: "#28a745", // Torna o checkbox verde
    marginLeft: "10px", // Diminui o espaço entre a checkbox e o texto
    transition: "transform 0.2s ease-in-out",
  },
  projectsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    width: "100%",
  },
  filterTitle: {
    textAlign: "center", // Centraliza o texto
    marginBottom: "10px", // Dá um pequeno espaçamento abaixo do título
    fontSize: "20px", // Tamanho da fonte
    fontWeight: "600", // Deixa o texto em negrito
  }
};

export default HomePage;
