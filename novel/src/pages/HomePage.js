import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const redirectProject = () => navigate("/project");
  const redirectScene = () => navigate("/scene");
  const redirectChoice = () => navigate("/choice");

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Your Novel Dashboard</h1>
        <p style={styles.subtitle}>Gerencie seus projetos, cenas e escolhas</p>
      </header>

      <div style={styles.gridContainer}>
        <button style={styles.card} onClick={redirectProject}>
          <img src="/images/coracao_roxo.png" alt="Projects" style={styles.cardIcon} />
          <span style={styles.cardTitle}>Projects</span>
        </button>
        <button style={styles.card} onClick={redirectScene}>
          <img src="/images/coracao_roxo.png" alt="Scenes" style={styles.cardIcon} />
          <span style={styles.cardTitle}>Scenes</span>
        </button>
        <button style={styles.card} onClick={redirectChoice}>
          <img src="/images/coracao_roxo.png" alt="Choices" style={styles.cardIcon} />
          <span style={styles.cardTitle}>Choices</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fef5f8",
    fontFamily: "'Poppins', sans-serif",
    padding: "40px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    width: "100%",
  },
  title: {
    fontSize: "2.5rem",
    color: "#7e005f", // Alterada para um tom de azul
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#6b686a", // Alterada para um tom de vermelho
    marginTop: "10px",
  },
  gridContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    width: "100%",
    marginTop: "50px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    textDecoration: "none",
    width: "150px",
  },
  cardIcon: {
    width: "30px",
    height: "30px",
    marginBottom: "10px",
  },
  cardTitle: {
    fontSize: "1.2rem",
    color: "#333",
    fontWeight: "bold",
  },
};

export default HomePage;
