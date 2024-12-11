import React from "react";

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
      <div style={{ ...styles.container, backgroundImage: `url(${urlBackground})` }}>
        <div style={styles.characters}>
          {urlCharacterLeft && <img src={urlCharacterLeft} alt="Character Left" style={{ ...styles.character, ...styles.characterLeft }} />}
          {urlCharacterMiddle && <img src={urlCharacterMiddle} alt="Character Middle" style={{ ...styles.character, ...styles.characterMiddle }} />}
          {urlCharacterRight && <img src={urlCharacterRight} alt="Character Right" style={{ ...styles.character, ...styles.characterRight }} />}
        </div>
        <div style={styles.textBoxContainer}>
          {urlTextBox && <img src={urlTextBox} alt="Text Box" style={styles.textBox} />}
          {text && <p style={styles.text}>{text}</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    //alignItems: "center",
    //height: "100vh",
    //backgroundColor: "#000",
  },
  container: {
    position: "relative",
    width: "90vw", // Limite de largura
    maxWidth: "1200px", // Tamanho máximo
    height: "75vh", // Proporção da altura
    maxHeight: "800px", // Tamanho máximo de altura
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    border: "2px solid #fff", // Moldura branca
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.8)", // Sombra para destacar a cena
  },
  characters: {
    position: "absolute",
    bottom: "20%",
    maxWidth: "1200px",
    width: "100%",
    //display: "flex",
    justifyContent: "space-between", // Ajusta a posição dos personagens
    alignItems: "flex-end",
    //padding: "0 5%",
    overflow: "hidden", // Garante que os personagens não saiam do contêiner
  },
  character: {
    height: "500px",
    maxHeight: "100%", // Limita a altura máxima dos personagens
    maxWidth: "33%", // Limita a largura máxima dos personagens
    objectFit: "contain",
  },
  characterLeft: {
    alignSelf: "flex-start",
  },
  characterMiddle: {
    alignSelf: "center",
  },
  characterRight: {
    alignSelf: "flex-end",
  },
  textBoxContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "90%",
    margin: "0 auto 10px auto",
    padding: "20px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fundo escuro semitransparente
    borderRadius: "8px", // Bordas arredondadas para harmonizar
  },
  textBox: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
  text: {
    position: "relative", // Não mais absoluto, ajustado pelo container
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "left",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)", // Para destaque extra
    lineHeight: "1.5",
  },
};




export default Scene;
