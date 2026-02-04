
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Plus, Trash2, ArrowRight, X, Sparkles } from 'lucide-react';
import { Catalog, Product } from '../types';
import { generateCatalogSummary } from '../services/geminiService';

interface Props {
  catalogs: Catalog[];
  products: Product[];
  setCatalogs: (catalogs: Catalog[]) => void;
  onViewCatalog: (id: string) => void;
}

const CatalogList: React.FC<Props> = ({ catalogs, products, setCatalogs, onViewCatalog }) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('Delete this catalog? Products will remain in inventory.'))) {
      setCatalogs(catalogs.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t('Catalogs')}</h2>
          <p className="text-gray-500">{t('Curate collections for your customers to browse.')}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          <span>{t('New Catalog')}</span>
        </button>
      </div>

      {catalogs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 py-24 text-center">
          <BookOpen className="text-gray-200 w-24 h-24 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900">{t('Start Curating')}</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">{t('Catalogs help you group related products like "Summer Hits" or "Gifts for Him" to make browsing easy.')}</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="mt-8 px-8 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
          >
            {t('Create Your First Catalog')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalogs.map(catalog => {
            const catalogProducts = products.filter(p => catalog.productIds.includes(p.id));
            const previewImages = catalogProducts.flatMap(p => p.imageUrls).slice(0, 4);

            return (
              <div 
                key={catalog.id} 
                onClick={() => onViewCatalog(catalog.id)}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col"
              >
                <div className="p-2 grid grid-cols-2 gap-2 h-48">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden relative">
                      {previewImages[i] ? (
                        <img 
                          src={previewImages[i]} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10 text-gray-900">
                          <BookOpen size={24} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {catalog.name}
                    </h4>
                    <button 
                      onClick={(e) => handleDelete(catalog.id, e)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
                    {catalog.description || t("No description provided.")}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="text-sm font-medium text-gray-400">
                      {catalog.productIds.length} {t('Products')}
                    </div>
                    <div className="text-indigo-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
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

const CatalogForm: React.FC<{ onClose: () => void, onSubmit: (c: Catalog) => void, products: Product[] }> = ({ onClose, onSubmit, products }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold">{t('New Catalog')}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={24} />
          </button>
        </div>
        
        <form className="p-8 space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            id: Date.now().toString(),
            name,
            description,
            productIds: selectedProducts,
            createdAt: Date.now()
          });
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('Catalog Name')}</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 placeholder-gray-400"
                placeholder={t('e.g. Summer Collection 2024')}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">{t('Tagline / Description')}</label>
                <button 
                  type="button"
                  onClick={handleAISuggest}
                  disabled={isGenerating}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  {isGenerating ? t('Drafting...') : t('Draft with AI')}
                </button>
              </div>
              <textarea 
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-gray-900 placeholder-gray-400"
                placeholder={t('Hook your customers with a catchy description...')}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Select Products')}</label>
              {products.length === 0 ? (
                <div className="p-8 bg-gray-50 rounded-2xl text-center text-gray-400 border border-dashed border-gray-200">
                  {t('Add products to your inventory first.')}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                  {products.map(product => (
                    <label 
                      key={product.id} 
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                        ${selectedProducts.includes(product.id) ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50 bg-white'}
                      `}
                    >
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => {
                          if (selectedProducts.includes(product.id)) {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                          } else {
                            setSelectedProducts([...selectedProducts, product.id]);
                          }
                        }}
                      />
                      <img src={product.imageUrls[0] || 'https://via.placeholder.com/100'} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">{product.name}</div>
                        <div className="text-xs text-indigo-600 font-bold uppercase tracking-tighter">{product.sku || 'N/A'}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors bg-white"
            >
              {t('Cancel')}
            </button>
            <button 
              type="submit"
              disabled={selectedProducts.length === 0}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
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
