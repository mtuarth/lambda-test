import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Criar root do React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar aplicação
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hot Module Replacement (para desenvolvimento)
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(
      <React.StrictMode>
        <NextApp />
      </React.StrictMode>
    );
  });
}
