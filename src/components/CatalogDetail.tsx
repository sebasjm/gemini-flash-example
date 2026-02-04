
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Eye, Share2, Plus, Trash2, Check, Copy, Facebook, DollarSign, Tag as TagIcon, LayoutGrid } from 'lucide-react';
import { Catalog, Product } from '../types';

interface Props {
  catalog: Catalog;
  allProducts: Product[];
  onUpdate: (c: Catalog) => void;
  onUpdateProducts: (products: Product[]) => void;
  onBack: () => void;
  onPreview: () => void;
}

const CatalogDetail: React.FC<Props> = ({ catalog, allProducts, onUpdate, onUpdateProducts, onBack, onPreview }) => {
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
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors">
          <ArrowLeft size={20} />
          <span>{t('Back to Catalogs')}</span>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={onPreview}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
          >
            <Eye size={18} />
            <span>{t('Customer Preview')}</span>
          </button>
          
          <div className="relative" ref={shareMenuRef}>
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Share2 size={18} />
              <span>{t('Share')}</span>
            </button>
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                <button onClick={handleCopyLink} className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left font-semibold text-gray-700 text-sm">
                  {isCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  {isCopied ? t('Copied!') : t('Copy Link')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{catalog.name}</h2>
        <p className="text-xl text-gray-500 leading-relaxed">{catalog.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">{t('Manage Catalog Products')}</h3>
          
          {catalogProducts.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 text-gray-400 font-medium">
              {t('Add products from your inventory to populate this catalog.')}
            </div>
          ) : (
            <div className="space-y-4">
              {catalogProducts.map(product => (
                <div key={product.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-indigo-200 transition-all">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={product.imageUrls[0] || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-gray-900 truncate mb-2">{product.name}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="Price"
                          className="w-full pl-8 pr-3 py-2 bg-emerald-50 border-none rounded-xl text-sm font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={product.price}
                          onChange={(e) => handleUpdateProductInplace(product.id, { price: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="relative">
                        <TagIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                        <input 
                          type="text" 
                          placeholder="Tag (e.g. 10% Off)"
                          className="w-full pl-8 pr-3 py-2 bg-indigo-50 border-none rounded-xl text-sm font-bold text-indigo-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                          value={product.tag || ''}
                          onChange={(e) => handleUpdateProductInplace(product.id, { tag: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <input 
                      type="color" 
                      className="w-8 h-8 rounded-full cursor-pointer border-none p-0 bg-transparent overflow-hidden" 
                      value={product.tagColor || '#4f46e5'}
                      onChange={(e) => handleUpdateProductInplace(product.id, { tagColor: e.target.value })}
                    />
                    <button 
                      onClick={() => removeProduct(product.id)}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">{t('Inventory Browser')}</h3>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 h-[600px] overflow-y-auto custom-scrollbar">
            {otherProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400 italic">
                {t('No more products available in inventory.')}
              </div>
            ) : (
              <div className="space-y-3">
                {otherProducts.map(product => (
                  <div key={product.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-all group">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={product.imageUrls[0] || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 truncate text-sm">{product.name}</div>
                      <div className="text-emerald-600 font-bold text-xs">${product.price?.toFixed(2) || '0.00'}</div>
                    </div>
                    <button 
                      onClick={() => addProduct(product.id)}
                      className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
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
