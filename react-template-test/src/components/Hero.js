import React from 'react';

function Hero({ config }) {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">{config.siteTitle}</h1>
          <p className="hero-description">{config.siteDescription}</p>
          
          <div className="hero-buttons">
            <button className="btn btn-primary">
              Conheça nossos serviços
            </button>
            <button className="btn btn-secondary">
              Entre em contato
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">100+</span>
              <span className="stat-label">Projetos</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Clientes</span>
            </div>
            <div className="stat">
              <span className="stat-number">3+</span>
              <span className="stat-label">Anos</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-shape">
            <div className="floating-card">
              <div className="card-header">
                <div className="card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="card-content">
                <div className="code-line"></div>
                <div className="code-line short"></div>
                <div className="code-line"></div>
                <div className="code-line medium"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
