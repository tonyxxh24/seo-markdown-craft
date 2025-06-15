
import React from 'react';
import { SEOProvider } from '@/contexts/SEOContext';
import { ImportExport } from '@/components/ImportExport';
import { BlockList } from '@/components/BlockList';
import { FileText, Sparkles } from 'lucide-react';

export const SEOApp: React.FC = () => {
  return (
    <SEOProvider>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <FileText size={32} />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SEO Markdown 編輯器
                </h1>
                <Sparkles className="text-purple-500" size={24} />
              </div>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              專為行銷團隊打造的 SEO 內容管理工具，支援 Markdown 格式匯入匯出，讓 SEO 優化變得簡單高效
            </p>
          </div>

          {/* Import/Export Section */}
          <div className="mb-8">
            <ImportExport />
          </div>

          {/* Blocks Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
            <BlockList />
          </div>
        </div>
      </div>
    </SEOProvider>
  );
};
