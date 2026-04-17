# Architecture

## Monorepo layout

```text
heliolabs/
├── apps/
│   ├── api/
│   │   ├── app/
│   │   │   ├── api/routes/
│   │   │   ├── core/
│   │   │   ├── db/
│   │   │   ├── models/
│   │   │   ├── repositories/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   └── pyproject.toml
│   └── web/
│       ├── public/
│       └── src/
│           ├── app/
│           ├── components/
│           ├── data/
│           ├── lib/
│           ├── store/
│           └── types/
├── docker-compose.yml
└── docs/
```

## Backend flow

### Clean architecture layers

- Routers: HTTP contracts and dependency wiring
- Services: business rules, validation, orchestration
- Repositories: persistence access
- Models: SQLModel tables
- Schemas: request/response DTOs

### Commerce flow

1. Storefront sends cart actions with optional bearer token and `X-Session-Id`
2. Backend resolves guest or authenticated cart context
3. On login/signup, guest cart lines merge into the user cart
4. Checkout locks inventory rows, validates stock, creates an awaiting-payment order, and reserves stock
5. Stripe hosted checkout is created from that order snapshot
6. Webhook confirms payment or releases reserved stock on failure/expiry

### Security

- JWT access + refresh tokens
- Refresh token rotation backed by a persisted token table
- Password hashing with bcrypt via Passlib
- Pydantic validation on every external payload
- SlowAPI request limiting on auth/contact/newsletter endpoints
- CORS configured from environment settings

## Frontend flow

### Rendering strategy

- Marketing and catalog pages render through App Router server components
- Interaction-heavy surfaces like cart, account auth, and checkout use client components
- SEO route families are statically generated from discovery maps
- Public data fetchers fall back to seeded content for resilient local rendering

### State

- Zustand cart store persists guest session/cart state
- Zustand auth store persists JWTs and account snapshot
- React Hook Form handles checkout, contact, newsletter, and auth forms

### UX direction

- Sticky translucent navigation
- Minimal, spacious layouts with orange clinical accent
- Controlled motion using reveal transitions and drawer animation
- Premium product-first hierarchy inspired by D2C skincare and minimal hardware brands

## Deployment notes

- Web: Vercel-ready Next.js app
- API: containerized FastAPI app
- DB: PostgreSQL via managed provider or container
- Stripe: webhook endpoint at `/api/v1/payments/webhook`

