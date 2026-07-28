# GreenTweet

Aplicação full-stack de rede social construída como projeto final do curso EBAC Desenvolvedor FullStack Python.

## Arquitetura

O repositório é um monorepo com dois projetos independentes para deploy:

| Projeto | Responsabilidade | Hospedagem |
| --- | --- | --- |
| `greentweet-frontend` | SPA React + Vite | Vercel |
| `greentweet-backend` | API Django REST Framework (WSGI) | segundo projeto na Vercel |
| Neon | PostgreSQL | Neon |
| Cloudinary | imagens de posts e avatares | Cloudinary |

Na Vercel, configure `greentweet-frontend` e `greentweet-backend` como projetos separados, cada um com seu respectivo **Root Directory**. O `manage.py` está na raiz de `greentweet-backend` e o WSGI configurado é `greentweet.wsgi:application`; a detecção nativa atual da Vercel para Django reconhece essa estrutura, portanto não é necessário um `vercel.json` no backend. O `render.yaml` continua no repositório como fallback do ambiente anterior.

## Desenvolvimento local

Pré-requisitos: Node.js 20+, Python 3.11+, PostgreSQL local e, opcionalmente, uma conta Cloudinary.

### Backend

```powershell
cd greentweet-backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# configure a conexão PostgreSQL local e, se desejado, Cloudinary
python manage.py migrate
python manage.py runserver
```

Para desenvolvimento local, o backend mantém compatibilidade com `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` e `DB_PORT`. Também aceita `DATABASE_URL`.

### Frontend

```powershell
cd greentweet-frontend
npm ci
copy .env.example .env
npm run dev
```

O frontend usa `VITE_API_URL` (não `VITE_API_BASE_URL`). O padrão local é `http://localhost:8000`.

## Produção: Vercel, Neon e Cloudinary

1. Crie um projeto Vercel com Root Directory `greentweet-frontend` e defina `VITE_API_URL` como a URL HTTPS do projeto de API.
2. Crie outro projeto Vercel com Root Directory `greentweet-backend`; não configure um comando que execute migrations no build.
3. No Neon, use a **URL pooled** como `DATABASE_URL` da aplicação serverless. O Django desabilita conexões persistentes (`conn_max_age=0`) e cursores server-side para compatibilidade com PgBouncer/Neon.
4. Para migrations, use manualmente uma **URL direta** do Neon fora do build/deploy da Vercel. Não use a URL pooled para essa operação.
5. Defina `USE_CLOUDINARY=True` e as três credenciais Cloudinary no backend; os uploads novos então usam o Cloudinary.

## Variáveis de ambiente

### Backend (`greentweet-backend`)

| Variável | Uso |
| --- | --- |
| `SECRET_KEY` | chave secreta do Django; obrigatória em produção |
| `DEBUG` | use `False` em produção |
| `DATABASE_URL` | URL PostgreSQL pooled do Neon para a aplicação |
| `ALLOWED_HOSTS` | hosts separados por vírgula; `VERCEL_URL` é incluído automaticamente quando fornecido pela Vercel |
| `CORS_ALLOWED_ORIGINS` | origens HTTPS do frontend, separadas por vírgula |
| `CSRF_TRUSTED_ORIGINS` | origens confiáveis completas, com `https://`, separadas por vírgula |
| `USE_CLOUDINARY` | `True` para armazenar mídia no Cloudinary |
| `CLOUDINARY_CLOUD_NAME` | nome do cloud |
| `CLOUDINARY_API_KEY` | chave de API |
| `CLOUDINARY_API_SECRET` | segredo de API |

Consulte `greentweet-backend/.env.example` para uma base segura. Em desenvolvimento, `http://localhost:5173` é permitido automaticamente apenas quando `DEBUG=True`.

### Frontend (`greentweet-frontend`)

| Variável | Uso |
| --- | --- |
| `VITE_API_URL` | URL base pública da API, sem segredo |

Consulte `greentweet-frontend/.env.example`.

## Endpoints úteis

- `GET /health/` — verificação pública de disponibilidade, retorna `{ "status": "ok" }`.
- `POST /auth/register/` — cadastro.
- `POST /auth/login/` e `POST /auth/refresh/` — tokens JWT.
- `GET`/`POST /posts/` — feed e criação de posts.
- `GET /profiles/<username>/` — perfil.

## Validação local

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

Os arquivos `tests.py` existem nos apps do backend, mas não há casos de teste automatizados implementados neste momento.
