# GreenTweet

Uma aplicação web full-stack de rede social, construída para publicar textos e imagens, descobrir conteúdo e interagir entre perfis.

## Links principais

- Aplicação: [greentweet.vercel.app](https://greentweet.vercel.app)
- API e health check: [greentweet-api.vercel.app/health/](https://greentweet-api.vercel.app/health/)

## Visão geral

O GreenTweet apresenta um fluxo completo de uma rede social: a pessoa cria uma conta, entra com autenticação JWT, configura o perfil, publica conteúdo, acompanha posts, busca perfis e publicações e interage com curtidas, comentários e seguidores.

Do ponto de vista técnico, o projeto separa uma SPA React da API Django REST Framework. O frontend mantém o estado de autenticação no Redux, renova o token de acesso após respostas `401` e consome uma API protegida por Bearer token. O logout é local: remove os tokens e o estado de sessão do navegador, sem chamar uma rota da API. No backend, as regras de autoria impedem a edição ou exclusão de posts, comentários e relações de seguimento de outras pessoas.

## Principais funcionalidades

- Cadastro, login, renovação de token e recuperação dos dados da conta autenticada.
- Perfis com nome de usuário, nome, sobrenome, biografia e avatar.
- Criação, edição e exclusão de publicações de até 280 caracteres, com texto, imagem ou ambos.
- Upload de imagens para posts e avatares, com validação de tipo e limite de 2 MB.
- Extração automática de hashtags do texto da publicação e consulta de posts por hashtag.
- Curtidas, com prevenção de duplicidade por usuário e post.
- Comentários em publicações, com operações de criação, edição e exclusão autorizadas pelo autor.
- Seguidores e perfis seguidos, incluindo bloqueio de auto-seguimento e de relações duplicadas.
- Notificações de curtidas, comentários e novos seguidores; o frontend as consulta periodicamente e exibe avisos para itens novos.
- Busca por nome de usuário e conteúdo de posts.

## Tecnologias

| Camada | Tecnologias confirmadas no repositório |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router, Redux Toolkit, Redux Persist, TanStack React Query, Axios e styled-components |
| Backend | Python, Django 5, Django REST Framework, Simple JWT, django-cors-headers, WhiteNoise e Gunicorn |
| Banco de dados | PostgreSQL; `dj-database-url` para a variável `DATABASE_URL` |
| Infraestrutura e mídia | Vercel, Neon (PostgreSQL) e Cloudinary; Docker Compose com PostgreSQL 15 para desenvolvimento local |

## Arquitetura do monorepo

O repositório contém dois projetos independentes, preparados para serem publicados separadamente:

| Diretório | Papel |
| --- | --- |
| `greentweet-frontend` | SPA React/Vite que consome a API por meio de `VITE_API_URL` |
| `greentweet-backend` | API REST em Django, responsável por autenticação, regras de negócio e persistência |

A API utiliza PostgreSQL. Em produção, a configuração espera uma `DATABASE_URL` do Neon. Os arquivos de mídia podem usar o armazenamento local no desenvolvimento ou o Cloudinary quando `USE_CLOUDINARY=True`.

## Estrutura das pastas

```text
.
├── greentweet-frontend/
│   ├── src/
│   │   ├── api/           # Cliente HTTP e módulos de consumo da API
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Login, cadastro, feed e perfil
│   │   ├── store/         # Redux Toolkit e thunks
│   │   └── types/         # Tipos TypeScript
│   ├── public/
│   └── vercel.json        # Rewrite para a SPA
├── greentweet-backend/
│   ├── greentweet/        # Configurações, URLs, WSGI e health check
│   ├── users/             # Cadastro e dados da conta autenticada
│   ├── profiles/          # Perfis e avatares
│   ├── posts/             # Posts, feed e hashtags
│   ├── likes/, comments/, follows/, notifications/, search/
│   ├── requirements.txt
│   └── docker-compose.yml # PostgreSQL local
└── README.md
```

## Como executar localmente

Pré-requisitos: Node.js 20+, Python 3.11+ e PostgreSQL. Como alternativa ao PostgreSQL instalado, o backend oferece um `docker-compose.yml` com PostgreSQL 15 exposto na porta `5433`.

### Backend

```powershell
cd greentweet-backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# configure as variáveis do banco e, se necessário, do Cloudinary
python manage.py migrate
python manage.py runserver
```

O servidor de desenvolvimento inicia, por padrão, em `http://localhost:8000`.

### Frontend

Em outro terminal:

```powershell
cd greentweet-frontend
npm ci
copy .env.example .env
npm run dev
```

Defina `VITE_API_URL=http://localhost:8000` no arquivo `greentweet-frontend/.env`. O Vite normalmente disponibiliza a aplicação em `http://localhost:5173`.

## Variáveis de ambiente

Os arquivos `.env.example` são o ponto de partida e não contêm segredos. Os arquivos `.env` são ignorados pelo Git.

### Backend (`greentweet-backend`)

| Variável | Uso |
| --- | --- |
| `SECRET_KEY` | Chave secreta do Django; deve ser definida em produção. |
| `DEBUG` | Use `False` em produção. Com `True`, `http://localhost:5173` é incluído no CORS. |
| `DATABASE_URL` | URL de conexão PostgreSQL usada pela aplicação. |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | Alternativa local à `DATABASE_URL`. |
| `ALLOWED_HOSTS` | Hosts Django separados por vírgula; `VERCEL_URL` é acrescentada automaticamente quando fornecida pela plataforma. |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas do frontend, separadas por vírgula. |
| `CSRF_TRUSTED_ORIGINS` | Origens confiáveis completas, incluindo protocolo, separadas por vírgula. |
| `USE_CLOUDINARY` | `True` para usar o Cloudinary no armazenamento de mídia. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Credenciais do Cloudinary. |

### Frontend (`greentweet-frontend`)

| Variável | Uso |
| --- | --- |
| `VITE_API_URL` | URL base pública da API. Não armazene segredos nessa variável, pois ela é incorporada no build do Vite. |

## Deploy com Vercel, Neon e Cloudinary

### Vercel

1. Crie um projeto para `greentweet-frontend` com **Root Directory** definido como `greentweet-frontend`. Configure `VITE_API_URL` com a URL HTTPS pública da API. O `vercel.json` desse projeto redireciona rotas para `index.html`, permitindo o roteamento da SPA.
2. Crie outro projeto com **Root Directory** em `greentweet-backend`. O `manage.py` está na raiz desse diretório e a aplicação WSGI é `greentweet.wsgi:application`. Não há `vercel.json` no backend.
3. Não execute migrations no build da Vercel. Execute-as de forma controlada antes ou durante a manutenção do banco.
4. No backend, configure ao menos `SECRET_KEY`, `DEBUG=False`, `DATABASE_URL`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` e `CSRF_TRUSTED_ORIGINS` para os domínios publicados.

### Neon

- Use a URL **pooled** do Neon como `DATABASE_URL` da aplicação serverless. A configuração Django desabilita conexões persistentes (`conn_max_age=0`) e cursores server-side, adequando-se a pools compatíveis com PgBouncer.
- Para executar migrations, utilize manualmente uma URL **direta** do Neon fora do build/deploy da Vercel. Não use a URL pooled nessa operação.

### Cloudinary

Para que novos uploads de posts e avatares sejam enviados ao Cloudinary, defina `USE_CLOUDINARY=True` e informe `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` no ambiente do backend. Sem essa configuração, o Django usa armazenamento local de mídia.

> O arquivo `greentweet-backend/render.yaml` permanece no repositório e descreve uma configuração separada para Render; ele não faz parte do fluxo acima com Vercel, Neon e Cloudinary.

## Endpoints principais

As rotas abaixo são servidas pela API. As rotas de saúde, autenticação e consulta de hashtags são públicas; as demais exigem `Authorization: Bearer <access_token>`.

| Método e rota | Finalidade |
| --- | --- |
| `GET /health/` | Verificação pública de disponibilidade; responde `{ "status": "ok" }`. |
| `POST /auth/register/` | Cria uma conta. |
| `POST /auth/login/` | Emite tokens JWT de acesso e atualização. |
| `POST /auth/refresh/` | Renova o token de acesso. |
| `GET /auth/me/` | Retorna os dados da conta autenticada. |
| `GET /profiles/me/` | Retorna o perfil da conta autenticada. |
| `GET /profiles/username/{username}/` | Busca um perfil por nome de usuário. |
| `GET`, `PATCH /profiles/{id}/` | Consulta ou atualiza um perfil; a atualização é restrita ao proprietário. |
| `GET`, `POST /posts/` | Lista publicações ou cria uma publicação. Aceita filtro `?author={username}`. |
| `GET`, `PATCH`, `DELETE /posts/{id}/` | Consulta, altera ou exclui uma publicação. |
| `GET /posts/mine/` | Lista as publicações da pessoa autenticada. |
| `GET /feed/?limit=10&offset=0` | Lista posts de contas seguidas, com paginação por limite e deslocamento. |
| `GET /tags/` e `GET /tags/{name}/posts/` | Lista hashtags e posts associados a uma hashtag. |
| `POST /likes/`, `DELETE /likes/{id}/` | Cria ou remove uma curtida. |
| `GET /comments/?post={id}` | Lista os comentários de um post; sem o parâmetro, lista todos os comentários. IDs de post inválidos retornam `400`. |
| `POST /comments/`; `PATCH`, `DELETE /comments/{id}/` | Cria, altera ou exclui comentários. |
| `POST /follows/`, `DELETE /follows/{id}/` | Segue ou deixa de seguir uma conta. |
| `GET /profiles/{id}/followers/`, `GET /profiles/{id}/following/` | Lista seguidores ou perfis seguidos. |
| `GET /notifications/`, `PATCH /notifications/{id}/` | Lista notificações da conta ou marca uma como lida. |
| `GET /search/?q={termo}` | Busca perfis por nome de usuário e posts por conteúdo. |

## Testes e validações existentes

O backend possui testes automatizados para a listagem de comentários em `comments/tests.py`. Eles cobrem comentários de posts diferentes, filtro por post, resposta vazia, parâmetro inválido e autenticação obrigatória. Os demais arquivos `tests.py` ainda contêm apenas o esqueleto gerado pelo Django. No frontend não há script de testes no `package.json`.

As verificações disponíveis no repositório são:

```powershell
cd greentweet-backend
python manage.py check
python manage.py test
python manage.py collectstatic --noinput

cd ..\greentweet-frontend
npm ci
npm run lint
npm run build
```

## Limitações conhecidas

- A cobertura automatizada atual está concentrada na listagem de comentários; os demais apps do backend ainda não possuem casos de teste implementados.
- O frontend ainda não possui uma suíte de testes configurada.
- O arquivo `render.yaml` ainda referencia Render, embora os links principais e a documentação de deploy apontem para Vercel.

## Autor

[Lukas Frick](https://github.com/LukasFrickDev) · [LinkedIn](https://www.linkedin.com/in/lukaschristophfrick)
