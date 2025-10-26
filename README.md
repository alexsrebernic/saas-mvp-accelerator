# 🚀 SaaS MVP Accelerator

> **De la idea al MVP en 14 días** - Un template completo y opinionado para crear SaaS rentables rápidamente

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🎯 ¿Por qué este template?

Después de crear 20+ MVPs en los últimos 2 años, identifiqué patrones que se repiten en cada proyecto exitoso. Este template codifica esas mejores prácticas en un starter kit listo para usar.

### Filosofía del Proyecto

1. **MVP First**: Enfócate en validar, no en la perfección
2. **Money from Day 1**: Si no tiene modelo de negocio, no es un negocio
3. **Ship Fast, Iterate Faster**: Mejor hecho que perfecto
4. **Document Everything**: Tu yo del futuro te lo agradecerá

### Para quién es esto

✅ **Indie hackers** que quieren lanzar rápido
✅ **Desarrolladores** que quieren validar ideas de negocio
✅ **Equipos pequeños** que necesitan estructura probada
✅ **Builders** en Argentina/LATAM con integraciones locales

❌ **No es para ti si** buscas un framework complejo o quieres construir todo desde cero

---

## ✨ ¿Qué incluye?

### Core Features

- 🔐 **Autenticación completa** con Supabase Auth
- 💳 **Pagos integrados** (Stripe + MercadoPago para LATAM)
- 📊 **Dashboard template** con métricas clave
- 🎨 **UI Components** con shadcn/ui pre-configurado
- 📧 **Email system** con templates listos (Resend)
- 🌍 **i18n ready** (español/inglés por defecto)
- 📱 **Mobile responsive** desde día 1
- 🌙 **Dark mode** incluido

### Developer Experience

- 📝 **CLAUDE.md** para mantener contexto con AI assistants
- 🏗 **PRD Template** para documentar antes de codear
- 🔄 **CI/CD pipelines** con GitHub Actions
- 🧪 **Testing setup** (unit + e2e con Playwright)
- 📊 **Analytics ready** (Vercel Analytics)
- 🚀 **One-click deploy** a Vercel
- 🤖 **Interactive setup script** que genera todo por ti

### Optimizado para Argentina/LATAM 🇦🇷

- ✅ MercadoPago integrado
- ✅ Templates legales adaptados
- ✅ Soporte i18n ES/EN
- ✅ Consideraciones fiscales documentadas
- ✅ Comunidad hispanohablante

---

## 🚀 Quick Start

### Opción 1: Setup Interactivo (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/alexsrebernic/saas-mvp-accelerator.git my-saas
cd my-saas

# Instalar dependencias
npm install

# Ejecutar setup interactivo
npm run setup
```

El script interactivo te preguntará:
- Nombre del proyecto
- Tipo de SaaS (B2B, B2C, etc.)
- Features necesarias
- Región de operación
- Modelo de precios

Y generará automáticamente:
- `CLAUDE.md` personalizado
- `PRD.md` completo
- `.env.local` con variables necesarias
- Estructura de i18n si aplica

### Opción 2: Manual Setup

```bash
# Clonar y entrar
git clone https://github.com/alexsrebernic/saas-mvp-accelerator.git my-saas
cd my-saas

# Instalar dependencias
npm install

# Copiar environment variables
cp .env.example .env.local

# Configurar Supabase (ve a https://app.supabase.com)
# Pega tus keys en .env.local

# Iniciar desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📦 Stack Tecnológico

