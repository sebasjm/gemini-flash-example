
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Hash } from 'lucide-react';
import { StorageLocation, Product } from '../types';

interface Props {
  location: StorageLocation;
  products: Product[];
  onBack: () => void;
}

const LocationDetail: React.FC<Props> = ({ location, products, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{location.name}</h2>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin size={14} />
            <span>{location.description || t('Storage Area')}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <MapPin className="mx-auto text-gray-100 mb-6 opacity-20" size={64} />
            <p className="text-gray-400 font-bold text-xl">{t('No products stored in this location yet.')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Product')}</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('SKU')}</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">{t('Quantity')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                          <img src={product.imageUrls[0] || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-gray-900 text-lg">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="font-mono text-gray-500 text-sm">{product.sku || 'N/A'}</div>
                    </td>
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 text-xl font-black text-indigo-600">
                        <Hash size={20} className="text-gray-300" />
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
