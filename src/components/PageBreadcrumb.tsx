
import React from 'react';
import { useSEO } from '@/contexts/SEOContext';
import { ChevronRight, Home, FileText } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const PageBreadcrumb: React.FC = () => {
  const { state } = useSEO();
  const currentPage = state.pages.find(page => page.id === state.currentPageId);

  if (!currentPage) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="flex items-center gap-2">
              <Home size={16} />
              SEO 管理系統
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight size={16} />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2">
              <FileText size={16} />
              {currentPage.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
