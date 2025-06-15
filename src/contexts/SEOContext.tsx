
import React, { createContext, useContext, useReducer } from 'react';
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

interface SEOState {
  blocks: SEOBlock[];
  editingTagId: string | null;
}

type SEOAction =
  | { type: 'SET_BLOCKS'; payload: SEOBlock[] }
  | { type: 'ADD_BLOCK' }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; updates: Partial<SEOBlock> } }
  | { type: 'DELETE_BLOCK'; payload: string }
  | { type: 'ADD_TAG'; payload: string }
  | { type: 'UPDATE_TAG'; payload: { blockId: string; tagId: string; updates: Partial<SEOTag> } }
  | { type: 'DELETE_TAG'; payload: { blockId: string; tagId: string } }
  | { type: 'SET_EDITING_TAG'; payload: string | null };

const initialState: SEOState = {
  blocks: [],
  editingTagId: null,
};

function seoReducer(state: SEOState, action: SEOAction): SEOState {
  switch (action.type) {
    case 'SET_BLOCKS':
      return { ...state, blocks: action.payload };
    
    case 'ADD_BLOCK':
      const newBlock: SEOBlock = {
        id: uuidv4(),
        name: '新區塊',
        tags: [],
      };
      return { ...state, blocks: [...state.blocks, newBlock] };
    
    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map(block =>
          block.id === action.payload.id
            ? { ...block, ...action.payload.updates }
            : block
        ),
      };
    
    case 'DELETE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.filter(block => block.id !== action.payload),
      };
    
    case 'ADD_TAG':
      const newTag: SEOTag = {
        id: uuidv4(),
        type: '',
        oldContent: '',
        newContent: '',
      };
      return {
        ...state,
        blocks: state.blocks.map(block =>
          block.id === action.payload
            ? { ...block, tags: [...block.tags, newTag] }
            : block
        ),
        editingTagId: newTag.id,
      };
    
    case 'UPDATE_TAG':
      return {
        ...state,
        blocks: state.blocks.map(block =>
          block.id === action.payload.blockId
            ? {
                ...block,
                tags: block.tags.map(tag =>
                  tag.id === action.payload.tagId
                    ? { ...tag, ...action.payload.updates }
                    : tag
                ),
              }
            : block
        ),
      };
    
    case 'DELETE_TAG':
      return {
        ...state,
        blocks: state.blocks.map(block =>
          block.id === action.payload.blockId
            ? { ...block, tags: block.tags.filter(tag => tag.id !== action.payload.tagId) }
            : block
        ),
        editingTagId: state.editingTagId === action.payload.tagId ? null : state.editingTagId,
      };
    
    case 'SET_EDITING_TAG':
      return {
        ...state,
        editingTagId: action.payload,
      };
    
    default:
      return state;
  }
}

interface SEOContextType {
  state: SEOState;
  setBlocks: (blocks: SEOBlock[]) => void;
  addBlock: () => void;
  updateBlock: (id: string, updates: Partial<SEOBlock>) => void;
  deleteBlock: (id: string) => void;
  addTag: (blockId: string) => void;
  updateTag: (blockId: string, tagId: string, updates: Partial<SEOTag>) => void;
  deleteTag: (blockId: string, tagId: string) => void;
  setEditingTag: (tagId: string | null) => void;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export function SEOProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(seoReducer, initialState);

  const setBlocks = (blocks: SEOBlock[]) => {
    dispatch({ type: 'SET_BLOCKS', payload: blocks });
  };

  const addBlock = () => {
    dispatch({ type: 'ADD_BLOCK' });
  };

  const updateBlock = (id: string, updates: Partial<SEOBlock>) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, updates } });
  };

  const deleteBlock = (id: string) => {
    dispatch({ type: 'DELETE_BLOCK', payload: id });
  };

  const addTag = (blockId: string) => {
    dispatch({ type: 'ADD_TAG', payload: blockId });
  };

  const updateTag = (blockId: string, tagId: string, updates: Partial<SEOTag>) => {
    dispatch({ type: 'UPDATE_TAG', payload: { blockId, tagId, updates } });
  };

  const deleteTag = (blockId: string, tagId: string) => {
    dispatch({ type: 'DELETE_TAG', payload: { blockId, tagId } });
  };

  const setEditingTag = (tagId: string | null) => {
    dispatch({ type: 'SET_EDITING_TAG', payload: tagId });
  };

  return (
    <SEOContext.Provider
      value={{
        state,
        setBlocks,
        addBlock,
        updateBlock,
        deleteBlock,
        addTag,
        updateTag,
        deleteTag,
        setEditingTag,
      }}
    >
      {children}
    </SEOContext.Provider>
  );
}

export function useSEO() {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within a SEOProvider');
  }
  return context;
}
