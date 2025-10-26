# API Limits & Costs

Guía completa de límites de todas las APIs y servicios usados, con estrategias para mantenerse en free tier y costos estimados por escala.

## 🎯 TL;DR - Costos Totales Estimados

| Escala | Usuarios | MRR Target | Costo Mensual | Profit Margin |
|--------|----------|------------|---------------|---------------|
| MVP    | 0-100    | $0-$500    | $0-$25        | ~95%          |
| Growth | 100-1K   | $500-$5K   | $25-$150      | ~97%          |
| Scale  | 1K-10K   | $5K-$50K   | $150-$1K      | ~98%          |

**Objetivo**: Mantenerse en free tier el máximo tiempo posible.

---

## 🗄️ Supabase (Database + Auth + Storage)

### Free Tier
- **Database**: 500 MB
- **Bandwidth**: 5 GB/mes
- **Storage**: 1 GB
- **Auth Users**: Unlimited
- **Edge Functions**: 500K executions/mes
- **Realtime**: Unlimited connections

**Límites prácticos**:
- ~500-1,000 usuarios activos
- ~50,000 rows en DB
- ~10,000 API requests/day

### Cuándo Migrar a Pro ($25/mes)
- > 500 MB database
- > 5 GB bandwidth/mes
- Necesitas daily backups con >7 days retention
- Point-in-time recovery

### Pro Tier ($25/mes)
- **Database**: 8 GB
- **Bandwidth**: 50 GB/mes
- **Storage**: 100 GB
- **Daily backups**: 14 days retention
- **Point-in-time recovery**: 7 days

### Strategies para Reducir Uso

#### Database Size
```sql
-- Limpiar data vieja
DELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days';

-- Usar JSONB solo cuando necesario (ocupa más espacio)
-- Considerar archiving a cold storage (S3)
```

#### Bandwidth
```typescript
// ❌ Bad: Fetch todo
const { data } = await supabase.from('projects').select('*');

// ✅ Good: Select only needed columns
const { data } = await supabase
  .from('projects')
  .select('id, name, created_at')
  .limit(10);
```

#### Storage
- Usar CDN para assets estáticos (Vercel)
- Comprimir imágenes antes de subir
- Implementar file size limits

---

## 🚀 Vercel (Hosting)

### Hobby Tier (Gratis)
- **Bandwidth**: 100 GB/mes
- **Build minutes**: 6,000/mes
- **Serverless functions**: 100 GB-Hours
- **Edge middleware**: Unlimited
- **Team members**: 1

**Límites prácticos**:
- ~50,000 page views/mes
- ~10-20 deploys/day

### Pro Tier ($20/mes)
- **Bandwidth**: 1 TB/mes
- **Build minutes**: 24,000/mes
- **Team members**: Unlimited
- **Analytics**: Advanced
- **Speed Insights**: Incluido

### Cuándo Migrar a Pro
- > 100 GB bandwidth (ej: >500K pageviews/mes)
- Necesitas team collaboration
- Quieres analytics avanzado

### Strategies para Reducir Uso

