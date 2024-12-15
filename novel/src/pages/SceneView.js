import React from "react";

// Componente Scene
const Scene = ({
  urlBackground,
  urlTextBox,
  urlCharacterLeft,
  urlCharacterMiddle,
  urlCharacterRight,
  text,
}) => {
  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.container,
          backgroundImage: `url(${urlBackground})`,
          backgroundColor: urlBackground ? "transparent" : "#333", // Fundo escuro se não houver imagem
        }}
      >
        <CharacterContainer
          urlCharacterLeft={urlCharacterLeft}
          urlCharacterMiddle={urlCharacterMiddle}
          urlCharacterRight={urlCharacterRight}
        />
        <TextBoxContainer urlTextBox={urlTextBox} text={text} />
      </div>
    </div>
  );
};

// Componente para exibir os personagens
const CharacterContainer = ({ urlCharacterLeft, urlCharacterMiddle, urlCharacterRight }) => (
  <div style={styles.characters}>
    {urlCharacterLeft && (
      <img
        src={urlCharacterLeft}
        alt="Character Left"
        style={styles.characterLeft}
        onError={(e) => (e.target.style.display = "none")} // Oculta a imagem caso falhe ao carregar
        onLoad={(e) => (e.target.style.display = "flex")}

      />
    )}
    {urlCharacterMiddle && (
      <img
        src={urlCharacterMiddle}
        alt="Character Middle"
        style={styles.characterMiddle}
        onError={(e) => (e.target.style.display = "none")} // Oculta a imagem caso falhe ao carregar
        onLoad={(e) => (e.target.style.display = "flex")}

      />
    )}
    {urlCharacterRight && (
      <img
        src={urlCharacterRight}
        alt="Character Right"
        style={styles.characterRight}
        onError={(e) => (e.target.style.display = "none")} // Oculta a imagem caso falhe ao carregar
        onLoad={(e) => (e.target.style.display = "flex")}
      />
    )}
  </div>
);

// Componente para exibir a caixa de texto
const TextBoxContainer = ({ urlTextBox, text }) => (
  <div style={styles.textBoxContainer}>
    {urlTextBox && (
      <img
        src={urlTextBox}
        alt="Text Box"
        style={styles.textBox}
        onError={(e) => (e.target.style.display = "none")} // Oculta a imagem caso falhe ao carregar
      />
    )}
    {text && <p style={styles.text}>{text}</p>}
  </div>
);

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  container: {
    position: "relative",
    width: "100%",
    maxWidth: "1200px",
    height: "75vh",
    maxHeight: "800px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    border: "2px solid #fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.8)",
    backgroundColor: "#333",
  },
  characters: {
    position: "absolute",
    bottom: "15%",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 8%", // Aumentado para mover os personagens para a esquerda
  },
  characterLeft: {
    position: "absolute", // Posicionamento absoluto para o personagem da esquerda
    bottom: "0", // Posiciona no fundo do container
    left: "4%", // Posiciona à esquerda do container
    height: "500px",
    maxWidth: "25%",
    objectFit: "contain",
  },
  characterMiddle: {
    position: "absolute",
    bottom: "0",
    left: "31%", // Coloca o personagem no meio (ajuste conforme necessário)
    height: "500px",
    maxWidth: "25%",
    objectFit: "contain",
  },
  characterRight: {
    position: "absolute",
    bottom: "0",
   left: "58%", // Coloca o personagem à direita
   height: "500px",
   maxWidth: "25%",
   objectFit: "contain",
  },
  textBoxContainer: {
    position: "absolute",
    bottom: "5%",
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: "8px",
    zIndex: 2,
  },
  textBox: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
  text: {
    position: "relative",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
    lineHeight: "1.5",
    zIndex: 2,
  },
};


export default Scene;
