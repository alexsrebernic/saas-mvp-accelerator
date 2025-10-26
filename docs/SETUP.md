# Guía de Setup Completo

Esta guía te llevará desde cero hasta tener tu SaaS funcionando localmente en menos de 30 minutos.

## 📋 Prerrequisitos

- Node.js 20+ y npm 10+
- Git instalado
- Cuenta en Supabase (gratis)
- Cuenta en Vercel (gratis) - opcional para deployment
- Editor de código (recomendado: VS Code o Cursor)

## 🚀 Setup Rápido (Opción 1: Interactivo)

```bash
# 1. Clonar el repositorio
git clone https://github.com/alexsrebernic/saas-mvp-accelerator.git my-saas
cd my-saas

# 2. Instalar dependencias
npm install

# 3. Ejecutar setup interactivo
npm run setup
```

El script interactivo te preguntará:
- Nombre del proyecto
- Tipo de SaaS
- Features necesarias
- Región de operación
- Modelo de precios

Y generará automáticamente:
- `CLAUDE.md` personalizado
- `PRD.md` completo
- `.env.local` con variables necesarias

## 🔧 Setup Manual (Opción 2: Paso a Paso)

### 1. Clonar e Instalar

```bash
git clone https://github.com/alexsrebernic/saas-mvp-accelerator.git my-saas
cd my-saas
npm install
```

### 2. Configurar Supabase

#### 2.1 Crear Proyecto

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Click en "New Project"
3. Nombra tu proyecto
4. Elige región (recomendado: South America para LATAM)
5. Genera una database password segura (guárdala!)

#### 2.2 Obtener Credentials

En tu proyecto de Supabase:
1. Ve a Settings > API
2. Copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ SECRET!)

#### 2.3 Configurar Environment Variables

```bash
cp .env.example .env.local
```

Edita `.env.local` y completa:

```env
# Core
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="My SaaS"

# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # ⚠️ NUNCA COMITEAR!
```

### 3. Configurar Database

#### 3.1 Instalar Supabase CLI (opcional pero recomendado)

```bash
npm install -g supabase
```

#### 3.2 Ejecutar Migrations

**Opción A: Via Supabase Dashboard** (más fácil)
1. Ve a SQL Editor en Supabase Dashboard
2. Copia el contenido de `supabase/migrations/00000000000000_initial_schema.sql`
3. Pega y ejecuta

**Opción B: Via CLI**
```bash
supabase link --project-ref your-project-id
supabase db push
```

#### 3.3 Verificar Schema

En Supabase Dashboard > Table Editor, deberías ver:
- `profiles`
- `projects` (tabla de ejemplo)

### 4. Configurar Authentication

En Supabase Dashboard > Authentication > URL Configuration:

**Site URL**: `http://localhost:3000`

**Redirect URLs**:
```
http://localhost:3000/auth/callback
http://localhost:3000
```

Para producción, agregar:
```
https://yourdomain.com/auth/callback
https://yourdomain.com
```

### 5. Iniciar Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

Deberías ver la landing page del template.

## ✅ Verificar Setup

```bash
npm run check:env
```

Este comando verifica:
- Variables de entorno requeridas
- Archivos críticos
- Dependencias instaladas

Si todo está OK, verás:
```
✅ Todo listo! El proyecto está correctamente configurado.
```

## 🎨 Configurar UI (Opcional)

El template viene con shadcn/ui pre-configurado. Para agregar más componentes:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

Ver componentes disponibles: [ui.shadcn.com](https://ui.shadcn.com)

## 💳 Configurar Pagos (Opcional)

### MercadoPago (Argentina/LATAM)

1. Crear cuenta en [mercadopago.com.ar](https://mercadopago.com.ar)
2. Ve a Tus integraciones > Aplicaciones
3. Crea nueva aplicación
4. Copia credentials a `.env.local`:

```env
MP_ACCESS_TOKEN=APP_USR-xxxxx
MP_PUBLIC_KEY=APP_USR-xxxxx
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxxxx
```

### Stripe (Global)

1. Crear cuenta en [stripe.com](https://stripe.com)
2. Ve a Developers > API keys
3. Copia a `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

## 📧 Configurar Emails (Opcional)

### Resend

1. Crear cuenta en [resend.com](https://resend.com)
2. Crear API key
3. Agregar a `.env.local`:

```env
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

4. Verificar dominio en Resend dashboard

## 🤖 Configurar AI Features (Opcional)

### OpenAI

1. Crear cuenta en [platform.openai.com](https://platform.openai.com)
2. Crear API key
3. Agregar a `.env.local`:

```env
OPENAI_API_KEY=sk-xxxxx
OPENAI_MODEL=gpt-4-turbo-preview
```

## 🔍 Troubleshooting

### Error: "Invalid credentials"
- Verifica que copiaste correctamente las keys de Supabase
- Asegúrate de no tener espacios extra

### Error: "Table 'profiles' does not exist"
- Ejecuta las migrations (paso 3.2)
- Verifica en Supabase Dashboard que las tablas existen

### Error: "Cannot find module '@/components/ui/button'"
- Ejecuta `npm install`
- Verifica que tsconfig.json tiene el alias `@/*` configurado

### Build error
```bash
# Limpiar y reinstalar
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Próximos Pasos

1. ✅ Setup completo? Revisa [ARCHITECTURE.md](./ARCHITECTURE.md)
2. 🚀 Listo para deployar? Ve a [DEPLOYMENT.md](./DEPLOYMENT.md)
3. 💰 Define pricing: [PRICING_STRATEGY.md](./PRICING_STRATEGY.md)
4. 🌍 LATAM specific: [LATAM_SETUP.md](./LATAM_SETUP.md)

## 🆘 Soporte

- [GitHub Issues](https://github.com/alexsrebernic/saas-mvp-accelerator/issues)
- [Discord Community](https://discord.gg/saas-argentina)
- Email: alex@srebernic.com
