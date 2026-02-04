
import React, { h } from 'preact';
import { useTranslation } from '../react-i18next';
import { Globe, Check } from 'lucide-preact';

const Settings=  () => {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' }
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <div class="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">{t('Settings')}</h2>
        <p class="text-gray-500">{t('Manage your preferences and store configuration.')}</p>
      </div>

      <div class="max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-8 border-b border-gray-50">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Globe size={24} />
            </div>
            <h3 class="text-xl font-bold">{t('Language')}</h3>
          </div>
          
          <p class="text-gray-500 mb-8">{t('Select your preferred language')}</p>

          <div class="grid grid-cols-1 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                class={`
                  flex items-center justify-between p-5 rounded-2xl border transition-all duration-200
                  ${i18n.language.startsWith(lang.code)
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}
                `}
              >
                <span class={`font-bold ${i18n.language.startsWith(lang.code) ? 'text-indigo-700' : 'text-gray-700'}`}>
                  {t(lang.label)}
                </span>
                {i18n.language.startsWith(lang.code) && (
                  <div class="bg-indigo-600 text-white p-1 rounded-full">
                    <Check size={16} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div class="p-8 bg-gray-50/50">
          <p class="text-sm text-gray-400">
            {t('MerchantHub will automatically adapt to your browser language unless manually changed here.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
