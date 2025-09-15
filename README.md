# GreenTweet
GreenTweet é uma aplicação fullstack inspirada no Twitter, desenvolvida como projeto final do curso EBAC Desenvolvedor FullStack Python.
O objetivo é implementar funcionalidades essenciais de uma rede social: autenticação, perfis, seguir/seguir, feed, postagens, curtidas e comentários.

📚 Tecnologias
Frontend
- React 18 + TypeScript
- Redux Toolkit + RTK Query
- React Router
- styled-components
- Vite
Backend
- Python 3.11
- Django 5 + Django REST Framework
- JWT Authentication (djangorestframework-simplejwt)
- PostgreSQL (Neon/Render) ou MySQL (PlanetScale)
- Cloudinary (upload de imagens)

🚀 Funcionalidades
- Autenticação JWT (registro, login, refresh)
- Perfil (editar nome, avatar, senha)
- Seguir/Deixar de seguir usuários
- Feed com posts apenas de usuários seguidos
- Postagens com texto e imagem opcional
- Curtidas e comentários em posts
- Deploy acessível publicamente

📂 Estrutura do Repositório
/greentweet-frontend   → Código do frontend
/greentweet-backend    → Código do backend



🛠️ Como rodar localmente
Pré-requisitos
- Node.js 20+
- Python 3.11+
- PostgreSQL ou MySQL
- Conta no Cloudinary (opcional para imagens)

Backend
# 1. Entrar na pasta
cd greentweet-backend

# 2. Criar e ativar ambiente virtual
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Configurar variáveis de ambiente
cp .env.example .env

# 5. Rodar migrações
python manage.py migrate

# 6. Rodar servidor
python manage.py runserver



Frontend
# 1. Entrar na pasta
cd greentweet-frontend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env

# 4. Rodar servidor de desenvolvimento
npm run dev



⚙️ Variáveis de Ambiente
Backend (.env)
SECRET_KEY=chave_secreta_django
DEBUG=True
DATABASE_URL=postgresql://usuario:senha@host:porta/dbname
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
ALLOWED_HOSTS=localhost,127.0.0.1


Frontend (.env)
VITE_API_BASE_URL=http://localhost:8000



🧪 Testes
Backend
pytest


Frontend
npm test



☁️ Deploy
- Backend: Render / Fly.io / Railway
- Frontend: Vercel 
- Banco: Neon (Postgres) ou PlanetScale (MySQL)
- Imagens: Cloudinary

📜 Licença
Este projeto é de uso educacional e não possui licença comercial.
