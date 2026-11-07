import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  X, 
  Home, 
  Plus, 
  Bookmark, 
  Star, 
  Puzzle, 
  MoreVertical, 
  Minus, 
  Square, 
  EyeOff,
  Volume2,
  VolumeX,
  Globe,
  Pin
} from 'lucide-react';
import { BrowserTab, BookmarkItem, ShortcutItem, BrowserSettings, ViewMode } from '../../types/browser';
import { Omnibox } from '../chrome/Omnibox';
import { NewTabPage } from '../chrome/NewTabPage';
import { GoogleSearchResults } from '../chrome/GoogleSearchResults';
import { BrowserViewport } from '../chrome/BrowserViewport';
import { ChromeMenu } from '../chrome/ChromeMenu';
import { DevToolsDrawer } from '../chrome/DevToolsDrawer';
import { THEME_PALETTES } from '../../constants/defaults';

interface DesktopChromeProps {
  tabs: BrowserTab[];
  activeTabId: string;
  bookmarks: BookmarkItem[];
  shortcuts: ShortcutItem[];
  settings: BrowserSettings;
  viewMode: ViewMode;
  zoomLevel: number;
  isMenuOpen: boolean;
  isDevToolsOpen: boolean;
  onSelectTab: (id: string) => void;
  onNewTab: (url?: string, isIncognito?: boolean) => void;
  onCloseTab: (id: string, e: React.MouseEvent) => void;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onToggleBookmark: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onToggleDevTools: () => void;
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

export const DesktopChrome: React.FC<DesktopChromeProps> = ({
  tabs,
  activeTabId,
  bookmarks,
  shortcuts,
  settings,
  viewMode,
  zoomLevel,
  isMenuOpen,
  isDevToolsOpen,
  onSelectTab,
  onNewTab,
  onCloseTab,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onHome,
  onToggleBookmark,
  onToggleMenu,
  onCloseMenu,
  onToggleDevTools,
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
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const canGoBack = activeTab && activeTab.historyIndex > 0;
  const canGoForward = activeTab && activeTab.historyIndex < activeTab.history.length - 1;
  const isBookmarked = bookmarks.some(b => b.url === activeTab?.url);

  const themeConfig = THEME_PALETTES[settings.theme] || THEME_PALETTES.default;
  const isIncognito = activeTab?.isIncognito;

  return (
    <div className={`flex flex-col h-full w-full select-none ${settings.isDarkMode ? 'dark' : ''}`}>
      
      {/* 1. Chrome Title Bar & Tabs Strip */}
      <div className={`relative flex items-end h-10 px-2 pt-1 gap-1 ${
        isIncognito ? 'bg-[#1F1F1F] text-white' : themeConfig.barBg
      }`}>
        
        {/* Incognito Icon if Incognito */}
        {isIncognito && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 font-medium">
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Incognito</span>
          </div>
        )}

        {/* Tabs List */}
        <div className="flex items-end flex-1 overflow-x-auto no-scrollbar gap-1 max-w-[calc(100vw-140px)]">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`group relative flex items-center h-8 sm:h-9 px-3 max-w-[200px] min-w-[120px] rounded-t-lg text-xs font-normal cursor-pointer transition-colors ${
                  isActive
                    ? isIncognito 
                      ? 'bg-[#28292A] text-white font-medium shadow-xs' 
                      : `${themeConfig.tabActive} text-slate-900 dark:text-white font-medium shadow-xs`
                    : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {/* Tab Icon */}
                <div className="mr-2 shrink-0">
                  {tab.isLoading ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  ) : tab.isIncognito ? (
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  ) : tab.url === 'chrome://newtab' ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold">
                      G
                    </div>
                  ) : tab.url.startsWith('chrome://search') ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-[#EA4335] flex items-center justify-center text-[8px] text-white font-bold">
                      S
                    </div>
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                {/* Tab Title */}
                <span className="flex-1 truncate">
                  {tab.title || (tab.url === 'chrome://newtab' ? 'New Tab' : 'Web Page')}
                </span>

                {/* Close Tab Button */}
                <button
                  type="button"
                  onClick={(e) => onCloseTab(tab.id, e)}
                  className={`p-1 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-all ml-1 shrink-0 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  title="Close tab (Ctrl+W)"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {/* New Tab (+) Button */}
          <button
            type="button"
            onClick={() => onNewTab()}
            className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0 mb-1"
            title="New tab (Ctrl+T)"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Windows Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center gap-1 ml-auto shrink-0 pb-1.5 px-1">
          <button 
            type="button"
            onClick={() => onToggleViewMode()}
            className="px-2 py-0.5 text-[11px] font-medium bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-300 rounded transition-colors hidden md:block"
            title="Toggle Desktop / Mobile view"
          >
            {viewMode === 'desktop' ? '📱 Mobile' : '💻 Desktop'}
          </button>
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 ml-1"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
          <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
        </div>
      </div>

      {/* 2. Chrome Navigation Bar & Omnibox Row */}
      <div className={`relative flex items-center h-12 px-3 gap-2 border-b border-slate-200/80 dark:border-slate-800 ${
        isIncognito ? 'bg-[#28292A] text-white' : 'bg-white dark:bg-[#202124]'
      }`}>
        
        {/* Navigation Controls: Back, Forward, Reload */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            className={`p-1.5 rounded-full transition-colors ${
              canGoBack 
                ? 'text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10' 
                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }`}
            title="Click to go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onForward}
            disabled={!canGoForward}
            className={`p-1.5 rounded-full transition-colors ${
              canGoForward 
                ? 'text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10' 
                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }`}
            title="Click to go forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onReload}
            className="p-1.5 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Reload this page"
          >
            <RotateCw className={`w-4 h-4 ${activeTab?.isLoading ? 'animate-spin text-blue-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onHome}
            className="p-1.5 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden sm:block"
            title="Open the home page (Google)"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Central Omnibox */}
        <Omnibox
          currentUrl={activeTab?.url || ''}
          isLoading={Boolean(activeTab?.isLoading)}
          isBookmarked={isBookmarked}
          onNavigate={onNavigate}
          onToggleBookmark={onToggleBookmark}
          onOpenVoiceSearch={onOpenVoiceSearch}
          onOpenLens={onOpenLens}
        />

        {/* Right Action Icons & 3-Dot Menu */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden sm:block"
            title="Chrome Extensions"
          >
            <Puzzle className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={onOpenSettings}
            className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-xs font-semibold shadow-xs cursor-pointer hover:opacity-90 transition-opacity ml-1"
            title="Google Account"
          >
            U
          </div>

          {/* 3-Dot Menu Button */}
          <div className="relative">
            <button
              type="button"
              onClick={onToggleMenu}
              className={`p-1.5 rounded-full transition-colors ${
                isMenuOpen 
                  ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' 
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
              }`}
              title="Customize and control Google Chrome"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Menu Dropdown */}
            <ChromeMenu
              isOpen={isMenuOpen}
              onClose={onCloseMenu}
              onNewTab={() => onNewTab()}
              onNewIncognitoTab={() => onNewTab('chrome://newtab', true)}
              onOpenHistory={onOpenHistory}
              onOpenBookmarks={onOpenBookmarks}
              onOpenSettings={onOpenSettings}
              onOpenDevTools={onToggleDevTools}
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

      </div>

      {/* 3. Bookmarks Bar (if enabled) */}
      {settings.showBookmarksBar && (
        <div className="flex items-center h-7 px-3 bg-white dark:bg-[#202124] border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 gap-2 overflow-x-auto no-scrollbar">
          {bookmarks.slice(0, 10).map((bm) => (
            <div
              key={bm.id}
              onClick={() => onNavigate(bm.url)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer shrink-0 transition-colors"
            >
              <Star className="w-3 h-3 text-amber-500 fill-current shrink-0" />
              <span className="truncate max-w-[120px]">{bm.title}</span>
            </div>
          ))}
          <button
            onClick={onOpenBookmarks}
            className="text-[11px] text-slate-400 hover:text-blue-500 ml-auto shrink-0"
          >
            All Bookmarks »
          </button>
        </div>
      )}

      {/* 4. Active Tab Viewport */}
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
            isMobile={false}
          />
        ) : activeTab?.url.startsWith('chrome://search?q=') ? (
          <GoogleSearchResults
            query={new URL(activeTab.url).searchParams.get('q') || ''}
            onNavigate={onNavigate}
            isMobile={false}
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

        {/* Embedded DevTools Drawer */}
        <DevToolsDrawer
          isOpen={isDevToolsOpen}
          onClose={onToggleDevTools}
          currentUrl={activeTab?.url || ''}
        />
      </div>

    </div>
  );
};
