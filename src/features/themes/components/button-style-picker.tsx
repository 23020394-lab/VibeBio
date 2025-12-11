'use client'

import { useProfileStore } from '@/features/profiles/store'
import { Label } from '@/components/ui/label'
import { ThemeConfig } from '../types'
import { Button } from '@/components/ui/button'

export function ButtonStylePicker() {
    const { profile, updateTheme } = useProfileStore()
    const theme = (profile?.theme_config || {}) as ThemeConfig

    // Helpers to update specific fields
    const setShape = (shape: ThemeConfig['buttonStyle']) => updateTheme({ buttonStyle: shape })
    const setVariant = (variant: ThemeConfig['buttonVariant']) => updateTheme({ buttonVariant: variant })

    const currentShape = theme.buttonStyle || 'rounded'
    const currentVariant = theme.buttonVariant || 'solid'

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label className="text-base font-semibold">Button Shape</Label>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShape('square')}
                        className={`h-10 w-full bg-gray-200 border-2 transition-all ${currentShape === 'square' ? 'border-black bg-gray-300' : 'border-transparent'}`}
                        style={{ borderRadius: '0px' }}
                    >
                        Square
                    </button>
                    <button
                        onClick={() => setShape('rounded')}
                        className={`h-10 w-full bg-gray-200 border-2 transition-all ${currentShape === 'rounded' ? 'border-black bg-gray-300' : 'border-transparent'}`}
                        style={{ borderRadius: '0.5rem' }}
                    >
                        Rounded
                    </button>
                    <button
                        onClick={() => setShape('pill')}
                        className={`h-10 w-full bg-gray-200 border-2 transition-all ${currentShape === 'pill' ? 'border-black bg-gray-300' : 'border-transparent'}`}
                        style={{ borderRadius: '9999px' }}
                    >
                        Pill
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <Label className="text-base font-semibold">Button Variant</Label>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => setVariant('solid')}
                        className={`h-10 border-2 transition-all flex items-center justify-center font-medium ${currentVariant === 'solid' ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        Solid
                    </button>
                    <button
                        onClick={() => setVariant('outline')}
                        className={`h-10 border-2 transition-all flex items-center justify-center font-medium ${currentVariant === 'outline' ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        Outline
                    </button>
                    <button
                        onClick={() => setVariant('shadow')}
                        className={`h-10 border-2 transition-all flex items-center justify-center font-medium shadow-lg transform active:scale-95 ${currentVariant === 'shadow' ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        Shadow
                    </button>
                </div>
            </div>
        </div>
    )
}
