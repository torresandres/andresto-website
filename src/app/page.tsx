import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Center, Title } from '@mantine/core'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}
): Promise<Metadata> {
  const locale = (await params).locale
  const t = await getTranslations({locale, namespace: 'HomePage'})

  return {
    title: t('MetaTitle'),
    description: t('MetaDescription')
  }
}

export default function Home() {
  const t = useTranslations('HomePage')

  return (
    <Center style={{ height: '100vh' }}>
      <Title order={1} fz="6rem">{t('HeroTitle')}</Title>
    </Center>
  )
}