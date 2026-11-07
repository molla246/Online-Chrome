export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  history: string[];
  historyIndex: number;
  isIncognito: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folder?: string;
  dateAdded: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  visitedAt: number;
  favicon?: string;
}

export interface ShortcutItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  bgColor?: string;
}

export interface SearchResultItem {
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

export interface SearchResponse {
  query: string;
  category: string;
  aiOverview?: {
    text: string;
    sources?: { title: string; url: string }[];
  } | null;
  knowledgePanel?: {
    title: string;
    description: string;
    extract: string;
    thumbnail?: string | null;
    contentUrl: string;
  } | null;
  results: SearchResultItem[];
}

export type ViewMode = 'desktop' | 'mobile';

export type BrowserTheme = 'default' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'purple';

export interface BrowserSettings {
  searchEngine: 'google' | 'bing' | 'duckduckgo';
  theme: BrowserTheme;
  isDarkMode: boolean;
  openNewTabOnStartup: boolean;
  showBookmarksBar: boolean;
  language: 'bn' | 'en';
}
