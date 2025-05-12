import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      it: {
        translation: {
          settings: {
            title: 'Impostazioni',
            darkMode: 'Modalità Scura',
            darkModeDesc: 'Attiva/disattiva tema scuro',
            emailNotifications: 'Notifiche Email',
            emailNotificationsDesc: 'Ricevi aggiornamenti e avvisi via email',
            autoPublish: 'Pubblicazione Automatica',
            autoPublishDesc: 'Pubblica automaticamente i contenuti generati',
            language: 'Lingua',
            languageDesc: 'Seleziona la lingua dell\'interfaccia'
          },
          auth: {
            signInWith: 'Accedi con {{provider}}',
            connected: 'Connesso',
            notConnected: 'Non connesso',
            connect: 'Connetti',
            disconnect: 'Disconnetti'
          },
          subscription: {
            title: 'Piani di Abbonamento',
            currentPlan: 'Piano Attuale',
            loading: 'Caricamento in corso...',
            trialDays: '{{days}} giorni di prova gratuita',
            upgrade: 'Upgrade',
            freeTrial: 'Prova Gratuita di {{days}} Giorni'
          }
        }
      },
      en: {
        translation: {
          settings: {
            title: 'Settings',
            darkMode: 'Dark Mode',
            darkModeDesc: 'Toggle dark/light theme',
            emailNotifications: 'Email Notifications',
            emailNotificationsDesc: 'Receive updates and alerts via email',
            autoPublish: 'Auto Publish',
            autoPublishDesc: 'Automatically publish generated content',
            language: 'Language',
            languageDesc: 'Select interface language'
          },
          auth: {
            signInWith: 'Sign in with {{provider}}',
            connected: 'Connected',
            notConnected: 'Not connected',
            connect: 'Connect',
            disconnect: 'Disconnect'
          },
          subscription: {
            title: 'Subscription Plans',
            currentPlan: 'Current Plan',
            loading: 'Loading...',
            trialDays: '{{days}} days free trial',
            upgrade: 'Upgrade',
            freeTrial: '{{days}} Days Free Trial'
          }
        }
      }
    },
    fallbackLng: 'it',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;