# Arquitectura del Sistema

Este documento describe las decisiones arquitecturales del SaaS MVP Accelerator.

## 🎯 Principios de Diseño

1. **Server-First**: Server Components por defecto, Client Components solo cuando es necesario
2. **Type Safety**: TypeScript strict mode + Zod validation
3. **Security by Default**: RLS en toda tabla, validación en todo endpoint
4. **Progressive Enhancement**: Funciona sin JS, mejor con JS
5. **Mobile First**: Diseñado para móvil, mejorado para desktop

## 🏗 Stack Tecnológico

### Frontend
```
├── Next.js 14 (App Router)
│   ├── React 18 (Server Components)
│   ├── TypeScript (strict mode)
│   └── Tailwind CSS + shadcn/ui
```

**Por qué Next.js 14?**
- Server Components reducen bundle size significativamente
- App Router con layouts anidados para mejor UX
- Built-in optimizations (images, fonts, code splitting)
- Vercel deployment con zero-config

**Por qué Server Components?**
- Menos JavaScript al cliente = mejor performance
- Data fetching más seguro (tokens nunca al cliente)
- SEO mejorado out-of-the-box

### Backend
```
├── Next.js Server Actions
│   ├── next-safe-action (type-safe wrapper)
│   ├── Zod (schema validation)
│   └── API Routes (webhooks, auth callbacks)
```

**Por qué Server Actions?**
- No necesitas crear API endpoints manualmente
- Type-safe end-to-end
- Streaming support out-of-the-box
- Mejor DX que tradicional REST/GraphQL para este caso de uso

### Database
```
└── Supabase (PostgreSQL)
    ├── Row Level Security (RLS)
    ├── Built-in Auth
    ├── Storage
    └── Realtime (opcional)
```

**Por qué Supabase?**
- PostgreSQL (robusto, escalable)
- RLS policies (security a nivel de DB)
- Auth integrado (menos código)
- Free tier generoso para MVP

## 📐 Arquitectura de Capas

```
┌─────────────────────────────────────┐
│         UI Layer (Client)           │
│  - React Components (Server/Client) │
│  - Tailwind CSS                     │
└─────────────────────────────────────┘
            ↓ (Server Actions)
┌─────────────────────────────────────┐
│      Application Layer (Server)     │
│  - Server Actions (next-safe-action)│
│  - Input validation (Zod)           │
│  - Business logic                   │
└─────────────────────────────────────┘
            ↓ (Supabase SDK)
┌─────────────────────────────────────┐
│         Data Layer (Supabase)       │
│  - PostgreSQL                       │
│  - RLS Policies                     │
│  - Triggers & Functions             │
└─────────────────────────────────────┘
```

## 🔐 Security Architecture

### Authentication Flow

```
User → UI (Client) → Server Action → Supabase Auth
                        ↓
                  Session Cookie (httpOnly)
                        ↓
                   Middleware checks auth
                        ↓
                   Protected routes
```

### Authorization (RLS)

Cada query a Supabase pasa por RLS policies:

```sql
-- Example: Users can only see their own data
CREATE POLICY "users_select_own"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

**Ventajas**:
- Security a nivel de DB (no bypasseable)
- Funciona incluso si backend está comprometido
- Simple de razonar

### Data Flow con Validación

```
1. User input (UI)
   ↓
2. Zod schema validation (Server Action)
   ↓ (si pasa)
3. Business logic
   ↓
4. Supabase SDK call
   ↓
5. RLS policy check
   ↓ (si pasa)
6. Database operation
   ↓
7. Return to Server Action
   ↓
8. Revalidate cache (Next.js)
   ↓
9. Update UI
```

## 📁 Estructura de Archivos

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group (shared layout)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Dashboard route group
│   │   ├── layout.tsx     # Dashboard layout (with header)
│   │   └── page.tsx       # Dashboard home
│   ├── api/               # API routes (webhooks, etc.)
│   │   ├── webhook/
│   │   └── health/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components (presentational)
│   ├── shared/            # Shared components (Header, Footer)
│   └── features/          # Feature-specific components
├── lib/
│   ├── supabase/          # Supabase clients
│   │   ├── client.ts      # Browser client
│   │   ├── server.ts      # Server client
│   │   └── middleware.ts  # Middleware helper
│   ├── validations/       # Zod schemas
│   │   └── schemas.ts
│   └── utils/             # Utility functions
│       └── utils.ts       # cn() and others
├── actions/               # Server Actions
│   ├── auth-actions.ts
│   ├── user-actions.ts
│   └── project-actions.ts
└── types/                 # TypeScript types
    ├── supabase.ts        # Auto-generated from DB
    └── index.ts           # Custom types
```

