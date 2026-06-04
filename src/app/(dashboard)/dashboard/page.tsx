'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
} from 'recharts';
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { PRIORITIES } from '@/lib/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const colorMap: Record<string, string> = {
  violet: 'from-violet-600 to-purple-600',
  amber: 'from-yellow-500 to-amber-500',
  green: 'from-green-500 to-emerald-500',
  red: 'from-red-500 to-rose-500',
  blue: 'from-blue-500 to-cyan-500',
  emerald: 'from-emerald-500 to-teal-500',
};

export default function DashboardPage() {
  const router = useRouter();
  const { stats, weekly, byCity, activity, problems, urgent, loading, error } = useDashboard();
  const { user } = useCurrentUser();

  const displayName = user?.name?.split(' ')[0] ?? 'Utilisateur';

  const statCards = [
    {
      title: 'Total des livraisons',
      value: stats.totalDeliveries.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'violet',
    },
    {
      title: 'En attente',
      value: stats.activeDeliveries.toString(),
      change: '+5.2%',
      changeType: 'negative' as const,
      icon: Clock,
      color: 'amber',
    },
    {
      title: 'Réussies',
      value: stats.completedDeliveries.toLocaleString(),
      change: '+8.1%',
      changeType: 'positive' as const,
      icon: CheckCircle2,
      color: 'green',
    },
    {
      title: 'Problématiques',
      value: stats.failedDeliveries.toString(),
      change: '-3.4%',
      changeType: 'positive' as const,
      icon: AlertTriangle,
      color: 'red',
    },
  ];

  const urgentDeliveries = urgent;
  const recentActivity = activity.slice(0, 4);
  const issuesThisWeek = problems;
  const totalIssuesThisWeek = issuesThisWeek.reduce((sum, p) => sum + p.count, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour, {displayName} 👋
          </h1>
          <p className="text-muted-foreground">
            Voici ce qui se passe avec votre logistique aujourd&apos;hui.
          </p>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 text-sm">
          Erreur : {error}
        </div>
      )}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-0 shadow-soft hover:shadow-lg transition-shadow">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[stat.color]} opacity-5`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full bg-gradient-to-br ${colorMap[stat.color]} p-2`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '…' : stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600 dark:text-red-400" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">par rapport au mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-soft h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg font-semibold">Livraisons mensuelles effectuées</CardTitle>
                <p className="text-sm text-muted-foreground">Livraisons effectuées par mois</p>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                2026
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
                  <div className="h-[320px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={weekly} margin={{ left: -20, right: 8 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" style={{ stopColor: 'var(--primary)', stopOpacity: 0.3 }} />
                        <stop offset="95%" style={{ stopColor: 'var(--primary)', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
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
                      dataKey="deliveries"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="border-0 shadow-soft h-[400px]">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg font-semibold">Livraisons par ville</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[320px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={byCity} margin={{ left: -20, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
                    <XAxis dataKey="city" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        color: 'var(--foreground)',
                      }}
                    />
                    <Bar dataKey="deliveries" fill="var(--primary)" radius={[8, 8, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-soft h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg font-semibold">Livraisons urgentes</CardTitle>
                <p className="text-sm text-muted-foreground">Nécessite une attention immédiate</p>
              </div>
              <Button variant="ghost" size="sm" className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300" onClick={() => router.push('/logistics')}>
                Voir tout
              </Button>
            </CardHeader>
            <CardContent className="pt-4 h-[calc(100%-80px)]">
              <div className="space-y-4">
                {urgentDeliveries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune livraison urgente.</p>
                ) : (
                  urgentDeliveries.map((delivery) => (
                    <div
                      key={delivery.id}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-muted/50 p-3 sm:p-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-white dark:from-yellow-600 dark:to-amber-600">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{delivery.trackingId}</p>
                          <p className="text-sm text-muted-foreground">{delivery.clientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={PRIORITIES[delivery.priority as keyof typeof PRIORITIES].color}>
                          {PRIORITIES[delivery.priority as keyof typeof PRIORITIES].label}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">{delivery.city}</p>
                          <p className="text-xs text-muted-foreground">
                            {delivery.scheduledDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-soft h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg font-semibold">Livraisons avec problèmes – Cette semaine</CardTitle>
                <p className="text-sm text-muted-foreground">Livraisons problématiques nécessitant attention</p>
              </div>
            </CardHeader>
            <CardContent className="pt-4 h-[calc(100%-80px)]">
              <div className="h-full overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Nom de l'événement</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Type de problème</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Nombre</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issuesThisWeek.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-3 text-center text-muted-foreground">Aucun problème signalé</td>
                      </tr>
                    ) : (
                      issuesThisWeek.map((item) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="py-3 font-medium">{item.event}</td>
                          <td className="py-3 text-muted-foreground">{item.problem}</td>
                          <td className="py-3 text-center">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium">
                              {item.count}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.statusColor}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 bg-muted/30">
                      <td className="py-3 font-semibold" colSpan={2}>Total des problèmes</td>
                      <td className="py-3 text-center font-semibold text-red-600 dark:text-red-400">{totalIssuesThisWeek}</td>
                      <td className="py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
