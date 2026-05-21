'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Truck, CheckCircle, AlertTriangle, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type DeliveryStatus = 'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';

interface StatusTab {
  id: DeliveryStatus;
  label: string;
  icon: typeof Calendar;
  count: number;
  color: string;
}

interface DeliveryStatusTabsProps {
  onStatusChange?: (status: DeliveryStatus) => void;
}

const statusTabs: StatusTab[] = [
  { id: 'SCHEDULED', label: 'Scheduled', icon: Calendar, count: 10, color: '#3498db' },
  { id: 'IN_TRANSIT', label: 'In Transit', icon: Truck, count: 4, color: '#e74c3c' },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle, count: 2, color: '#2ecc71' },
  { id: 'FAILED', label: 'Failed', icon: AlertTriangle, count: 1, color: '#e74c3c' },
];

const mockContent: Record<DeliveryStatus, { title: string; description: string; items: string[] }> = {
  SCHEDULED: {
    title: 'Scheduled Deliveries',
    description: 'Upcoming deliveries awaiting pickup',
    items: [
      'National Basketball League - Casablanca',
      'Football Championship - Rabat',
      'Tennis Tournament - Marrakech',
      'Swimming Competition - Agadir',
    ],
  },
  IN_TRANSIT: {
    title: 'In Transit',
    description: 'Packages currently on the way',
    items: [
      'Handball Equipment - Oujda',
      'Volleyball Gear - Tangier',
      'Athletics Supplies - Fez',
      'Boxing Equipment - Meknes',
    ],
  },
  DELIVERED: {
    title: 'Delivered',
    description: 'Successfully completed deliveries',
    items: [
      'Cycling Event - Essaouira',
      'Golf Tournament - El Jadida',
    ],
  },
  FAILED: {
    title: 'Failed Deliveries',
    description: 'Deliveries that could not be completed',
    items: [
      'Rugby Equipment - Kenitra - Reschedule required',
    ],
  },
};

export function DeliveryStatusTabs({ onStatusChange }: DeliveryStatusTabsProps) {
  const [activeTab, setActiveTab] = useState<DeliveryStatus>('SCHEDULED');

  const handleTabClick = (status: DeliveryStatus) => {
    setActiveTab(status);
    onStatusChange?.(status);
  };

  const activeContent = mockContent[activeTab];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {statusTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                    transition-all duration-300 whitespace-nowrap
                    ${isActive
                      ? 'bg-[#f5c400] text-black shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: isActive ? '#000' : tab.color }}
                  />
                  <span>{tab.label}</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${isActive ? 'bg-black/10' : 'bg-gray-100'}
                  `}>
                    ({tab.count})
                  </span>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg p-2" style={{ backgroundColor: statusTabs.find(t => t.id === activeTab)?.color + '20' }}>
                  {(() => {
                    const Icon = statusTabs.find(t => t.id === activeTab)?.icon || Package;
                    return <Icon className="h-5 w-5" style={{ color: statusTabs.find(t => t.id === activeTab)?.color }} />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{activeContent.title}</h3>
                  <p className="text-sm text-muted-foreground">{activeContent.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {activeContent.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Package className="h-4 w-4 text-violet-500" />
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Total: <span className="font-medium text-foreground">{statusTabs.find(t => t.id === activeTab)?.count}</span> {activeTab.toLowerCase().replace('_', ' ')} items
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default DeliveryStatusTabs;