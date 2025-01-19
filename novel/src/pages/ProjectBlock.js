import React from "react";
import api from "../api_access";
import './styles/ProjectBlock.css'; // Importar o CSS

const defaultImageUrl = "/images/No_Image_Available.jpg"; // Caminho da imagem padrão

const ProjectBlock = ({ id, name, imageUrl, isPrivate, isStaff, accessToken }) => {
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