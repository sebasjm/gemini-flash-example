
import React, { useState } from 'preact/hooks';
import { useTranslation } from '../react-i18next';
import { BookOpen, Plus, Trash2, ArrowRight, X, Sparkles } from 'lucide-react';
import { Catalog, Product } from '../types';
import { generateCatalogSummary } from '../services/geminiService';
import { h } from 'preact';
import CatalogForm from './CatalogForm';

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

export default CatalogList;
