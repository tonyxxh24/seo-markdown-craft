
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSEO, SEOBlock } from '@/contexts/SEOContext';
import { TagRow } from '@/components/TagRow';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlockEditorProps {
  block: SEOBlock;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ block }) => {
  const { updateBlock, deleteBlock, addTag } = useSEO();
  const { toast } = useToast();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBlock(block.id, { name: e.target.value });
  };

  const handleDeleteBlock = () => {
    if (window.confirm(`確定要刪除區塊「${block.name}」嗎？此操作無法復原。`)) {
      deleteBlock(block.id);
      toast({
        title: "區塊已刪除",
        description: `已成功刪除區塊「${block.name}」`,
      });
    }
  };

  const handleAddTag = () => {
    addTag(block.id);
    toast({
      title: "標籤已新增",
      description: "請填寫標籤內容",
    });
  };

  return (
    <div className="space-y-6">
      {/* Block Name Editor */}
      <div className="flex items-center gap-3">
        <Edit3 className="text-gray-700" size={20} />
        <Input
          value={block.name}
          onChange={handleNameChange}
          className="flex-1 text-lg font-semibold border-2 border-gray-300 focus:border-black"
          placeholder="區塊名稱"
        />
        <Button
          onClick={handleDeleteBlock}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
        >
          <Trash2 size={16} className="mr-1" />
          刪除區塊
        </Button>
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">標籤內容</h4>
          <Button
            onClick={handleAddTag}
            className="bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus size={16} className="mr-2" />
            新增標籤
          </Button>
        </div>

        {block.tags.length === 0 ? (
          <div className="text-center py-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">此區塊尚未添加任何標籤</p>
            <p className="text-gray-400 text-sm mt-1">點擊「新增標籤」開始添加 SEO 內容</p>
          </div>
        ) : (
          <div className="space-y-4">
            {block.tags.map((tag) => (
              <TagRow key={tag.id} blockId={block.id} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
