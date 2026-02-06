# 📊 Sistema de Gestão de Clientes - Grupo 7

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-blue?logo=tailwind-css)
![Responsivo](https://img.shields.io/badge/📱-100%25_Responsivo-green)

Um sistema completo de gestão de clientes desenvolvido com React + TypeScript + Tailwind CSS, com foco em experiência responsiva para desktop e mobile.

## ⚙️ Funcionalidades

### 🔐 Autenticação
- **Login/Cadastro** com validação em tempo real
- Armazenamento seguro com localStorage
- Sistema multi-usuário com isolamento de dados

### 👤 Gestão de Clientes
- ✅ Adicionar novos clientes com formulário completo
- 📋 Listar clientes em formato de cards (mobile) ou tabela (desktop)
- 🏷️ Status dinâmico (Ativo/Inativo/Pendente)
- 🔍 Visualização detalhada por cliente
- 🗑️ Exclusão segura com confirmação

### 🏢 Onboarding da Empresa
- Cadastro em 2 etapas (Proprietário + Empresa)
- Formulários com máscaras automáticas (CPF/CNPJ/Telefone)
- Validação completa de dados

### 📱 Design Responsivo
- **Mobile-first** approach
- Layout adaptativo para todos os dispositivos
- Cards interativos em mobile
- Tabelas otimizadas para desktop
- Navegação intuitiva em todas as telas

## 🚀 Tecnologias Utilizadas

| Tecnologia | Finalidade |
|------------|------------|
| **React 18** | Biblioteca principal para UI |
| **TypeScript** | Tipagem estática e segurança |
| **Tailwind CSS** | Estilização utilitária e responsiva |
| **React Router** | Navegação entre páginas |
| **LocalStorage** | Persistência de dados local |

## ⚡ Instalação e Uso

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Passos para instalação

1. **Clonar o repositório**
```bash
git clone https://github.com/seu-usuario/projeto-grupo7.git
cd projeto-grupo7
```

2. **Instalar dependências**
```bash
npm install
# ou
yarn install
```

3. **Iniciar servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Acessar no navegador**
```
http://localhost:5173
```

## 🧪 Testes de Usuário

1. **Cadastre-se** com um novo email
2. **Complete o onboarding** da empresa
3. **Adicione clientes** através do botão "+"
4. **Navegue** entre as visualizações mobile/desktop
5. **Teste a responsividade** redimensionando a janela

## 🔧 Recursos Técnicos

### Validações Implementadas
- ✅ Email com regex
- ✅ CPF/CNPJ formatados automaticamente
- ✅ Telefone com máscara (11) 99999-9999
- ✅ Senha mínima 6 caracteres
- ✅ Confirmação de senha

### Persistência de Dados
- Armazenamento por usuário (prefixo `user_${id}`)
- Dados isolados entre diferentes logins
- Atualização automática ao adicionar/remover

### Performance
- Lazy loading de componentes
- Otimização de re-renders
- Imagens otimizadas
- Código dividido por funcionalidade

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👥 Grupo 7

Esse sistema front-end é uma contribuição do desenvolvedor Vinicius Melo para o projeto de criação de um sistema de gestão de clientes do Grupo 7 da maratona DevSquad. No repositório original do projeto, devem ser incluídas tecnologias de back-end e banco de dados, oferecendo mais robustez ao sistema.

## 🎯 Próximas Melhorias

- Exportação de dados (PDF/Excel)
- Busca e filtros avançados
- Dashboard com gráficos
- Autenticação com backend real
- Notificações em tempo real
- Temas claro/escuro

---

⭐ Se este projeto te ajudou, dê uma estrela no repositório!

---

**Versão:** 1.0.0  
**Última atualização:** Janeiro 2026  
**Status do projeto:** ✅ Em produção