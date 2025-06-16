
import { SEOPage, SEOBlock, SEOTag } from '@/contexts/SEOContext';
import { v4 as uuidv4 } from 'uuid';

export function generateMarkdown(pages: SEOPage[]): string {
  let markdown = '# SEO Content Management\n\n';
  
  pages.forEach((page, pageIndex) => {
    markdown += `## Page: ${page.name}\n\n`;
    
    if (page.blocks.length === 0) {
      markdown += '*此頁面尚未添加任何區塊*\n\n';
      return;
    }
    
    page.blocks.forEach((block, blockIndex) => {
      markdown += `### Block ${blockIndex + 1}: ${block.name}\n\n`;
      
      if (block.tags.length === 0) {
        markdown += '*此區塊尚未添加任何標籤*\n\n';
        return;
      }
      
      // Table header
      markdown += '| 標籤類型 | 原始內容 | 更新內容 |\n';
      markdown += '|---------|---------|----------|\n';
      
      // Table rows
      block.tags.forEach((tag) => {
        const tagType = tag.type || '-';
        const oldContent = tag.oldContent || '-';
        const newContent = tag.newContent || '-';
        
        markdown += `| ${tagType} | ${oldContent} | ${newContent} |\n`;
      });
      
      markdown += '\n';
    });
    
    markdown += '\n';
  });
  
  return markdown;
}

export function parseMarkdown(content: string): SEOPage[] {
  const lines = content.split('\n');
  const pages: SEOPage[] = [];
  let currentPage: SEOPage | null = null;
  let currentBlock: SEOBlock | null = null;
  let inTableSection = false;
  let tableHeaderPassed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Page header (## Page: ...)
    if (line.startsWith('## Page: ')) {
      const pageName = line.replace('## Page: ', '').trim();
      currentPage = {
        id: uuidv4(),
        name: pageName || '未命名頁面',
        blocks: [],
      };
      pages.push(currentPage);
      currentBlock = null;
      inTableSection = false;
      tableHeaderPassed = false;
      continue;
    }
    
    // Block header (### Block X: ...)
    if (line.startsWith('### Block') && line.includes(': ')) {
      if (!currentPage) {
        // Create default page if none exists
        currentPage = {
          id: uuidv4(),
          name: '預設頁面',
          blocks: [],
        };
        pages.push(currentPage);
      }
      
      const blockName = line.split(': ').slice(1).join(': ').trim();
      currentBlock = {
        id: uuidv4(),
        name: blockName || '未命名區塊',
        tags: [],
      };
      currentPage.blocks.push(currentBlock);
      inTableSection = false;
      tableHeaderPassed = false;
      continue;
    }
    
    // Table header detection
    if (line.includes('標籤類型') && line.includes('原始內容') && line.includes('更新內容')) {
      inTableSection = true;
      tableHeaderPassed = false;
      continue;
    }
    
    // Table separator line
    if (inTableSection && line.includes('---') && line.includes('|')) {
      tableHeaderPassed = true;
      continue;
    }
    
    // Table data rows
    if (inTableSection && tableHeaderPassed && line.includes('|') && currentBlock) {
      const parts = line.split('|').map(part => part.trim()).filter(part => part);
      
      if (parts.length >= 3) {
        const tag: SEOTag = {
          id: uuidv4(),
          type: parts[0] === '-' ? '' : parts[0],
          oldContent: parts[1] === '-' ? '' : parts[1],
          newContent: parts[2] === '-' ? '' : parts[2],
        };
        currentBlock.tags.push(tag);
      }
      continue;
    }
    
    // Reset table section if we encounter non-table content
    if (inTableSection && !line.includes('|') && !line.includes('---')) {
      inTableSection = false;
      tableHeaderPassed = false;
    }
  }
  
  // If no pages were created, create a default one
  if (pages.length === 0) {
    pages.push({
      id: uuidv4(),
      name: '預設頁面',
      blocks: [],
    });
  }
  
  return pages;
}
