import React, { useState } from 'react';
import { 
  Search, 
  Mic, 
  Camera, 
  Plus, 
  X, 
  Paintbrush, 
  ExternalLink,
  Sparkles,
  Newspaper,
  Compass,
  ArrowRight
} from 'lucide-react';
import { ShortcutItem } from '../../types/browser';
import { DISCOVER_FEED } from '../../constants/defaults';

interface NewTabPageProps {
  shortcuts: ShortcutItem[];
  onNavigate: (url: string) => void;
  onAddShortcut: (shortcut: ShortcutItem) => void;
  onRemoveShortcut: (id: string) => void;
  onOpenVoiceSearch: () => void;
  onOpenLens: () => void;
  onOpenCustomize: () => void;
  isMobile?: boolean;
}

export const NewTabPage: React.FC<NewTabPageProps> = ({
  shortcuts,
  onNavigate,
  onAddShortcut,
  onRemoveShortcut,
  onOpenVoiceSearch,
  onOpenLens,
  onOpenCustomize,
  isMobile = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onNavigate(searchTerm.trim());
    }
  };

  const handleCreateShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    
    let url = newUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const newShortcut: ShortcutItem = {
      id: `sc-${Date.now()}`,
      title: newTitle.trim(),
      url: url,
      bgColor: '#1a73e8'
    };

    onAddShortcut(newShortcut);
    setNewTitle('');
    setNewUrl('');
    setShowAddModal(false);
  };

  // Google Colored Logo Component
  const GoogleLogo = () => (
    <div className="flex items-center justify-center select-none font-bold tracking-tight text-5xl sm:text-6xl md:text-7xl font-sans mb-7 sm:mb-8">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </div>
  );

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-white dark:bg-[#202124] text-slate-800 dark:text-slate-100 flex flex-col items-center justify-between px-4 py-8 sm:py-16 transition-colors">
      <div className="w-full max-w-2xl flex flex-col items-center flex-1">
        
        {/* Google Logo */}
        <GoogleLogo />

        {/* Central Search Box */}
        <div className="w-full relative mb-6">
          <form 
            onSubmit={handleSearchSubmit}
            className="flex items-center w-full h-12 sm:h-13 px-4 bg-white dark:bg-[#303134] rounded-full border border-slate-200 dark:border-transparent hover:shadow-md focus-within:shadow-md transition-shadow dark:shadow-none"
          >
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="গুগলে সার্চ করুন বা URL লিখুন (Search Google or type a URL)"
              className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400"
              autoFocus={!isMobile}
            />

            <div className="flex items-center gap-1 sm:gap-2 ml-2">
              <button
                type="button"
                onClick={onOpenVoiceSearch}
                className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                title="Search by voice"
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onOpenLens}
                className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                title="Search with Google Lens"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Action buttons on desktop */}
          {!isMobile && (
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                type="button"
                onClick={() => {
                  if (searchTerm.trim()) onNavigate(searchTerm.trim());
                  else onNavigate('Google AI');
                }}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-[#303134] dark:hover:bg-[#3c4043] border border-slate-200/60 dark:border-transparent text-xs sm:text-sm text-slate-700 dark:text-slate-200 rounded-md transition-colors"
              >
                Google Search
              </button>
              <button
                type="button"
                onClick={() => onNavigate('https://en.wikipedia.org/wiki/Special:Random')}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-[#303134] dark:hover:bg-[#3c4043] border border-slate-200/60 dark:border-transparent text-xs sm:text-sm text-slate-700 dark:text-slate-200 rounded-md transition-colors"
              >
                I'm Feeling Lucky
              </button>
            </div>
          )}
        </div>

        {/* Shortcuts Grid */}
        <div className="w-full max-w-xl grid grid-cols-4 sm:grid-cols-4 gap-3 sm:gap-4 my-4 sm:my-6">
          {shortcuts.slice(0, 8).map((sc) => {
            const domain = (() => {
              try {
                return new URL(sc.url).hostname;
              } catch {
                return sc.title;
              }
            })();

            return (
              <div 
                key={sc.id} 
                className="group relative flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5 transition-all cursor-pointer"
                onClick={() => onNavigate(sc.url)}
              >
                {/* Remove shortcut button on hover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveShortcut(sc.id);
                  }}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-opacity"
                  title="Remove shortcut"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Circle Icon Container */}
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#303134] flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs mb-2 transition-transform group-hover:scale-105">
                  <span className="text-base font-bold uppercase">
                    {sc.title.slice(0, 1)}
                  </span>
                </div>

                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[80px] text-center">
                  {sc.title}
                </span>
              </div>
            );
          })}

          {/* Add Shortcut button */}
          {shortcuts.length < 10 && (
            <div
              onClick={() => setShowAddModal(true)}
              className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#303134] flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shadow-xs mb-2 transition-transform group-hover:scale-105">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate max-w-[80px] text-center">
                Add shortcut
              </span>
            </div>
          )}
        </div>

        {/* Discover / Trending Articles Feed (Chrome Mobile & Desktop style) */}
        <div className="w-full max-w-xl mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Compass className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs sm:text-sm font-semibold tracking-wide">
                Discover · শীর্ষ সংবাদ ও প্রবণতা
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Google Feed</span>
          </div>

          <div className="space-y-3">
            {DISCOVER_FEED.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate(item.url)}
                className="p-3 bg-slate-50/70 dark:bg-[#28292A] hover:bg-slate-100/90 dark:hover:bg-[#303134] rounded-xl cursor-pointer transition-all border border-slate-200/50 dark:border-transparent flex items-start justify-between gap-3 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-medium text-blue-600 dark:text-blue-400">{item.source}</span>
                    <span>·</span>
                    <span>{item.category}</span>
                    <span>·</span>
                    <span>{item.time}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Customize Chrome button (Bottom Right) */}
      <div className="w-full max-w-2xl flex justify-end mt-6">
        <button
          type="button"
          onClick={onOpenCustomize}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-[#303134] hover:bg-slate-50 dark:hover:bg-[#3c4043] border border-slate-200 dark:border-transparent rounded-full shadow-xs text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Paintbrush className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Customize Chrome</span>
        </button>
      </div>

      {/* Add Shortcut Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
          <div className="bg-white dark:bg-[#28292A] rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Add shortcut
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateShortcut} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Google Docs"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#35363A] border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="e.g. docs.google.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#35363A] border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
