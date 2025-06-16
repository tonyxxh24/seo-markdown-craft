
import React from 'react';
import { SEOProvider } from '@/contexts/SEOContext';
import { ImportExport } from '@/components/ImportExport';
import { BlockList } from '@/components/BlockList';
import { PageSidebar } from '@/components/PageSidebar';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { SidebarProvider } from '@/components/ui/sidebar';

export const SEOApp: React.FC = () => {
  return (
    <SEOProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <PageSidebar />
        
        <div className="flex-1 flex flex-col">
          <PageBreadcrumb />
          
          <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Import/Export Section */}
              <div className="mb-8">
                <ImportExport />
              </div>

              {/* Blocks Section */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                <BlockList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SEOProvider>
  );
};
