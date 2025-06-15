
import { SEOBlock, SEOTag } from '@/contexts/SEOContext';
import { v4 as uuidv4 } from 'uuid';

export const parseMarkdown = (text: string): SEOBlock[] => {
  const blocks: SEOBlock[] = [];
  
  // Split by ## headers
  const sections = text.split(/^##\s+/m).filter(section => section.trim());
  
  for (const section of sections) {
    const lines = section.split('\n');
    const name = lines[0].trim();
    
    // Find the seo code block
    const seoBlockStart = lines.findIndex(line => line.trim() === '```seo');
    const seoBlockEnd = lines.findIndex((line, index) => 
      index > seoBlockStart && line.trim() === '```'
    );
    
    if (seoBlockStart === -1 || seoBlockEnd === -1) {
      continue;
    }
    
    const seoContent = lines.slice(seoBlockStart + 1, seoBlockEnd).join('\n');
    
    try {
      const blockData = parseYamlLike(seoContent);
      const block: SEOBlock = {
        id: blockData.id || uuidv4(),
        name: blockData.name || name,
        tags: blockData.tags || []
      };
      
      blocks.push(block);
    } catch (error) {
      console.error('Error parsing block:', error);
    }
  }
  
  return blocks;
};

export const serializeMarkdown = (blocks: SEOBlock[]): string => {
  let markdown = '';
  
  for (const block of blocks) {
    markdown += `## ${block.name}\n`;
    markdown += '```seo\n';
    markdown += `id: ${block.id}\n`;
    markdown += `name: ${block.name}\n`;
    
    if (block.tags.length > 0) {
      markdown += 'tags:\n';
      for (const tag of block.tags) {
        markdown += `  - id: ${tag.id}\n`;
        markdown += `    type: ${tag.type}\n`;
        markdown += `    old: "${tag.oldContent.replace(/"/g, '\\"')}"\n`;
        markdown += `    new: "${tag.newContent.replace(/"/g, '\\"')}"\n`;
      }
    } else {
      markdown += 'tags: []\n';
    }
    
    markdown += '```\n\n';
  }
  
  return markdown;
};

const parseYamlLike = (content: string): any => {
  const lines = content.split('\n');
  const result: any = { tags: [] };
  let currentTag: any = null;
  let inTags =  false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('id:')) {
      result.id = trimmed.substring(3).trim();
    } else if (trimmed.startsWith('name:')) {
      result.name = trimmed.substring(5).trim();
    } else if (trimmed === 'tags:') {
      inTags = true;
    } else if (inTags && trimmed.startsWith('- id:')) {
      if (currentTag) {
        result.tags.push(currentTag);
      }
      currentTag = {
        id: trimmed.substring(5).trim(),
        type: '',
        oldContent: '',
        newContent: ''
      };
    } else if (currentTag && trimmed.startsWith('type:')) {
      currentTag.type = trimmed.substring(5).trim();
    } else if (currentTag && trimmed.startsWith('old:')) {
      const value = trimmed.substring(4).trim();
      currentTag.oldContent = value.startsWith('"') && value.endsWith('"') 
        ? value.slice(1, -1).replace(/\\"/g, '"')
        : value;
    } else if (currentTag && trimmed.startsWith('new:')) {
      const value = trimmed.substring(4).trim();
      currentTag.newContent = value.startsWith('"') && value.endsWith('"')
        ? value.slice(1, -1).replace(/\\"/g, '"')
        : value;
    }
  }
  
  if (currentTag) {
    result.tags.push(currentTag);
  }
  
  return result;
};
