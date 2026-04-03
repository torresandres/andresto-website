import { headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const requestHeaders = await headers()
  const locale = requestHeaders.get('accept-language')?.split(',')[0]?.substring(0, 2) || 'en'

  return {
    locale,
    messages: (await import(`./locale/${locale}.json`)).default
  }
})