import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';

// Definindo o estilo global para a fonte
const globalStyle = {
  fontFamily: 'Poppins, sans-serif', // Fonte Poppins
  margin: 0, // Evitar margens padrão
  padding: 0, // Evitar paddings padrão
};

const rootStyles = {
  margin: 0,
  padding: 0,
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <div style={rootStyles}>
      <App />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));

// Aplicando o estilo global diretamente na div que envolve o componente App
root.render(
  <div style={globalStyle}>
    <App />
  </div>
);
