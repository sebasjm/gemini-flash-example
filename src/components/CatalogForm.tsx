
import { Sparkles, X } from 'lucide-preact';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useTranslation } from '../react-i18next';
import { generateCatalogSummary } from '../services/geminiService';
import { Catalog, Product } from '../types';


interface Props { onClose: () => void, onSubmit: (c: Catalog) => void, products: Product[] }

export const CatalogForm = ({ onClose, onSubmit, products }: Props) => {
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
                onChange={e => setName(e.currentTarget.value)}
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
                onChange={e => setDescription(e.currentTarget.value)}
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

export default CatalogForm;
