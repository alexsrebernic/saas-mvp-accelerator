import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu SaaS MVP. Aquí van tus métricas principales.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Usuarios Totales"
          value="0"
          description="Usuarios registrados"
        />
        <MetricCard
          title="Usuarios Activos"
          value="0"
          description="Últimos 7 días"
        />
        <MetricCard
          title="MRR"
          value="$0"
          description="Monthly Recurring Revenue"
        />
        <MetricCard
          title="Tasa de Conversión"
          value="0%"
          description="Free → Paid"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>No hay actividad reciente aún.</p>
            <p className="text-sm mt-2">
              Comienza a usar la plataforma para ver actividad aquí.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
