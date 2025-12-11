import { ThemeConfig } from './types'

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'minimal',
    variant: 'light',
    primaryColor: '#1a1a1a',
    backgroundColor: '#ffffff',
    buttonStyle: 'rounded'
  },
  {
    id: 'dark_mode',
    variant: 'dark',
    primaryColor: '#ffffff',
    backgroundColor: '#0f172a', // Slate 900
    buttonStyle: 'rounded'
  },
  {
    id: 'forest',
    variant: 'light',
    primaryColor: '#14532d', // Green 900
    backgroundColor: '#f0fdf4', // Green 50
    buttonStyle: 'pill'
  },
  {
    id: 'ocean',
    variant: 'light',
    primaryColor: '#1e3a8a', // Blue 900
    backgroundColor: '#eff6ff', // Blue 50
    buttonStyle: 'square'
  },
  {
    id: 'sunset',
    variant: 'dark',
    primaryColor: '#ffffff',
    backgroundColor: 'linear-gradient(to bottom right, #f97316, #db2777)', // Orange to Pink
    buttonStyle: 'pill'
  },
  {
    id: 'galaxy',
    variant: 'dark',
    primaryColor: '#e0e7ff',
    backgroundColor: 'linear-gradient(to bottom, #0f172a, #312e81, #581c87)', // Slate to Indigo to Purple
    buttonStyle: 'rounded'
  },
  {
    id: 'cotton_candy',
    variant: 'light',
    primaryColor: '#db2777', // Pink 600
    backgroundColor: 'linear-gradient(135deg, #ecfdf5, #fff1f2, #eff6ff)', // Mint to Rose to Blue
    buttonStyle: 'rounded'
  },
  {
    id: 'neon',
    variant: 'dark',
    primaryColor: '#a3e635', // Lime 400
    backgroundColor: '#000000',
    buttonStyle: 'square'
  }
]
