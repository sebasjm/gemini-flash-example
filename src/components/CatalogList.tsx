
import React, { useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { BookOpen, Plus, Trash2, ArrowRight, X, Sparkles } from 'lucide-react';
import { Catalog, Product } from '../types';
import { generateCatalogSummary } from '../services/geminiService';
import { h } from 'preact';

interface Props {
  catalogs: Catalog[];
  products: Product[];
  setCatalogs: (catalogs: Catalog[]) => void;
  onViewCatalog: (id: string) => void;
}

const CatalogList = ({ catalogs, products, setCatalogs, onViewCatalog }: Props) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('Delete this catalog? Products will remain in inventory.'))) {
      setCatalogs(catalogs.filter(c => c.id !== id));
    }
  };

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">{t('Catalogs')}</h2>
          <p class="text-gray-500">{t('Curate collections for your customers to browse.')}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          <span>{t('New Catalog')}</span>
        </button>
      </div>

      {catalogs.length === 0 ? (
        <div class="bg-white rounded-3xl border border-dashed border-gray-300 py-24 text-center">
          <BookOpen class="text-gray-200 w-24 h-24 mx-auto mb-6" />
          <h3 class="text-2xl font-bold text-gray-900">{t('Start Curating')}</h3>
          <p class="text-gray-500 mt-2 max-w-sm mx-auto">{t('Catalogs help you group related products like "Summer Hits" or "Gifts for Him" to make browsing easy.')}</p>
          <button 
            onClick={() => setIsAdding(true)}
            class="mt-8 px-8 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
          >
            {t('Create Your First Catalog')}
          </button>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalogs.map(catalog => {
            const catalogProducts = products.filter(p => catalog.productIds.includes(p.id));
            const previewImages = catalogProducts.flatMap(p => p.imageUrls).slice(0, 4);

            return (
              <div 
                key={catalog.id} 
                onClick={() => onViewCatalog(catalog.id)}
                class="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col"
              >
                <div class="p-2 grid grid-cols-2 gap-2 h-48">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} class="bg-gray-50 rounded-2xl overflow-hidden relative">
                      {previewImages[i] ? (
                        <img 
                          src={previewImages[i]} 
                          alt="" 
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div class="w-full h-full flex items-center justify-center opacity-10 text-gray-900">
                          <BookOpen size={24} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div class="p-6 flex-1 flex flex-col">
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {catalog.name}
                    </h4>
                    <button 
                      onClick={(e) => handleDelete(catalog.id, e)}
                      class="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p class="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
                    {catalog.description || t("No description provided.")}
                  </p>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div class="text-sm font-medium text-gray-400">
                      {catalog.productIds.length} {t('Products')}
                    </div>
                    <div class="text-indigo-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      <span>{t('View & Share')}</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isAdding && (
        <CatalogForm 
          onClose={() => setIsAdding(false)}
          onSubmit={(newCatalog) => {
            setCatalogs([...catalogs, newCatalog]);
            setIsAdding(false);
          }}
          products={products}
        />
      )}
    </div>
  );
};

interface Props { onClose: () => void, onSubmit: (c: Catalog) => void, products: Product[] }
const CatalogForm = ({ onClose, onSubmit, products }: Props) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAISuggest = async () => {
    if (!name || selectedProducts.length === 0) {
      alert(t('Please enter a name and select at least one product.'));
      return;
    }
    setIsGenerating(true);
    const productNames = products
      .filter(p => selectedProducts.includes(p.id))
      .map(p => p.name);
    const summary = await generateCatalogSummary(name, productNames);
    setDescription(summary);
    setIsGenerating(false);
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 class="text-xl font-bold">{t('New Catalog')}</h3>
          <button onClick={onClose} class="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={24} />
          </button>
        </div>
        
        <form class="p-8 space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            id: Date.now().toString(),
            name,
            description,
            productIds: selectedProducts,
            createdAt: Date.now()
          });
        }}>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">{t('Catalog Name')}</label>
              <input 
                required
                type="text" 
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 placeholder-gray-400"
                placeholder={t('e.g. Summer Collection 2024')}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="text-sm font-semibold text-gray-700">{t('Tagline / Description')}</label>
                <button 
                  type="button"
                  onClick={handleAISuggest}
                  disabled={isGenerating}
                  class="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  {isGenerating ? t('Drafting...') : t('Draft with AI')}
                </button>
              </div>
              <textarea 
                rows={3}
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-gray-900 placeholder-gray-400"
                placeholder={t('Hook your customers with a catchy description...')}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{t('Select Products')}</label>
              {products.length === 0 ? (
                <div class="p-8 bg-gray-50 rounded-2xl text-center text-gray-400 border border-dashed border-gray-200">
                  {t('Add products to your inventory first.')}
                </div>
              ) : (
                <div class="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                  {products.map(product => (
                    <label 
                      key={product.id} 
                      class={`
                        flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                        ${selectedProducts.includes(product.id) ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50 bg-white'}
                      `}
                    >
                      <input 
                        type="checkbox" 
                        class="hidden" 
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => {
                          if (selectedProducts.includes(product.id)) {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                          } else {
                            setSelectedProducts([...selectedProducts, product.id]);
                          }
                        }}
                      />
                      <img src={product.imageUrls[0] || 'https://via.placeholder.com/100'} alt="" class="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-sm text-gray-900 truncate">{product.name}</div>
                        <div class="text-xs text-indigo-600 font-bold uppercase tracking-tighter">{product.sku || 'N/A'}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div class="pt-6 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              class="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors bg-white"
            >
              {t('Cancel')}
            </button>
            <button 
              type="submit"
              disabled={selectedProducts.length === 0}
              class="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
            >
              {t('Create Catalog')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CatalogList;
