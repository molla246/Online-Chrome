import React, { useState } from 'react';
import { Camera, X, Upload, Sparkles, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface LensModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export const LensModal: React.FC<LensModalProps> = ({
  isOpen,
  onClose,
  onSearch
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleSubjects = [
    { label: 'Eiffel Tower (Paris Landmark)', query: 'Eiffel Tower history architecture Paris' },
    { label: 'Bengal Tiger (Royal Wildlife)', query: 'Royal Bengal Tiger habitat wildlife conservation' },
    { label: 'Monstera Deliciosa (Plant)', query: 'Monstera Deliciosa plant care tips indoor gardening' },
    { label: 'Google Pixel 9 Pro (Tech)', query: 'Google Pixel 9 Pro camera specs price reviews' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      onSearch(cleanName || "Visual search result");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#28292A] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 relative text-slate-800 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl text-blue-600 dark:text-blue-400">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Google Lens Search</h3>
            <p className="text-xs text-slate-500">Search any image with Google Lens intelligence</p>
          </div>
        </div>

        {/* Upload Zone */}
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-[#303134]/40 hover:bg-blue-50/30 mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-blue-500 mb-2" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Drag an image here or <span className="text-blue-600 dark:text-blue-400 underline">upload a file</span>
          </span>
          <span className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP</span>
        </label>

        {/* Sample Images to Try */}
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
            Or try searching sample visual concepts:
          </span>
          <div className="space-y-2">
            {sampleSubjects.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSearch(item.query);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100/70 hover:bg-slate-100 dark:bg-[#35363A] dark:hover:bg-[#3c4043] text-left transition-colors text-xs sm:text-sm text-slate-800 dark:text-slate-200"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
