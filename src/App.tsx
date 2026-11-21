/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProcessingLinePage } from './pages/ProcessingLinePage';
import { ProcessingLineDetailPage } from './pages/ProcessingLineDetailPage';
import { EquipmentsPage } from './pages/EquipmentsPage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { PROCESSING_LINES } from './data/processingLinesData';

const PageContent: React.FC = () => {
  const { currentPath } = useRouter();

  const renderActivePage = () => {
    // Admin Console
    if (currentPath === '/admin') {
      return <AdminPage />;
    }

    // Check if navigating to a specific processing line detail page
    if (currentPath.startsWith('/products/processing-line/') || currentPath.startsWith('/processing-line/')) {
      const slug = currentPath
        .replace('/products/processing-line/', '')
        .replace('/processing-line/', '')
        .split('/')[0];
      const matchedLine = PROCESSING_LINES.find((line) => line.slug === slug);
      if (matchedLine) {
        return <ProcessingLineDetailPage line={matchedLine} />;
      }
      return <ProcessingLinePage />;
    }

    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/about':
        return <AboutPage />;
      case '/products/processing-line':
      case '/processing-line':
        return <ProcessingLinePage />;
      case '/products/equipments':
      case '/equipments':
        return <EquipmentsPage />;
      case '/services':
        return <ServicesPage />;
      case '/gallery':
        return <GalleryPage />;
      case '/contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-sage/20 selection:text-ink">
      {/* Global Header & Navigation Structure (Present on all pages) */}
      <Navbar />

      {/* Dedicated Page Content */}
      <main className="flex-1">
        {renderActivePage()}
      </main>

      {/* Global Minimalist Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <PageContent />
    </RouterProvider>
  );
}
