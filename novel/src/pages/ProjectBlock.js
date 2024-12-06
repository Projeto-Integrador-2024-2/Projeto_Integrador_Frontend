import React from "react";

const ProjectBlock = ({ id, name }) => {
  return (
    <div style={styles.block}>
      <h2 style={styles.name}>{name}</h2>
      <button 
        style={styles.button} 
        onClick={() => window.location.href = `/project/${id}`}
      >
        Ver Projeto
      </button>
    </div>
  );
};

const styles = {
  block: {
    border: "1px solid #ccc",
    padding: "16px",
    margin: "8px",
    borderRadius: "8px",
    textAlign: "center",
    maxWidth: "300px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  },
  name: {
    fontSize: "1.5em",
    margin: "0 0 12px 0",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  }
};

export default ProjectBlock;
