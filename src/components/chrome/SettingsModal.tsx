import React from 'react';
import { Settings, X, Search, Palette, Globe, Shield, Bookmark, Check } from 'lucide-react';
import { BrowserSettings, BrowserTheme } from '../../types/browser';
import { THEME_PALETTES } from '../../constants/defaults';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BrowserSettings;
  onUpdateSettings: (newSettings: Partial<BrowserSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  const themes: { key: BrowserTheme; name: string; color: string }[] = [
    { key: 'default', name: 'Classic Chrome', color: '#1a73e8' },
    { key: 'ocean', name: 'Ocean Blue', color: '#0070BA' },
    { key: 'forest', name: 'Forest Green', color: '#2e7d32' },
    { key: 'sunset', name: 'Sunset Orange', color: '#E65100' },
    { key: 'purple', name: 'Midnight Purple', color: '#7B1FA2' },
    { key: 'dark', name: 'Carbon Dark', color: '#18181b' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#28292A] rounded-2xl w-full max-w-xl max-h-[85vh] shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col text-slate-800 dark:text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Chrome Settings (সেটিংস)</h2>
              <span className="text-xs text-slate-500">Configure search engine, themes and preferences</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Section 1: Search Engine */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Search className="w-4 h-4 text-blue-500" />
              <span>Default Search Engine (ডিফল্ট সার্চ ইঞ্জিন)</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Search engine used in the address bar (Omnibox)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'google', name: 'Google (গুগল)' },
                { id: 'duckduckgo', name: 'DuckDuckGo' },
                { id: 'bing', name: 'Microsoft Bing' }
              ].map(engine => (
                <button
                  key={engine.id}
                  onClick={() => onUpdateSettings({ searchEngine: engine.id as any })}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-colors ${
                    settings.searchEngine === engine.id
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#323639]'
                  }`}
                >
                  <span>{engine.name}</span>
                  {settings.searchEngine === engine.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

          {/* Section 2: Appearance & Theme */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Palette className="w-4 h-4 text-purple-500" />
              <span>Appearance & Color Theme (থিম নির্বাচন)</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Select Chrome toolbar, tab colors, and styling
            </p>
            <div className="grid grid-cols-3 gap-2">
              {themes.map(t => (
                <button
                  key={t.key}
                  onClick={() => onUpdateSettings({ theme: t.key })}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                    settings.theme === t.key
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#323639]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: t.color }}></span>
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

          {/* Section 3: Bookmarks & Startup */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Bookmarks & Navigation</span>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#303134] cursor-pointer">
                <div>
                  <div className="text-xs sm:text-sm font-medium">Show Bookmarks Bar</div>
                  <div className="text-[11px] text-slate-500">Display top bookmarks row beneath the address bar</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showBookmarksBar}
                  onChange={(e) => onUpdateSettings({ showBookmarksBar: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#303134] cursor-pointer">
                <div>
                  <div className="text-xs sm:text-sm font-medium">Dark Mode Appearance</div>
                  <div className="text-[11px] text-slate-500">Enable high-contrast eye protection theme</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.isDarkMode}
                  onChange={(e) => onUpdateSettings({ isDarkMode: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

          {/* Section 4: Privacy & About */}
          <div className="p-4 bg-slate-50 dark:bg-[#303134] rounded-xl flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-100 block mb-0.5">
                Google Chrome Protection (ব্রাউজার নিরাপত্তা)
              </span>
              Standard protection is active. Protects against dangerous websites, downloads, and unwanted extensions.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
