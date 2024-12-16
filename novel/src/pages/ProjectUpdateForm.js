import React, { useState, useEffect } from "react";
import api from "../api_access";

const ProjectUpdateForm = ({ project, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: project[0]?.name || "", // Verifica se praoject existe
    privacy: project[0]?.privacy || false, // Inicializa como booleano
    genres: project[0]?.genres?.map((genre) => genre.id) || [], // Verifica se genres existe
  });

  const [availableGenres, setAvailableGenres] = useState([]); // Para armazenar os gêneros disponíveis

  console.log(formData, availableGenres)

  // Busca os gêneros na API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get("/list/genre");
        setAvailableGenres(response.data); // Supondo que a resposta seja um array de gêneros
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "privacy" ? value === "true" : value, // Converte string para booleano
    }));
  };

  const handleGenresChange = (e) => {
    const options = e.target.options;
    const selectedGenres = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedGenres.push(Number(options[i].value)); // Converte o valor para número
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      genres: selectedGenres,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Passa os dados para a função onSubmit fornecida pelo componente pai
  };

  // Estilos Inline
  const styles = {
    form: {
      maxWidth: "600px",
      margin: "20px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    formGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "8px",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      fontWeight: "bold",
      color: "white",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label htmlFor="name" style={styles.label}>
          Project Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          style={styles.input}
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="privacy" style={styles.label}>
          Privacy:
        </label>
        <select
          id="privacy"
          name="privacy"
          style={styles.select}
          value={formData.privacy.toString()} // Converte booleano para string
          onChange={handleInputChange}
          required
        >
          <option value="false">Public</option>
          <option value="true">Private</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="genres" style={styles.label}>
          Genres:
        </label>
        <select
          id="genres"
          name="genres"
          multiple
          style={styles.select}
          value={formData.genres}
          onChange={handleGenresChange}
        >   
          {availableGenres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        style={styles.button}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Update Project
      </button>
    </form>
  );
};

export default ProjectUpdateForm;
