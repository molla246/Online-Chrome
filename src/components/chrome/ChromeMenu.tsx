import React, { useRef, useEffect } from 'react';
import { 
  Plus, 
  AppWindow, 
  EyeOff, 
  History, 
  Bookmark, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Printer, 
  Settings, 
  Moon, 
  Sun, 
  Smartphone, 
  Monitor, 
  Terminal, 
  Check, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ViewMode } from '../../types/browser';

interface ChromeMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNewTab: () => void;
  onNewIncognitoTab: () => void;
  onOpenHistory: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  onOpenDevTools: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  showBookmarksBar: boolean;
  onToggleBookmarksBar: () => void;
}

export const ChromeMenu: React.FC<ChromeMenuProps> = ({
  isOpen,
  onClose,
  onNewTab,
  onNewIncognitoTab,
  onOpenHistory,
  onOpenBookmarks,
  onOpenSettings,
  onOpenDevTools,
  isDarkMode,
  onToggleDarkMode,
  viewMode,
  onToggleViewMode,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  showBookmarksBar,
  onToggleBookmarksBar
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute right-2 top-11 w-72 bg-white dark:bg-[#28292A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-50 text-slate-700 dark:text-slate-200 text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Group 1: Tabs & Windows */}
      <div className="py-1">
        <button
          onClick={() => { onNewTab(); onClose(); }}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#35363A] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Plus className="w-4 h-4 text-slate-500" />
            <span>New tab (নতুন ট্যাব)</span>
          </div>
          <span className="text-[11px] text-slate-400">Ctrl+T</span>
        </button>

        <button
          onClick={() => { onNewIncognitoTab(); onClose(); }}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#35363A] transition-colors"
        >
          <div className="flex items-center gap-3">
            <EyeOff className="w-4 h-4 text-slate-500" />
            <span>New Incognito tab (ছদ্মবেশী ট্যাব)</span>
          </div>
          <span className="text-[11px] text-slate-400">Ctrl+Shift+N</span>
        </button>
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-700/60 my-1"></div>

      {/* Group 2: History & Bookmarks */}
      <div className="py-1">
        <button
          onClick={() => { onOpenHistory(); onClose(); }}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#35363A] transition-colors"
        >
          <div className="flex items-center gap-3">
            <History className="w-4 h-4 text-slate-500" />
            <span>History (ব্রাউজিং ইতিহাস)</span>
          </div>
          <span className="text-[11px] text-slate-400">Ctrl+H</span>
        </button>

        <button
          onClick={() => { onOpenBookmarks(); onClose(); }}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#35363A] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bookmark className="w-4 h-4 text-slate-500" />
            <span>Bookmarks & lists (বুকমার্কস)</span>
          </div>
          <span className="text-[11px] text-slate-400">Ctrl+D</span>
        </button>

        <button
          onClick={onToggleBookmarksBar}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#35363A] transition-colors"
        >
          <div className="flex items-center gap-3 pl-7">
            <span>Show bookmarks bar</span>
          </div>
          {showBookmarksBar && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        </button>
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-700/60 my-1"></div>

      {/* Group 3: Zoom Controls */}
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-slate-600 dark:text-slate-300">Zoom</span>
        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
          <button
            onClick={onZoomOut}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span 
            onClick={onResetZoom}
            className="text-xs font-mono w-10 text-center cursor-pointer hover:underline"
            title="Reset zoom"
          >
            {zoomLevel}%
          </span>
          <button
            onClick={onZoomIn}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Group 4: Device & Theme View Mode Toggles */}
      <div className="py-1">
        <button
          onClick={() => { onToggleViewMode(); onClose(); }}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#35363A] transition-colors text-blue-600 dark:text-blue-400 font-medium"
        >
          <div className="flex items-center gap-3">
            {viewMode === 'desktop' ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
            <span>
              {viewMode === 'desktop' ? 'Switch to Mobile Version (মোবাইল ভার্সন)' : 'Switch to Desktop Version (ডেক্সটপ ভার্সন)'}
            </span>
          </div>
        </button>

        <button
          onClick={() => { onToggleDarkMode(); onClose(); }}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#35363A] transition-colors"
        >
          <div className="flex items-center gap-3">
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
            <span>Dark mode (ডার্ক মোড)</span>
          </div>
          <span className="text-[11px] text-slate-400">{isDarkMode ? 'On' : 'Off'}</span>
        </button>

        <button
          onClick={() => { onOpenDevTools(); onClose(); }}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#35363A] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-slate-500" />
            <span>Developer Tools (Console/Inspect)</span>
          </div>
          <span className="text-[11px] text-slate-400">F12</span>
        </button>

        <button
          onClick={() => { window.print(); onClose(); }}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#35363A] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print page...</span>
          </div>
          <span className="text-[11px] text-slate-400">Ctrl+P</span>
        </button>
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-700/60 my-1"></div>

      {/* Group 5: Settings */}
      <div className="py-1">
        <button
          onClick={() => { onOpenSettings(); onClose(); }}
          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#35363A] transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings (সেটিংস)</span>
        </button>
      </div>
    </div>
  );
};
