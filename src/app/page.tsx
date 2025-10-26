import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-6xl font-bold text-center">
            🚀 SaaS MVP Accelerator
          </h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl">
            De la idea al MVP en 14 días. Template completo con Next.js 14,
            Supabase, Stripe, y todo lo que necesitas para lanzar tu SaaS.
          </p>

          <div className="flex gap-4 mt-8">
            <Button asChild size="lg">
              <Link href="/dashboard">Ver Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Login</Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <FeatureCard
              icon="⚡"
              title="Setup Rápido"
              description="npm run setup y estás listo. Script interactivo genera todo por ti."
            />
            <FeatureCard
              icon="📝"
              title="Documentación Completa"
              description="CLAUDE.md + PRD.md + docs técnicas. Todo documentado."
            />
            <FeatureCard
              icon="🌍"
              title="LATAM Ready"
              description="MercadoPago, i18n ES/EN, templates legales para Argentina."
            />
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Creado con ❤️ por{' '}
              <a
                href="https://github.com/alexsrebernic"
                className="underline hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                Alex Srebernic
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
