# 🌱 GreenTweet

Aplicação fullstack inspirada no Twitter, criada como projeto final do curso EBAC Desenvolvedor FullStack Python. O objetivo é oferecer uma experiência completa de rede social: cadastro e onboarding guiados, perfis personalizáveis, feed dinâmico com posts multimídia, interações (curtidas, comentários, follows) e acompanhamento por hashtags/notificações.

---

## 🧭 Visão Geral

- **Arquitetura:** monorepo com `greentweet-frontend` (React + TS) e `greentweet-backend` (Django REST).  
- **Fluxo de onboarding:** novo usuário registra-se, faz login automático, preenche perfil (nome, bio, avatar) e é levado ao feed ao salvar.  
- **Feed completo:** posts com texto e/ou imagem (validadas até 2MB) armazenadas com segurança no Cloudinary, cards com layout responsivo 16:9, destaque inline sem rolagem abrupta e carregamento condicional de conteúdo.
- **Notificações inteligentes:** sidebar mostra apenas notificações não lidas (likes, comentários, follows) e entra em modo “zerado” quando tudo foi visto.  
- **Hashtags e filtros:** extração automática de hashtags no backend e filtros por tag no frontend com atualização dinâmica de métricas.  
- **Rede social viva:** seguir/seguir, curtidas, comentários, busca, perfis com avatar, contadores e destaques.

---

## ⚙️ Tecnologias Principais

| Camada | Tecnologias |
| --- | --- |
| **Frontend** | React 18 · TypeScript · Redux Toolkit · React Router · styled-components · Vite |
| **Backend** | Python 3.11 · Django 5 · Django REST Framework · SimpleJWT |
| **Infra recomendada** | PostgreSQL · Cloudinary (imagens) · Vercel (frontend) · Render/Fly/Railway (backend) |

---

## ⭐ Funcionalidades

### Autenticação & Onboarding
- Cadastro com validação de senhas/aceite de termos.  
- Login automático pós-registro e busca do perfil via `/auth/me/`.  
- Redirecionamento para edição de perfil com flag `onboarding`.  
- Ao salvar dados iniciais, redirecionamento automático ao feed.

### Feed & Posts
- Postagens com texto opcional + upload de imagem (preview em 16:9, limite de 2MB).  
- Validação backend aceita posts somente com imagem.  
- Destaque (“highlight”) abre inline no ponto do post, sem rolagem para o topo.  
- Botão de comentário muda para “Ver comentários” em posts do próprio autor.  
- Filtro “Seguindo” x “Mundo” e filtro por hashtag (com banners de contexto).  
- Paginação incremental (“Ver mais”) com preservação de estado.

### Interações & Notificações
- Curtidas com feedback imediato (flag `is_liked`, totalizador e undo).  
- Comentários em destaque com expansão/colapso.  
- Notificações listam apenas itens não lidos e marcam como lidas ao abrir o post relacionado.  
- Contagem total apresentada em `Profile` e `Feed`.

### Perfis & Seguidores
- Visualização de seguidores/seguindo, contadores e ações rápidas.  
- Edição completa (username, nomes, bio, avatar) com validação e preview.  
- Remoção/reset de avatar suportados.  
- Links para voltar ao feed e navegação orientada por tabs (posts/notifications/follows).

### Hashtags & Busca
- Extração automática de hashtags no `Post.save`.  
- Endpoint `tags` retorna ranking para o painel lateral.  
- Filtros por hashtag carregam posts via API dedicada, com mensagens de “sem resultados”.

---

## 🗂️ Estrutura

```
.
├── greentweet-backend   # API Django REST RESTful
│   ├── posts/           # Posts, likes, comentários, hashtags
│   ├── profiles/        # Perfis, signals, avatars
│   ├── users/           # Auth, registro
│   └── ...
└── greentweet-frontend  # SPA React com Redux
	├── src/pages        # Feed, Profile, Register etc.
	├── src/components   # PostCard, PostHighlight, SearchBar...
	└── ...
```

---

## 🛠️ Setup Local

### Requisitos
- Node.js 20+  
- Python 3.11+  
- Banco relacional (PostgreSQL recomendado)  
- Conta Cloudinary (opcional para upload de mídia)

### Backend

```powershell
cd greentweet-backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# configure credenciais no .env
python manage.py migrate
python manage.py runserver
```

