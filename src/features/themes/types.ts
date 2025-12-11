export interface ThemeConfig {
    id: string
    variant: 'light' | 'dark'
    primaryColor: string
    backgroundColor: string
    // Extendable
    font?: 'Inter' | 'Roboto' | 'Poppins' | 'Playfair Display' | 'Space Mono'
    buttonStyle?: 'rounded' | 'square' | 'pill'
    buttonVariant?: 'solid' | 'outline' | 'shadow'
    backgroundImage?: string
    backgroundOverlayOpacity?: number
}

export const DEFAULT_THEME: ThemeConfig = {
    id: 'minimal',
    variant: 'light',
    primaryColor: '#000000',
    backgroundColor: '#ffffff',
    buttonStyle: 'rounded'
}
