
import { useTranslation } from 'react-i18next';
import { AppState, ViewState } from '../types';
import { ShoppingBag, Book, Users, TrendingUp, Package } from 'lucide-react';
import { h } from 'preact';

interface Props {
  state: AppState;
  onNavigate: (view: ViewState) => void;
}

const Dashboard = ({ state, onNavigate }: Props) => {
  const { t } = useTranslation();
  
  const stats = [
    { label: t('Total Products'), value: state.products.length, icon: <ShoppingBag />, color: 'bg-blue-500' },
    { label: t('Live Catalogs'), value: state.catalogs.length, icon: <Book />, color: 'bg-indigo-500' },
    { label: t('Total Views'), value: '1,284', icon: <Users />, color: 'bg-emerald-500' },
    { label: t('Conversion'), value: '4.2%', icon: <TrendingUp />, color: 'bg-amber-500' },
  ];

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">{t('Welcome back, Merchant')}</h2>
        <p class="text-gray-500 mt-2">{t("Here's what's happening with your store today.")}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div class={`${stat.color} p-3 rounded-xl text-white`}>{stat.icon}</div>
            <div>
              <div class="text-sm font-medium text-gray-500">{stat.label}</div>
              <div class="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="text-lg font-bold mb-6">{t('Recent Inventory')}</h3>
            {state.products.length === 0 ? (
              <div class="text-center py-12 text-gray-400">
                <Package size={48} class="mx-auto mb-4 opacity-20" />
                <p>{t('Your inventory is empty.')}</p>
              </div>
            ) : (
              <div class="space-y-4">
                {state.products.slice(0, 5).map(product => (
                  <div key={product.id} class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <img src={product.imageUrls[0] || 'https://via.placeholder.com/100'} alt={product.name} class="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                    <div class="flex-1">
                      <div class="font-medium text-gray-900">{product.name}</div>
                      <div class="text-xs text-gray-500">{state.categories.find(c => c.id === product.categoryId)?.name || t('General')}</div>
                    </div>
                    <div class="text-indigo-600 font-bold text-xs uppercase">{product.sku || 'No SKU'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg text-white">
            <h3 class="text-lg font-bold mb-2">{t('Setup your domain')}</h3>
            <p class="text-indigo-100 text-sm mb-6">{t('Connect your custom domain to create a professional storefront.')}</p>
            <button onClick={() => onNavigate('settings')} class="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-sm hover:bg-indigo-50 transition-colors">{t('Configure Domain')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
