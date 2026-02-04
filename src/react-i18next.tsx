export function useTranslation() {
  return {
    t: (t: string, params: Record<string,string> = {}) => t,
    i18n: {
      changeLanguage: (code: string) => {},
      language: "English",
    },
  };
}
