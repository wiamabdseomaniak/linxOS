'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, Calendar, MapPin, Truck, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { PRIORITIES } from '@/lib/constants';

const AreaChartCard = dynamic(() => import('@/components/dashboard/dashboard-charts').then(m => m.AreaChartCard), { ssr: false });
const RadialChartCard = dynamic(() => import('@/components/dashboard/dashboard-charts').then(m => m.RadialChartCard), { ssr: false });
const BarChartCard = dynamic(() => import('@/components/dashboard/dashboard-charts').then(m => m.BarChartCard), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const statPalette = {
  violet: {
    ring: 'ring-violet-500/20',
    glow: 'shadow-[0_18px_40px_-20px_rgba(124,58,237,0.55)]',
    chip: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    spark: ['#8b5cf6', '#6366f1'],
  },
  amber: {
    ring: 'ring-amber-500/20',
    glow: 'shadow-[0_18px_40px_-20px_rgba(245,158,11,0.55)]',
    chip: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    spark: ['#f59e0b', '#fbbf24'],
  },
  emerald: {
    ring: 'ring-emerald-500/20',
    glow: 'shadow-[0_18px_40px_-20px_rgba(16,185,129,0.55)]',
    chip: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    spark: ['#10b981', '#34d399'],
  },
  rose: {
    ring: 'ring-rose-500/20',
    glow: 'shadow-[0_18px_40px_-20px_rgba(244,63,94,0.55)]',
    chip: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    spark: ['#f43f5e', '#fb7185'],
  },
} as const;

type ColorKey = keyof typeof statPalette;

export default function DashboardPage() {
  const router = useRouter();
  const { stats, weekly, byCity, activity, problems, urgent, loading, error } = useDashboard();
  const { user, loading: userLoading } = useCurrentUser();

  const displayName = user?.name?.split(' ')[0];

  const successRate = useMemo(() => stats.totalDeliveries > 0
    ? Math.round((stats.completedDeliveries / stats.totalDeliveries) * 100)
    : 0, [stats.totalDeliveries, stats.completedDeliveries]);

  const statCards = useMemo(() => [
    {
      title: 'Total des livraisons',
      value: stats.totalDeliveries.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'violet' as ColorKey,
      ring: 'before:bg-violet-500/40',
    },
    {
      title: 'En cours',
      value: stats.activeDeliveries.toString(),
      change: '+5.2%',
      changeType: 'negative' as const,
      icon: Clock,
      color: 'amber' as ColorKey,
      ring: 'before:bg-amber-500/40',
    },
    {
      title: 'Livrées',
      value: stats.completedDeliveries.toLocaleString(),
      change: '+8.1%',
      changeType: 'positive' as const,
      icon: CheckCircle2,
      color: 'emerald' as ColorKey,
      ring: 'before:bg-emerald-500/40',
    },
    {
      title: 'Problèmes',
      value: stats.failedDeliveries.toString(),
      change: '-3.4%',
      changeType: 'positive' as const,
      icon: AlertTriangle,
      color: 'rose' as ColorKey,
      ring: 'before:bg-rose-500/40',
    },
  ], [stats.totalDeliveries, stats.activeDeliveries, stats.completedDeliveries, stats.failedDeliveries]);

  const recentActivity = useMemo(() => activity.slice(0, 4), [activity]);
  const totalIssuesThisWeek = useMemo(() => problems.reduce((sum, p) => sum + p.count, 0), [problems]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-5 sm:gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 px-3.5 py-1.5 text-xs font-semibold text-amber-800 shadow-md shadow-amber-500/10 ring-1 ring-amber-300/30 backdrop-blur-sm dark:border-amber-400/30 dark:from-amber-400/15 dark:to-yellow-400/10 dark:text-amber-200 dark:ring-amber-400/20">
            
            Vue d&apos;ensemble · 2026
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {'Bonjour'}{displayName && !userLoading && <> <span className="text-gradient-brand">{displayName}</span></>}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {"Aperçu de l'activité de vos livraisons aujourd'hui."}
          </p>
        </div>
       
          
      </motion.div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 text-sm">
          Erreur : {error}
        </div>
      )}

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const palette = statPalette[stat.color];
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`group relative overflow-hidden rounded-2xl border-border/50 bg-card/70 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-border ${palette.glow}`}
            >
              <div className={`pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full ${stat.ring} blur-2xl`} />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${palette.chip}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                 
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                    {loading ? '…' : stat.value}
                  </p>
                
                <p className="text-xs text-muted-foreground">
                  {'Par rapport au mois dernier'}
                </p>
              <div className="flex items-center justify-end">
  {stat.title !== 'En cours' && (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
      stat.changeType === 'positive'
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
    }`}
  >
    {stat.changeType === 'positive' ? (
      <ArrowUpRight className="h-3 w-3" />
    ) : (
      <ArrowDownRight className="h-3 w-3" />
    )}
    {stat.change}
  </span>
)}
</div>
  </div>
              </div>
            </Card>
          );
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <AreaChartCard weekly={weekly} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <RadialChartCard
            successRate={successRate}
            completedDeliveries={stats.completedDeliveries}
            failedDeliveries={stats.failedDeliveries}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <BarChartCard byCity={byCity} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Activité</p>
                <CardTitle className="text-lg font-semibold">Activité récente</CardTitle>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
              ) : (
                <ul className="space-y-3">
                  {recentActivity.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.driver ?? '—'}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Priorité</p>
                <CardTitle className="text-lg font-semibold">{'Livraisons urgentes'}</CardTitle>
                <p className="text-sm text-muted-foreground">{'À traiter en priorité'}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-amber-600 hover:text-amber-700 dark:text-amber-400"
                onClick={() => router.push('/logistics')}
              >
                {'Voir tout'}
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {urgent.length === 0 ? (
                <p className="text-sm text-muted-foreground">{'Aucune livraison urgente pour le moment.'}</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {urgent.map((delivery) => (
                    <div
                      key={delivery.id}
                      className="group relative overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-4 transition-all hover:border-amber-500/40"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                            <Truck className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="font-mono text-sm font-semibold">{delivery.trackingId}</p>
                            <p className="text-xs text-muted-foreground">{delivery.clientName}</p>
                          </div>
                        </div>
                        <Badge className={PRIORITIES[delivery.priority as keyof typeof PRIORITIES].color}>
                          {PRIORITIES[delivery.priority as keyof typeof PRIORITIES].label}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {delivery.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {delivery.scheduledDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Incidents</p>
                <CardTitle className="text-lg font-semibold">Problèmes</CardTitle>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                {totalIssuesThisWeek}
              </span>
            </CardHeader>
            <CardContent className="pt-4">
              {problems.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun problème cette semaine.</p>
              ) : (
                <ul className="space-y-2.5">
                  {problems.slice(0, 5).map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.event}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.problem}</p>
                      </div>
                      <span className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold ${item.statusColor}`}>
                        {item.count}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
