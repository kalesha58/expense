import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      settings: {
        title: 'Settings',
        account: 'Account',
        profile: 'Profile',
        accountSettings: 'Account Settings',
        logout: 'Logout',
        preferences: 'Preferences',
        darkMode: 'Dark Mode',
        notifications: 'Notifications',
        support: 'Support',
        help: 'Help & Support',
        about: 'About',
        version: 'Version',
        copyright: '© 2025 Propel Apps',
      },
    },
  },
  es: {
    translation: {
      settings: {
        title: 'Configuración',
        account: 'Cuenta',
        profile: 'Perfil',
        accountSettings: 'Configuración de la cuenta',
        logout: 'Cerrar sesión',
        preferences: 'Preferencias',
        darkMode: 'Modo oscuro',
        notifications: 'Notificaciones',
        support: 'Soporte',
        help: 'Ayuda y soporte',
        about: 'Acerca de',
        version: 'Versión',
        copyright: '© 2025 Oracle Corporation',
      },
    },
  },
};

const languageCode = Localization.getLocales()[0]?.languageCode || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: languageCode,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 