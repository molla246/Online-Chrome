import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Search, 
  Globe, 
  Star, 
  Mic, 
  Camera, 
  Share2, 
  RotateCw, 
  X, 
  ShieldCheck, 
  SlidersHorizontal,
  ExternalLink,
  History,
  Copy,
  Check
} from 'lucide-react';

interface OmniboxProps {
  currentUrl: string;
  isLoading: boolean;
  isBookmarked: boolean;
  onNavigate: (input: string) => void;
  onToggleBookmark: () => void;
  onOpenVoiceSearch: () => void;
  onOpenLens: () => void;
  isMobile?: boolean;
}

export const Omnibox: React.FC<OmniboxProps> = ({
  currentUrl,
  isLoading,
  isBookmarked,
  onNavigate,
  onToggleBookmark,
  onOpenVoiceSearch,
  onOpenLens,
  isMobile = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSecurityPopover, setShowSecurityPopover] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with currentUrl when not focused
  useEffect(() => {
    if (!isFocused) {
      if (currentUrl === 'chrome://newtab' || !currentUrl) {
        setInputValue('');
      } else if (currentUrl.startsWith('chrome://search?q=')) {
        try {
          const parsed = new URL(currentUrl);
          setInputValue(parsed.searchParams.get('q') || '');
        } catch {
          setInputValue(currentUrl);
        }
      } else {
        setInputValue(currentUrl);
      }
    }
  }, [currentUrl, isFocused]);

  // Fetch suggestions when typing
  useEffect(() => {
    if (!isFocused || !inputValue.trim() || inputValue.startsWith('chrome://')) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(inputValue)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.suggestions)) {
            setSuggestions(data.suggestions);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch suggestions:', err);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [inputValue, isFocused]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setShowSecurityPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = (selectedIndex >= 0 && suggestions[selectedIndex]) ? suggestions[selectedIndex] : inputValue.trim();
    if (query) {
      onNavigate(query);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayDisplayUrl = () => {
    if (isFocused) return inputValue;
    if (!currentUrl || currentUrl === 'chrome://newtab') return '';
    if (currentUrl.startsWith('chrome://search?q=')) {
      try {
        const parsed = new URL(currentUrl);
        return parsed.searchParams.get('q') || '';
      } catch {
        return currentUrl;
      }
    }
    try {
      const u = new URL(currentUrl);
      return u.hostname + (u.pathname === '/' ? '' : u.pathname);
    } catch {
      return currentUrl;
    }
  };

  const isHttps = currentUrl.startsWith('https://');

  return (
    <div ref={containerRef} className="relative flex-1 w-full max-w-4xl mx-auto">
      {/* Omnibox Bar */}
      <div 
        className={`flex items-center h-9 sm:h-9 px-3 rounded-full transition-all duration-150 ${
          isFocused 
            ? 'bg-white dark:bg-[#202124] shadow-md ring-2 ring-blue-500/40 text-slate-900 dark:text-white' 
            : 'bg-[#F1F3F4] dark:bg-[#28292A] hover:bg-[#E8EAED] dark:hover:bg-[#323639] text-slate-700 dark:text-slate-200'
        }`}
      >
        {/* Security / Icon indicator */}
        <button
          type="button"
          onClick={() => setShowSecurityPopover(!showSecurityPopover)}
          className="p-1 -ml-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
          title={isHttps ? "Connection is secure" : "View site information"}
        >
          {isFocused ? (
            <Search className="w-4 h-4 text-slate-400" />
          ) : isHttps ? (
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : currentUrl && !currentUrl.startsWith('chrome://') ? (
            <Globe className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <Search className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Input Field */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center h-full px-2">
          <input
            ref={inputRef}
            type="text"
            value={isFocused ? inputValue : displayDisplayUrl()}
            placeholder="Search Google or type a URL (গুগলে সার্চ করুন বা URL লিখুন)"
            onChange={(e) => {
              setInputValue(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (currentUrl && currentUrl !== 'chrome://newtab' && !currentUrl.startsWith('chrome://search')) {
                setInputValue(currentUrl);
              }
              // select all text on focus
              setTimeout(() => inputRef.current?.select(), 50);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 truncate"
          />
        </form>

        {/* Clear Button when typing */}
        {isFocused && inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              inputRef.current?.focus();
            }}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Omnibox Action Icons */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Voice Search */}
          <button
            type="button"
            onClick={onOpenVoiceSearch}
            className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Search by voice"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          {/* Google Lens */}
          <button
            type="button"
            onClick={onOpenLens}
            className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Search by image (Google Lens)"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Bookmark Star (only shown when visiting a real page or search) */}
          {currentUrl && currentUrl !== 'chrome://newtab' && (
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                isBookmarked 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title={isBookmarked ? "Edit bookmark" : "Bookmark this tab"}
            >
              <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isFocused && (suggestions.length > 0 || inputValue.trim().length > 0) && (
        <div className="absolute left-0 right-0 top-10 mt-1 bg-white dark:bg-[#28292A] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
          {/* Direct Search Option */}
          <div
            onMouseDown={() => {
              onNavigate(inputValue);
              setIsFocused(false);
            }}
            className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
              selectedIndex === -1 ? 'bg-slate-100 dark:bg-[#35363A]' : 'hover:bg-slate-50 dark:hover:bg-[#323639]'
            }`}
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 truncate">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                "{inputValue}"
              </span>
              <span className="text-xs text-slate-400 ml-2">· Google Search</span>
            </div>
          </div>

          {/* Suggested List */}
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              onMouseDown={() => {
                onNavigate(suggestion);
                setIsFocused(false);
              }}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors ${
                selectedIndex === idx 
                  ? 'bg-slate-100 dark:bg-[#35363A]' 
                  : 'hover:bg-slate-50 dark:hover:bg-[#323639]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-200 truncate">
                  {suggestion}
                </span>
              </div>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setInputValue(suggestion);
                  inputRef.current?.focus();
                }}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-1 py-0.5 rounded"
                title="Fill in search"
              >
                ↖
              </button>
            </div>
          ))}

          {/* Quick Shortcuts Hint */}
          <div className="px-4 py-2 mt-1 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Press Enter to search or open URL</span>
            <span>Google Chrome Omnibox</span>
          </div>
        </div>
      )}

      {/* Security Info Popover */}
      {showSecurityPopover && (
        <div className="absolute left-2 top-11 bg-white dark:bg-[#28292A] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-80 p-4 z-50 text-slate-800 dark:text-slate-200 animate-in fade-in duration-100">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">
                  {isHttps ? "Connection is secure" : "Site Information"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isHttps ? "Your information is private" : "Standard connection"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSecurityPopover(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700/60 pt-3">
            <div className="flex justify-between items-center py-1">
              <span>Certificate</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Valid (TLS 1.3)</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>Cookies & Site Data</span>
              <span className="text-slate-500">Allowed</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>Current URL</span>
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
