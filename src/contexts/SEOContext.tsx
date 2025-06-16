
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

export interface SEOPage {
  id: string;
  name: string;
  blocks: SEOBlock[];
}

interface SEOState {
  pages: SEOPage[];
  currentPageId: string | null;
  editingTagId: string | null;
  sidebarOpen: boolean;
}

type SEOAction =
  | { type: 'SET_PAGES'; payload: SEOPage[] }
  | { type: 'ADD_PAGE' }
  | { type: 'UPDATE_PAGE'; payload: { id: string; updates: Partial<SEOPage> } }
  | { type: 'DELETE_PAGE'; payload: string }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'ADD_BLOCK' }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; updates: Partial<SEOBlock> } }
  | { type: 'DELETE_BLOCK'; payload: string }
  | { type: 'ADD_TAG'; payload: string }
  | { type: 'UPDATE_TAG'; payload: { blockId: string; tagId: string; updates: Partial<SEOTag> } }
  | { type: 'DELETE_TAG'; payload: { blockId: string; tagId: string } }
  | { type: 'SET_EDITING_TAG'; payload: string | null }
  | { type: 'TOGGLE_SIDEBAR' };

const initialState: SEOState = {
  pages: [{
    id: uuidv4(),
    name: '首頁',
    blocks: [],
  }],
  currentPageId: null,
  editingTagId: null,
  sidebarOpen: true,
};

// Initialize currentPageId to first page
initialState.currentPageId = initialState.pages[0].id;

function seoReducer(state: SEOState, action: SEOAction): SEOState {
  switch (action.type) {
    case 'SET_PAGES':
      return { 
        ...state, 
        pages: action.payload,
        currentPageId: action.payload.length > 0 ? action.payload[0].id : null
      };
    
    case 'ADD_PAGE':
      const newPage: SEOPage = {
        id: uuidv4(),
        name: '新頁面',
        blocks: [],
      };
      return { 
        ...state, 
        pages: [...state.pages, newPage],
        currentPageId: newPage.id
      };
    
    case 'UPDATE_PAGE':
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload.id
            ? { ...page, ...action.payload.updates }
            : page
        ),
      };
    
    case 'DELETE_PAGE':
      const remainingPages = state.pages.filter(page => page.id !== action.payload);
      return {
        ...state,
        pages: remainingPages,
        currentPageId: state.currentPageId === action.payload 
          ? (remainingPages.length > 0 ? remainingPages[0].id : null)
          : state.currentPageId,
      };
    
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPageId: action.payload,
      };
    
    case 'ADD_BLOCK':
      if (!state.currentPageId) return state;
      
      const newBlock: SEOBlock = {
        id: uuidv4(),
        name: '新區塊',
        tags: [],
      };
      
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === state.currentPageId
            ? { ...page, blocks: [...page.blocks, newBlock] }
            : page
        ),
      };
    
    case 'UPDATE_BLOCK':
      return {
        ...state,
        pages: state.pages.map(page => ({
          ...page,
          blocks: page.blocks.map(block =>
            block.id === action.payload.id
              ? { ...block, ...action.payload.updates }
              : block
          ),
        })),
      };
    
    case 'DELETE_BLOCK':
      return {
        ...state,
        pages: state.pages.map(page => ({
          ...page,
          blocks: page.blocks.filter(block => block.id !== action.payload),
        })),
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
        pages: state.pages.map(page => ({
          ...page,
          blocks: page.blocks.map(block =>
            block.id === action.payload
              ? { ...block, tags: [...block.tags, newTag] }
              : block
          ),
        })),
        editingTagId: newTag.id,
      };
    
    case 'UPDATE_TAG':
      return {
        ...state,
        pages: state.pages.map(page => ({
          ...page,
          blocks: page.blocks.map(block =>
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
        })),
      };
    
    case 'DELETE_TAG':
      return {
        ...state,
        pages: state.pages.map(page => ({
          ...page,
          blocks: page.blocks.map(block =>
            block.id === action.payload.blockId
              ? { ...block, tags: block.tags.filter(tag => tag.id !== action.payload.tagId) }
              : block
          ),
        })),
        editingTagId: state.editingTagId === action.payload.tagId ? null : state.editingTagId,
      };
    
    case 'SET_EDITING_TAG':
      return {
        ...state,
        editingTagId: action.payload,
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    
    default:
      return state;
  }
}

interface SEOContextType {
  state: SEOState;
  setPages: (pages: SEOPage[]) => void;
  addPage: () => void;
  updatePage: (id: string, updates: Partial<SEOPage>) => void;
  deletePage: (id: string) => void;
  setCurrentPage: (id: string) => void;
  addBlock: () => void;
  updateBlock: (id: string, updates: Partial<SEOBlock>) => void;
  deleteBlock: (id: string) => void;
  addTag: (blockId: string) => void;
  updateTag: (blockId: string, tagId: string, updates: Partial<SEOTag>) => void;
  deleteTag: (blockId: string, tagId: string) => void;
  setEditingTag: (tagId: string | null) => void;
  toggleSidebar: () => void;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export function SEOProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(seoReducer, initialState);

  const setPages = (pages: SEOPage[]) => {
    dispatch({ type: 'SET_PAGES', payload: pages });
  };

  const addPage = () => {
    dispatch({ type: 'ADD_PAGE' });
  };

  const updatePage = (id: string, updates: Partial<SEOPage>) => {
    dispatch({ type: 'UPDATE_PAGE', payload: { id, updates } });
  };

  const deletePage = (id: string) => {
    dispatch({ type: 'DELETE_PAGE', payload: id });
  };

  const setCurrentPage = (id: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: id });
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

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <SEOContext.Provider
      value={{
        state,
        setPages,
        addPage,
        updatePage,
        deletePage,
        setCurrentPage,
        addBlock,
        updateBlock,
        deleteBlock,
        addTag,
        updateTag,
        deleteTag,
        setEditingTag,
        toggleSidebar,
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
