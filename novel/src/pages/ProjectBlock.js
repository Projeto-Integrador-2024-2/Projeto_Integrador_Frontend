import React from "react";

// acha os projeto publico de td mundo e leva pra ver
const ProjectBlock = ({ id, name, imageUrl }) => {
  //console.log(imageUrl)
  return (
    <div 
      style={styles.block} 
      onClick={() => window.location.href = `/project/view/${id}`}
    >
      <img src={imageUrl} alt={name} style={styles.image} />
      <h2 style={styles.name}>{name}</h2>
    </div>
  );
};

// acha os teus projetos e leva pra editar
const ProjectBlock2 = ({ id, name, imageUrl }) => {
  //console.log(imageUrl)
  return (
    <div 
      style={styles.block} 
      onClick={() => window.location.href = `/project/${id}`}
    >
      <img src={imageUrl} alt={name} style={styles.image} />
      <h2 style={styles.name}>{name}</h2>
    </div>
  );
};

// mostra as cenas do projeto e leva pra editar elas
const ProjectBlock3 = ({ id, name, imageUrl }) => {
  return (
    <div style={styles.block}>
      <img src={imageUrl} alt={name} style={styles.image} />
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