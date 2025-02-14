import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Certifique-se de que esta biblioteca está instalada
import { ProjectBlockGrade }  from "./ProjectBlock";
import api from "../api_access";
import './styles/HomePage.css';

const MyGrades = () => {
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
        const response = await api.get("list/project/rated", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        //console.log(response.data)
        const updatedProjects = response.data.map((project) => {
          if (project.first_scene === null) {
            project.first_scene = {
              url_background: "-",
            };
          }
          return project;
        });
        //console.log(updatedProjects.)
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
    <div className="homepage-page">
      <div className="homepage-container">
        {/* Seção esquerda (30%) - Filtros por gêneros */}
        <div className="homepage-leftSection">
          <h3 className="homepage-filterTitle">Filtrar por Gênero</h3>

          {/* Linha de separação */}
          <div className="homepage-genreSeparator"></div>

          <div className="homepage-genreList">
            {genres.map((genre) => (
              <label key={genre.id} className="homepage-checkboxLabel">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  className="homepage-checkbox"
                />
                {genre.name}
              </label>
            ))}
          </div>
        </div>

        {/* Seção direita (70%) com projetos */}
        <div className="homepage-rightSection">
          <h2>Projetos Recentes</h2>
          <div className="homepage-projectsContainer">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectBlockGrade
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  imageUrl={project.first_scene.url_background}
                  isPrivate={project.privacy}
                  accessToken={accessToken}
                  averageGrade={project.user_grade}
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

export default MyGrades;
