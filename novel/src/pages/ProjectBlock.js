import React, { useState, useEffect } from "react";
import api from "../api_access";

const defaultImageUrl = "/images/No_Image_Available.jpg"; // Caminho da imagem padrão

// acha os projetos públicos de todo mundo e leva para visualização
const ProjectBlock = ({ id, name, imageUrl, isPrivate, isStaff, accessToken }) => {
  const blockStyle = {
    ...styles.block,
    backgroundColor: isPrivate ? "#ffe6e6" : "#f0f0f0", // Cor diferente para projetos privados
  };

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
      style={blockStyle}
      onClick={() => window.location.href = `/project/view/${id}`}
    >
      <img
        src={imageUrl}
        alt={name}
        style={styles.image}
        onError={(e) => { e.target.src = defaultImageUrl; }} // Define imagem padrão em caso de erro
      />
      <h2 style={styles.name}>{name}</h2>
      {isStaff && (
        <button
          style={styles.deleteButton}
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
      style={styles.block}
      onClick={() => window.location.href = `/project/${id}`}
    >
      <img
        src={imageUrl}
        alt={name}
        style={styles.image}
        onError={(e) => { e.target.src = defaultImageUrl; }} // Define imagem padrão em caso de erro
      />
      <h2 style={styles.name}>{name}</h2>
    </div>
  );
};

const ProjectBlock3 = ({ id, name, imageUrl }) => {
  return (
    <div style={styles.block}>
      <img
        src={imageUrl}
        alt={name}
        style={styles.image}
        onError={(e) => { e.target.src = defaultImageUrl; }} // Define imagem padrão em caso de erro
      />
      <h2 style={styles.name}>{name}</h2>
    </div>
  );
};

const styles = {
  block: {
    width: "200px",
    height: "150px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    position: "relative",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px 8px 0 0",
  },
  name: {
    fontSize: "16px",
    color: "#333",
    padding: "8px",
    textAlign: "center",
  },
};

// Adiciona efeito de hover
styles.block[':hover'] = {
  transform: "scale(1.05)",
};

export { ProjectBlock, ProjectBlock2, ProjectBlock3 };