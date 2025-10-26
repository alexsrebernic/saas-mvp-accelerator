---
name: MVP Launch Checklist
about: Checklist completo para lanzar tu MVP
title: '🚀 MVP Launch - [PROJECT_NAME]'
labels: launch, mvp
assignees: ''
---

# 🚀 MVP Launch Checklist

**Proyecto**: [NOMBRE DEL PROYECTO]
**Launch Date Target**: [FECHA]
**Owner**: [TU NOMBRE]

---

## 📋 Pre-Development

- [ ] PRD.md completo y revisado
- [ ] CLAUDE.md configurado con contexto del proyecto
- [ ] User stories priorizadas
- [ ] Diseños/wireframes aprobados
- [ ] Stack tecnológico decidido
- [ ] Schema de base de datos diseñado

## 🔧 Technical Setup

### Environment & Config
- [ ] Variables de entorno configuradas (.env.local)
- [ ] Supabase proyecto creado y configurado
- [ ] Database migrations ejecutadas
- [ ] Seed data cargada para testing

### Authentication
- [ ] Supabase Auth configurado
- [ ] Login flow funcionando
- [ ] Signup flow funcionando
- [ ] Password reset funcionando
- [ ] Email verification configurado

### Core Features
- [ ] Feature #1: [NOMBRE] - Completa
- [ ] Feature #2: [NOMBRE] - Completa
- [ ] Feature #3: [NOMBRE] - Completa

### UI/UX
- [ ] Mobile responsive verificado
- [ ] Dark mode funcionando
- [ ] Loading states implementados
- [ ] Error states diseñados
- [ ] Empty states amigables
- [ ] Accesibilidad básica (WCAG AA)

## 💳 Payments & Billing

- [ ] Stripe/MercadoPago configurado
- [ ] Pricing page completa
- [ ] Checkout flow testeado
- [ ] Webhooks funcionando
- [ ] Subscription management implementado
- [ ] Invoice generation configurado
- [ ] Refund process definido

## 📧 Communications

- [ ] Email provider configurado (Resend)
- [ ] Welcome email template
- [ ] Password reset email
- [ ] Payment confirmation email
- [ ] Domain verificado para emails
- [ ] Email deliverability testeada

## 📊 Analytics & Monitoring

- [ ] Analytics configurado (Vercel/GA)
- [ ] Conversion tracking
- [ ] Error tracking (Sentry - opcional)
- [ ] Performance monitoring
- [ ] Uptime monitoring (UptimeRobot)

## 🔒 Security

- [ ] RLS policies habilitadas en todas las tablas
- [ ] Environment variables nunca commiteadas
- [ ] Validación de input en todos los Server Actions
- [ ] Rate limiting implementado
- [ ] HTTPS enforced
- [ ] Security headers configurados
- [ ] CORS apropiado

## ⚡ Performance

- [ ] Build sin errores
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals en verde
- [ ] Images optimizadas
- [ ] Lazy loading implementado
- [ ] Code splitting verificado

## 📄 Legal & Compliance

### Argentina/LATAM Specific
- [ ] Términos y condiciones en español
- [ ] Política de privacidad (Ley 25.326)
- [ ] Datos fiscales correctos (CUIT, razón social)
- [ ] MercadoPago configurado para Argentina

### General
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie policy
- [ ] GDPR compliance (si aplica)

## 🧪 Testing

### Automated
- [ ] Unit tests pasando
- [ ] E2E tests críticos pasando
- [ ] CI/CD pipeline funcionando

### Manual
- [ ] Signup → Onboarding → First value flow testeado
- [ ] Payment flow completo testeado
- [ ] Mobile testing en dispositivos reales
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Error scenarios testeados

## 🌍 Deployment

- [ ] Production environment configurado
- [ ] DNS configurado correctamente
- [ ] SSL certificate activo
- [ ] Database backups configurados
- [ ] Deployment pipeline probado
- [ ] Rollback plan documentado

## 📱 Post-Launch Preparation

- [ ] Status page configurado (opcional)
- [ ] Monitoring dashboards configurados
- [ ] Support email configurado
- [ ] FAQ/Help docs creadas
- [ ] Feedback form implementado

## 👥 Beta Testing (Pre-Launch)

- [ ] 5-10 beta testers invitados
- [ ] Feedback session planeada
- [ ] Beta feedback documentado
- [ ] Critical bugs del beta resueltos

## 🎉 Launch Day

- [ ] Final testing completo
- [ ] Monitoring activo
- [ ] Team alert en caso de issues
- [ ] Social media posts preparados
- [ ] Product Hunt launch (opcional)
- [ ] Reddit posts (r/SaaS, etc.)

## 📈 Week 1 Post-Launch

- [ ] Monitorear métricas diariamente
- [ ] Responder a todo feedback
- [ ] Fix critical bugs < 24hrs
- [ ] Collect user testimonials
- [ ] Iterar basado en data

---

## 🎯 Success Metrics Goals

### Week 1
- [ ] X usuarios registrados
- [ ] Y% activation rate
- [ ] Z usuarios pagando (objetivo: 1-2)

### Month 1
- [ ] 100 usuarios objetivo
- [ ] $X MRR
- [ ] <5% churn rate

---

## 📝 Notes

[Espacio para notas, decisiones importantes, learnings]

---

**Última actualización**: [FECHA]
**Status**: [ ] Planning | [ ] In Progress | [ ] Ready to Launch | [ ] Launched
