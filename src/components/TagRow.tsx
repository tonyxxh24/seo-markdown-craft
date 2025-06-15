
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSEO, SEOTag } from '@/contexts/SEOContext';
import { Trash2, Save, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TagRowProps {
  blockId: string;
  tag: SEOTag;
}

export const TagRow: React.FC<TagRowProps> = ({ blockId, tag }) => {
  const { updateTag, deleteTag, setEditingTag, state } = useSEO();
  const { toast } = useToast();
  
  const isEditing = state.editingTagId === tag.id;

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

  const handleEdit = () => {
    setEditingTag(tag.id);
  };

  const handleSave = () => {
    setEditingTag(null);
    toast({
      title: "標籤已儲存",
      description: "標籤內容已成功儲存",
    });
  };

  const handleCancel = () => {
    setEditingTag(null);
  };

  const getTagTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'h1': 'bg-gray-800 text-white border-gray-800',
      'h2': 'bg-gray-700 text-white border-gray-700',
      'h3': 'bg-gray-600 text-white border-gray-600',
      'p': 'bg-gray-500 text-white border-gray-500',
      'title': 'bg-gray-400 text-white border-gray-400',
      'meta': 'bg-gray-300 text-black border-gray-300',
    };
    return colors[type.toLowerCase()] || 'bg-gray-200 text-black border-gray-200';
  };

  const getStatusInfo = () => {
    const hasOld = tag.oldContent.trim().length > 0;
    const hasNew = tag.newContent.trim().length > 0;
    
    if (!hasOld && hasNew) {
      return { status: '新增', color: 'bg-gray-800 text-white border-gray-800' };
    } else if (hasOld && !hasNew) {
      return { status: '刪除', color: 'bg-red-100 text-red-700 border-red-200' };
    } else if (hasOld && hasNew) {
      return { status: '修改', color: 'bg-gray-600 text-white border-gray-600' };
    } else {
      return { status: '待編輯', color: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };

  const statusInfo = getStatusInfo();

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Input
              value={tag.type}
              onChange={handleTypeChange}
              placeholder="標籤類型（如：h1, p, title...）"
              className="w-48 text-sm font-medium border-gray-300 focus:border-black"
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
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="outline"
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300"
            >
              <Save size={16} />
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
            >
              取消
            </Button>
            <Button
              onClick={handleDeleteTag}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">原始內容</label>
            <Textarea
              value={tag.oldContent}
              onChange={handleOldContentChange}
              placeholder="留空表示「新增」內容"
              className="min-h-[100px] resize-y border-gray-300 focus:border-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">更新內容</label>
            <Textarea
              value={tag.newContent}
              onChange={handleNewContentChange}
              placeholder="留空表示「刪除」內容"
              className="min-h-[100px] resize-y border-gray-300 focus:border-black"
            />
          </div>
        </div>
      </div>
    );
  }

  // Read-only view - table format
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Tag column */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            {tag.type && (
              <span className={`px-2 py-1 text-xs rounded-full border ${getTagTypeColor(tag.type)}`}>
                {tag.type}
              </span>
            )}
            <span className={`px-2 py-1 text-xs rounded-full border ${statusInfo.color}`}>
              {statusInfo.status}
            </span>
          </div>
        </div>

        {/* Original content column */}
        <div className="col-span-4">
          <div className="text-sm text-gray-700 truncate" title={tag.oldContent}>
            {tag.oldContent || '—'}
          </div>
        </div>

        {/* New content column */}
        <div className="col-span-4">
          <div className="text-sm text-gray-700 truncate" title={tag.newContent}>
            {tag.newContent || '—'}
          </div>
        </div>

        {/* Actions column */}
        <div className="col-span-2 flex gap-2 justify-end">
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300"
            disabled={state.editingTagId !== null && state.editingTagId !== tag.id}
          >
            <Edit size={16} />
          </Button>
          <Button
            onClick={handleDeleteTag}
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            disabled={state.editingTagId !== null && state.editingTagId !== tag.id}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
