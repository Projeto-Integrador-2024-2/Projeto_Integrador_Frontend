import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import './pages/styles/styles.css';



// Definindo o estilo global para a fonte
//const globalStyle = {
//  fontFamily: 'Poppins, sans-serif', // Fonte Poppins
//  margin: 0, // Evitar margens padrão
//  padding: 0, // Evitar paddings padrão
//};
//
//const rootStyles = {
//  margin: 0,
//  padding: 0,
//  width: '100%',
//  height: '100%',
//  boxSizing: 'border-box',
//};

ReactDOM.createRoot(document.getElementById('root')).render(
  <div>
      <App />
  </div>
);
