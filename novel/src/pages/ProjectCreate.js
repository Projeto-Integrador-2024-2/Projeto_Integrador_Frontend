import React from 'react';

const Profile = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>This is the Create Project Page</h1>
      <p style={styles.text}>Here, you can create your projects</p>
    </div>
  );
};

// Estilos para a página
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#7e005f',
  },
  text: {
    fontSize: '18px',
    color: '#333',
  },
};

export default Profile;