**Convenciones**:
- `(auth)`, `(dashboard)` = Route groups (no afectan URL)
- Server Components = default (no 'use client')
- Client Components = tienen 'use client' directive
- Server Actions = tienen 'use server' directive

## 🔄 Data Fetching Patterns

### Server Component (Recomendado)

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const supabase = await createClient(); // Server client
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  return <ProjectList projects={projects} />;
}
```

**Ventajas**:
- No loading state necesario
- No useEffect
- Data fetching paralelo automático
- Cacheable por Next.js

### Server Action (Mutations)

```tsx
// actions/project-actions.ts
'use server';

export const createProject = actionClient
  .schema(createProjectSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .insert(parsedInput)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard'); // Refresh data
    return { success: true, data };
  });
```

### Client Component (Interactivo)

```tsx
// components/create-project-form.tsx
'use client';

export function CreateProjectForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createProject(/* ... */);
      // Handle result
    });
  };

  return <form action={handleSubmit}>...</form>;
}
```

## 💾 Caching Strategy

Next.js 14 cachea agresivamente por defecto:

### Static Pages
- Landing page
- Terms, Privacy
- Pricing

→ Generated at build time

### Dynamic Pages con ISR
```tsx
export const revalidate = 3600; // 1 hour

export default async function BlogPost() {
  // ...
}
```

### Fully Dynamic
```tsx
export const dynamic = 'force-dynamic';

export default async function UserDashboard() {
  // Siempre fresh data
}
```

### Manual Revalidation
```tsx
import { revalidatePath, revalidateTag } from 'next/cache';

// Después de mutation
revalidatePath('/dashboard');
revalidateTag('projects');
```

## 🌐 Deployment Architecture

```
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       ↓
┌──────────────────────────┐
│   Vercel Edge Network    │ ← CDN global
│  - Static assets cached  │
│  - Edge middleware       │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│   Next.js App (Vercel)   │ ← Serverless functions
│  - Server Components     │
│  - Server Actions        │
│  - API Routes            │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│   Supabase (Database)    │ ← PostgreSQL + Auth
│  - Multi-region replicas │
│  - Connection pooling    │
└──────────────────────────┘
```

## 📊 Scalability Considerations

### MVP (0-1,000 users)
- Vercel free tier: ✅
- Supabase free tier: ✅
- Total cost: $0/month

### Growth (1K-10K users)
- Vercel Pro: ~$20/month
- Supabase Pro: ~$25/month
- Total: ~$45/month

### Scale (10K-100K users)
- Vercel Enterprise
- Supabase Team/Enterprise
- Considerar:
  - Connection pooling (PgBouncer)
  - Read replicas
  - CDN optimization

## 🔌 Integration Patterns

### Third-Party APIs (MercadoPago, Stripe, etc.)

```
User action → Server Action → API SDK → Webhook
                                          ↓
               Database ← Process ← API Route
```

**Best practices**:
- Secrets en environment variables
- Retry logic con exponential backoff
- Idempotency keys
- Webhook signature verification

## 🎯 Performance Targets

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### API Performance
- **p50**: < 200ms
- **p95**: < 500ms
- **p99**: < 1s

### Strategies
1. Server Components (menos JS)
2. Image optimization (next/image)
3. Font optimization (next/font)
4. Code splitting automático
5. Prefetching links
6. Streaming SSR

## 🧪 Testing Strategy

```
Unit Tests (Jest)
  ↓
Integration Tests (API routes)
  ↓
E2E Tests (Playwright)
  ↓
Manual QA
```

## 📈 Monitoring & Observability

- **Vercel Analytics**: Web Vitals, audience insights
- **Supabase Dashboard**: Query performance, RLS errors
- **Error Tracking**: Sentry (opcional)
- **Logging**: Vercel logs + Supabase logs

## 🔄 CI/CD Pipeline

```
Git push → GitHub Actions →
  ├─ Lint
  ├─ Type check
  ├─ Build
  ├─ Tests
  └─ Deploy (Vercel)
```

Ver `.github/workflows/ci.yml` para detalles.

## 🎓 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Server Actions Deep Dive](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
