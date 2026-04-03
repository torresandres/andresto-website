import { DEFAULT_THEME, MantineTheme } from '@mantine/core'

export const theme: MantineTheme = {
  ...DEFAULT_THEME,
  primaryColor: 'grape',
  fontFamily: 'var(--font-roboto)',
  fontFamilyMonospace: 'var(--font-roboto-mono)',
  headings: {
    fontFamily: 'inherit',
    fontWeight: '500',
    textWrap: 'wrap',
    sizes: DEFAULT_THEME.headings.sizes,
  },
  other: {
    defaultColorScheme: 'dark',
  }
}