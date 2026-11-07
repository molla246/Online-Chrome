import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  RotateCw,
  Image as ImageIcon,
  Newspaper,
  Video,
  MapPin,
  BookOpen,
  Share2
} from 'lucide-react';
import { SearchResponse, SearchResultItem } from '../../types/browser';

interface GoogleSearchResultsProps {
  query: string;
  onNavigate: (url: string) => void;
  isMobile?: boolean;
}

export const GoogleSearchResults: React.FC<GoogleSearchResultsProps> = ({
  query,
  onNavigate,
  isMobile = false
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'news' | 'videos'>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}&cat=${activeTab}`)
      .then(res => res.json())
      .then(resData => {
        if (isMounted) {
          setData(resData);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Search error:', err);
        if (isMounted) {
          setData(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query, activeTab]);

  // People also ask questions
  const faqs = [
    {
      q: `What is the latest update about ${query}?`,
      a: `${query} continues to evolve with rapid developments and worldwide updates. Recent industry analysis highlights significant advancements in related technologies and community adoption.`
    },
    {
      q: `How can I learn more about ${query}?`,
      a: `You can access comprehensive documentation, tutorials, video courses, and community forums. Official sites and reputable encyclopedias provide thorough background knowledge.`
    },
    {
      q: `Where can I find official resources for ${query}?`,
      a: `Official web portals, verified social channels, and research archives offer authenticated guides, documentation, and download mirrors.`
    }
  ];

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-white dark:bg-[#202124] text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Google Sub-header / Category Filter Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-16 pt-3 pb-1 bg-white dark:bg-[#202124] sticky top-0 z-10">
        <div className="flex items-center gap-6 overflow-x-auto text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 no-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 pb-2.5 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>All</span>
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-1.5 pb-2.5 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'images'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-1.5 pb-2.5 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'news'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>News</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-1.5 pb-2.5 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'videos'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-16 py-4">
        
        {/* Results Stats */}
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          About {Math.floor(Math.random() * 800 + 200)},000 results (0.34 seconds)
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6 py-6 animate-pulse max-w-2xl">
            <div className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-2xl"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-1/3"></div>
              <div className="h-5 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3"></div>
              <div className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded w-full"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-1/4"></div>
              <div className="h-5 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2"></div>
              <div className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded w-full"></div>
            </div>
          </div>
        )}

        {/* Loaded Results Layout (Grid with main results and knowledge panel) */}
        {!loading && data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: AI Overview & Organic Results */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Google AI Overview Box */}
              {data.aiOverview && (
                <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-purple-50/50 dark:from-[#242b3d] dark:via-[#222736] dark:to-[#28253a] border border-blue-200/70 dark:border-blue-900/40 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      AI Overview
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">· Gemini Smart Summary</span>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {data.aiOverview.text}
                  </div>

                  {data.aiOverview.sources && data.aiOverview.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-blue-200/50 dark:border-slate-700/60 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">Sources:</span>
                      {data.aiOverview.sources.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => onNavigate(src.url)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-white/80 dark:bg-[#303134] hover:bg-white dark:hover:bg-[#3c4043] border border-slate-200/80 dark:border-slate-700 rounded-md text-[11px] text-blue-600 dark:text-blue-400 transition-colors"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* People Also Ask Section */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-[#28292A]">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  People also ask
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {faqs.map((faq, index) => (
                    <div key={index} className="py-2.5">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="flex items-center justify-between w-full text-left text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {expandedFaq === index ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1 animate-in fade-in duration-150">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Organic Search Results */}
              <div className="space-y-6 pt-2">
                {data.results.map((item, index) => (
                  <div key={index} className="group max-w-2xl">
                    {/* Domain / Breadcrumb */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300">
                        <Globe className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {item.domain}
                      </span>
                    </div>

                    {/* Result Title */}
                    <h3 
                      onClick={() => onNavigate(item.url)}
                      className="text-base sm:text-lg font-medium text-[#1a0dab] dark:text-[#8ab4f8] group-hover:underline cursor-pointer leading-snug mb-1"
                    >
                      {item.title}
                    </h3>

                    {/* Snippet Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.snippet}
                    </p>

                    {/* Sitelinks mockup */}
                    {index === 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                        <div 
                          onClick={() => onNavigate(item.url)}
                          className="cursor-pointer group/link"
                        >
                          <div className="text-xs font-medium text-[#1a0dab] dark:text-[#8ab4f8] group-hover/link:underline">
                            Overview & Guides
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Explore full specifications and details
                          </div>
                        </div>
                        <div 
                          onClick={() => onNavigate(item.url)}
                          className="cursor-pointer group/link"
                        >
                          <div className="text-xs font-medium text-[#1a0dab] dark:text-[#8ab4f8] group-hover/link:underline">
                            Community & Documentation
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Join discussions and read technical articles
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Related Searches footer */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Related searches
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    `${query} bangla tutorial`,
                    `${query} latest news 2026`,
                    `${query} download and features`,
                    `best alternatives to ${query}`
                  ].map((rel, rIdx) => (
                    <div
                      key={rIdx}
                      onClick={() => onNavigate(rel)}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#303134] hover:bg-slate-100 dark:hover:bg-[#3c4043] cursor-pointer text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{rel}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Google Knowledge Graph Panel */}
            {data.knowledgePanel && (
              <div className="lg:col-span-4">
                <div className="border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 bg-white dark:bg-[#28292A] shadow-xs sticky top-16">
                  {data.knowledgePanel.thumbnail && (
                    <div className="w-full h-44 mb-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={data.knowledgePanel.thumbnail}
                        alt={data.knowledgePanel.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                    {data.knowledgePanel.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {data.knowledgePanel.description}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {data.knowledgePanel.extract}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Source: Wikipedia</span>
                    <button
                      onClick={() => onNavigate(data.knowledgePanel!.contentUrl)}
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>Read full page</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