### Frontend
- **[Next.js 14](https://nextjs.org)** - React framework con App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[shadcn/ui](https://ui.shadcn.com)** - Component library
- **[Lucide Icons](https://lucide.dev)** - Icons
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark mode

### Backend
- **[Supabase](https://supabase.com)** - PostgreSQL database + Auth + Storage
- **[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)** - Backend logic
- **[next-safe-action](https://next-safe-action.dev)** - Type-safe Server Actions
- **[Zod](https://zod.dev)** - Schema validation

### Payments
- **[Stripe](https://stripe.com)** - Global payments
- **[MercadoPago](https://www.mercadopago.com.ar)** - LATAM payments

### Email & Communications
- **[Resend](https://resend.com)** - Transactional emails
- **[React Email](https://react.email)** - Email templates (optional)

### DevOps
- **[Vercel](https://vercel.com)** - Hosting & deployment
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD
- **[Playwright](https://playwright.dev)** - E2E testing

---

## 🏗 Estructura del Proyecto

```
saas-mvp-accelerator/
├── .github/                  # GitHub templates y workflows
│   ├── ISSUE_TEMPLATE/       # Templates de issues
│   └── workflows/            # CI/CD pipelines
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Rutas de autenticación
│   │   ├── (dashboard)/     # Rutas del dashboard
│   │   └── api/             # API routes
│   ├── components/          # Componentes React
│   │   ├── ui/              # shadcn/ui components
│   │   ├── shared/          # Componentes compartidos
│   │   └── features/        # Componentes por feature
│   ├── lib/                 # Utilidades
│   │   ├── supabase/        # Cliente Supabase
│   │   ├── validations/     # Schemas Zod
│   │   └── utils/           # Helpers
│   ├── actions/             # Server Actions
│   └── types/               # TypeScript types
├── supabase/                # Supabase config
│   ├── migrations/          # DB migrations
│   └── functions/           # Edge functions
├── scripts/                 # Scripts de automatización
│   ├── setup-project.js     # Setup interactivo
│   ├── check-dependencies.js # Validación de env
│   └── generate-schemas.js  # Generador de schemas
├── templates/               # Templates de archivos
│   ├── CLAUDE.md.template   # Template de contexto
│   ├── PRD.md.template      # Product Requirements
│   └── legal/               # Templates legales
├── docs/                    # Documentación
├── locales/                 # Traducciones i18n
├── CLAUDE.md                # Contexto del proyecto
├── PRD.md                   # Requirements completos
└── README.md                # Este archivo
```

---

## 📚 Documentación

### Guías de Setup
- [**Configuración Inicial**](./docs/SETUP.md) - Setup paso a paso
- [**Supabase Setup**](./docs/SUPABASE.md) - Configurar database y auth
- [**Deployment**](./docs/DEPLOYMENT.md) - Deploy a producción

### Arquitectura
- [**Architecture Guide**](./docs/ARCHITECTURE.md) - Decisiones arquitecturales
- [**Database Schema**](./docs/DATABASE.md) - Schema y migrations
- [**API Reference**](./docs/API.md) - Endpoints y Server Actions

### Negocio
- [**Pricing Strategy**](./docs/PRICING_STRATEGY.md) - Cómo definir precios
- [**API Limits & Costs**](./docs/API_LIMITS.md) - Costos de infraestructura
- [**LATAM Setup**](./docs/LATAM_SETUP.md) - Configuración para LATAM

### Desarrollo
- [**Contributing**](./docs/CONTRIBUTING.md) - Guía de contribución
- [**Cursor Rules**](./.cursorrules) - Reglas para Cursor IDE

---

## 🎯 Desarrollo Rápido

### Semana 1-2: Foundation

```bash
npm run dev              # Desarrollo local
npm run db:push          # Push schema a Supabase
npm run db:seed          # Cargar datos de prueba
npm run check:env        # Validar configuración
```

### Semana 3: Alpha Testing

- Invitar 5-10 usuarios alpha
- Recolectar feedback
- Iterar features

### Semana 4: Launch

```bash
npm run test             # Tests completos
npm run build            # Build de producción
npm run deploy           # Deploy a Vercel
```

---

## 🛠 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run start            # Servidor de producción
npm run lint             # Linter
npm run format           # Formatear código

# Setup
npm run setup            # Setup interactivo
npm run setup:env        # Copiar .env.example
npm run check:env        # Validar environment

# Database (Supabase)
npm run db:generate-types # Generar tipos TypeScript
npm run db:push          # Push migrations
npm run db:pull          # Pull schema
npm run db:seed          # Seed data
npm run db:reset         # Reset completo

# Testing
npm run test             # Tests unitarios
npm run test:e2e         # Tests E2E
npm run test:e2e:ui      # E2E con UI

# Deployment
npm run deploy:preview   # Deploy preview
npm run deploy:production # Deploy producción
```

---

## 💡 Características Destacadas

### 1. CLAUDE.md - Contexto para AI

Este template incluye un archivo `CLAUDE.md` que mantiene todo el contexto del proyecto:

- Stack tecnológico
- Decisiones arquitecturales
- Modelo de negocio
- Comandos importantes
- Problemas conocidos y soluciones

Perfecto para trabajar con Claude, ChatGPT, o cualquier AI assistant.

### 2. PRD Template Completo

Documento de requerimientos de producto completo con:

- User personas
- User stories
- Success metrics
- Technical architecture
- Launch strategy

### 3. Setup Interactivo

El script `npm run setup` te guía paso a paso:

```
🚀 SaaS MVP Accelerator Setup

📝 Nombre del proyecto: my-awesome-saas
📋 Descripción: Una plataforma que...
🎯 Tipo de SaaS: B2B - SMB
✨ Features: [Authentication, Payments, AI Integration]
💰 Pricing: Freemium
```

Y genera todo automáticamente.

### 4. Integraciones LATAM

Si seleccionas Argentina/LATAM en el setup:

- MercadoPago pre-configurado
- i18n español/inglés
- Templates legales adaptados
- Documentación de consideraciones fiscales

---

## 🎓 Recursos de Aprendizaje

### Videos (Coming Soon)
1. De 0 a MVP en 14 días
2. Configurando Supabase + Stripe
3. Deploy y primeros usuarios

### Artículos (Coming Soon)
1. El archivo CLAUDE.md que cambió mi productividad
2. Cómo validar tu SaaS sin escribir código
3. Pricing: El arte de cobrar lo justo

### Community
- [Discord](https://discord.gg/saas-argentina) - Únete a la comunidad
- [Twitter](https://twitter.com/alexsrebernic) - Sígueme para updates
- [YouTube](https://youtube.com/@alexsrebernic) - Tutoriales

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](./docs/CONTRIBUTING.md) para detalles.

### Formas de contribuir:

- 🐛 Reportar bugs
- ✨ Sugerir nuevas features
- 📝 Mejorar documentación
- 🌍 Traducir a otros idiomas
- 💻 Enviar pull requests

---

## 📈 Casos de Éxito

Proyectos construidos con este template:

- **[Tu proyecto aquí]** - Describe tu éxito y compártelo

¿Construiste algo con este template? [Házmelo saber](https://github.com/alexsrebernic/saas-mvp-accelerator/discussions)!

---

## 🗺 Roadmap

### v1.0 (Actual)
- [x] Setup base con Next.js 14
- [x] Integración Supabase completa
- [x] Templates CLAUDE.md y PRD.md
- [x] Setup script interactivo
- [x] Integraciones LATAM

### v1.1 (Próximo)
- [ ] Email templates con React Email
- [ ] Admin dashboard template
- [ ] Multi-tenancy example
- [ ] Stripe subscription flow completo
- [ ] MercadoPago webhooks

### v2.0 (Futuro)
- [ ] Telegram bot integration
- [ ] AI features examples
- [ ] Mobile app template (React Native)
- [ ] Más templates legales (USA, EU)

---

## 📄 Licencia

MIT License - ve [LICENSE](./LICENSE) para detalles.

**TL;DR**: Úsalo gratis para construir tu próximo negocio millonario. No se requiere atribución, pero es apreciada.

---

## 🙏 Agradecimientos

Este template se inspira en:

- [Vercel Next.js Templates](https://vercel.com/templates/next.js)
- [Supabase Starter](https://github.com/supabase/supabase)
- [shadcn/ui](https://ui.shadcn.com)
- La comunidad de indie hackers argentina

---

## 💬 Feedback y Soporte

- **Issues**: [GitHub Issues](https://github.com/alexsrebernic/saas-mvp-accelerator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/alexsrebernic/saas-mvp-accelerator/discussions)
- **Email**: alex@srebernic.com
- **Twitter**: [@alexsrebernic](https://twitter.com/alexsrebernic)

---

<div align="center">

**Creado con ❤️ por [Alex Srebernic](https://alexsrebernic.com)**

*Si este template te ayudó, considera:*

⭐ Darle una estrella al repo | 🐦 [Compartir en Twitter](https://twitter.com/intent/tweet?text=Encontré%20este%20template%20increíble%20para%20crear%20SaaS%20MVPs%20en%2014%20días&url=https://github.com/alexsrebernic/saas-mvp-accelerator) | ☕ [Invitarme un café](https://cafecito.app/alexsrebernic)

</div>
