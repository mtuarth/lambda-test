# Simple React Template

Template React simples para criação de sites corporativos através do Lambda.

## 📋 Sobre o Template

Este template foi criado para ser processado via AWS Lambda + Webpack, gerando sites estáticos customizáveis.

### ✨ Características:
- ⚡ **React 18** com componentes funcionais
- 🎨 **Design moderno** e responsivo  
- 🔧 **Totalmente customizável** via configuração
- 📱 **Mobile-first** approach
- 🚀 **Otimizado para build** via webpack

### 📁 Estrutura:
```
src/
├── index.js           # Entry point
├── App.js            # Componente principal
├── styles.css        # Estilos globais
└── components/       # Componentes do template
    ├── Header.js     # Cabeçalho com navegação
    ├── Hero.js       # Seção principal/banner
    ├── Services.js   # Seção de serviços
    ├── Contact.js    # Formulário de contato
    └── Footer.js     # Rodapé
```

## ⚙️ Configuração

O template é customizado via `template-config.json` e variáveis passadas no build:

```json
{
  "siteName": "Minha Empresa",
  "siteTitle": "Soluções Digitais",
  "siteDescription": "Descrição do negócio",
  "primaryColor": "#667eea",
  "services": [...],
  "contact": {...}
}
```

## 🔨 Build Process

1. **Lambda recebe** configuração do site
2. **Template baixado** do S3
3. **Webpack processa** React → HTML/CSS/JS
4. **Site estático** gerado e enviado para S3

## 🎯 Uso no Lambda

```javascript
// Lambda irá:
// 1. Baixar este template do S3
// 2. Instalar dependências (via Layer)
// 3. Aplicar configuração customizada
// 4. Executar webpack build
// 5. Fazer upload do site gerado
```

## 📦 Dependencies

### Runtime:
- react@18.2.0
- react-dom@18.2.0

### Build:
- webpack@5.88.0
- babel-loader@9.1.0
- html-webpack-plugin@5.5.0
- css-loader@6.8.0
- style-loader@3.3.0

## 🚀 Próximos Passos

1. Upload para S3
2. Teste via Lambda
3. Integração com Guard Service
4. Deploy automatizado
