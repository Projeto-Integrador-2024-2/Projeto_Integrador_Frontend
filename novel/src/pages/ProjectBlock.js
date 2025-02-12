import React from "react";
import api from "../api_access";
import './styles/ProjectBlock.css'; // Importar o CSS

const defaultImageUrl = "/images/No_Image_Available.jpg"; // Caminho da imagem padrão

const ProjectBlock = ({ id, name, imageUrl, isPrivate, isStaff, accessToken, averageGrade }) => {
  const blockClass = isPrivate ? "block private" : "block";

  const handleDelete = async () => {
    if (window.confirm("Tem certeza de que deseja excluir este projeto?")) {
      try {
        await api.delete(`delete/project?id=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert("Projeto excluído com sucesso!");
        window.location.reload(); // Recarrega a página para atualizar a lista de projetos
      } catch (error) {
        console.error("Erro ao excluir o projeto:", error);
        alert("Ocorreu um erro ao tentar excluir o projeto.");
      }
    }
  };

  // Função para renderizar as estrelas baseadas na nota (averageGrade)
  const renderStars = (rating) => {
    // Garantir que o rating seja um número válido entre 0 e 100
    const validRating = Math.min(Math.max(parseFloat(rating), 0), 100);
    // Converte a nota de 0-100 para uma escala de 0-5
    const starsRating = (validRating / 20).toFixed(1);  // Agora o valor de starsRating será entre 0 e 5, com uma casa decimal

    const fullStars = Math.floor(starsRating);
    const halfStars = starsRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <div className="stars">
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-star-${index}`} className="star full">★</span>
        ))}
        {halfStars > 0 && (
          <span className="star half">★</span>  // Estrela meia cheia
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-star-${index}`} className="star empty">★</span>
        ))}
      </div>
    );
  };

  return (
    <div
      className={blockClass}
      onClick={() => window.location.href = `/project/view/${id}`}
    >
      <img
        src={imageUrl}
        alt={name}
        className="image"
        onError={(e) => { e.target.src = defaultImageUrl; }} // Define imagem padrão em caso de erro
      />
      <h2 className="name">{name}</h2>
      {averageGrade != null && renderStars(averageGrade)}  {/* Exibe as estrelas caso a nota esteja presente */}
      {isStaff && (
        <button
          className="deleteButton"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          Excluir
        </button>
      )}
    </div>
  );
};

const ProjectBlock2 = ({ id, name, imageUrl }) => {
  return (
    <div
      className="block"
      onClick={() => window.location.href = `/project/${id}`}
    >
      <img
        src={imageUrl}
        alt={name}
        className="image"
        onError={(e) => { e.target.src = defaultImageUrl; }} // Define imagem padrão em caso de erro
      />
      <h2 className="name">{name}</h2>
    </div>
  );
};

const ProjectBlock3 = ({ id, name, imageUrl }) => {
  return (
    <div className="block">
      <img
        src={imageUrl}
        alt={name}
        className="image"
        onError={(e) => { e.target.src = defaultImageUrl; }} // Define imagem padrão em caso de erro
      />
      <h2 className="name">{name}</h2>
    </div>
  );
};

export { ProjectBlock, ProjectBlock2, ProjectBlock3 };