import React, { useState } from 'react';
import { 
  Home, 
  Plus, 
  MoreVertical, 
  X, 
  EyeOff, 
  Globe, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Star,
  Trash2,
  Layers,
  Smartphone,
  Monitor
} from 'lucide-react';
import { BrowserTab, BookmarkItem, ShortcutItem, BrowserSettings, ViewMode } from '../../types/browser';
import { Omnibox } from '../chrome/Omnibox';
import { NewTabPage } from '../chrome/NewTabPage';
import { GoogleSearchResults } from '../chrome/GoogleSearchResults';
import { BrowserViewport } from '../chrome/BrowserViewport';
import { ChromeMenu } from '../chrome/ChromeMenu';

interface MobileChromeProps {
  tabs: BrowserTab[];
  activeTabId: string;
  bookmarks: BookmarkItem[];
  shortcuts: ShortcutItem[];
  settings: BrowserSettings;
  viewMode: ViewMode;
  zoomLevel: number;
  isMenuOpen: boolean;
  onSelectTab: (id: string) => void;
  onNewTab: (url?: string, isIncognito?: boolean) => void;
  onCloseTab: (id: string, e: React.MouseEvent) => void;
  onCloseAllTabs: () => void;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onToggleBookmark: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onToggleDarkMode: () => void;
  onToggleViewMode: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleBookmarksBar: () => void;
  onOpenHistory: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  onOpenVoiceSearch: () => void;
  onOpenLens: () => void;
  onOpenCustomize: () => void;
  onAddShortcut: (sc: ShortcutItem) => void;
  onRemoveShortcut: (id: string) => void;
  onTitleUpdate: (title: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const MobileChrome: React.FC<MobileChromeProps> = ({
  tabs,
  activeTabId,
  bookmarks,
  shortcuts,
  settings,
  viewMode,
  zoomLevel,
  isMenuOpen,
  onSelectTab,
  onNewTab,
  onCloseTab,
  onCloseAllTabs,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onHome,
  onToggleBookmark,
  onToggleMenu,
  onCloseMenu,
  onToggleDarkMode,
  onToggleViewMode,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleBookmarksBar,
  onOpenHistory,
  onOpenBookmarks,
  onOpenSettings,
  onOpenVoiceSearch,
  onOpenLens,
  onOpenCustomize,
  onAddShortcut,
  onRemoveShortcut,
  onTitleUpdate,
  onLoadingChange
}) => {
  const [showTabSwitcher, setShowTabSwitcher] = useState(false);
  const [tabSwitcherMode, setTabSwitcherMode] = useState<'normal' | 'incognito'>('normal');

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const isBookmarked = bookmarks.some(b => b.url === activeTab?.url);
  const isIncognito = activeTab?.isIncognito;

  // Filter tabs for switcher
  const displayedTabs = tabs.filter(t => 
    tabSwitcherMode === 'incognito' ? t.isIncognito : !t.isIncognito
  );

  return (
    <div className={`flex flex-col h-full w-full select-none bg-white dark:bg-[#121212] ${settings.isDarkMode ? 'dark' : ''}`}>
      
      {/* 1. Mobile Top Toolbar */}
      <div className={`flex items-center h-14 px-2 gap-2 border-b border-slate-200/80 dark:border-slate-800 shrink-0 z-30 ${
        isIncognito ? 'bg-[#1F1F1F] text-white' : 'bg-white dark:bg-[#202124]'
      }`}>
        
        {/* Home Button */}
        <button
          type="button"
          onClick={onHome}
          className="p-2 text-slate-700 dark:text-slate-200 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
          title="Google Home"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Mobile Omnibox */}
        <div className="flex-1 min-w-0">
          <Omnibox
            currentUrl={activeTab?.url || ''}
            isLoading={Boolean(activeTab?.isLoading)}
            isBookmarked={isBookmarked}
            onNavigate={onNavigate}
            onToggleBookmark={onToggleBookmark}
            onOpenVoiceSearch={onOpenVoiceSearch}
            onOpenLens={onOpenLens}
            isMobile={true}
          />
        </div>

        {/* Tab Switcher Button (with counter number like [ 3 ]) */}
        <button
          type="button"
          onClick={() => setShowTabSwitcher(true)}
          className="w-8 h-8 rounded-lg border-2 border-slate-600 dark:border-slate-300 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold font-mono hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all shrink-0"
          title="Switch tabs"
        >
          {tabs.length}
        </button>

        {/* 3-Dot Menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={onToggleMenu}
            className="p-2 text-slate-700 dark:text-slate-200 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
            title="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          <ChromeMenu
            isOpen={isMenuOpen}
            onClose={onCloseMenu}
            onNewTab={() => onNewTab()}
            onNewIncognitoTab={() => onNewTab('chrome://newtab', true)}
            onOpenHistory={onOpenHistory}
            onOpenBookmarks={onOpenBookmarks}
            onOpenSettings={onOpenSettings}
            onOpenDevTools={() => {}}
            isDarkMode={settings.isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
            viewMode={viewMode}
            onToggleViewMode={onToggleViewMode}
            zoomLevel={zoomLevel}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onResetZoom={onResetZoom}
            showBookmarksBar={settings.showBookmarksBar}
            onToggleBookmarksBar={onToggleBookmarksBar}
          />
        </div>

      </div>

      {/* 2. Main Mobile Page Viewport */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
        {activeTab?.url === 'chrome://newtab' ? (
          <NewTabPage
            shortcuts={shortcuts}
            onNavigate={onNavigate}
            onAddShortcut={onAddShortcut}
            onRemoveShortcut={onRemoveShortcut}
            onOpenVoiceSearch={onOpenVoiceSearch}
            onOpenLens={onOpenLens}
            onOpenCustomize={onOpenCustomize}
            isMobile={true}
          />
        ) : activeTab?.url.startsWith('chrome://search?q=') ? (
          <GoogleSearchResults
            query={new URL(activeTab.url).searchParams.get('q') || ''}
            onNavigate={onNavigate}
            isMobile={true}
          />
        ) : (
          <BrowserViewport
            url={activeTab?.url || 'https://google.com'}
            isLoading={Boolean(activeTab?.isLoading)}
            onNavigate={onNavigate}
            onTitleUpdate={onTitleUpdate}
            onLoadingChange={onLoadingChange}
            zoomLevel={zoomLevel}
          />
        )}
      </div>

      {/* 3. Mobile Chrome Tab Switcher Overlay (Cards Grid) */}
      {showTabSwitcher && (
        <div className="fixed inset-0 bg-[#202124] text-white z-50 flex flex-col animate-in fade-in duration-150">
          {/* Top Switcher Bar */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-slate-700/80 bg-[#292a2d]">
            <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl">
              <button
                onClick={() => setTabSwitcherMode('normal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  tabSwitcherMode === 'normal' ? 'bg-[#3c4043] text-white shadow-xs' : 'text-slate-400'
                }`}
              >
                Tabs ({tabs.filter(t => !t.isIncognito).length})
              </button>
              <button
                onClick={() => setTabSwitcherMode('incognito')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  tabSwitcherMode === 'incognito' ? 'bg-[#3c4043] text-white shadow-xs' : 'text-slate-400'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Incognito ({tabs.filter(t => t.isIncognito).length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onNewTab('chrome://newtab', tabSwitcherMode === 'incognito');
                  setShowTabSwitcher(false);
                }}
                className="p-2 hover:bg-white/10 rounded-full"
                title="New Tab"
              >
                <Plus className="w-5 h-5 text-blue-400" />
              </button>
              <button
                onClick={() => setShowTabSwitcher(false)}
                className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white"
              >
                Done
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3.5">
            {displayedTabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <div
                  key={tab.id}
                  onClick={() => {
                    onSelectTab(tab.id);
                    setShowTabSwitcher(false);
                  }}
                  className={`flex flex-col h-48 rounded-2xl overflow-hidden cursor-pointer transition-all border-2 relative ${
                    isActive 
                      ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/30' 
                      : 'border-slate-700/80 hover:border-slate-500 bg-[#292a2d]'
                  }`}
                >
                  {/* Tab Card Header */}
                  <div className="h-9 px-2.5 bg-[#35363a] flex items-center justify-between text-xs">
                    <span className="truncate font-medium text-slate-200 flex-1 mr-1">
                      {tab.title || 'New Tab'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id, e);
                      }}
                      className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Content Preview Thumbnail */}
                  <div className="flex-1 bg-[#202124] p-3 flex flex-col items-center justify-center text-center">
                    {tab.url === 'chrome://newtab' ? (
                      <div className="text-xl font-bold font-sans">
                        <span className="text-[#4285F4]">G</span>
                        <span className="text-[#EA4335]">o</span>
                        <span className="text-[#FBBC05]">o</span>
                        <span className="text-[#4285F4]">g</span>
                        <span className="text-[#34A853]">l</span>
                        <span className="text-[#EA4335]">e</span>
                      </div>
                    ) : tab.url.startsWith('chrome://search') ? (
                      <div className="space-y-1">
                        <Search className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                        <span className="text-[11px] text-slate-400 truncate block">
                          Search results
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Globe className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                        <span className="text-[10px] text-slate-400 break-all line-clamp-2">
                          {tab.url}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Switcher Actions */}
          <div className="h-12 border-t border-slate-700/80 px-4 flex items-center justify-between bg-[#292a2d] text-xs">
            <button
              onClick={onCloseAllTabs}
              className="text-red-400 hover:text-red-300 font-medium"
            >
              Close all tabs
            </button>
            <button
              onClick={() => {
                onNewTab('chrome://newtab', tabSwitcherMode === 'incognito');
                setShowTabSwitcher(false);
              }}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New tab</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
