# Guía de Deployment

Esta guía cubre el deployment a producción del SaaS MVP Accelerator.

## 🎯 Opciones de Deployment

1. **Vercel** (Recomendado) - Zero config, optimizado para Next.js
2. **Railway** - Alternative con Postgres incluido
3. **Self-hosted** - Docker + cualquier VPS

Esta guía se enfoca en **Vercel** que es la opción más simple.

## 🚀 Deploy a Vercel (Recomendado)

### Pre-requisitos
- Cuenta en [Vercel](https://vercel.com) (gratis)
- Repo en GitHub/GitLab/Bitbucket
- Supabase proyecto configurado

### Paso 1: Conectar Repositorio

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Conecta tu repo de GitHub
4. Vercel detectará Next.js automáticamente

### Paso 2: Configurar Environment Variables

En Vercel dashboard, ve a Settings > Environment Variables.

Agrega **TODAS** estas variables:

```env
# Core (REQUERIDO)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Your SaaS Name

# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # ⚠️ SECRET!

# Payments (si aplica)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

MP_ACCESS_TOKEN=APP_USR-...
MP_PUBLIC_KEY=APP_USR-...
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-...

# Email (si aplica)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# AI (opcional)
OPENAI_API_KEY=sk-...
```

**Importante**:
- Production keys != Development keys
- Stripe: usar `sk_live_` no `sk_test_`
- MercadoPago: credentials de producción

### Paso 3: Configurar Dominio

#### Opción A: Vercel Subdomain (Gratis)
- Tu app estará en `your-project.vercel.app`
- Listo! No hay pasos adicionales

#### Opción B: Custom Domain

1. Ve a Settings > Domains
2. Add domain: `yourdomain.com`
3. Configura DNS según instrucciones de Vercel:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (~5-60 min)
5. Vercel auto-provisionará SSL (Let's Encrypt)

### Paso 4: Actualizar Supabase URLs

En Supabase Dashboard > Authentication > URL Configuration:

**Site URL**: `https://yourdomain.com`

**Redirect URLs**:
```
https://yourdomain.com/auth/callback
https://yourdomain.com
```

### Paso 5: Configurar Webhooks

#### Stripe Webhooks

1. Ve a Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copia webhook secret a Vercel env vars

#### MercadoPago Webhooks

1. Ve a MercadoPago > Tus integraciones > Webhooks
2. Add URL: `https://yourdomain.com/api/webhook/mercadopago`
3. Testear con herramienta de MP

### Paso 6: Deploy!

```bash
# Opción A: Push a main branch
git push origin main
# Vercel auto-deploys

# Opción B: Via Vercel CLI
npm i -g vercel
vercel --prod
```

## ✅ Post-Deployment Checklist

- [ ] Dominio custom funcionando (si aplica)
- [ ] SSL certificate activo (🔒 en browser)
- [ ] Authentication flow completo funcionando
- [ ] Payments testeados (modo test primero!)
- [ ] Webhooks recibiendo events
- [ ] Emails enviándose correctamente
- [ ] Analytics tracking funcionando
- [ ] Error tracking configurado

## 🧪 Testing en Producción

### Smoke Tests

1. **Signup Flow**
   ```
   - Go to /register
   - Create account
   - Verify email received
   - Login successful
   ```

2. **Payment Flow** (test mode primero!)
   ```
   - Go to /pricing
   - Select plan
   - Complete checkout
   - Verify subscription updated
   ```

3. **Core Features**
   ```
   - Create project/item
   - Update project
   - Delete project
   ```

## 📊 Monitoring en Producción

### Vercel Analytics

Automático! Ve a Analytics tab en Vercel dashboard.

Métricas disponibles:
- Visitors
- Page views
- Top pages
- Top referrers
- Devices & browsers

### Vercel Speed Insights

Gratis en plan Pro. Monitorea Core Web Vitals en producción.

### Uptime Monitoring

Recomendado: [UptimeRobot](https://uptimerobot.com) (gratis)

1. Crear monitor para `https://yourdomain.com/api/health`
2. Interval: 5 minutos
3. Alertas via email

### Error Tracking (Opcional)

**Sentry**:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Agrega a `.env`:
```
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
```

## 🔄 Continuous Deployment

Una vez conectado, Vercel auto-deploya en:

- **Push a `main`** → Production deployment
- **Push a otras branches** → Preview deployment
- **Pull Requests** → Preview deployment con URL única

### Preview Deployments

Cada PR obtiene su propia URL:
- `your-pr-name-git-branch-username.vercel.app`
- Perfecto para QA antes de merge

## 🚨 Rollback

Si algo sale mal después de un deployment:

1. Ve a Vercel Dashboard > Deployments
2. Encuentra deployment anterior que funcionaba
3. Click "..." > "Promote to Production"
4. Instantáneo!

## 🌍 Deployment para LATAM

### Consideraciones Regionales

**Hosting Region**:
- Supabase: Seleccionar región South America
- Vercel: Edge network auto-optimiza

**CDN**:
- Vercel tiene PoPs en São Paulo
- Latencia ~20-50ms para users en Argentina/Brasil

**DNS**:
- Usar Cloudflare DNS (gratis) para mejor performance en LATAM
- TTL bajo (300s) para cambios rápidos

## 💾 Database Backups

### Supabase (Automático)

- **Free tier**: Daily backups, 7 days retention
- **Pro tier**: Point-in-time recovery

### Manual Backups

```bash
# Via Supabase CLI
supabase db dump -f backup.sql

# Via pg_dump directamente
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

**Recomendación**: Backups semanales guardados en S3/Drive.

## 🔐 Security Hardening

### Headers de Seguridad

Agregar a `next.config.mjs`:

```js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Environment Variable Secrets

⚠️ **NUNCA** comitear:
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `MP_ACCESS_TOKEN`
- Cualquier `*_SECRET` o `*_PRIVATE`

Usar:
- Vercel Environment Variables
- GitHub Secrets (para CI/CD)

## 📈 Performance Optimization

### Images

```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Para above-the-fold images
/>
```

### Fonts

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

### Analytics Bundle

```bash
# Analizar bundle size
ANALYZE=true npm run build
```

## 🆘 Troubleshooting

### Build Fails

```
Error: Module not found
```

→ Verifica que todas las dependencies estén en `package.json`, no solo en devDependencies

### Environment Variables No Funcionan

→ Redeploy después de agregar nuevas env vars

### 500 Error en Producción

1. Check Vercel logs: Vercel Dashboard > Deployment > Functions
2. Check Supabase logs: Supabase Dashboard > Logs
3. Verificar que production env vars son correctas

### SSL No Funciona

→ Wait 5-10 minutos después de agregar dominio. Vercel auto-provee SSL.

## 📱 Mobile Testing

Antes de lanzar, testear en:
- iPhone (Safari)
- Android (Chrome)
- Tablets

Usar herramientas:
- [BrowserStack](https://www.browserstack.com) (paid)
- Chrome DevTools Device Mode (gratis)

## 🎯 Launch Day Checklist

- [ ] Código en `main` branch estable
- [ ] Todas las env vars configuradas
- [ ] Dominio custom funcionando
- [ ] SSL activo
- [ ] Database backups configurados
- [ ] Monitoring activo
- [ ] Analytics funcionando
- [ ] Email templates testeadas
- [ ] Payment flows funcionando
- [ ] Mobile responsive verificado
- [ ] SEO meta tags completos
- [ ] sitemap.xml generado
- [ ] robots.txt configurado
- [ ] Equipo alertado y disponible

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
