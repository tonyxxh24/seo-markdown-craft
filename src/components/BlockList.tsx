
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSEO } from '@/contexts/SEOContext';
import { BlockEditor } from '@/components/BlockEditor';
import { Plus, Blocks, ChevronRight, ChevronDown } from 'lucide-react';

export const BlockList: React.FC = () => {
  const { state, addBlock } = useSEO();
  const [newBlockName, setNewBlockName] = useState('');
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  const handleAddBlock = () => {
    if (newBlockName.trim()) {
      addBlock(newBlockName.trim());
      setNewBlockName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddBlock();
    }
  };

  const toggleBlock = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Blocks className="text-gray-700" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">SEO 區塊管理</h2>
      </div>

      {/* Add New Block */}
      <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">新增 SEO 區塊</h3>
        <div className="flex gap-3">
          <Input
            placeholder="輸入區塊名稱（例如：首頁標題、產品描述...）"
            value={newBlockName}
            onChange={(e) => setNewBlockName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-2 border-gray-300 focus:border-gray-600 transition-colors"
          />
          <Button
            onClick={handleAddBlock}
            disabled={!newBlockName.trim()}
            className="bg-black hover:bg-gray-800 text-white px-6 shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-400"
          >
            <Plus size={20} className="mr-2" />
            新增區塊
          </Button>
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-4">
        {state.blocks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Blocks className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-lg">尚未建立任何 SEO 區塊</p>
            <p className="text-gray-400 text-sm mt-2">請新增區塊或匯入 Markdown 檔案開始使用</p>
          </div>
        ) : (
          state.blocks.map((block) => {
            const isExpanded = expandedBlocks.has(block.id);
            return (
              <div key={block.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
                {/* Block Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleBlock(block.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="text-gray-600" size={20} />
                    ) : (
                      <ChevronRight className="text-gray-400" size={20} />
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">{block.name}</h3>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                      {block.tags.length} 個標籤
                    </span>
                  </div>
                </div>

                {/* Block Content */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <BlockEditor block={block} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
