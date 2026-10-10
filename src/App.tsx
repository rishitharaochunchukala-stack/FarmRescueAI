import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import MarketplacePage from '@/pages/MarketplacePage';
import ListProducePage from '@/pages/ListProducePage';
import RescuePage from '@/pages/RescuePage';
import AIPage from '@/pages/AIPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import type { Page, Produce } from '@/types';
import { loadProduce, saveProduce } from '@/lib/produceStorage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [produce, setProduce] = useState<Produce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load persisted listings from the database on startup
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { items, error } = await loadProduce();
      if (cancelled) return;
      if (error) {
        setLoadError(error);
      } else {
        setProduce(items);
      }
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Save a new listing to the database, then add to state on success
  const handleAddProduce = useCallback(
    async (item: Produce): Promise<{ success: boolean; error: string | null }> => {
      const { success, error } = await saveProduce(item);
      if (success) {
        setProduce((prev) => [item, ...prev]);
      }
      return { success, error };
    },
    []
  );

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage produce={produce} />;
      case 'marketplace':
        return <MarketplacePage produce={produce} />;
      case 'list-produce':
        return <ListProducePage onAddProduce={handleAddProduce} />;
      case 'rescue':
        return <RescuePage produce={produce} />;
      case 'ai':
        return <AIPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-gray-400 text-sm">Loading listings...</div>
          </div>
        ) : loadError ? (
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <p className="text-red-600 font-medium mb-2">Could not load listings</p>
            <p className="text-sm text-gray-500">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          renderPage()
        )}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
