import { i18n } from '@configs/i18n'
import { ensurePrefix } from '@/utils/string'

// Check if the URL is missing any known locale
export const isUrlMissingLocale = url => {
  return i18n.locales.every(locale => !(url.startsWith(`/${locale}/`) || url === `/${locale}`))
}

// Get the localized URL
export const getLocalizedUrl = (url, languageCode) => {
  if (!url || !languageCode) throw new Error("URL or Language Code can't be empty")

  const isDefaultLocale = languageCode === i18n.defaultLocale

  // Only prefix if it's not the default locale AND the URL is missing a locale
  if (!isDefaultLocale && isUrlMissingLocale(url)) {
    return `/${languageCode}${ensurePrefix(url, '/')}`
  }

  return url
}
