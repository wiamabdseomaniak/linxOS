'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { WeeklyPerformance, CityData } from '@/types/supabase';

interface DashboardChartsProps {
  weekly: WeeklyPerformance[];
  byCity: CityData[];
  successRate: number;
  completedDeliveries: number;
  failedDeliveries: number;
}

export function AreaChartCard({ weekly }: { weekly: WeeklyPerformance[] }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Suivi des performances</p>
          <CardTitle className="text-lg font-semibold">
            {'Livraisons mensuelles'}
          </CardTitle>
        </div>
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
          2026
        </Badge>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[280px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weekly} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5C400" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#F5C400" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="strokeValue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F5C400" />
                  <stop offset="100%" stopColor="#F5C400" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: 'var(--foreground)',
                }}
              />
              <Area
                type="monotone"
                dataKey="livrées"
                stroke="url(#strokeValue)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function RadialChartCard({ successRate, completedDeliveries, failedDeliveries }: {
  successRate: number;
  completedDeliveries: number;
  failedDeliveries: number;
}) {
  const radialData = [{ name: 'Succès', value: successRate, fill: '#10b981' }];

  return (
    <Card className="h-full overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
      <CardHeader className="border-b border-border/50 pb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Indicateur</p>
        <CardTitle className="text-lg font-semibold">Taux de réussite</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex h-[200px] items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              innerRadius="68%"
              outerRadius="100%"
              barSize={14}
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background={{ fill: 'var(--muted)' }} dataKey="value" cornerRadius={10} fill="#10b981" />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute flex flex-col items-center">
            <span className="text-3xl font-semibold tracking-tight">{successRate}%</span>
            <span className="text-xs text-muted-foreground">livraisons réussies</span>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-3">
            <p className="text-xs text-muted-foreground">Réussies</p>
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{completedDeliveries}</p>
          </div>
          <div className="rounded-xl bg-rose-500/10 p-3">
            <p className="text-xs text-muted-foreground">Échouées</p>
            <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">{failedDeliveries}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BarChartCard({ byCity }: { byCity: CityData[] }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
      <CardHeader className="border-b border-border/50 pb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Répartition</p>
        <CardTitle className="text-lg font-semibold">{'Livraisons par ville'}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[280px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byCity} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5C400" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
              <XAxis dataKey="city" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--foreground)',
                }}
              />
              <Bar dataKey="livrées" fill="url(#barFill)" radius={[8, 8, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
