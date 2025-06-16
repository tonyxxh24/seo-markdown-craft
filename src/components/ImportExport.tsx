
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/contexts/SEOContext';
import { Download, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateMarkdown, parseMarkdown } from '@/utils/markdownUtils';

export const ImportExport: React.FC = () => {
  const { state, setPages } = useSEO();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const markdown = generateMarkdown(state.pages);
      
      if (!markdown || markdown.trim().length === 0) {
        toast({
          title: "匯出失敗",
          description: "沒有可匯出的內容",
          variant: "destructive",
        });
        return;
      }

      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'seo-content.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const totalBlocks = state.pages.reduce((sum, page) => sum + page.blocks.length, 0);
      toast({
        title: "匯出成功",
        description: `已匯出 ${state.pages.length} 個頁面，共 ${totalBlocks} 個區塊的內容`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "匯出失敗",
        description: "匯出過程中發生錯誤",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (state.editingTagId !== null) {
      toast({
        title: "無法匯入",
        description: "請先完成目前標籤的編輯",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content || content.trim().length === 0) {
          toast({
            title: "匯入失敗",
            description: "檔案內容為空",
            variant: "destructive",
          });
          return;
        }

        const pages = parseMarkdown(content);
        if (pages.length === 0) {
          toast({
            title: "匯入失敗",
            description: "無法解析檔案內容",
            variant: "destructive",
          });
          return;
        }

        setPages(pages);
        const totalBlocks = pages.reduce((sum, page) => sum + page.blocks.length, 0);
        toast({
          title: "匯入成功",
          description: `已匯入 ${pages.length} 個頁面，共 ${totalBlocks} 個區塊`,
        });
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "匯入失敗",
          description: "檔案格式不正確或內容無法解析",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const totalBlocks = state.pages.reduce((sum, page) => sum + page.blocks.length, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="text-gray-700" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">檔案管理</h3>
            <p className="text-sm text-gray-600">
              匯入或匯出 Markdown 格式的 SEO 內容 ({state.pages.length} 頁面，{totalBlocks} 區塊)
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <input
            type="file"
            accept=".md,.txt"
            onChange={handleImport}
            className="hidden"
            ref={fileInputRef}
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="border-black text-black hover:bg-black hover:text-white transition-colors"
            disabled={state.editingTagId !== null}
          >
            <Upload size={16} className="mr-2" />
            匯入 Markdown
          </Button>
          
          <Button
            onClick={handleExport}
            className="bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Download size={16} className="mr-2" />
            匯出 Markdown
          </Button>
        </div>
      </div>

      {state.editingTagId !== null && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-700">
            目前有標籤正在編輯中，請先完成編輯才能進行匯入操作。
          </p>
        </div>
      )}
    </div>
  );
};
