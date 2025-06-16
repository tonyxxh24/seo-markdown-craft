
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSEO } from '@/contexts/SEOContext';
import { Plus, FileText, Trash2, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PageSidebar: React.FC = () => {
  const { state, addPage, updatePage, deletePage, setCurrentPage, toggleSidebar } = useSEO();
  const { toast } = useToast();
  const [editingPageId, setEditingPageId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');

  const handlePageClick = (pageId: string) => {
    if (state.editingTagId !== null) {
      toast({
        title: "無法切換頁面",
        description: "請先完成目前標籤的編輯",
        variant: "destructive",
      });
      return;
    }
    setCurrentPage(pageId);
  };

  const handleAddPage = () => {
    if (state.editingTagId !== null) {
      toast({
        title: "無法新增頁面",
        description: "請先完成目前標籤的編輯",
        variant: "destructive",
      });
      return;
    }
    addPage();
    toast({
      title: "頁面已新增",
      description: "請編輯頁面名稱",
    });
  };

  const handleDeletePage = (pageId: string) => {
    if (state.pages.length <= 1) {
      toast({
        title: "無法刪除",
        description: "至少需要保留一個頁面",
        variant: "destructive",
      });
      return;
    }

    if (state.editingTagId !== null) {
      toast({
        title: "無法刪除頁面",
        description: "請先完成目前標籤的編輯",
        variant: "destructive",
      });
      return;
    }

    const page = state.pages.find(p => p.id === pageId);
    if (window.confirm(`確定要刪除頁面「${page?.name}」嗎？此操作無法復原。`)) {
      deletePage(pageId);
      toast({
        title: "頁面已刪除",
        description: `已成功刪除頁面「${page?.name}」`,
      });
    }
  };

  const handleEditPage = (page: { id: string; name: string }) => {
    if (state.editingTagId !== null) {
      toast({
        title: "無法編輯頁面",
        description: "請先完成目前標籤的編輯",
        variant: "destructive",
      });
      return;
    }
    setEditingPageId(page.id);
    setEditingName(page.name);
  };

  const handleSavePageName = () => {
    if (editingPageId && editingName.trim()) {
      updatePage(editingPageId, { name: editingName.trim() });
      setEditingPageId(null);
      setEditingName('');
      toast({
        title: "頁面名稱已更新",
        description: `頁面名稱已更改為「${editingName.trim()}」`,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditingName('');
  };

  if (!state.sidebarOpen) {
    return (
      <div className="fixed left-0 top-0 h-full z-30">
        <Button
          onClick={toggleSidebar}
          variant="outline"
          size="icon"
          className="m-4 bg-white shadow-lg hover:shadow-xl"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">頁面管理</h2>
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </Button>
      </div>

      {/* Add Page Button */}
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={handleAddPage}
          className="w-full bg-black hover:bg-gray-800 text-white"
          disabled={state.editingTagId !== null}
        >
          <Plus size={16} className="mr-2" />
          新增頁面
        </Button>
        {state.editingTagId !== null && (
          <p className="text-xs text-amber-600 mt-2">
            有標籤正在編輯中，請先完成編輯
          </p>
        )}
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {state.pages.map((page) => (
            <div
              key={page.id}
              className={`group relative mb-2 p-3 rounded-lg border transition-all ${
                page.id === state.currentPageId
                  ? 'bg-black text-white border-black'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
              }`}
            >
              {editingPageId === page.id ? (
                <div className="space-y-2">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="text-sm"
                    placeholder="頁面名稱"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSavePageName();
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSavePageName}
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      儲存
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      取消
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => handlePageClick(page.id)}
                  >
                    <FileText size={16} />
                    <span className="flex-1 font-medium truncate">{page.name}</span>
                    <span className="text-xs opacity-70">
                      {page.blocks.length} 區塊
                    </span>
                  </div>
                  
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPage(page);
                      }}
                      size="sm"
                      variant="ghost"
                      className={`h-6 w-6 p-0 ${
                        page.id === state.currentPageId
                          ? 'hover:bg-gray-700 text-white'
                          : 'hover:bg-gray-200'
                      }`}
                      disabled={state.editingTagId !== null}
                    >
                      <Edit3 size={12} />
                    </Button>
                    {state.pages.length > 1 && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePage(page.id);
                        }}
                        size="sm"
                        variant="ghost"
                        className={`h-6 w-6 p-0 ${
                          page.id === state.currentPageId
                            ? 'hover:bg-red-600 text-white'
                            : 'hover:bg-red-100 text-red-600'
                        }`}
                        disabled={state.editingTagId !== null}
                      >
                        <Trash2 size={12} />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
