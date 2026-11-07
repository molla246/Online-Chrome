import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCw, 
  AlertCircle, 
  BookOpen, 
  ExternalLink, 
  Maximize2, 
  Minimize2,
  Copy,
  Check,
  ShieldAlert
} from 'lucide-react';

interface BrowserViewportProps {
  url: string;
  isLoading: boolean;
  onNavigate: (url: string) => void;
  onTitleUpdate: (title: string) => void;
  onLoadingChange: (loading: boolean) => void;
  zoomLevel: number;
}

export const BrowserViewport: React.FC<BrowserViewportProps> = ({
  url,
  isLoading,
  onNavigate,
  onTitleUpdate,
  onLoadingChange,
  zoomLevel
}) => {
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Derive proxied URL
  const proxySrc = `/api/proxy?url=${encodeURIComponent(url)}`;

  useEffect(() => {
    setLoadError(false);
    onLoadingChange(true);

    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object') {
        if (event.data.type === 'CHROME_NAVIGATE' && event.data.url) {
          onNavigate(event.data.url);
        } else if (event.data.type === 'CHROME_TITLE_UPDATE' && event.data.title) {
          onTitleUpdate(event.data.title);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [url]);

  const handleIframeLoad = () => {
    onLoadingChange(false);
    try {
      if (iframeRef.current?.contentDocument?.title) {
        onTitleUpdate(iframeRef.current.contentDocument.title);
      }
    } catch {
      // Cross-origin restriction expected, fallback to URL host
      try {
        const u = new URL(url);
        onTitleUpdate(u.hostname);
      } catch {}
    }
  };

  const handleIframeError = () => {
    setLoadError(true);
    onLoadingChange(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex-1 w-full h-full bg-white dark:bg-[#1a1a1a] overflow-hidden flex flex-col">
      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-100 z-30 overflow-hidden">
          <div className="h-full bg-blue-600 animate-indeterminate"></div>
        </div>
      )}

      {/* Reader View vs Normal Web View */}
      {readerMode ? (
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 max-w-3xl mx-auto w-full text-slate-800 dark:text-slate-100 font-serif leading-relaxed">
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 font-sans">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              Chrome Reader Mode
            </span>
            <button
              onClick={() => setReaderMode(false)}
              className="text-xs text-blue-600 hover:underline"
            >
              Exit Reader Mode
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 font-sans">
            {url}
          </h1>
          <p className="text-sm text-slate-500 mb-6 font-sans">
            Browsing target: {url}
          </p>
          <div className="space-y-4 text-base">
            <p>
              This is the distilled reading mode of the requested web page, stripping away extraneous advertisements, popups, and intrusive third-party scripts.
            </p>
            <p>
              You can toggle back to the live interactive page at any time using the button above or in the page controls.
            </p>
          </div>
        </div>
      ) : (
        <div 
          className="flex-1 w-full h-full relative"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left', width: `${10000 / zoomLevel}%`, height: `${10000 / zoomLevel}%` }}
        >
          {loadError ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white dark:bg-[#202124]">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-full text-amber-600 mb-4">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                This webpage could not be loaded directly
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6">
                The website might have strict anti-embedding policies or restricted origin access.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setLoadError(false);
                    onLoadingChange(true);
                    if (iframeRef.current) iframeRef.current.src = proxySrc;
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Retry Loading
                </button>
                <button
                  onClick={() => setReaderMode(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
                >
                  Open in Reader Mode
                </button>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={proxySrc}
              title="Web Page"
              className="w-full h-full border-none bg-white"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </div>
      )}

      {/* Bottom Floating Web Actions Strip */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-white/95 dark:bg-[#28292A]/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 z-20">
        <button
          onClick={() => setReaderMode(!readerMode)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
            readerMode ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
          title="Reader View"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reader</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Copy URL"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Open in external browser window"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">External</span>
        </a>
      </div>
    </div>
  );
};
