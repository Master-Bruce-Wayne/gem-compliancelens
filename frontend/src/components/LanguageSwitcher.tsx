import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN', nativeLabel: 'English' },
  { code: 'hi', label: 'हि', nativeLabel: 'हिन्दी' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.split('-')[0] ?? 'en';

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          title={lang.nativeLabel}
          aria-label={`Switch to ${lang.nativeLabel}`}
          className={`px-2.5 py-1 rounded-md text-sm font-semibold transition-colors ${
            currentLang === lang.code
              ? 'bg-white shadow-sm text-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
