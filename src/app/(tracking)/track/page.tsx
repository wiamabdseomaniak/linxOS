'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, MapPin, Clock, Phone, AlertCircle, ArrowLeft, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockSportEvents } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'SCHEDULED', label: 'Scheduled', icon: Calendar },
  { id: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export default function TrackPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundEvent, setFoundEvent] = useState<typeof mockSportEvents[0] | null>(null);

  const handleSearch = () => {
    const event = mockSportEvents.find(
      (e) =>
        e.id_tracking.toLowerCase() === searchQuery.toLowerCase() ||
        e.id_livraison.toLowerCase() === searchQuery.toLowerCase() ||
        e.contactPhone.includes(searchQuery)
    );
    setFoundEvent(event || null);
  };

  const getCurrentStepIndex = (status: string) => {
    if (status === 'FAILED') return -1;
    return steps.findIndex((s) => s.id === status);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Scheduled';
      case 'IN_TRANSIT': return 'In Transit';
      case 'DELIVERED': return 'Delivered';
      case 'FAILED': return 'Failed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-white/80 backdrop-blur-xl dark:bg-gray-900/80">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link href="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-400 shadow-lg shadow-yellow-500/25">
            <span className="text-2xl font-bold text-white">LX</span>
          </div>
          <h1 className="text-3xl font-bold">Track Your Delivery</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your tracking ID, delivery ID, or phone number
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="LNX-2026-001 or LIV-2026-001"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="h-14 rounded-xl pl-12 text-lg"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="h-14 rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 px-8 shadow-lg shadow-yellow-500/25"
                >
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {foundEvent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <Card className="border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{foundEvent.id_tracking}</CardTitle>
                    <p className="mt-1 text-white/80">
                      {getStatusLabel(foundEvent.status)}
                    </p>
                  </div>
                  <Badge className="bg-white/20 text-white text-lg px-4 py-1">
                    {foundEvent.quantity} units
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-8">
                  <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                      const currentIndex = getCurrentStepIndex(foundEvent.status);
                      const isActive = currentIndex >= index;
                      const isCurrent = currentIndex === index;
                      const Icon = step.icon;

                      return (
                        <div key={step.id} className="flex flex-1 flex-col items-center">
                          <div
                            className={cn(
                              'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all',
                              isActive
                                ? 'border-yellow-500 bg-yellow-500 text-white'
                                : 'border-gray-200 bg-white text-gray-400',
                              isCurrent && 'scale-110 shadow-lg shadow-yellow-500/25'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className={cn('mt-2 text-xs font-medium', isActive ? 'text-yellow-500' : 'text-gray-400')}>
                            {step.label}
                          </p>
                          {index < steps.length - 1 && (
                            <div
                              className={cn(
                                'absolute left-1/2 top-6 h-0.5 w-full -translate-x-1/2',
                                currentIndex > index ? 'bg-yellow-500' : 'bg-gray-200'
                              )}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {foundEvent.status === 'FAILED' && (
                  <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-400">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <p className="font-medium">There is an issue with this delivery</p>
                    </div>
                    <p className="mt-1 text-sm">Our team is working to resolve it. Please contact support for more information.</p>
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Event Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Event Name</p>
                        <p className="font-medium">{foundEvent.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Club</p>
                        <p className="font-medium">{foundEvent.club}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-1 h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Address</p>
                          <p className="font-medium">{foundEvent.address}</p>
                          <p className="text-sm text-muted-foreground">{foundEvent.city}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-1 h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Event Date</p>
                          <p className="font-medium">{foundEvent.date} at {foundEvent.time}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Package className="mt-1 h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p className="font-medium">{foundEvent.quantity} units</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Recipient</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-yellow-500 text-white font-semibold">
                          {foundEvent.contactName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{foundEvent.contactName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="mt-1 h-4 w-4 text-yellow-500" />
                        <p className="font-medium">{foundEvent.contactPhone}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-muted-foreground">Delivery ID</p>
                      <p className="font-mono font-medium text-violet-600">{foundEvent.id_livraison}</p>
                    </div>

                    {foundEvent.notes && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-1">
                          {foundEvent.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : searchQuery && !foundEvent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <Card className="border-0 shadow-2xl">
              <CardContent className="py-16">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold">No Delivery Found</h2>
                <p className="mt-2 text-muted-foreground">
                  We couldn&apos;t find a delivery matching your search. Please check your tracking ID or contact support.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </main>

      <footer className="mt-16 border-t bg-white/80 backdrop-blur-xl dark:bg-gray-900/80">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 LINXOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}