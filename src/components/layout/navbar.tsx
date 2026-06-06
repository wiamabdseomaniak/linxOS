'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import { useUIStore, useNotificationStore } from '@/stores';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useTranslation } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Settings,
  LogOut,
  User,
  ChevronRight,
  Package,
  Truck,
  AlertCircle,
  CheckCircle2,
  Info,
  Activity,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NotificationDropdown } from '@/components/notifications';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme, signOut } = useTheme();
  const { toggleMobileSidebar } = useUIStore();
  const { user: fetchedUser, loading: userLoading } = useCurrentUser();
  const { markAllAsRead, notifications } = useNotificationStore();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; type: string; title: string; subtitle: string; path: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pageTitles: Record<string, string> = {
    '/dashboard': t('nav.dashboard'),
    '/logistics': t('nav.logistics'),
    '/notifications': t('nav.notifications'),
    '/settings': t('nav.settings'),
    '/profile': t('nav.profile'),
  };

  const notificationIcons = {
    delivery: Package,
    event: Activity,
    system: Info,
    alert: AlertCircle,
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  };

  const notificationColors = {
    delivery: 'text-violet-600 dark:text-violet-400',
    event: 'text-blue-600',
    system: 'text-muted-foreground',
    alert: 'text-amber-600',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('navbar-search')?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const mockResults = [
      { id: '1', type: 'delivery', title: `LNX-2026-001`, subtitle: 'Casablanca → Rabat', path: '/tracking' },
      { id: '2', type: 'delivery', title: `LNX-2026-002`, subtitle: 'Marrakech → Agadir', path: '/tracking' },
      { id: '3', type: 'driver', title: 'Ahmed Benali', subtitle: 'Logistique Manager', path: '/profile' },
      { id: '4', type: 'client', title: 'Fatima Zahra', subtitle: 'Client Premium', path: '/users' },
    ].filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const currentPage = Object.keys(pageTitles).find((key) =>
    pathname.startsWith(key)
  );

  const unreadNotifications = notifications.filter((n) => !n.lue).length;

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden">
          <div className="flex h-16 items-center gap-2 px-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                placeholder={t('common.search') + '...'}
                className="h-10 w-full rounded-xl bg-muted/50 pl-10 pr-4 text-sm"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            {isSearching ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="flex flex-col">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    className="flex items-start gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                      router.push(result.path);
                    }}
                  >
                    <div className="mt-0.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20 p-1.5">
                      {result.type === 'delivery' && <Package className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />}
                      {result.type === 'client' && <User className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{result.title}</p>
                      <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                {t('navbar.noResults')} &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                {t('navbar.searchHint')}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-border/60 bg-background/90 px-3 shadow-sm backdrop-blur-xl sm:px-4 lg:px-6">
        {/* Left section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 lg:hidden"
          onClick={toggleMobileSidebar}
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">LINXOS</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">
            {currentPage ? pageTitles[currentPage] : t('nav.dashboard')}
          </span>
        </nav>

        {/* Live indicator */}
        <div className="hidden items-center gap-2 rounded-full bg-green-500/10 dark:bg-green-400/10 px-3 py-1 lg:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 dark:bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500 dark:bg-green-400" />
          </span>
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            {t('navbar.live')}
          </span>
        </div>
      </div>

      {/* Center - Search */}
      <div className="hidden flex-1 justify-center px-8 lg:flex">
        <Popover open={searchQuery.length >= 2} onOpenChange={(open) => !open && setSearchQuery('')}>
          <PopoverTrigger
            render={
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="navbar-search"
                  placeholder={t('navbar.search')}
                  className="h-10 w-full rounded-xl bg-muted/50 pl-10 pr-4 text-sm"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <kbd className="pointer-events-none absolute right-3 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground lg:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            }
          />
          <PopoverContent className="w-full max-w-md p-0" align="center">
            <Card className="border-0 shadow-2xl">
              <ScrollArea className="max-h-72">
                {isSearching ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        className="flex items-start gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50"
                        onClick={() => {
                          setSearchQuery('');
                          router.push(result.path);
                        }}
                      >
                        <div className="mt-0.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20 p-1.5">
                          {result.type === 'delivery' && <Package className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />}
                          {result.type === 'driver' && <Truck className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />}
                          {result.type === 'client' && <User className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{result.title}</p>
                          <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {t('navbar.noResults')} &quot;{searchQuery}&quot;
                  </div>
                ) : null}
              </ScrollArea>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile search button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 lg:hidden"
        onClick={() => setIsSearchOpen(true)}
        aria-label="Rechercher"
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Right section */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Language switcher */}
        <LanguageSwitcher />

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="relative"
        >
          {mounted && (
            <span className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {resolvedTheme === 'dark' ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          )}
        </Button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User menu */}
        {fetchedUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="cursor-pointer rounded-full transition-all hover:opacity-80">
              <Avatar className="h-10 w-10 border-2 border-violet-500 hover:border-violet-600 dark:border-violet-400 dark:hover:border-violet-300">
                <AvatarImage src={fetchedUser?.avatar ?? ""} alt={fetchedUser?.name ?? ""} />
                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-600 text-white dark:from-violet-700 dark:to-purple-700 font-semibold">
                  {(fetchedUser?.name ?? '').split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-2" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={fetchedUser?.avatar ?? ""} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-600 text-white dark:from-violet-700 dark:to-purple-700">
                        {(fetchedUser?.name ?? '').split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{fetchedUser?.name ?? ""}</p>
                      <p className="text-xs text-muted-foreground">{fetchedUser?.email ?? ""}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                    <Activity className="mr-1 h-3 w-3" />
                    Online
                  </Badge>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              {t('nav.profile')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              {t('nav.settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('sidebar.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        ) : (
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" disabled>
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
        )}
      </div>
      </header>
    </>
  );
}