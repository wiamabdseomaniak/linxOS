// Page Logistique — gestion et suivi des livraisons avec filtres, vue Kanban et détails
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  MapPin,
  Clock,
  Calendar,
  Truck,
  CheckCircle2,
  MessageCircle,
  FileText,
  X,
  AlertTriangle,
  Filter,
  Search,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { StatutLivraison, LogisticsEvent } from '@/types/supabase';
import { useLogistics } from '@/features/logistics/hooks/use-logistics';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type StatusKey = StatutLivraison;

const STATUS_COLUMNS: Array<{
  key: StatusKey;
  labelKey: string;
  icon: typeof Package;
  accent: { bar: string; ring: string; bg: string; text: string; chip: string; glow: string };
}> = [
  {
    key: 'planifie',
    labelKey: 'logistics.statuses.scheduled',
    icon: Calendar,
    accent: {
      bar: 'bg-blue-500',
      ring: 'ring-blue-500/20',
      bg: 'from-blue-500/10 via-blue-500/5 to-transparent',
      text: 'text-blue-700 dark:text-blue-300',
      chip: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      glow: 'shadow-[0_18px_40px_-25px_rgba(59,130,246,0.6)]',
    },
  },
  {
    key: 'en_cours',
    labelKey: 'logistics.statuses.inTransit',
    icon: Truck,
    accent: {
      bar: 'bg-orange-500',
      ring: 'ring-orange-500/20',
      bg: 'from-orange-500/10 via-orange-500/5 to-transparent',
      text: 'text-orange-700 dark:text-orange-300',
      chip: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
      glow: 'shadow-[0_18px_40px_-25px_rgba(249,115,22,0.6)]',
    },
  },
  {
    key: 'livree',
    labelKey: 'logistics.statuses.delivered',
    icon: CheckCircle2,
    accent: {
      bar: 'bg-emerald-500',
      ring: 'ring-emerald-500/20',
      bg: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      text: 'text-emerald-700 dark:text-emerald-300',
      chip: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      glow: 'shadow-[0_18px_40px_-25px_rgba(16,185,129,0.6)]',
    },
  },
  {
    key: 'echouee',
    labelKey: 'logistics.statuses.failed',
    icon: AlertTriangle,
    accent: {
      bar: 'bg-rose-500',
      ring: 'ring-rose-500/20',
      bg: 'from-rose-500/10 via-rose-500/5 to-transparent',
      text: 'text-rose-700 dark:text-rose-300',
      chip: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
      glow: 'shadow-[0_18px_40px_-25px_rgba(244,63,94,0.6)]',
    },
  },
];

const STATUS_BADGE: Record<StatusKey, string> = {
  planifie: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20',
  en_cours: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500/20',
  livree: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20',
  echouee: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20',
};

