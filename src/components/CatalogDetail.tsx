
import { useState, useRef, useEffect } from 'preact/hooks';
import { useTranslation } from '../react-i18next';
import { ArrowLeft, Eye, Share2, Plus, Trash2, Check, Copy, Facebook, DollarSign, Tag as TagIcon, LayoutGrid } from 'lucide-react';
import { Catalog, Product } from '../types';
import { h } from 'preact';

interface Props {
  catalog: Catalog;
  allProducts: Product[];
  onUpdate: (c: Catalog) => void;
  onUpdateProducts: (products: Product[]) => void;
  onBack: () => void;
  onPreview: () => void;
}

const CatalogDetail = ({ catalog, allProducts, onUpdate, onUpdateProducts, onBack, onPreview }: Props) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const catalogProducts = allProducts.filter(p => catalog.productIds.includes(p.id));
  const otherProducts = allProducts.filter(p => !catalog.productIds.includes(p.id));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdateProductInplace = (id: string, updates: Partial<Product>) => {
    const updated = allProducts.map(p => p.id === id ? { ...p, ...updates } : p);
    onUpdateProducts(updated);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const addProduct = (id: string) => {
    onUpdate({ ...catalog, productIds: [...catalog.productIds, id] });
  };

  const removeProduct = (id: string) => {
    onUpdate({ ...catalog, productIds: catalog.productIds.filter(pid => pid !== id) });
  };

  return (
    <div class="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div class="flex items-center justify-between">
        <button onClick={onBack} class="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors">
          <ArrowLeft size={20} />
          <span>{t('Back to Catalogs')}</span>
        </button>
        <div class="flex items-center gap-3">
          <button 
            onClick={onPreview}
            class="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
          >
            <Eye size={18} />
            <span>{t('Customer Preview')}</span>
          </button>
          
          <div class="relative" ref={shareMenuRef}>
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Share2 size={18} />
              <span>{t('Share')}</span>
            </button>
            {showShareMenu && (
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                <button onClick={handleCopyLink} class="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left font-semibold text-gray-700 text-sm">
                  {isCopied ? <Check size={16} class="text-emerald-500" /> : <Copy size={16} />}
                  {isCopied ? t('Copied!') : t('Copy Link')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 class="text-4xl font-black text-gray-900 mb-2 tracking-tight">{catalog.name}</h2>
        <p class="text-xl text-gray-500 leading-relaxed">{catalog.description}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <h3 class="text-xl font-bold text-gray-900">{t('Manage Catalog Products')}</h3>
          
          {catalogProducts.length === 0 ? (
            <div class="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 text-gray-400 font-medium">
              {t('Add products from your inventory to populate this catalog.')}
            </div>
          ) : (
            <div class="space-y-4">
              {catalogProducts.map(product => (
                <div key={product.id} class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-indigo-200 transition-all">
                  <div class="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={product.imageUrls[0] || 'https://via.placeholder.com/100'} class="w-full h-full object-cover" />
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="font-black text-gray-900 truncate mb-2">{product.name}</div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div class="relative">
                        <DollarSign size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="Price"
                          class="w-full pl-8 pr-3 py-2 bg-emerald-50 border-none rounded-xl text-sm font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={product.price}
                          onChange={(e) => handleUpdateProductInplace(product.id, { price: parseFloat(e.currentTarget.value) })}
                        />
                      </div>
                      <div class="relative">
                        <TagIcon size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                        <input 
                          type="text" 
                          placeholder="Tag (e.g. 10% Off)"
                          class="w-full pl-8 pr-3 py-2 bg-indigo-50 border-none rounded-xl text-sm font-bold text-indigo-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                          value={product.tag || ''}
                          onChange={(e) => handleUpdateProductInplace(product.id, { tag: e.currentTarget.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 self-end sm:self-center">
                    <input 
                      type="color" 
                      class="w-8 h-8 rounded-full cursor-pointer border-none p-0 bg-transparent overflow-hidden" 
                      value={product.tagColor || '#4f46e5'}
                      onChange={(e) => handleUpdateProductInplace(product.id, { tagColor: e.currentTarget.value })}
                    />
                    <button 
                      onClick={() => removeProduct(product.id)}
                      class="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div class="space-y-6">
          <h3 class="text-xl font-bold text-gray-900">{t('Inventory Browser')}</h3>
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 h-[600px] overflow-y-auto custom-scrollbar">
            {otherProducts.length === 0 ? (
              <div class="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400 italic">
                {t('No more products available in inventory.')}
              </div>
            ) : (
              <div class="space-y-3">
                {otherProducts.map(product => (
                  <div key={product.id} class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-all group">
                    <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={product.imageUrls[0] || 'https://via.placeholder.com/100'} class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-bold text-gray-900 truncate text-sm">{product.name}</div>
                      <div class="text-emerald-600 font-bold text-xs">${product.price?.toFixed(2) || '0.00'}</div>
                    </div>
                    <button 
                      onClick={() => addProduct(product.id)}
                      class="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogDetail;
