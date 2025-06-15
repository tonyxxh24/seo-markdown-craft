
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSEO, SEOTag } from '@/contexts/SEOContext';
import { Trash2, Tag, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TagRowProps {
  blockId: string;
  tag: SEOTag;
}

export const TagRow: React.FC<TagRowProps> = ({ blockId, tag }) => {
  const { updateTag, deleteTag } = useSEO();
  const { toast } = useToast();

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTag(blockId, tag.id, { type: e.target.value });
  };

  const handleOldContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateTag(blockId, tag.id, { oldContent: e.target.value });
  };

  const handleNewContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateTag(blockId, tag.id, { newContent: e.target.value });
  };

  const handleDeleteTag = () => {
    if (window.confirm('確定要刪除此標籤嗎？')) {
      deleteTag(blockId, tag.id);
      toast({
        title: "標籤已刪除",
        description: "標籤已成功刪除",
      });
    }
  };

  const getTagTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'h1': 'bg-red-100 text-red-700 border-red-200',
      'h2': 'bg-orange-100 text-orange-700 border-orange-200',
      'h3': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'p': 'bg-blue-100 text-blue-700 border-blue-200',
      'title': 'bg-purple-100 text-purple-700 border-purple-200',
      'meta': 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusInfo = () => {
    const hasOld = tag.oldContent.trim().length > 0;
    const hasNew = tag.newContent.trim().length > 0;
    
    if (!hasOld && hasNew) {
      return { status: '新增', color: 'bg-green-100 text-green-700 border-green-200' };
    } else if (hasOld && !hasNew) {
      return { status: '刪除', color: 'bg-red-100 text-red-700 border-red-200' };
    } else if (hasOld && hasNew) {
      return { status: '修改', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    } else {
      return { status: '待編輯', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tag className="text-blue-600" size={18} />
          <Input
            value={tag.type}
            onChange={handleTypeChange}
            placeholder="標籤類型（如：h1, p, title...）"
            className="w-48 text-sm font-medium"
          />
          {tag.type && (
            <span className={`px-2 py-1 text-xs rounded-full border ${getTagTypeColor(tag.type)}`}>
              {tag.type}
            </span>
          )}
          <span className={`px-2 py-1 text-xs rounded-full border ${statusInfo.color}`}>
            {statusInfo.status}
          </span>
        </div>
        <Button
          onClick={handleDeleteTag}
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Old Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">原始內容</label>
          <Textarea
            value={tag.oldContent}
            onChange={handleOldContentChange}
            placeholder="留空表示「新增」內容"
            className="min-h-[100px] resize-y"
          />
          {tag.oldContent.trim().length > 0 && (
            <p className="text-xs text-gray-500">
              {tag.oldContent.trim().length} 個字元
            </p>
          )}
        </div>

        {/* Arrow */}
        <div className="hidden lg:flex items-center justify-center">
          <ArrowRight className="text-gray-400" size={24} />
        </div>

        {/* New Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">更新內容</label>
          <Textarea
            value={tag.newContent}
            onChange={handleNewContentChange}
            placeholder="留空表示「刪除」內容"
            className="min-h-[100px] resize-y"
          />
          {tag.newContent.trim().length > 0 && (
            <p className="text-xs text-gray-500">
              {tag.newContent.trim().length} 個字元
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
