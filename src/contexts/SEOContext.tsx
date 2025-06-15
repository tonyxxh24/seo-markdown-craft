
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface SEOTag {
  id: string;
  type: string;
  oldContent: string;
  newContent: string;
}

export interface SEOBlock {
  id: string;
  name: string;
  tags: SEOTag[];
}

interface AppState {
  blocks: SEOBlock[];
}

interface SEOContextType {
  state: AppState;
  addBlock: (name: string) => void;
  updateBlock: (id: string, updates: Partial<SEOBlock>) => void;
  deleteBlock: (id: string) => void;
  addTag: (blockId: string) => void;
  updateTag: (blockId: string, tagId: string, updates: Partial<SEOTag>) => void;
  deleteTag: (blockId: string, tagId: string) => void;
  setBlocks: (blocks: SEOBlock[]) => void;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within a SEOProvider');
  }
  return context;
};

interface SEOProviderProps {
  children: ReactNode;
}

export const SEOProvider: React.FC<SEOProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    blocks: []
  });

  const addBlock = (name: string) => {
    const newBlock: SEOBlock = {
      id: uuidv4(),
      name,
      tags: []
    };
    setState(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  const updateBlock = (id: string, updates: Partial<SEOBlock>) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    }));
  };

  const deleteBlock = (id: string) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== id)
    }));
  };

  const addTag = (blockId: string) => {
    const newTag: SEOTag = {
      id: uuidv4(),
      type: '',
      oldContent: '',
      newContent: ''
    };
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId
          ? { ...block, tags: [...block.tags, newTag] }
          : block
      )
    }));
  };

  const updateTag = (blockId: string, tagId: string, updates: Partial<SEOTag>) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              tags: block.tags.map(tag =>
                tag.id === tagId ? { ...tag, ...updates } : tag
              )
            }
          : block
      )
    }));
  };

  const deleteTag = (blockId: string, tagId: string) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId
          ? { ...block, tags: block.tags.filter(tag => tag.id !== tagId) }
          : block
      )
    }));
  };

  const setBlocks = (blocks: SEOBlock[]) => {
    setState({ blocks });
  };

  return (
    <SEOContext.Provider value={{
      state,
      addBlock,
      updateBlock,
      deleteBlock,
      addTag,
      updateTag,
      deleteTag,
      setBlocks
    }}>
      {children}
    </SEOContext.Provider>
  );
};
