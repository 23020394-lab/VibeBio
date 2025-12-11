import { Inter, Roboto, Poppins, Playfair_Display, Space_Mono } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'], display: 'swap' })
export const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' })
export const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ['latin'], display: 'swap' })
export const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap' })
export const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' })

export const fonts = {
    'Inter': inter,
    'Roboto': roboto,
    'Poppins': poppins,
    'Playfair Display': playfair,
    'Space Mono': spaceMono
}

export type FontName = keyof typeof fonts
