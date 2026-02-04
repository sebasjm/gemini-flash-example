
import { useState, useEffect } from 'preact/hooks';
import { 
  LayoutDashboard, 
  Package, 
  BookOpen, 
  Plus, 
  ChevronRight, 
  Store,
  Menu,
  X,
  Share2,
  Settings as SettingsIcon,
  MapPin
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Product, Category, Catalog, ViewState, AppState, StorageLocation } from './types';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import CatalogList from './components/CatalogList';
import CatalogDetail from './components/CatalogDetail';
import PublicCatalogView from './components/PublicCatalogView';
import Settings from './components/Settings';
import LocationManager from './components/LocationManager';
import LocationDetail from './components/LocationDetail';

const STORAGE_KEY = 'merchant_hub_data';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Stationery & Supplies', description: 'Essential office consumables', parentId: null, createdAt: Date.now() },
  { id: '2', name: 'Technology', description: 'Office hardware and gadgets', parentId: null, createdAt: Date.now() },
  { id: '3', name: 'Furniture', description: 'Desks, chairs, and storage solutions', parentId: null, createdAt: Date.now() }
];

const DEFAULT_LOCATIONS: StorageLocation[] = [
  { id: '1', name: 'Main Warehouse', description: 'Bulk storage and distribution hub', createdAt: Date.now() },
  { id: '2', name: 'Retail Store A', description: 'Front-facing customer showroom', createdAt: Date.now() }
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Premium Ballpoint Pens (12pk)', sku: 'OFF-PEN-01', upc: '072512234511', description: 'Smooth-writing black ink pens with ergonomic grip.', imageUrls: ['https://picsum.photos/seed/pen1/800', 'https://picsum.photos/seed/pen1b/800', 'https://picsum.photos/seed/pen1c/800'], categoryId: '1', storageLocationId: '1', quantity: 150, price: 12.99, createdAt: Date.now() },
  { id: 'p2', name: 'Legal Pad Yellow (5pk)', sku: 'OFF-PAD-02', upc: '072512234522', description: 'Standard ruled 50-sheet pads.', imageUrls: ['https://picsum.photos/seed/pad2/800', 'https://picsum.photos/seed/pad2b/800', 'https://picsum.photos/seed/pad2c/800', 'https://picsum.photos/seed/pad2d/800'], categoryId: '1', storageLocationId: '1', quantity: 85, price: 18.50, createdAt: Date.now() },
  { id: 'p3', name: 'Heavy Duty Desktop Stapler', sku: 'OFF-STP-03', upc: '072512234533', description: 'Reliable all-metal construction.', imageUrls: ['https://picsum.photos/seed/stapler/800', 'https://picsum.photos/seed/staplerb/800', 'https://picsum.photos/seed/staplerc/800'], categoryId: '1', storageLocationId: '1', quantity: 40, price: 22.95, createdAt: Date.now() },
  { id: 'p11', name: 'Ergonomic Mesh Task Chair', sku: 'OFF-CHR-11', upc: '072512234611', description: 'Breathable mesh back with lumbar support.', imageUrls: ['https://picsum.photos/seed/chair/800', 'https://picsum.photos/seed/chairb/800', 'https://picsum.photos/seed/chairc/800', 'https://picsum.photos/seed/chaird/800', 'https://picsum.photos/seed/chaire/800'], categoryId: '3', storageLocationId: '2', quantity: 12, price: 199.00, tag: 'Best Seller', tagColor: '#4f46e5', createdAt: Date.now() },
  { id: 'p12', name: '27-inch 4K UHD Monitor', sku: 'OFF-MON-12', upc: '072512234622', description: 'Crystal clear resolution.', imageUrls: ['https://picsum.photos/seed/monitor/800', 'https://picsum.photos/seed/monitorb/800', 'https://picsum.photos/seed/monitorc/800'], categoryId: '2', storageLocationId: '2', quantity: 6, price: 349.50, tag: 'Staff Pick', tagColor: '#f59e0b', createdAt: Date.now() }
];