export default function LogisticsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<LogisticsEvent | null>(null);
  const [noteText, setNoteText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const {
    events,
    loading,
    error,
    statusCounts,
    handleUpdateStatus,
    handleUpdateNote,
    openWhatsApp,
  } = useLogistics('planifie', cityFilter);

  const cities = Array.from(new Set(events.map((e) => e.city))).sort();
  const totalCount = events.length;

  const filteredByStatus = (status: StatusKey) =>
    events.filter((e) => {
      if (e.status !== status) return false;
      if (search.trim().length === 0) return true;
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.contactName.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.address.toLowerCase().includes(q) ||
        e.id_livraison.toLowerCase().includes(q) ||
        e.id_tracking.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-100/60 px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            Opérations
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t('logistics.title')}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t('logistics.subtitle')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('common.search') + '...'}
              className="h-10 w-full min-w-[220px] rounded-full bg-card/80 pl-9 pr-4 backdrop-blur-sm lg:w-72"
            />
          </div>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="h-10 appearance-none rounded-full border border-border/50 bg-card/80 pl-9 pr-8 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">Toutes les villes</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-rose-300/40 bg-rose-50/80 p-4 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          Erreur : {error}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 shadow-soft backdrop-blur-sm">
        <div className="flex flex-col gap-2 border-b border-border/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t('common.seeAll')}
            </p>
            <h2 className="text-xl font-semibold tracking-tight">
              {t('logistics.operations')}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 font-medium text-amber-700 dark:text-amber-300">
              {totalCount} {t('logistics.units')}
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-4">
          {STATUS_COLUMNS.map((column, idx) => {
            const count =
              column.key === 'planifie'
                ? statusCounts.scheduled
                : column.key === 'en_cours'
                ? statusCounts.in_transit
                : column.key === 'livree'
                ? statusCounts.delivered
                : statusCounts.failed;
            const items = filteredByStatus(column.key);
            const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return (
              <motion.div
                key={column.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  'group/column relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/60',
                  column.accent.glow
                )}
              >
                <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70', column.accent.bg)} />
                <div className={cn('absolute left-0 right-0 top-0 h-1', column.accent.bar)} />

                <div className="relative flex items-center justify-between px-4 pt-5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-xl ring-1',
                        column.accent.chip,
                        column.accent.ring
                      )}
                    >
                      <column.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Statut</p>
                      <h3 className={cn('text-sm font-semibold', column.accent.text)}>
                        {t(column.labelKey)}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn('text-2xl font-semibold tracking-tight', column.accent.text)}>
                      {count}
                    </span>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {percent}%
                    </p>
                  </div>
                </div>

                <div className="relative h-1.5 mx-4 mt-3 overflow-hidden rounded-full bg-muted/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                    className={cn('h-full rounded-full', column.accent.bar)}
                  />
                </div>

                <ScrollArea className="relative mt-3 flex-1 px-3 pb-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60" />
                    </div>
                  ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-1 py-12 text-center text-xs text-muted-foreground">
                      <Package className="h-5 w-5 opacity-40" />
                      {t('logistics.empty')}
                    </div>
                  ) : (
                    <ul className="space-y-2.5">
                      <AnimatePresence>
                        {items.map((event) => (
                          <motion.li
                            key={event.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <DeliveryCard
                              event={event}
                              accent={column.accent}
                              onOpenDetails={() => {
                                setSelectedEvent(event);
                                setDetailsDialogOpen(true);
                              }}
                              onStart={() => handleUpdateStatus(event.id, 'en_cours')}
                              onDelivered={() => handleUpdateStatus(event.id, 'livree')}
                              onFailed={() => handleUpdateStatus(event.id, 'echouee')}
                              t={t}
                            />
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </ScrollArea>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('logistics.note.addTitle')}</DialogTitle>
            <DialogDescription>
              {t('logistics.note.addSubtitle')} : {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder={t('logistics.note.placeholder')}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
            />
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t('logistics.note.attach')}</label>
              <div
                className="cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-amber-500/60"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setAttachedFiles((prev) => [...prev, ...files]);
                  }}
                />
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t('logistics.note.attachHint')}</p>
                  <p className="text-xs text-muted-foreground">{t('logistics.note.attachTypes')}</p>
                </div>
              </div>
              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-amber-500" />
                        <span className="truncate text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== index))}
                        className="text-muted-foreground transition-colors hover:text-rose-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNoteDialogOpen(false);
                  setNoteText('');
                  setAttachedFiles([]);
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedEvent) return;
                  await handleUpdateNote(selectedEvent.id, noteText, attachedFiles);
                  setNoteDialogOpen(false);
                  setNoteText('');
                  setAttachedFiles([]);
                }}
                className="bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400"
                disabled={!noteText.trim() && attachedFiles.length === 0}
              >
                {t('logistics.note.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t('logistics.details.title')}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="rounded-xl bg-muted/40 p-4 ring-1 ring-border/50">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('logistics.details.deliveryId')}</p>
                  <p className="mt-0.5 font-mono text-sm font-medium text-amber-600 dark:text-amber-400">{selectedEvent?.id_livraison}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('logistics.details.trackingId')}</p>
                  <p className="mt-0.5 font-mono text-sm font-medium text-violet-600 dark:text-violet-400">{selectedEvent?.id_tracking}</p>
                </div>
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('logistics.details.event')}</p>
                  <p className="mt-0.5 font-semibold">{selectedEvent?.title}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('logistics.details.club')}</p>
                  <p className="mt-0.5 font-medium text-amber-600 dark:text-amber-400">{selectedEvent?.club}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('logistics.details.address')}</p>
                  <p className="mt-0.5 text-sm">{selectedEvent?.address}, {selectedEvent?.city}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('logistics.details.date')}</p>
                    <p className="mt-0.5 font-medium text-sm">{selectedEvent?.date}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('logistics.details.time')}</p>
                    <p className="mt-0.5 font-medium text-sm">{selectedEvent?.time}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('logistics.details.quantity')}</p>
                    <p className="mt-0.5 font-medium text-sm">{selectedEvent?.quantity} {t('logistics.units')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('logistics.details.contact')}</p>
                  <p className="mt-0.5 font-medium text-sm">{selectedEvent?.contactName}</p>
                  <p className="text-xs text-muted-foreground">{selectedEvent?.contactPhone}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('logistics.details.status')}</p>
                  <span
                    className={cn(
                      'mt-0.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                      STATUS_BADGE[selectedEvent?.status ?? 'planifie']
                    )}
                  >
                    {selectedEvent?.status === 'planifie' && t('logistics.statuses.scheduled')}
                    {selectedEvent?.status === 'en_cours' && t('logistics.statuses.inTransit')}
                    {selectedEvent?.status === 'livree' && t('logistics.statuses.delivered')}
                    {selectedEvent?.status === 'echouee' && t('logistics.statuses.failed')}
                  </span>
                </div>
                {selectedEvent?.notes && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('logistics.details.notes')}</p>
                    <p className="mt-1 rounded-lg border border-amber-300/40 bg-amber-50 p-2 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
                      {selectedEvent.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">Actions rapides</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedEvent && openWhatsApp(selectedEvent.contactPhone)}
                  className="rounded-full"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t('logistics.quick.whatsapp')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNoteDialogOpen(true)}
                  className="rounded-full"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t('logistics.quick.addNote')}
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 p-4">
              <p className="mb-3 text-sm font-semibold">{t('logistics.timeline.title')}</p>
              <div className="space-y-3">
                <TimelineStep
                  active={selectedEvent?.status === 'planifie' || selectedEvent?.status === 'en_cours' || selectedEvent?.status === 'livree' || selectedEvent?.status === 'echouee'}
                  failed={false}
                  title={t('logistics.timeline.scheduled')}
                  desc={t('logistics.timeline.scheduledDesc')}
                />
                <TimelineStep
                  active={selectedEvent?.status === 'en_cours' || selectedEvent?.status === 'livree'}
                  failed={false}
                  title={t('logistics.timeline.inTransit')}
                  desc={t('logistics.timeline.inTransitDesc')}
                />
                <TimelineStep
                  active={selectedEvent?.status === 'livree' || selectedEvent?.status === 'echouee'}
                  failed={selectedEvent?.status === 'echouee'}
                  title={selectedEvent?.status === 'echouee' ? t('logistics.timeline.failed') : t('logistics.timeline.delivered')}
                  desc={selectedEvent?.status === 'echouee' ? t('logistics.timeline.failedDesc') : t('logistics.timeline.deliveredDesc')}
                  last
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface DeliveryCardProps {
  event: LogisticsEvent;
  accent: { text: string; chip: string };
  onOpenDetails: () => void;
  onStart: () => void;
  onDelivered: () => void;
  onFailed: () => void;
  t: (path: string) => string;
}

