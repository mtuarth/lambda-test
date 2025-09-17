import React from 'react';

function Services({ config }) {
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-header">
          <h2>Nossos Serviços</h2>
          <p>Soluções completas para sua transformação digital</p>
        </div>
        
        <div className="services-grid">
          {config.services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <button className="service-btn">
                Saiba mais →
              </button>
            </div>
          ))}
        </div>
        
        <div className="services-cta">
          <h3>Precisa de uma solução customizada?</h3>
          <p>Nossa equipe está pronta para criar a solução perfeita para seu negócio</p>
          <button className="btn btn-primary">
            Vamos conversar
          </button>
        </div>
      </div>
    </section>
  );
}

export default Services;