> 💡 **Cloudinary:** crie um par de credenciais (Cloud name, API key, API secret) em [cloudinary.com](https://cloudinary.com/), copie a string `CLOUDINARY_URL` exibida no painel e preencha as variáveis do `.env` conforme a seção abaixo. Com `USE_CLOUDINARY=True`, todos os uploads (postagens e avatars) são enviados diretamente para o Cloudinary, inclusive em ambiente local.

### Frontend

```powershell
cd greentweet-frontend
npm install
copy .env.example .env
# ajuste VITE_API_BASE_URL se necessário
npm run dev
```

Abra `http://localhost:5173` (ou a porta indicada pelo Vite) para o frontend e `http://localhost:8000` para o backend.

---

## 🔐 Variáveis de Ambiente

### Backend (`greentweet-backend/.env`)

```
SECRET_KEY=alterar_para_uma_chave_segura
DEBUG=True
DATABASE_URL=postgresql://usuario:senha@localhost:5432/greentweet
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=seu_api_key
CLOUDINARY_API_SECRET=seu_api_secret
USE_CLOUDINARY=True
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
ALLOWED_HOSTS=localhost,127.0.0.1
```

> 🔒 Não versione o `.env`. Na Vercel/Render, replique as mesmas variáveis de ambiente e redeploy para que o backend utilize o Cloudinary.

### Frontend (`greentweet-frontend/.env`)

```
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📸 Armazenamento de mídia (Cloudinary)

1. **Crie uma conta** no Cloudinary e, no painel de API Keys, gere um par dedicado ao projeto.
2. **Copie o `cloudinary://...`** indicado e preencha `CLOUDINARY_URL` junto com `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` e `USE_CLOUDINARY=True` no `.env` do backend.
3. **Reinstale as dependências** (`pip install -r requirements.txt`) e reinicie o servidor para que o Django carregue o storage `cloudinary_storage.storage.MediaCloudinaryStorage`.
4. **Produção:** replique as mesmas variáveis no Render (backend) e na Vercel (se necessário) antes do deploy. Quando `USE_CLOUDINARY=True`, todos os novos uploads (posts e avatars) são enviados diretamente ao Cloudinary; arquivos antigos em `media/` podem ser removidos manualmente.

Uploads pré-existentes no filesystem não são migrados automaticamente. Reenvie as imagens importantes após ativar o Cloudinary para garantir que fiquem disponíveis em produção.

---

## ✅ Qualidade & Testes

| Comando | Descrição |
| --- | --- |
| `npm run lint` | ESLint do frontend (executado e passando). |
| `python manage.py test posts` | Smoke tests do app de posts (atualmente sem casos, roda sem erros). |
| `python manage.py test profiles users` | Garantia de que signals e registro permanecem saudáveis (sem casos, roda sem erros). |
| *(opcional)* `pytest` | Adapte para sua suíte de testes Python preferida. |

Recomenda-se executar `python manage.py migrate` após atualizar o backend e, em produção, configurar `ALLOWED_HOSTS` adequadamente.

---

## 🌐 Endpoints Principais

### Autenticação
- `POST /auth/register/` – cria usuário e dispara criação de perfil.  
- `POST /auth/login/` – retorna tokens JWT (`access`, `refresh`).  
- `GET /auth/me/` – informações do usuário autenticado.  
- `POST /auth/refresh/` – renova token de acesso.

### Posts & Interações
- `GET /posts/` – lista geral (com paginação).  
- `POST /posts/` – cria post (texto opcional + imagem).  
- `GET /posts/<id>/` – detalhe.  
- `DELETE /posts/<id>/` – remove (autor).  
- `GET /comments/?post=<id>` – comentários por post.  
- `POST /comments/` – adiciona comentário.  
- `POST /likes/` / `DELETE /likes/<id>/` – curtir/descurtir.

### Follows & Notificações
- `POST /follows/` / `DELETE /follows/<id>/` – seguir/deixar de seguir.  
- `GET /notifications/` – lista notificações (não lidas utilizadas no frontend).  
- `PATCH /notifications/<id>/mark_read/` – marcar como lida (se implementado).

### Hashtags & Busca
- `GET /tags/` – ranking de hashtags.  
- `GET /posts/tags/<tag>/` – posts de uma hashtag.  
- `GET /search/?q=<termo>` – busca por posts/perfis.

### Perfis
- `GET /profiles/<username>/` – detalhes do perfil.  
- `PATCH /profiles/<id>/` – atualização (nome, bio, avatar, username).

---

## 🧱 Próximos Passos Sugestivos
- Adicionar testes automatizados (unidade e integração) para registro, onboarding e feed.  
- Criar indicadores visuais durante o onboarding (ex.: passo 1/2) e mensagens de sucesso.  
- Implementar marcação de notificações como lidas via API.  
- Preparar scripts de deploy com exemplos reais (Render/Vercel).  
- Internacionalização (pt-BR/en) para ampliar alcance.

---

## 👤 Autor

Projeto desenvolvido por **Lukas Frick** no contexto educacional da EBAC.  
[github.com/LukasFrickDev](https://github.com/LukasFrickDev)

---

Sinta-se à vontade para abrir issues ou PRs com sugestões, correções e melhorias! 🌿
