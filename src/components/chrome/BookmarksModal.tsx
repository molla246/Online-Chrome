import React, { useState } from 'react';
import { Bookmark, X, Search, Trash2, ExternalLink, Plus } from 'lucide-react';
import { BookmarkItem } from '../../types/browser';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
  onNavigate: (url: string) => void;
  onDeleteBookmark: (id: string) => void;
  onAddBookmark: (title: string, url: string) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onNavigate,
  onDeleteBookmark,
  onAddBookmark
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const filteredBookmarks = bookmarks.filter(item =>
    item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.url.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    onAddBookmark(title.trim(), finalUrl);
    setTitle('');
    setUrl('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#28292A] rounded-2xl w-full max-w-xl h-[520px] shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col text-slate-800 dark:text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Bookmarks Manager (বুকমার্ক ম্যানেজার)</h2>
              <span className="text-xs text-slate-500">{bookmarks.length} saved bookmarks</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Form if active */}
        {showAddForm && (
          <form onSubmit={handleAdd} className="p-3 bg-slate-50 dark:bg-[#303134] border-b border-slate-200 dark:border-slate-700 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Bookmark Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-[#383a3e] border border-slate-200 dark:border-slate-600 rounded-lg text-xs"
                required
              />
              <input
                type="text"
                placeholder="URL (e.g. google.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-[#383a3e] border border-slate-200 dark:border-slate-600 rounded-lg text-xs"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md"
              >
                Save Bookmark
              </button>
            </div>
          </form>
        )}

        {/* Search */}
        <div className="p-2.5 bg-slate-50 dark:bg-[#303134] border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search bookmarks..."
            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
          {filteredBookmarks.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-[#35363A] rounded-xl transition-colors group"
            >
              <div 
                onClick={() => {
                  onNavigate(item.url);
                  onClose();
                }}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Bookmark className="w-4 h-4 fill-current" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {item.title}
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
                  title="Open bookmark"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteBookmark(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                  title="Delete bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
