
import React from 'preact/hooks';
import { useTranslation } from '../react-i18next';
import { ArrowLeft, MapPin, Hash } from 'lucide-preact';
import { StorageLocation, Product } from '../types';
import { h } from 'preact';

interface Props {
  location: StorageLocation;
  products: Product[];
  onBack: () => void;
}

const LocationDetail = ({ location, products, onBack }: Props) => {
  const { t } = useTranslation();

  return (
    <div class="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div class="flex items-center gap-4">
        <button onClick={onBack} class="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">{location.name}</h2>
          <div class="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin size={14} />
            <span>{location.description || t('Storage Area')}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <div class="py-24 text-center">
            <MapPin class="mx-auto text-gray-100 mb-6 opacity-20" size={64} />
            <p class="text-gray-400 font-bold text-xl">{t('No products stored in this location yet.')}</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Product')}</th>
                  <th class="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('SKU')}</th>
                  <th class="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">{t('Quantity')}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.id} class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                          <img src={product.imageUrls[0] || 'https://via.placeholder.com/100'} class="w-full h-full object-cover" />
                        </div>
                        <div class="font-bold text-gray-900 text-lg">{product.name}</div>
                      </div>
                    </td>
                    <td class="px-8 py-5 whitespace-nowrap">
                      <div class="font-mono text-gray-500 text-sm">{product.sku || 'N/A'}</div>
                    </td>
                    <td class="px-8 py-5 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-2 text-xl font-black text-indigo-600">
                        <Hash size={20} class="text-gray-300" />
                        {product.quantity}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetail;
