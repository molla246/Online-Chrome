import { BookmarkItem, ShortcutItem } from '../types/browser';

export const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  {
    id: 'sc-1',
    title: 'YouTube',
    url: 'https://www.youtube.com',
    bgColor: '#FF0000',
    icon: 'youtube'
  },
  {
    id: 'sc-2',
    title: 'Wikipedia',
    url: 'https://en.wikipedia.org',
    bgColor: '#333333',
    icon: 'wikipedia'
  },
  {
    id: 'sc-3',
    title: 'Google News',
    url: 'https://news.google.com',
    bgColor: '#4285F4',
    icon: 'news'
  },
  {
    id: 'sc-4',
    title: 'Gmail',
    url: 'https://mail.google.com',
    bgColor: '#EA4335',
    icon: 'mail'
  },
  {
    id: 'sc-5',
    title: 'GitHub',
    url: 'https://github.com',
    bgColor: '#24292e',
    icon: 'github'
  },
  {
    id: 'sc-6',
    title: 'Facebook',
    url: 'https://www.facebook.com',
    bgColor: '#1877F2',
    icon: 'facebook'
  },
  {
    id: 'sc-7',
    title: 'Prothom Alo',
    url: 'https://www.prothomalo.com',
    bgColor: '#D9232D',
    icon: 'globe'
  },
  {
    id: 'sc-8',
    title: 'Weather',
    url: 'https://weather.com',
    bgColor: '#00598E',
    icon: 'sun'
  }
];

export const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'bm-1',
    title: 'Google',
    url: 'https://www.google.com',
    dateAdded: Date.now() - 100000,
  },
  {
    id: 'bm-2',
    title: 'YouTube',
    url: 'https://www.youtube.com',
    dateAdded: Date.now() - 90000,
  },
  {
    id: 'bm-3',
    title: 'Wikipedia',
    url: 'https://en.wikipedia.org',
    dateAdded: Date.now() - 80000,
  },
  {
    id: 'bm-4',
    title: 'GitHub',
    url: 'https://github.com',
    dateAdded: Date.now() - 70000,
  },
  {
    id: 'bm-5',
    title: 'Google Translate',
    url: 'https://translate.google.com',
    dateAdded: Date.now() - 60000,
  },
  {
    id: 'bm-6',
    title: 'Bangla News (প্রথম আলো)',
    url: 'https://www.prothomalo.com',
    dateAdded: Date.now() - 50000,
  }
];

export const DISCOVER_FEED = [
  {
    id: 'feed-1',
    title: 'গুগল ক্রোম ব্রাউজারে নতুন এআই এবং উন্নত পারফরম্যান্স ফিচার যুক্ত হলো',
    source: 'Tech Bangla',
    time: '২ ঘন্টা আগে',
    url: 'https://blog.google/products/chrome/',
    category: 'প্রযুক্তি'
  },
  {
    id: 'feed-2',
    title: 'বিশ্বের বৃহত্তম টেলিস্কোপের মাধ্যমে মহাবিশ্বের গভীর রহস্যের নতুন সন্ধান',
    source: 'বিজ্ঞান জার্নাল',
    time: '৪ ঘন্টা আগে',
    url: 'https://www.nasa.gov',
    category: 'বিজ্ঞান'
  },
  {
    id: 'feed-3',
    title: 'আন্তর্জাতিক টি-টোয়েন্টি টুর্নামেন্টে দুর্দান্ত জয়ে ফাইনালে বাংলাদেশ দল',
    source: 'খেলাধুলা ২৪',
    time: '৫ ঘন্টা আগে',
    url: 'https://www.espncricinfo.com',
    category: 'খেলা'
  },
  {
    id: 'feed-4',
    title: 'কৃত্রিম বুদ্ধিমত্তা ও প্রোগ্রামিং: শিক্ষার্থীদের জন্য নতুন সুযোগের দুয়ার উন্মুক্ত',
    source: 'ডেইলি লার্নিং',
    time: '৬ ঘন্টা আগে',
    url: 'https://openai.com',
    category: 'শিক্ষা'
  }
];

export const THEME_PALETTES = {
  default: {
    name: 'Classic Chrome',
    barBg: 'bg-[#DFE1E5] dark:bg-[#1F1F1F]',
    tabActive: 'bg-white dark:bg-[#28292A]',
    tabInactive: 'text-[#3C4043] dark:text-[#E8EAED]',
    accent: '#1a73e8',
  },
  ocean: {
    name: 'Ocean Blue',
    barBg: 'bg-[#CFE2F3] dark:bg-[#0E2439]',
    tabActive: 'bg-[#EBF3FB] dark:bg-[#183957]',
    tabInactive: 'text-[#1B365D] dark:text-[#A7D1F8]',
    accent: '#0070BA',
  },
  forest: {
    name: 'Forest Green',
    barBg: 'bg-[#D9EAD3] dark:bg-[#132B1B]',
    tabActive: 'bg-[#EFF8EE] dark:bg-[#1D4029]',
    tabInactive: 'text-[#274E13] dark:text-[#B6E3C0]',
    accent: '#2e7d32',
  },
  sunset: {
    name: 'Sunset Orange',
    barBg: 'bg-[#FCE5CD] dark:bg-[#382112]',
    tabActive: 'bg-[#FFF2E6] dark:bg-[#502E19]',
    tabInactive: 'text-[#783F04] dark:text-[#FFC299]',
    accent: '#E65100',
  },
  purple: {
    name: 'Midnight Purple',
    barBg: 'bg-[#E1D5E7] dark:bg-[#2A1836]',
    tabActive: 'bg-[#F4ECF7] dark:bg-[#3D234F]',
    tabInactive: 'text-[#4A154B] dark:text-[#DDBBE8]',
    accent: '#7B1FA2',
  },
  dark: {
    name: 'Carbon Dark',
    barBg: 'bg-[#18181b] dark:bg-[#121212]',
    tabActive: 'bg-[#27272a] dark:bg-[#1f1f23]',
    tabInactive: 'text-zinc-400 dark:text-zinc-300',
    accent: '#818cf8',
  }
};
