import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLangState] = useState(
    () => localStorage.getItem('language') || 'en'
  )

  function setLanguage(lang) {
    setLangState(lang)
    localStorage.setItem('language', lang)
  }

  function t(key) {
    return translations[language]?.[key] ?? translations['en']?.[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
