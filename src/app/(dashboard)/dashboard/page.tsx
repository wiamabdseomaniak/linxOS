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
  Truck,
  MapPin,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  LineChart,
  Line,
} from 'recharts';
import {
  mockDashboardStats,
  mockWeeklyPerformance,
  mockDeliveriesByCity,
  mockStatusDistribution,
  mockDeliveries,
  mockActivityTimeline,
  mockCurrentUser,
} from '@/lib/mock-data';
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

const statCards = [
  {
    title: 'Total Deliveries',
    value: mockDashboardStats.totalDeliveries.toLocaleString(),
    change: '+12.5%',
    changeType: 'positive',
    icon: Package,
    color: 'violet',
  },
  {
    title: 'Pending',
    value: mockDashboardStats.activeDeliveries.toString(),
    change: '+5.2%',
    changeType: 'negative',
    icon: Clock,
    color: 'amber',
  },
  {
    title: 'Successful',
    value: mockDashboardStats.completedDeliveries.toLocaleString(),
    change: '+8.1%',
    changeType: 'positive',
    icon: CheckCircle2,
    color: 'green',
  },
  {
    title: 'Problematic',
    value: mockDashboardStats.failedDeliveries.toString(),
    change: '-3.4%',
    changeType: 'positive',
    icon: AlertTriangle,
    color: 'red',
  },
  
  
];

const colorMap: Record<string, string> = {
  violet: 'from-violet-600 to-purple-600',
  amber: 'from-yellow-500 to-amber-500',
  green: 'from-green-500 to-emerald-500',
  red: 'from-red-500 to-rose-500',
  blue: 'from-blue-500 to-cyan-500',
  emerald: 'from-emerald-500 to-teal-500',
};

const pieColors = ['#22c55e', '#8b5cf6', '#f59e0b', '#3b82f6', '#ef4444'];

export default function DashboardPage() {
  const router = useRouter();
  const urgentDeliveries = mockDeliveries.filter((d) => d.priority === 'urgent').slice(0, 3);
  const recentActivity = mockActivityTimeline.slice(0, 4);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {mockCurrentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your logistics today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl" onClick={() => router.push('/tracking')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Performance */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-soft h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg font-semibold">Monthly Deliveries Completed</CardTitle>
                <p className="text-sm text-muted-foreground">Deliveries completed per month</p>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                2026
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[320px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={mockWeeklyPerformance}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#eab308"
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

        {/* Deliveries by City */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="border-0 shadow-soft h-[400px]">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg font-semibold">Deliveries by City</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[320px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={mockDeliveriesByCity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#eab308" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Urgent Deliveries */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-soft h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg font-semibold">Urgent Deliveries</CardTitle>
                <p className="text-sm text-muted-foreground">Requires immediate attention</p>
              </div>
              <Button variant="ghost" size="sm" className="text-yellow-500 hover:text-yellow-700" onClick={() => router.push('/logistics')}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="pt-4 h-[calc(100%-80px)]">
              <div className="space-y-4">
                {urgentDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="flex items-center justify-between rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-white">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{delivery.trackingId}</p>
                        <p className="text-sm text-muted-foreground">{delivery.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={PRIORITIES[delivery.priority].color}>
                        {PRIORITIES[delivery.priority].label}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">{delivery.city}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(delivery.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Deliveries with Issues */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-soft h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg font-semibold">Deliveries with Issues – This Week</CardTitle>
                <p className="text-sm text-muted-foreground">Problematic deliveries requiring attention</p>
              </div>
            </CardHeader>
            <CardContent className="pt-4 h-[calc(100%-80px)]">
              <div className="h-full overflow-auto">
                  <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Event Name</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Problem Type</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Count</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { event: 'Ramadan Express', problem: 'Late delivery', count: 3, status: 'En attente', statusColor: 'bg-yellow-100 text-yellow-700' },
                      { event: 'Tech Day Casablanca', problem: 'Wrong item', count: 2, status: 'Résolu', statusColor: 'bg-green-100 text-green-700' },
                      { event: 'Marrakech Food Festival', problem: 'Damaged package', count: 1, status: 'En révision', statusColor: 'bg-blue-100 text-blue-700' },
                    ].map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3 font-medium">{item.event}</td>
                        <td className="py-3 text-muted-foreground">{item.problem}</td>
                        <td className="py-3 text-center">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-medium">
                            {item.count}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.statusColor}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 bg-muted/30">
                      <td className="py-3 font-semibold" colSpan={2}>Total Issues</td>
                      <td className="py-3 text-center font-semibold text-red-600">6</td>
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