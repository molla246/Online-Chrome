import React, { useState } from 'react';
import { History, X, Search, Trash2, ExternalLink, Calendar, Clock } from 'lucide-react';
import { HistoryItem } from '../../types/browser';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onNavigate: (url: string) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onNavigate,
  onClearHistory,
  onDeleteHistoryItem
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.url.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#28292A] rounded-2xl w-full max-w-2xl h-[560px] shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col text-slate-800 dark:text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Chrome History (ব্রাউজিং ইতিহাস)</h2>
              <span className="text-xs text-slate-500">{history.length} items logged</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear history</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-slate-50 dark:bg-[#303134] border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search history..."
            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
          {searchFilter && (
            <button onClick={() => setSearchFilter('')} className="text-slate-400 hover:text-slate-600 text-xs px-2">
              Clear
            </button>
          )}
        </div>

        {/* History Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
              <Clock className="w-10 h-10 mb-2 opacity-50" />
              <span>No browsing history found</span>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-[#35363A] rounded-xl transition-colors group"
              >
                <div 
                  onClick={() => {
                    onNavigate(item.url);
                    onClose();
                  }}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                >
                  <span className="text-[11px] font-mono text-slate-400 shrink-0 w-14">
                    {formatTime(item.visitedAt)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {item.title || item.url}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {item.url}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      onNavigate(item.url);
                      onClose();
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg"
                    title="Open tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
