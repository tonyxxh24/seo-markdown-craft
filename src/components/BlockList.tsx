
import React from 'react';
import { Button } from '@/components/ui/button';
import { BlockEditor } from '@/components/BlockEditor';
import { useSEO } from '@/contexts/SEOContext';
import { Plus, FileText } from 'lucide-react';

export const BlockList: React.FC = () => {
  const { state, addBlock } = useSEO();
  const currentPage = state.pages.find(page => page.id === state.currentPageId);

  if (!currentPage) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">請選擇一個頁面來管理 SEO 區塊</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="text-gray-700" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">SEO 區塊管理</h2>
        </div>
        <Button
          onClick={addBlock}
          className="bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
          disabled={state.editingTagId !== null}
        >
          <Plus size={16} className="mr-2" />
          新增區塊
        </Button>
      </div>

      {state.editingTagId !== null && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800">
            目前有標籤正在編輯中，請先完成編輯才能新增區塊。
          </p>
        </div>
      )}

      {currentPage.blocks.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-gray-200">
              <FileText size={32} className="text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">尚未建立任何區塊</h3>
              <p className="text-gray-500 mb-4">開始建立您的第一個 SEO 區塊</p>
              <Button
                onClick={addBlock}
                className="bg-black hover:bg-gray-800 text-white"
                disabled={state.editingTagId !== null}
              >
                <Plus size={16} className="mr-2" />
                建立第一個區塊
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {currentPage.blocks.map((block) => (
            <div key={block.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <BlockEditor block={block} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
