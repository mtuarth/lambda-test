import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Configurações do template (normalmente viriam do S3/Lambda)
const DEFAULT_CONFIG = {
  siteName: "Minha Empresa",
  siteTitle: "Soluções Digitais Inovadoras",
  siteDescription: "Criamos experiências digitais únicas para seu negócio",
  primaryColor: "#667eea",
  secondaryColor: "#764ba2",
  services: [
    {
      id: 1,
      title: "Desenvolvimento Web",
      description: "Sites modernos e responsivos",
      icon: "🌐"
    },
    {
      id: 2,
      title: "Apps Mobile",
      description: "Aplicativos nativos e híbridos",
      icon: "📱"
    },
    {
      id: 3,
      title: "Cloud Solutions",
      description: "Infraestrutura escalável na nuvem",
      icon: "☁️"
    }
  ],
  contact: {
    email: "contato@minhaempresa.com",
    phone: "(11) 99999-9999",
    address: "São Paulo, SP"
  }
};

function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simular carregamento de configuração
    // Na versão real, isso viria do Lambda/S3
    const loadConfig = async () => {
      try {
        // Verificar se há configuração customizada
        const customConfig = window.SITE_CONFIG || {};
        
        setConfig({
          ...DEFAULT_CONFIG,
          ...customConfig
        });
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Simular delay de carregamento
    setTimeout(loadConfig, 800);
  }, []);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando template...</p>
      </div>
    );
  }
  
  return (
    <div className="app">
      <Header config={config} />
      <Hero config={config} />
      <Services config={config} />
      <Contact config={config} />
      <Footer config={config} />
    </div>
  );
}

export default App;
