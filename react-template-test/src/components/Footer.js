import React from 'react';

function Footer({ config }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{config.siteName}</h3>
            <p>{config.siteDescription}</p>
            <div className="social-links">
              <a href="#" aria-label="LinkedIn">💼</a>
              <a href="#" aria-label="GitHub">🐙</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Serviços</h4>
            <ul>
              {config.services.map((service) => (
                <li key={service.id}>
                  <a href="#services">{service.title}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contato</h4>
            <ul>
              <li>📧 {config.contact.email}</li>
              <li>📱 {config.contact.phone}</li>
              <li>📍 {config.contact.address}</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Links Úteis</h4>
            <ul>
              <li><a href="#home">Início</a></li>
              <li><a href="#services">Serviços</a></li>
              <li><a href="#contact">Contato</a></li>
              <li><a href="#">Política de Privacidade</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} {config.siteName}. Todos os direitos reservados.</p>
          <p>Desenvolvido com ❤️ e React</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