function DeliveryCard({ event, accent, onOpenDetails, onStart, onDelivered, onFailed, t }: DeliveryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/90 p-3.5 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-semibold leading-snug">{event.title}</p>
        <button
          onClick={onOpenDetails}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-600"
          aria-label={t('logistics.actions.details')}
        >
          <FileText className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{event.contactName}</p>
      <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
        <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
        <span className="line-clamp-1">{event.address}</span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {event.date}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {event.time}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5">
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', accent.chip)}>
          {event.quantity} {t('logistics.units')}
        </span>
        <div className="flex items-center gap-1">
          {event.status === 'planifie' && (
            <Button size="xs" variant="outline" onClick={onStart} className="h-7 rounded-full px-2.5 text-xs">
              {t('logistics.actions.startRoute')}
            </Button>
          )}
          {event.status === 'en_cours' && (
            <>
              <Button
                size="xs"
                variant="outline"
                onClick={onDelivered}
                className="h-7 rounded-full border-emerald-500/30 px-2.5 text-xs text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
              >
                {t('logistics.actions.delivered')}
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={onFailed}
                className="h-7 rounded-full border-rose-500/30 px-2.5 text-xs text-rose-700 hover:bg-rose-500/10 dark:text-rose-300"
              >
                {t('logistics.actions.failed')}
              </Button>
            </>
          )}
          {(event.status === 'livree' || event.status === 'echouee') && (
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', accent.chip)}>
              {event.status === 'livree' ? t('logistics.actions.completed') : t('logistics.actions.failed')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface TimelineStepProps {
  active: boolean;
  failed: boolean;
  title: string;
  desc: string;
  last?: boolean;
}

function TimelineStep({ active, failed, title, desc, last }: TimelineStepProps) {
  const color = failed ? 'bg-rose-500' : active ? 'bg-emerald-500' : 'bg-muted-foreground/30';
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn('h-2.5 w-2.5 rounded-full ring-4', color, active || failed ? 'ring-current/10' : 'ring-transparent')} />
        {!last && <div className="w-px flex-1 bg-border" />}
      </div>
      <div className="pb-1">
        <p className={cn('text-sm font-medium', active || failed ? 'text-foreground' : 'text-muted-foreground')}>
          {title}
        </p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