```typescript
// Cachear respuestas pesadas
export const revalidate = 3600; // 1 hour

// Optimizar images
import Image from 'next/image';
<Image
  src="/hero.jpg"
  alt="Hero"
  sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes
  quality={75} // Reduce quality slightly
/>

// Lazy load componentes pesados
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

---

## 💳 Stripe (Payments - Global)

### Pricing
- **Por transacción**: 2.9% + $0.30
- **No monthly fee**: $0 base cost

### Ejemplos de Costos

| Precio Plan | Fee Stripe | Net Revenue |
|-------------|------------|-------------|
| $9/mes      | $0.56      | $8.44       |
| $29/mes     | $1.14      | $27.86      |
| $99/mes     | $3.17      | $95.83      |

**Importante**:
- Fees se reducen a 2.7% + $0.05 con volumen >$1M/año
- International cards: +1.5%

### Estrategias

1. **Pago anual con descuento**:
   - Usuario paga $99/año (vs $9/mes = $108/año)
   - Reduces 12 transactions a 1 → ahorras en fees
   - Win-win: usuario ahorra, tú ahorras fees

2. **Pricing inteligente**:
   - $9.99 mejor que $9 (fee similar, revenue mayor)
   - $29 mejor que $30 (psicológicamente)

3. **Minimum viable price**:
   ```
   Stripe fee: $0.30
   Para tener 90% margin: precio mínimo = $3/mes
   ```

---

## 💰 MercadoPago (Payments - LATAM)

### Pricing (Argentina)
- **QR/Link**: 3.99% + $0
- **Subscriptions**: 4.99%
- **International cards**: +2%

### Ejemplos (Argentina, ARS)

| Precio | Fee MP | Net Revenue |
|--------|--------|-------------|
| $5,000 | $200   | $4,800      |
| $15,000| $600   | $14,400     |
| $30,000| $1,200 | $28,800     |

**Conversión USD → ARS**: Fluctúa (ej: 1 USD = ~900 ARS en Nov 2024)

### Consideraciones LATAM

1. **Tax (IVA 21%)**:
   - Precio mostrado: ¿Incluye o no IVA?
   - Recomendación: Mostrar precio final (con IVA incluido)

2. **Payment Methods**:
   - Credit card (más común)
   - Débito
   - Mercado Crédito
   - **Cuotas** (installments): Muy importante en Argentina!

3. **Chargeback Risk**:
   - Mayor en LATAM que USA/EU
   - Implementar fraud detection

### Estrategias

1. **Ofrecer cuotas**:
   ```typescript
   // MercadoPago permite hasta 12 cuotas
   installments: 12,
   installments_cost: 'seller' // Tú absorbes el costo
   ```

2. **Pricing en ARS**:
   - Actualizar cada 1-3 meses por inflación
   - Usar "dólar oficial" o "MEP" como referencia

---

## 📧 Resend (Email)

### Free Tier
- **Emails**: 3,000/mes
- **Domains**: 1
- **Team members**: 1

### Pro Tier ($20/mes)
- **Emails**: 50,000/mes
- **Domains**: Unlimited
- **Analytics**: Advanced

### Cuándo Migrar
- > 3,000 emails/mes
- Ej: 1,000 usuarios × 3 emails/mes = migrar a Pro

### Estrategias

1. **Batch emails inteligente**:
   ```typescript
   // ❌ Bad: 1 email por update
   onUpdate(() => sendEmail('Update'));

   // ✅ Good: Daily digest
   cron('0 9 * * *', () => {
     const updates = getUpdates();
     if (updates.length > 0) sendEmail('Daily digest', updates);
   });
   ```

2. **Transactional vs Marketing**:
   - Transactional (password reset): Always send
   - Marketing (newsletters): Opt-in, frecuencia controlada

---

## 🤖 OpenAI (AI Features)

### Pricing (GPT-4 Turbo)
- **Input**: $0.01/1K tokens
- **Output**: $0.03/1K tokens

### Ejemplos

| Uso | Tokens | Costo |
|-----|--------|-------|
| Generar título (50 tokens) | 1,000 input + 50 output | $0.011 |
| Resumir doc (500 tokens) | 2,000 input + 500 output | $0.035 |
| Chat conversation | 5,000 input + 1,000 output | $0.080 |

**Promedio**: $0.01-0.10 por interacción

### Strategies para Reducir Costos

1. **Caching Agresivo**:
   ```typescript
   const cache = new Map();

   async function generateWithCache(prompt: string) {
     if (cache.has(prompt)) return cache.get(prompt);

     const result = await openai.chat.completions.create({
       messages: [{ role: 'user', content: prompt }]
     });

     cache.set(prompt, result);
     return result;
   }
   ```

2. **Usar GPT-3.5 para tareas simples**:
   - GPT-3.5: $0.0005/1K tokens (20x cheaper!)
   - Clasificación, sentiment analysis: GPT-3.5
   - Content generation compleja: GPT-4

3. **Limitar uso por tier**:
   ```typescript
   const AI_LIMITS = {
     free: 10, // 10 requests/day
     pro: 100,
     enterprise: unlimited
   };
   ```

4. **Optimize prompts**:
   ```typescript
   // ❌ Bad: 500 tokens
   const prompt = `Very long detailed instructions...`;

   // ✅ Good: 50 tokens
   const prompt = `Summarize in 3 bullet points:`;
   ```

---

## 📊 Analytics

### Vercel Analytics (Incluido)
- **Free**: Básico (pageviews, referrers)
- **Pro ($20/mes)**: Advanced (funnels, custom events)

### PostHog (Opcional)
- **Free**: 1M events/mes
- **Paid**: $0.00031 per event después

### Google Analytics (Gratis)
- **Unlimited**: Gratis siempre
- Pero: Menos privacy-friendly

**Recomendación**: Vercel Analytics (incluido) + GA para MVP.

---

## 🎯 Arquitectura de Costos por Escala

### MVP (0-100 usuarios, $0-500 MRR)

```
Supabase Free:       $0
Vercel Hobby:        $0
Stripe fees:         ~$15 (si $500 MRR)
Resend Free:         $0
OpenAI (limited):    ~$10
Total:               ~$25/mes

