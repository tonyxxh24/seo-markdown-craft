
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSEO } from '@/contexts/SEOContext';
import { parseMarkdown, serializeMarkdown } from '@/utils/markdownUtils';
import { Upload, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ImportExport: React.FC = () => {
  const { state, setBlocks } = useSEO();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const blocks = parseMarkdown(text);
      setBlocks(blocks);
      toast({
        title: "匯入成功",
        description: `已成功匯入 ${blocks.length} 個 SEO 區塊`,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "匯入失敗",
        description: "請檢查檔案格式是否正確",
        variant: "destructive",
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    console.log('Export button clicked');
    console.log('Blocks to export:', state.blocks);
    
    if (!state.blocks || state.blocks.length === 0) {
      toast({
        title: "無法匯出",
        description: "目前沒有可匯出的 SEO 區塊",
        variant: "destructive",
      });
      return;
    }

    try {
      const markdown = serializeMarkdown(state.blocks);
      console.log('Generated markdown:', markdown);
      
      if (!markdown || markdown.trim() === '') {
        toast({
          title: "匯出失敗",
          description: "生成的 Markdown 內容為空",
          variant: "destructive",
        });
        return;
      }

      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `seo-content-${new Date().toISOString().split('T')[0]}.md`;
      link.style.display = 'none';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "匯出成功",
        description: "SEO 內容已成功匯出為 Markdown 檔案",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "匯出失敗",
        description: `匯出檔案時發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="text-gray-700" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">檔案管理</h2>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Import Section */}
        <div className="flex-1">
          <Input
            type="file"
            accept=".md,.markdown"
            onChange={handleFileImport}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-500 hover:bg-gray-50 transition-all duration-300 group text-gray-700"
          >
            <Upload className="mr-2 group-hover:scale-110 transition-transform text-gray-600" size={20} />
            匯入 Markdown 檔案
          </Button>
        </div>

        {/* Export Section */}
        <div className="flex-1">
          <Button
            onClick={handleExport}
            className="w-full h-12 bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Download className="mr-2 group-hover:scale-110 transition-transform" size={20} />
            匯出 Markdown 檔案
            {state.blocks.length > 0 && (
              <span className="ml-2 text-xs opacity-75">({state.blocks.length})</span>
            )}
          </Button>
        </div>
      </div>

      {state.blocks.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            目前有 <span className="font-semibold">{state.blocks.length}</span> 個 SEO 區塊，
            共 <span className="font-semibold">{state.blocks.reduce((sum, block) => sum + block.tags.length, 0)}</span> 個標籤
          </p>
        </div>
      )}
    </div>
  );
};
