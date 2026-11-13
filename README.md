# API de Cadastro de Tecnologias

Projeto de API REST com Node.js, Express, MongoDB Atlas, Mongoose e autenticacao JWT. O frontend utiliza HTML, CSS e JavaScript puro.

## 1. Requisitos

- Node.js instalado.
- Conta e cluster no MongoDB Atlas.
- VS Code (recomendado).

## 2. Instalacao

No terminal, dentro da pasta do projeto:

```bash
npm install
```

Crie uma copia do arquivo `.env.example` com o nome `.env` e preencha as variaveis:

```env
PORT=3003
MONGO_URL=sua_string_de_conexao_do_mongodb
JWT_SECRET=uma_chave_secreta_longa_e_aleatoria
ADMIN_EMAIL=admin@tecnologias.com
ADMIN_PASSWORD=uma_senha_forte
JWT_EXPIRES_IN=2h
```

Nao envie o arquivo `.env` para o GitHub. Ele ja esta protegido pelo `.gitignore`.

## 3. Executar

```bash
npm run dev
```

ou:

```bash
npm start
```

Acesse: http://localhost:3003

## 4. Login

Use o email e a senha definidos em `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env`.

A API retorna um token JWT. O frontend armazena o token em `sessionStorage` e envia o cabecalho:

```http
Authorization: Bearer SEU_TOKEN
```

## 5. Rotas

| Metodo | Rota | Descricao | Token |
|---|---|---|---|
| POST | `/api/auth/login` | Realizar login e receber token | Nao |
| GET | `/api/tecnologias` | Listar tecnologias | Sim |
| GET | `/api/tecnologias/:id` | Consultar por ID | Sim |
| POST | `/api/tecnologias` | Cadastrar tecnologia | Sim |
| PUT | `/api/tecnologias/:id` | Atualizar tecnologia | Sim |
| DELETE | `/api/tecnologias/:id` | Excluir tecnologia | Sim |

## 6. Exemplo de cadastro

Envie um JSON para `POST /api/tecnologias`:

```json
{
  "nome": "React",
  "base": "JS",
  "curvaAprendizado": "6 meses"
}
```

Valores permitidos para `base`: `PHP`, `C#` e `JS`.

## 7. Observacoes

- Todas as rotas de tecnologias exigem token JWT valido.
- O token tem duracao configuravel em `JWT_EXPIRES_IN`.
- O campo `curvaAprendizado` e texto para aceitar formatos como `6 meses`, `1 ano` ou `3 a 4 meses`.
- Para um ambiente real, utilize HTTPS, senha forte, segredo JWT robusto, limitacao de tentativas de login e gerenciamento seguro de usuarios.
