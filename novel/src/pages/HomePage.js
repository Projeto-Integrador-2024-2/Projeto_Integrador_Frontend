import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Biblioteca para manipular cookies

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove o token de autenticação dos cookies
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken"); // Opcional: remova também o refresh token
    navigate("/login"); // Redireciona para a página de login
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bem-vindo à Home Page!</h1>
      <p style={styles.subtitle}>Você está logado com sucesso.</p>
      <button style={styles.button} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

// Estilos simples para a página
const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    backgroundColor: 'pink',
    fontFamily: "'Arial', sans-serif",
  },
  title: {
    fontSize: "2.5rem",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default HomePage;
