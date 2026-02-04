
import React, { useState, useMemo } from 'preact/hooks';
import { useTranslation } from '../react-i18next';
import { 
  ArrowLeft, ShoppingBag, Share2, X, ChevronLeft, ChevronRight, 
  Filter, Search, MapPin, Trash2, Plus, Minus, Check, Copy, Truck, ShoppingCart 
} from 'lucide-preact';
import { Catalog, Product, Category, StorageLocation } from '../types';
import { h, Fragment } from 'preact';

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

interface Props {
  catalog: Catalog;
  products: Product[];
  categories: Category[];
  storageLocations?: StorageLocation[];
  onBack?: () => void;
}

const PublicCatalogView = ({ catalog, products, categories, storageLocations = [], onBack }: Props) => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [activeLocationFilter, setActiveLocationFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState(1); // 1: Review, 2: Address, 3: Summary
  const [shippingAddress, setShippingAddress] = useState({ street: '', city: '', zip: '' });
  const [isCopied, setIsCopied] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = !activeCategoryFilter || p.categoryId === activeCategoryFilter;
      const matchLocation = !activeLocationFilter || p.storageLocationId === activeLocationFilter;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchLocation && matchSearch;
    });
  }, [products, activeCategoryFilter, activeLocationFilter, searchQuery]);

  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredProducts.forEach(p => {
      const catName = categories.find(c => c.id === p.categoryId)?.name || t('General');
      if (!groups[catName]) groups[catName] = [];
      groups[catName].push(p);
    });
    return groups;
  }, [filteredProducts, categories]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { productId: product.id, quantity, product }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    setSelectedProduct(null);
    setIsCartOpen(true);
    setCartStep(1);
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || t('General');

  const handleCopySummary = () => {
    const itemsStr = cart.map(i => `${i.product.name} x${i.quantity} - $${(i.product.price * i.quantity).toFixed(2)}`).join('\n');
    const addressStr = shippingAddress.street ? `\nShipping to: ${shippingAddress.street}, ${shippingAddress.city} ${shippingAddress.zip}` : '';
    const fullSummary = `Order Summary from ${catalog.name}:\n${itemsStr}\nTotal: $${cartTotal.toFixed(2)}${addressStr}`;
    navigator.clipboard.writeText(fullSummary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col text-gray-900 overflow-x-hidden">
      {/* Header */}
      <header class="bg-white border-b border-gray-100 sticky top-0 z-[60] shadow-sm">
        <div class="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div class="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} class="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                <ArrowLeft size={24} />
              </button>
            )}
            <div class="text-2xl font-black italic tracking-tighter text-indigo-600">MERCHANT.SHOWCASE</div>
          </div>
          
          <div class="flex-1 max-w-xl px-8 hidden md:block">
            <div class="relative">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={t('Search products in {{name}}...', { name: catalog.name })}
                class="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-indigo-500/20 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              class="relative p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span class="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
            <button class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              <Share2 size={18} />
              <span class="hidden sm:inline">{t('Share Catalog')}</span>
            </button>
          </div>
        </div>
      </header>

      <div class="flex-1 flex max-w-[1600px] mx-auto w-full">
        {/* Sidebar Filters */}
        <aside class="w-72 border-r border-gray-100 bg-white p-8 hidden lg:block sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <div class="space-y-10">
            <div>
              <div class="flex items-center gap-2 mb-6 text-gray-400 uppercase tracking-[0.2em] font-black text-[10px]">
                <Filter size={14} class="text-indigo-600" />
                <span>{t('Categories')}</span>
              </div>
              <div class="space-y-1">
                <FilterButton active={!activeCategoryFilter} onClick={() => setActiveCategoryFilter(null)} label={t('All Categories')} />
                {categories.map(cat => (
                  <FilterButton key={cat.id} active={activeCategoryFilter === cat.id} onClick={() => setActiveCategoryFilter(cat.id)} label={cat.name} />
                ))}
              </div>
            </div>

            <div>
              <div class="flex items-center gap-2 mb-6 text-gray-400 uppercase tracking-[0.2em] font-black text-[10px]">
                <MapPin size={14} class="text-indigo-600" />
                <span>{t('Locations')}</span>
              </div>
              <div class="space-y-1">
                <FilterButton active={!activeLocationFilter} onClick={() => setActiveLocationFilter(null)} label={t('All Locations')} />
                {storageLocations.map(loc => (
                  <FilterButton key={loc.id} active={activeLocationFilter === loc.id} onClick={() => setActiveLocationFilter(loc.id)} label={loc.name} />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Product Content */}
        <main class="flex-1 p-6 md:p-12">
          {Object.keys(groupedProducts).length === 0 ? (
            <div class="py-24 text-center">
              <div class="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600">
                <ShoppingBag size={48} />
              </div>
              <h3 class="text-2xl font-black mb-4">{t('No matches found')}</h3>
              <p class="text-gray-400 max-w-sm mx-auto">{t('Try adjusting your filters or search terms.')}</p>
            </div>
          ) : (
            <div class="space-y-20">
              {/* Fix: Added explicit type cast to ensure Object.entries results are recognized as typed arrays to avoid "unknown" errors on items.length and items.map. */}
              {(Object.entries(groupedProducts) as [string, Product[]][]).map(([catName, items]) => (
                <section key={catName}>
                  <div class="flex items-center gap-4 mb-10">
                    <h2 class="text-3xl font-black tracking-tighter uppercase italic">{catName}</h2>
                    <div class="flex-1 h-px bg-gray-100"></div>
                    <div class="text-xs font-bold text-gray-300 tracking-widest uppercase">{items.length} {t('Items')}</div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {items.map(product => (
                      <div 
                        key={product.id} 
                        class="group flex flex-col cursor-pointer bg-white p-4 rounded-[40px] border border-transparent hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
                        onClick={() => handleOpenProduct(product)}
                      >
                        <div class="aspect-[4/5] bg-gray-100 rounded-[32px] overflow-hidden relative mb-6 shadow-sm">
                          <img src={product.imageUrls[0]} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          {product.tag && (
                            <div class="absolute top-6 left-6 px-4 py-1.5 rounded-full text-xs font-black text-white shadow-xl" style={{ backgroundColor: product.tagColor || '#4f46e5' }}>
                              {product.tag}
                            </div>
                          )}
                          <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div class="px-6 py-2.5 bg-white rounded-full font-black text-sm shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              {t('Open Gallery')}
                            </div>
                          </div>
                        </div>
                        <div class="px-2">
                          <h3 class="text-xl font-bold mb-1 tracking-tight group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                          <div class="flex items-baseline justify-between gap-4">
                            <div class="text-2xl font-black text-gray-900">${product.price?.toFixed(2)}</div>
                            <div class="text-[10px] font-black text-gray-300 uppercase tracking-widest">SKU: {product.sku || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Product Detail Overlay */}
      {selectedProduct && (
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-xl">
          <div class="bg-white w-full max-w-6xl rounded-[48px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-500 h-full max-h-[90vh]">
            <div class="md:w-[60%] relative bg-gray-50 h-[350px] md:h-auto group">
              {/* Fix: Added explicit cast to Product for selectedProduct to resolve "unknown" errors on imageUrls access. */}
              <img src={(selectedProduct as Product).imageUrls[activeImageIndex]} class="w-full h-full object-contain md:object-cover transition-all duration-500" />
              
              {(selectedProduct as Product).imageUrls.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(p => (p > 0 ? p - 1 : (selectedProduct as Product).imageUrls.length - 1)); }}
                    class="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-all active:scale-90"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(p => (p < (selectedProduct as Product).imageUrls.length - 1 ? p + 1 : 0)); }}
                    class="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-all active:scale-90"
                  >
                    <ChevronRight size={28} />
                  </button>
                  <div class="absolute bottom-8 inset-x-0 flex justify-center gap-2">
                    {(selectedProduct as Product).imageUrls.map((_, i) => (
                      <button key={i} onClick={() => setActiveImageIndex(i)} class={`h-1.5 rounded-full transition-all ${i === activeImageIndex ? 'w-8 bg-indigo-600' : 'w-4 bg-gray-300'}`} />
                    ))}
                  </div>
                </>
              )}

              <button onClick={() => setSelectedProduct(null)} class="md:hidden absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl"><X size={24} /></button>
            </div>
            
            <div class="md:w-[40%] p-8 md:p-16 flex flex-col h-full bg-white">
              <button onClick={() => setSelectedProduct(null)} class="hidden md:flex self-end mb-12 text-gray-300 hover:text-gray-900 transition-colors"><X size={32} /></button>
              <div class="flex-1 overflow-y-auto custom-scrollbar pr-4">
                <div class="text-xs font-black text-indigo-600 mb-4 uppercase tracking-[0.3em]">{getCategoryName(selectedProduct.categoryId)}</div>
                <h2 class="text-4xl lg:text-5xl font-black mb-6 leading-[0.9] tracking-tighter">{selectedProduct.name}</h2>
                <div class="flex flex-wrap items-center gap-3 mb-8">
                  <div class="text-4xl font-black text-gray-900">${selectedProduct.price?.toFixed(2)}</div>
                  {selectedProduct.tag && (
                    <div class="px-4 py-1.5 rounded-full text-sm font-black text-white" style={{ backgroundColor: selectedProduct.tagColor || '#4f46e5' }}>
                      {selectedProduct.tag}
                    </div>
                  )}
                </div>
                <p class="text-lg text-gray-500 leading-relaxed font-medium mb-10">{selectedProduct.description}</p>
              </div>
              
              <div class="pt-8 border-t border-gray-50 flex flex-col gap-4">
                <button 
                  onClick={() => { addToCart(selectedProduct, 1); setSelectedProduct(null); }}
                  class="w-full py-5 border-2 border-indigo-600 text-indigo-600 rounded-3xl font-black text-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  {t('Add to Cart & Continue')}
                </button>
                <button 
                  onClick={() => handleBuyNow(selectedProduct)}
                  class="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
                >
                  {t('Buy Now')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Wizard Overlay */}
      {isCartOpen && (
        <div class="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-12 bg-black/60 backdrop-blur-sm">
          <div class="bg-white w-full max-w-2xl rounded-t-[48px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300 max-h-[95vh]">
            <div class="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 class="text-2xl font-black tracking-tight">{t('Your Cart')}</h3>
                <div class="flex gap-2 mt-2">
                  {[1, 2, 3].map(step => (
                    <div key={step} class={`h-1.5 w-12 rounded-full transition-all ${step <= cartStep ? 'bg-indigo-600' : 'bg-gray-100'}`} />
                  ))}
                </div>
              </div>
              <button onClick={() => setIsCartOpen(false)} class="p-3 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={28} />
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {cart.length === 0 ? (
                <div class="py-20 text-center space-y-4">
                  <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <ShoppingCart size={32} />
                  </div>
                  <h4 class="text-xl font-bold">{t('Empty Cart')}</h4>
                  <p class="text-gray-400">{t('Your cart is lonely. Add some office supplies!')}</p>
                </div>
              ) : (
                <>
                  {cartStep === 1 && (
                    <div class="space-y-6">
                      {cart.map(item => (
                        <div key={item.productId} class="flex items-center gap-6 p-4 bg-gray-50 rounded-3xl group">
                          <img src={item.product.imageUrls[0]} class="w-20 h-20 rounded-2xl object-cover" />
                          <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-gray-900 truncate">{item.product.name}</h4>
                            <div class="text-indigo-600 font-black mt-1">${item.product.price.toFixed(2)}</div>
                          </div>
                          <div class="flex items-center gap-3">
                            <div class="flex items-center bg-white border border-gray-200 rounded-2xl p-1">
                              <button onClick={() => updateCartQuantity(item.productId, -1)} class="p-2 hover:bg-gray-50 rounded-xl text-gray-400"><Minus size={16} /></button>
                              <span class="w-8 text-center font-black">{item.quantity}</span>
                              <button onClick={() => updateCartQuantity(item.productId, 1)} class="p-2 hover:bg-gray-50 rounded-xl text-gray-400"><Plus size={16} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.productId)} class="p-3 text-gray-300 hover:text-red-500 rounded-2xl hover:bg-red-50 transition-all"><Trash2 size={20} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {cartStep === 2 && (
                    <div class="space-y-6 animate-in slide-in-from-right-4 duration-300">
                      <div class="bg-indigo-50 p-6 rounded-3xl flex items-start gap-4 mb-8">
                        <Truck class="text-indigo-600 mt-1" size={24} />
                        <div>
                          <h4 class="font-bold text-indigo-900">{t('Shipping Address')}</h4>
                          <p class="text-sm text-indigo-600/70">{t('We need to know where to send your high-quality supplies!')}</p>
                        </div>
                      </div>
                      <div class="space-y-4">
                        <input 
                          type="text" 
                          placeholder="Street Address" 
                          class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20"
                          value={shippingAddress.street}
                          onChange={e => setShippingAddress({ ...shippingAddress, street: e.currentTarget.value })}
                        />
                        <div class="grid grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="City" 
                            class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20"
                            value={shippingAddress.city}
                            onChange={e => setShippingAddress({ ...shippingAddress, city: e.currentTarget.value })}
                          />
                          <input 
                            type="text" 
                            placeholder="Zip Code" 
                            class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20"
                            value={shippingAddress.zip}
                            onChange={e => setShippingAddress({ ...shippingAddress, zip: e.currentTarget.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {cartStep === 3 && (
                    <div class="space-y-8 animate-in slide-in-from-right-4 duration-300">
                      <div class="text-center">
                        <div class="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check size={40} />
                        </div>
                        <h4 class="text-3xl font-black">{t('Your order is ready!')}</h4>
                        <p class="text-gray-500 mt-2">{t('Review the summary below and share it with the merchant.')}</p>
                      </div>

                      <div class="bg-gray-50 p-8 rounded-[32px] space-y-4">
                        <div class="flex justify-between font-black text-sm uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-4">
                          <span>{t('Summary')}</span>
                          <span>{cart.length} {t('Items')}</span>
                        </div>
                        <div class="space-y-2 py-4">
                          {cart.map(item => (
                            <div key={item.productId} class="flex justify-between items-center text-sm">
                              <span class="font-bold">{item.product.name} <span class="text-gray-400">x{item.quantity}</span></span>
                              <span class="font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div class="flex justify-between items-center pt-4 border-t border-gray-100 text-2xl font-black">
                          <span>{t('Total')}</span>
                          <span class="text-indigo-600">${cartTotal.toFixed(2)}</span>
                        </div>
                        {shippingAddress.street && (
                          <div class="pt-4 text-sm text-gray-500">
                            <div class="font-black uppercase text-[10px] tracking-widest mb-1">{t('Location')}</div>
                            <p>{shippingAddress.street}, {shippingAddress.city} {shippingAddress.zip}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div class="p-8 border-t border-gray-50 bg-white">
                {cartStep === 1 && (
                  <div class="flex items-center gap-6">
                    <div class="flex-1">
                      <div class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t('Total')}</div>
                      <div class="text-3xl font-black text-gray-900">${cartTotal.toFixed(2)}</div>
                    </div>
                    <button 
                      onClick={() => setCartStep(2)}
                      class="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                    >
                      {t('Proceed to Shipping')}
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
                {cartStep === 2 && (
                  <div class="flex gap-4">
                    <button 
                      onClick={() => setCartStep(3)}
                      class="flex-1 py-5 border-2 border-gray-200 text-gray-500 rounded-3xl font-black text-lg hover:bg-gray-50 transition-all"
                    >
                      {t('Skip for now')}
                    </button>
                    <button 
                      onClick={() => setCartStep(3)}
                      disabled={!shippingAddress.street || !shippingAddress.city || !shippingAddress.zip}
                      class="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50"
                    >
                      {t('Finish Order')}
                    </button>
                  </div>
                )}
                {cartStep === 3 && (
                  <div class="flex flex-col gap-4">
                    <button 
                      onClick={handleCopySummary}
                      class="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3"
                    >
                      {isCopied ? <Check size={24} /> : <Share2 size={24} />}
                      {isCopied ? t('Copied!') : t('Share Order')}
                    </button>
                    <button 
                      onClick={() => { setIsCartOpen(false); setCart([]); setCartStep(1); }}
                      class="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors"
                    >
                      {t('Review items')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterButton = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    class={`w-full text-left px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-gray-500 hover:bg-gray-50'}`}
  >
    {label}
  </button>
);

export default PublicCatalogView;