const App = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      products: INITIAL_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      storageLocations: DEFAULT_LOCATIONS,
      catalogs: [],
      activeCatalogId: null,
      activeLocationId: null,
      currentView: 'dashboard'
    };
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setView = (view: ViewState) => setState(prev => ({ ...prev, currentView: view }));
  const navigateToCatalog = (id: string) => setState(prev => ({ ...prev, currentView: 'catalog-detail', activeCatalogId: id }));
  const navigateToLocation = (id: string) => setState(prev => ({ ...prev, currentView: 'location-detail', activeLocationId: id }));

  const updateProducts = (products: Product[]) => setState(prev => ({ ...prev, products }));
  const updateCatalogs = (catalogs: Catalog[]) => setState(prev => ({ ...prev, catalogs }));
  const updateCategories = (categories: Category[]) => setState(prev => ({ ...prev, categories }));
  const updateLocations = (storageLocations: StorageLocation[]) => setState(prev => ({ ...prev, storageLocations }));

  const renderContent = () => {
    switch (state.currentView) {
      case 'dashboard': return <Dashboard state={state} onNavigate={setView} />;
      case 'inventory': return <ProductList products={state.products} categories={state.categories} storageLocations={state.storageLocations} setProducts={updateProducts} setCategories={updateCategories} />;
      case 'catalogs': return <CatalogList catalogs={state.catalogs} products={state.products} setCatalogs={updateCatalogs} onViewCatalog={navigateToCatalog} />;
      case 'catalog-detail':
        const activeCat = state.catalogs.find(c => c.id === state.activeCatalogId);
        if (!activeCat) return null;
        return <CatalogDetail catalog={activeCat} allProducts={state.products} onUpdate={(updated) => updateCatalogs(state.catalogs.map(c => c.id === updated.id ? updated : c))} onUpdateProducts={updateProducts} onBack={() => setView('catalogs')} onPreview={() => setView('public-view')} />;
      case 'public-view':
        const publicCat = state.catalogs.find(c => c.id === state.activeCatalogId);
        if (!publicCat) return null;
        return <PublicCatalogView catalog={publicCat} products={state.products.filter(p => publicCat.productIds.includes(p.id))} categories={state.categories} storageLocations={state.storageLocations} onBack={() => setView('catalog-detail')} />;
      case 'locations': return <LocationManager locations={state.storageLocations} onUpdate={updateLocations} onSelectLocation={navigateToLocation} />;
      case 'location-detail':
        const activeLoc = state.storageLocations.find(l => l.id === state.activeLocationId);
        if (!activeLoc) return null;
        return <LocationDetail location={activeLoc} products={state.products.filter(p => p.storageLocationId === activeLoc.id)} onBack={() => setView('locations')} />;
      case 'settings': return <Settings />;
      default: return <Dashboard state={state} onNavigate={setView} />;
    }
  };

  if (state.currentView === 'public-view') return renderContent();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md">
        {isSidebarOpen ? <X /> : <Menu />}
      </button>
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <div className="bg-indigo-600 p-2 rounded-lg"><Store className="text-white w-6 h-6" /></div>
          <h1 className="text-xl font-bold text-gray-900">MerchantHub</h1>
        </div>
        <nav className="mt-6 px-4 space-y-1">
          <SidebarLink icon={<LayoutDashboard size={20} />} label={t('Dashboard')} active={state.currentView === 'dashboard'} onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={<Package size={20} />} label={t('Inventory')} active={state.currentView === 'inventory'} onClick={() => { setView('inventory'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={<BookOpen size={20} />} label={t('Catalogs')} active={state.currentView === 'catalogs' || state.currentView === 'catalog-detail'} onClick={() => { setView('catalogs'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={<MapPin size={20} />} label={t('Locations')} active={state.currentView === 'locations' || state.currentView === 'location-detail'} onClick={() => { setView('locations'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={<SettingsIcon size={20} />} label={t('Settings')} active={state.currentView === 'settings'} onClick={() => { setView('settings'); setIsSidebarOpen(false); }} />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
    {icon}
    <span className="font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </button>
);

export default App;
