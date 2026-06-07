/**
 * Petits onglets de filtre (Toutes / Non lues) affichés
 * en haut du dropdown de notifications avec un badge de compteur.
 */

'use client';

import { cn } from '@/lib/utils';
import { FilterTab } from './types';

interface FilterTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  unreadCount: number;
  totalCount: number;
}

export function FilterTabs({ activeTab, onTabChange, unreadCount, totalCount }: FilterTabsProps) {
  const tabs: { id: FilterTab; label: string; badge?: number }[] = [
    { id: 'all', label: 'Toutes', badge: totalCount },
    { id: 'unread', label: 'Non lues', badge: unreadCount },
  ];

  return (
    <div className="flex items-center gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const hasBadge = (tab.id === 'all' && totalCount > 0) || (tab.id === 'unread' && unreadCount > 0);

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'bg-gray-100/60 text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
            )}
          >
            {tab.label}
            {hasBadge && (
              <span className={cn(
                'inline-flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-bold px-1.5',
                isActive ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}