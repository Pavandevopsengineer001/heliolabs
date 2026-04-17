# HelioLabs

Full-stack skincare commerce platform for HelioLabs, built as a fresh monorepo with:

- `apps/web`: Next.js App Router storefront
- `apps/api`: FastAPI + SQLModel backend
- `PostgreSQL`: primary database
- `Stripe`: hosted checkout + webhook flow
- `JWT`: access + refresh authentication

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zustand
- Backend: FastAPI, SQLModel, PostgreSQL, Stripe, SlowAPI rate limiting
- Deployment-ready: Dockerfiles for web and API, `docker-compose.yml` for local orchestration

## Local development

### 1. Backend

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
cp .env.example .env
uvicorn app.main:app --reload
```

### 2. Frontend

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

### 3. Database via Docker

```bash
docker compose up db
```

Or run the whole stack:

```bash
docker compose up --build
```

## Key routes

### Storefront

- `/`
- `/products`
- `/products/[slug]`
- `/science`
- `/blog`
- `/blog/[slug]`
- `/contact`
- `/account`
- `/checkout`
- `/skin-type/[slug]`
- `/concern/[slug]`
- `/ingredient/[slug]`

### API

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/products`
- `GET /api/v1/products/{slug}`
- `GET /api/v1/cart`
- `POST /api/v1/cart`
- `DELETE /api/v1/cart/item`
- `POST /api/v1/checkout`
- `GET /api/v1/orders`
- `GET /api/v1/orders/{id}`
- `GET /api/v1/profile`
- `PUT /api/v1/profile`
- `POST /api/v1/newsletter`
- `POST /api/v1/contact`
- `POST /api/v1/payments/webhook`
- `GET /api/v1/blog`
- `GET /api/v1/blog/{slug}`

## Business logic highlights

- Guest cart via `X-Session-Id`, merged into the authenticated cart on signup/login
- Checkout reserves inventory in a transaction before redirecting to Stripe
- Failed/expired Stripe flows release reserved inventory
- Webhook processing is idempotent via persisted event IDs
- Public content routes fall back to seed content so the frontend still renders during early local setup

## Verification completed

- Backend syntax pass: `python3 -m compileall apps/api/app`
- Frontend typecheck: `npm run typecheck`
- Frontend production build: `npm run build`

## More detail

See [docs/architecture.md](/home/pavan-kalyan-penchikalapati/Desktop/heliolabs/docs/architecture.md) for the module layout and request flow.

