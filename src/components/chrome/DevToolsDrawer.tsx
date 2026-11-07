import React, { useState } from 'react';
import { Terminal, X, Code, Network, Play, Trash2 } from 'lucide-react';

interface DevToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
}

export const DevToolsDrawer: React.FC<DevToolsDrawerProps> = ({
  isOpen,
  onClose,
  currentUrl
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'elements' | 'network'>('console');
  const [consoleInput, setConsoleInput] = useState('');
  const [logs, setLogs] = useState<Array<{ type: 'log' | 'info' | 'warn' | 'error' | 'eval'; text: string; time: string }>>([
    { type: 'info', text: 'Chrome DevTools initialized.', time: '00:00:01' },
    { type: 'log', text: `Navigated to ${currentUrl || 'chrome://newtab'}`, time: '00:00:02' },
    { type: 'info', text: 'Viewport responsive layout rendering ready.', time: '00:00:03' }
  ]);

  if (!isOpen) return null;

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const time = new Date().toLocaleTimeString();
    try {
      // Evaluate safe expression
      // eslint-disable-next-line no-eval
      const result = eval(consoleInput);
      setLogs(prev => [
        ...prev,
        { type: 'eval', text: `> ${consoleInput}`, time },
        { type: 'log', text: `< ${String(result)}`, time }
      ]);
    } catch (err: any) {
      setLogs(prev => [
        ...prev,
        { type: 'eval', text: `> ${consoleInput}`, time },
        { type: 'error', text: `Uncaught ${err.message}`, time }
      ]);
    }
    setConsoleInput('');
  };

  return (
    <div className="h-64 sm:h-72 w-full bg-[#202124] text-slate-200 border-t border-slate-700 flex flex-col font-mono text-xs z-40 select-text">
      {/* DevTools Top Bar */}
      <div className="h-8 bg-[#292a2d] border-b border-slate-700 px-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeTab === 'console' ? 'bg-[#35363a] text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Console
          </button>
          <button
            onClick={() => setActiveTab('elements')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeTab === 'elements' ? 'bg-[#35363a] text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Elements
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeTab === 'network' ? 'bg-[#35363a] text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Network
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'console' && (
            <button
              onClick={() => setLogs([])}
              className="p-1 text-slate-400 hover:text-slate-200"
              title="Clear console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white"
            title="Close DevTools"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DevTools Body */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'console' && (
          <div className="space-y-1">
            {logs.map((log, idx) => (
              <div 
                key={idx} 
                className={`py-0.5 flex items-start gap-2 ${
                  log.type === 'error' ? 'text-red-400 bg-red-950/20 px-1 rounded' :
                  log.type === 'warn' ? 'text-amber-400' :
                  log.type === 'info' ? 'text-blue-400' :
                  log.type === 'eval' ? 'text-slate-400' : 'text-slate-200'
                }`}
              >
                <span className="text-[10px] text-slate-500 shrink-0 select-none">[{log.time}]</span>
                <span className="whitespace-pre-wrap break-all">{log.text}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="text-slate-300 space-y-1 text-xs font-mono">
            <div className="text-slate-500">&lt;!doctype html&gt;</div>
            <div className="text-blue-400">&lt;<span className="text-purple-400">html</span> <span className="text-yellow-400">lang</span>=<span className="text-green-400">"bn"</span>&gt;</div>
            <div className="pl-4 text-blue-400">&lt;<span className="text-purple-400">head</span>&gt; ... &lt;/<span className="text-purple-400">head</span>&gt;</div>
            <div className="pl-4 text-blue-400">
              &lt;<span className="text-purple-400">body</span> <span className="text-yellow-400">class</span>=<span className="text-green-400">"chrome-viewport"</span>&gt;
            </div>
            <div className="pl-8 text-blue-400">
              &lt;<span className="text-purple-400">main</span> <span className="text-yellow-400">id</span>=<span className="text-green-400">"chrome-active-page"</span>&gt;
            </div>
            <div className="pl-12 text-slate-400 text-[11px]">
              Active Page URL: {currentUrl || 'chrome://newtab'}
            </div>
            <div className="pl-8 text-blue-400">&lt;/<span className="text-purple-400">main</span>&gt;</div>
            <div className="pl-4 text-blue-400">&lt;/<span className="text-purple-400">body</span>&gt;</div>
            <div className="text-blue-400">&lt;/<span className="text-purple-400">html</span>&gt;</div>
          </div>
        )}

        {activeTab === 'network' && (
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="py-1">Name</th>
                <th className="py-1">Status</th>
                <th className="py-1">Type</th>
                <th className="py-1">Size</th>
                <th className="py-1">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-1 text-blue-400">/api/search</td>
                <td className="py-1 text-emerald-400">200 OK</td>
                <td className="py-1">fetch</td>
                <td className="py-1">4.2 kB</td>
                <td className="py-1">42ms</td>
              </tr>
              <tr>
                <td className="py-1 text-blue-400">/api/proxy</td>
                <td className="py-1 text-emerald-400">200 OK</td>
                <td className="py-1">document</td>
                <td className="py-1">28.5 kB</td>
                <td className="py-1">120ms</td>
              </tr>
              <tr>
                <td className="py-1 text-blue-400">favicon.ico</td>
                <td className="py-1 text-emerald-400">200 OK</td>
                <td className="py-1">image/x-icon</td>
                <td className="py-1">1.1 kB</td>
                <td className="py-1">12ms</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Console Input Bar */}
      {activeTab === 'console' && (
        <form onSubmit={handleRunCommand} className="h-8 bg-[#292a2d] border-t border-slate-700 px-3 flex items-center gap-2">
          <span className="text-blue-400 font-bold">&gt;</span>
          <input
            type="text"
            value={consoleInput}
            onChange={(e) => setConsoleInput(e.target.value)}
            placeholder="Type JavaScript (e.g. 2 + 2, navigator.userAgent)..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 text-xs font-mono"
          />
        </form>
      )}
    </div>
  );
};
