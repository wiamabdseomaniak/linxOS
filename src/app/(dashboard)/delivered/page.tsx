'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Package, CheckCircle2, MessageCircle, FileText, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockSportEvents } from '@/lib/mock-data';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function DeliveredPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof mockSportEvents[0] | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [events, setEvents] = useState(mockSportEvents.filter(e => e.status === 'DELIVERED'));

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, '').replace('+212', '212');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const updateEventNote = (eventId: string, note: string) => {
    const fileNames = attachedFiles.length > 0
      ? `\n\nAttached files: ${attachedFiles.map(f => f.name).join(', ')}`
      : '';
    setEvents(events.map(e =>
      e.id === eventId ? { ...e, notes: note + fileNames } : e
    ));
    setNoteDialogOpen(false);
    setNoteText('');
    setAttachedFiles([]);
  };

  const openNoteDialog = (event: typeof mockSportEvents[0]) => {
    setSelectedEvent(event);
    setNoteText(event.notes || '');
    setNoteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivered Events</h1>
          <p className="text-muted-foreground">
            View all successfully delivered events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="mr-1 h-4 w-4" />
            {events.length} Delivered
          </Badge>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Delivered</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-violet-100 p-3 dark:bg-violet-900/30">
                  <Package className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Units</p>
                  <p className="text-2xl font-bold">
                    {events.reduce((sum, e) => sum + e.quantity, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cities Covered</p>
                  <p className="text-2xl font-bold">
                    {new Set(events.map(e => e.city)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delivered Events List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Delivered Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  {/* Status Badge */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full px-3 py-1 text-xs font-medium text-white bg-green-500">
                      Delivered
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(event);
                        setDetailsDialogOpen(true);
                      }}
                      className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Event Title */}
                  <h3 className="mb-3 text-base font-bold leading-tight text-gray-900">
                    {event.title}
                  </h3>

                  {/* Contact Name */}
                  <p className="mb-2 text-sm text-gray-700">
                    {event.contactName}
                  </p>

                  {/* Address & City */}
                  <div className="mb-3 flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-2">
                      {event.address}, {event.city}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      {event.quantity} units
                    </span>
                  </div>

                  {/* Delivery ID */}
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Delivery ID</p>
                    <p className="font-mono text-sm font-medium text-violet-600">
                      {event.id_livraison}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Details Sheet */}
      <Sheet open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Event Details</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery ID</p>
                  <p className="font-mono font-medium text-violet-600">{selectedEvent?.id_livraison}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tracking ID</p>
                  <p className="font-mono font-medium text-purple-600">{selectedEvent?.id_tracking}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Event</p>
                <p className="font-semibold">{selectedEvent?.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Club</p>
                <p className="font-medium text-violet-600">{selectedEvent?.club}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-sm">{selectedEvent?.address}, {selectedEvent?.city}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedEvent?.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedEvent?.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{selectedEvent?.quantity} units</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{selectedEvent?.contactName}</p>
                <p className="text-sm text-muted-foreground">{selectedEvent?.contactPhone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Delivered
                </Badge>
              </div>
              {selectedEvent?.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800">{selectedEvent.notes}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedEvent && openWhatsApp(selectedEvent.contactPhone)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNoteDialogOpen(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add note for: {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
            />
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Attach Files</label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-violet-400 transition-colors"
                onClick={() => document.getElementById('delivered-file-input')?.click()}
              >
                <input
                  id="delivered-file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setAttachedFiles(prev => [...prev, ...files]);
                  }}
                />
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
              {attachedFiles.length > 0 && (
                <div className="space-y-2 mt-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-violet-600" />
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setNoteDialogOpen(false);
                setNoteText('');
                setAttachedFiles([]);
              }}>
                Cancel
              </Button>
              <Button
                onClick={() => selectedEvent && updateEventNote(selectedEvent.id, noteText)}
                className="bg-yellow-400 hover:bg-yellow-500"
                disabled={!noteText.trim() && attachedFiles.length === 0}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}