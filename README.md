# Todo API NestJS

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS Badge"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge"/>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Badge"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Badge"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma Badge"/>
</p>

## Sobre o Projeto

Este projeto é uma API de tarefas (Todo API) desenvolvida com [NestJS](https://nestjs.com/), utilizando TypeScript, PostgreSQL, Docker e Prisma ORM. O objetivo principal foi aprender a essência do NestJS, já que eu já domino outras linguagens de programação e frameworks. O foco foi entender a estrutura, conceitos e boas práticas do NestJS para poder evoluir em projetos mais complexos futuramente.

> **Nota:** Este repositório é apenas para fins de estudo e referência rápida sobre a stack NestJS.

---

## Funcionalidades

- Cadastro e autenticação de usuários
- CRUD de tarefas (todos)
- Relacionamento entre usuários e tarefas
- Paginação e filtros
- Validações e tratamento de erros
- Integração com banco de dados PostgreSQL via Prisma
- Deploy e ambiente de desenvolvimento com Docker

---

## Tecnologias Utilizadas

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

## Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)

### Passos

```bash
# Clone o repositório
$ git clone https://github.com/Kauanrodrigues01/todo-api-nestjs.git
$ cd todo-api-nestjs

# Instale as dependências
$ yarn install
# ou
$ npm install

# Suba o banco de dados com Docker
$ docker-compose up -d

# Rode as migrations do Prisma
$ npx prisma migrate dev

# Inicie a aplicação
$ yarn start:dev
# ou
$ npm run start:dev
```

A API estará disponível em `http://localhost:3000`.

---

## Estrutura do Projeto

```
├── src/
│   ├── app/           # Módulo principal
│   ├── auth/          # Autenticação e usuários
│   ├── common/        # Utilitários, DTOs, middlewares, etc
│   ├── prisma/        # Configuração do Prisma ORM
│   └── tasks/         # CRUD de tarefas
├── prisma/            # Migrations e schema do banco
├── test/              # Testes automatizados
├── docker-compose.yml # Configuração Docker
└── ...
```

---

<p align="center">
  <b>Feito por Kauan Rodrigues</b>
</p>