Profit: $500 - $25 = $475 (95% margin)
```

### Growth (100-1K usuarios, $500-5K MRR)

```
Supabase Pro:        $25
Vercel Pro:          $20
Stripe fees:         ~$150 (si $5K MRR)
Resend Pro:          $20
OpenAI:              ~$50
Monitoring:          ~$10
Total:               ~$275/mes

Profit: $5,000 - $275 = $4,725 (94% margin)
```

### Scale (1K-10K usuarios, $5K-50K MRR)

```
Supabase Team:       $100
Vercel Pro:          $50 (más bandwidth)
Stripe fees:         ~$1,500 (si $50K MRR)
Resend:              $100
OpenAI:              $200
Monitoring:          $50
CDN:                 $50
Total:               ~$2,050/mes

Profit: $50,000 - $2,050 = $47,950 (95% margin)
```

---

## 💡 Tips Generales

1. **Start Free, Upgrade When Needed**
   - No pagar por adelantado
   - Monitorear uso cada semana

2. **Annual Billing**
   - Ahorra 20-30% en todos los servicios
   - Pero: Solo si estás seguro de long-term usage

3. **Monitor Usage**
   ```typescript
   // Add to your monitoring
   - Supabase DB size (daily check)
   - Vercel bandwidth (weekly)
   - API calls (daily)
   - Email sends (weekly)
   ```

4. **Set Alerts**
   - Supabase: 80% de límite
   - Vercel: 80GB de 100GB
   - Stripe: Unusual transaction spikes

---

## 📈 ROI Analysis

Para un SaaS típico con este stack:

**Break-even**: 10-20 usuarios pagando (plan Pro $29/mes)
- Revenue: $290-580/mes
- Costs: ~$25-50/mes
- Profit: $240-530/mes

**Sustainable**: 100 usuarios (plan Pro $29/mes)
- Revenue: $2,900/mes
- Costs: ~$275/mes
- Profit: $2,625/mes (90% margin)

**Margins en SaaS típico**: 70-80%
**Margins con este stack**: 90-95%

---

## 🔗 Resources

- [Supabase Pricing](https://supabase.com/pricing)
- [Vercel Pricing](https://vercel.com/pricing)
- [Stripe Pricing](https://stripe.com/pricing)
- [MercadoPago Fees](https://www.mercadopago.com.ar/costs-section/cost-model)
- [OpenAI Pricing](https://openai.com/pricing)
- [Resend Pricing](https://resend.com/pricing)
