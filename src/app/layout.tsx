import { Roboto, Roboto_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core'

import { theme } from '@/app/theme'

import '@mantine/core/styles.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  fallback: ['system-ui', 'arial']
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto-mono',
  fallback: ['monospace']
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html lang={locale} className={`${roboto.variable} ${robotoMono.variable}`} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme={theme.other.defaultColorScheme} />
      </head>
      <body>
        <NextIntlClientProvider>
          <MantineProvider theme={theme} defaultColorScheme={theme.other.defaultColorScheme}>
            {children}
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}