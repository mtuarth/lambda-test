# 🚀 Como Rodar o Template React

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (com hot reload)
npm start

# Build de produção
npm run build
```

## URLs de Desenvolvimento

- **Local:** http://localhost:8080
- **Network:** http://192.168.x.x:8080 (para testar em outros dispositivos)

## Scripts Disponíveis

- `npm start` → Desenvolvimento com hot reload
- `npm run build` → Build de produção (pasta dist/)
- `npm run dev` → Alias para npm start

## Estrutura Visual

O template inclui:

### 🎨 **Header**
- Logo da empresa
- Menu de navegação
- Menu mobile (hamburger)

### 🌟 **Hero Section**
- Título principal
- Descrição do negócio
- Botões de call-to-action
- Estatísticas (projetos, clientes, anos)
- Animação floating card

### 💼 **Services Section**
- Grid de serviços
- Cards com ícones
- Call-to-action secundário

### 📞 **Contact Section**
- Informações de contato
- Formulário funcional
- Layout em duas colunas

### 📱 **Footer**
- Links organizados
- Redes sociais
- Copyright

## Customização

Edite as configurações em `src/App.js`:

```javascript
const DEFAULT_CONFIG = {
  siteName: "Sua Empresa",
  siteTitle: "Seu Título",
  // ... outras configurações
};
```

## Tecnologias

- ⚛️ React 18
- 📦 Webpack 5
- 🎨 CSS3 + Flexbox/Grid
- 📱 Mobile-first responsive
- 🔥 Hot Module Replacement
