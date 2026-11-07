import React, { useState, useEffect } from 'react';
import { 
  BrowserTab, 
  BookmarkItem, 
  ShortcutItem, 
  BrowserSettings, 
  HistoryItem,
  ViewMode 
} from './types/browser';
import { DEFAULT_SHORTCUTS, DEFAULT_BOOKMARKS } from './constants/defaults';
import { DesktopChrome } from './components/desktop/DesktopChrome';
import { MobileChrome } from './components/mobile/MobileChrome';
import { HistoryModal } from './components/chrome/HistoryModal';
import { BookmarksModal } from './components/chrome/BookmarksModal';
import { SettingsModal } from './components/chrome/SettingsModal';
import { VoiceSearchModal } from './components/chrome/VoiceSearchModal';
import { LensModal } from './components/chrome/LensModal';
import { Monitor, Smartphone, Sparkles } from 'lucide-react';

const INITIAL_TAB: BrowserTab = {
  id: 'tab-1',
  title: 'New Tab',
  url: 'chrome://newtab',
  isLoading: false,
  history: ['chrome://newtab'],
  historyIndex: 0,
  isIncognito: false
};

export default function App() {
  // Tabs State
  const [tabs, setTabs] = useState<BrowserTab[]>([INITIAL_TAB]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Bookmarks & Shortcuts & History
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('chrome_bookmarks');
      return saved ? JSON.parse(saved) : DEFAULT_BOOKMARKS;
    } catch {
      return DEFAULT_BOOKMARKS;
    }
  });

  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(() => {
    try {
      const saved = localStorage.getItem('chrome_shortcuts');
      return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
    } catch {
      return DEFAULT_SHORTCUTS;
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('chrome_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Settings
  const [settings, setSettings] = useState<BrowserSettings>(() => {
    try {
      const saved = localStorage.getItem('chrome_settings');
      return saved ? JSON.parse(saved) : {
        searchEngine: 'google',
        theme: 'default',
        isDarkMode: false,
        openNewTabOnStartup: true,
        showBookmarksBar: true,
        language: 'bn'
      };
    } catch {
      return {
        searchEngine: 'google',
        theme: 'default',
        isDarkMode: false,
        openNewTabOnStartup: true,
        showBookmarksBar: true,
        language: 'bn'
      };
    }
  });

  // View Mode: Auto-detect mobile screen or explicit toggle
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  });

  // Active Zoom level
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Modals & Drawers
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isLensOpen, setIsLensOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('chrome_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('chrome_shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  useEffect(() => {
    localStorage.setItem('chrome_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('chrome_settings', JSON.stringify(settings));
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && viewMode === 'desktop') {
        // on tiny screens, default to mobile view for usability
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        handleNewTab();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        handleCloseTab(activeTabId);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setIsHistoryOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleToggleBookmark();
      } else if (e.key === 'F12') {
        e.preventDefault();
        setIsDevToolsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId]);

  // Helper: Normalize URL or Search
  const parseNavigationInput = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return 'chrome://newtab';
    if (trimmed.startsWith('chrome://')) return trimmed;

    // Check if it's a URL
    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const domainPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::[0-9]{1,5})?(?:\/.*)?$/i;

    if (hasProtocol) {
      return trimmed;
    } else if (domainPattern.test(trimmed) && !trimmed.includes(' ')) {
      return `https://${trimmed}`;
    } else {
      // It's a search query
      return `chrome://search?q=${encodeURIComponent(trimmed)}`;
    }
  };

  // Tab Operations
  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
  };

  const handleNewTab = (url: string = 'chrome://newtab', isIncognito: boolean = false) => {
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title: isIncognito ? 'Incognito Tab' : 'New Tab',
      url: url,
      isLoading: false,
      history: [url],
      historyIndex: 0,
      isIncognito
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (tabs.length === 1) {
      // Reset single tab to newtab
      setTabs([{
        id: `tab-${Date.now()}`,
        title: 'New Tab',
        url: 'chrome://newtab',
        isLoading: false,
        history: ['chrome://newtab'],
        historyIndex: 0,
        isIncognito: false
      }]);
      return;
    }

    const index = tabs.findIndex(t => t.id === id);
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);

    if (activeTabId === id) {
      const nextTab = newTabs[Math.max(0, index - 1)];
      setActiveTabId(nextTab.id);
    }
  };

  const handleCloseAllTabs = () => {
    handleNewTab('chrome://newtab', false);
  };

  // Navigation inside current tab
  const handleNavigate = (input: string) => {
    const finalUrl = parseNavigationInput(input);
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) return;

    // Derive page title
    let title = 'Google Search';
    if (finalUrl === 'chrome://newtab') {
      title = 'New Tab';
    } else if (finalUrl.startsWith('chrome://search?q=')) {
      const q = new URL(finalUrl).searchParams.get('q') || '';
      title = `${q} - Google Search`;
    } else {
      try {
        title = new URL(finalUrl).hostname;
      } catch {
        title = finalUrl;
      }
    }

    // Update History Stack
    const currentHist = activeTab.history.slice(0, activeTab.historyIndex + 1);
    const updatedHistory = [...currentHist, finalUrl];
    const newIndex = updatedHistory.length - 1;

    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          url: finalUrl,
          title,
          history: updatedHistory,
          historyIndex: newIndex,
          isLoading: !finalUrl.startsWith('chrome://')
        };
      }
      return tab;
    }));

    // Add to Global History (unless incognito)
    if (!activeTab.isIncognito && finalUrl !== 'chrome://newtab') {
      const historyItem: HistoryItem = {
        id: `hist-${Date.now()}`,
        title,
        url: finalUrl,
        visitedAt: Date.now()
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 99)]);
    }
  };

  const handleBack = () => {
    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId && tab.historyIndex > 0) {
        const nextIndex = tab.historyIndex - 1;
        const prevUrl = tab.history[nextIndex];
        return {
          ...tab,
          url: prevUrl,
          historyIndex: nextIndex,
          isLoading: !prevUrl.startsWith('chrome://')
        };
      }
      return tab;
    }));
  };

  const handleForward = () => {
    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId && tab.historyIndex < tab.history.length - 1) {
        const nextIndex = tab.historyIndex + 1;
        const nextUrl = tab.history[nextIndex];
        return {
          ...tab,
          url: nextUrl,
          historyIndex: nextIndex,
          isLoading: !nextUrl.startsWith('chrome://')
        };
      }
      return tab;
    }));
  };

  const handleReload = () => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) return;
    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return { ...tab, isLoading: true };
      }
      return tab;
    }));
    setTimeout(() => {
      setTabs(prev => prev.map(tab => {
        if (tab.id === activeTabId) {
          return { ...tab, isLoading: false };
        }
        return tab;
      }));
    }, 400);
  };

  const handleHome = () => {
    handleNavigate('chrome://newtab');
  };

  const handleToggleBookmark = () => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab || activeTab.url === 'chrome://newtab') return;

    const existingIndex = bookmarks.findIndex(b => b.url === activeTab.url);
    if (existingIndex >= 0) {
      setBookmarks(prev => prev.filter(b => b.url !== activeTab.url));
    } else {
      const newBm: BookmarkItem = {
        id: `bm-${Date.now()}`,
        title: activeTab.title || activeTab.url,
        url: activeTab.url,
        dateAdded: Date.now()
      };
      setBookmarks(prev => [newBm, ...prev]);
    }
  };

  const handleTitleUpdate = (newTitle: string) => {
    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return { ...tab, title: newTitle };
      }
      return tab;
    }));
  };

  const handleLoadingChange = (isLoading: boolean) => {
    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return { ...tab, isLoading };
      }
      return tab;
    }));
  };

  const handleAddShortcut = (sc: ShortcutItem) => {
    setShortcuts(prev => [...prev, sc]);
  };

  const handleRemoveShortcut = (id: string) => {
    setShortcuts(prev => prev.filter(sc => sc.id !== id));
  };

  const handleUpdateSettings = (newSettings: Partial<BrowserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      
      {/* View Mode Quick Switcher Header Banner on large screens */}
      <div className="h-7 bg-slate-950 text-slate-400 text-[11px] px-3 flex items-center justify-between border-b border-slate-800 shrink-0 select-none z-40">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">Google Chrome</span>
          <span>·</span>
          <span>ওয়েব ব্রাউজার সিমুলেটর</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
              viewMode === 'desktop' ? 'bg-blue-600 text-white font-medium' : 'hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>ডেক্সটপ ভার্সন (Desktop)</span>
          </button>

          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
              viewMode === 'mobile' ? 'bg-blue-600 text-white font-medium' : 'hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>মোবাইল ভার্সন (Mobile)</span>
          </button>
        </div>
      </div>

      {/* Main Browser Container: Desktop vs Mobile Layout */}
      <div className="flex-1 w-full h-[calc(100vh-28px)] overflow-hidden flex items-center justify-center bg-slate-200 dark:bg-slate-900">
        {viewMode === 'desktop' ? (
          <div className="w-full h-full bg-white dark:bg-[#202124] shadow-2xl flex flex-col overflow-hidden">
            <DesktopChrome
              tabs={tabs}
              activeTabId={activeTabId}
              bookmarks={bookmarks}
              shortcuts={shortcuts}
              settings={settings}
              viewMode={viewMode}
              zoomLevel={zoomLevel}
              isMenuOpen={isMenuOpen}
              isDevToolsOpen={isDevToolsOpen}
              onSelectTab={handleSelectTab}
              onNewTab={handleNewTab}
              onCloseTab={handleCloseTab}
              onNavigate={handleNavigate}
              onBack={handleBack}
              onForward={handleForward}
              onReload={handleReload}
              onHome={handleHome}
              onToggleBookmark={handleToggleBookmark}
              onToggleMenu={() => setIsMenuOpen(prev => !prev)}
              onCloseMenu={() => setIsMenuOpen(false)}
              onToggleDevTools={() => setIsDevToolsOpen(prev => !prev)}
              onToggleDarkMode={() => handleUpdateSettings({ isDarkMode: !settings.isDarkMode })}
              onToggleViewMode={() => setViewMode(prev => prev === 'desktop' ? 'mobile' : 'desktop')}
              onZoomIn={() => setZoomLevel(prev => Math.min(200, prev + 10))}
              onZoomOut={() => setZoomLevel(prev => Math.max(50, prev - 10))}
              onResetZoom={() => setZoomLevel(100)}
              onToggleBookmarksBar={() => handleUpdateSettings({ showBookmarksBar: !settings.showBookmarksBar })}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onOpenBookmarks={() => setIsBookmarksOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
              onOpenLens={() => setIsLensOpen(true)}
              onOpenCustomize={() => setIsSettingsOpen(true)}
              onAddShortcut={handleAddShortcut}
              onRemoveShortcut={handleRemoveShortcut}
              onTitleUpdate={handleTitleUpdate}
              onLoadingChange={handleLoadingChange}
            />
          </div>
        ) : (
          /* Mobile Phone Simulation Container */
          <div className="w-full h-full md:max-w-md md:h-[94%] md:my-auto md:rounded-[40px] md:border-8 md:border-slate-800 md:shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-[#121212] relative">
            {/* Phone Speaker/Camera notch on desktop simulation */}
            <div className="hidden md:flex h-5 w-full bg-slate-800 justify-center items-center">
              <div className="w-16 h-3 bg-slate-900 rounded-full"></div>
            </div>

            <div className="flex-1 w-full h-full overflow-hidden flex flex-col">
              <MobileChrome
                tabs={tabs}
                activeTabId={activeTabId}
                bookmarks={bookmarks}
                shortcuts={shortcuts}
                settings={settings}
                viewMode={viewMode}
                zoomLevel={zoomLevel}
                isMenuOpen={isMenuOpen}
                onSelectTab={handleSelectTab}
                onNewTab={handleNewTab}
                onCloseTab={handleCloseTab}
                onCloseAllTabs={handleCloseAllTabs}
                onNavigate={handleNavigate}
                onBack={handleBack}
                onForward={handleForward}
                onReload={handleReload}
                onHome={handleHome}
                onToggleBookmark={handleToggleBookmark}
                onToggleMenu={() => setIsMenuOpen(prev => !prev)}
                onCloseMenu={() => setIsMenuOpen(false)}
                onToggleDarkMode={() => handleUpdateSettings({ isDarkMode: !settings.isDarkMode })}
                onToggleViewMode={() => setViewMode(prev => prev === 'desktop' ? 'mobile' : 'desktop')}
                onZoomIn={() => setZoomLevel(prev => Math.min(200, prev + 10))}
                onZoomOut={() => setZoomLevel(prev => Math.max(50, prev - 10))}
                onResetZoom={() => setZoomLevel(100)}
                onToggleBookmarksBar={() => handleUpdateSettings({ showBookmarksBar: !settings.showBookmarksBar })}
                onOpenHistory={() => setIsHistoryOpen(true)}
                onOpenBookmarks={() => setIsBookmarksOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
                onOpenLens={() => setIsLensOpen(true)}
                onOpenCustomize={() => setIsSettingsOpen(true)}
                onAddShortcut={handleAddShortcut}
                onRemoveShortcut={handleRemoveShortcut}
                onTitleUpdate={handleTitleUpdate}
                onLoadingChange={handleLoadingChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals & Dialogs */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onNavigate={handleNavigate}
        onClearHistory={() => setHistory([])}
        onDeleteHistoryItem={(id) => setHistory(prev => prev.filter(h => h.id !== id))}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onNavigate={handleNavigate}
        onDeleteBookmark={(id) => setBookmarks(prev => prev.filter(b => b.id !== id))}
        onAddBookmark={(title, url) => {
          setBookmarks(prev => [{ id: `bm-${Date.now()}`, title, url, dateAdded: Date.now() }, ...prev]);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSearch={handleNavigate}
      />

      <LensModal
        isOpen={isLensOpen}
        onClose={() => setIsLensOpen(false)}
        onSearch={handleNavigate}
      />

    </div>
  );
}
