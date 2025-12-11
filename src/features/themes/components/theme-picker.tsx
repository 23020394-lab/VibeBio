'use client'

import { useProfileStore } from '@/features/profiles/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { THEME_PRESETS } from '../presets'
import { Check } from 'lucide-react'
import { DEFAULT_THEME } from '../types'
import { FontPicker } from './font-picker'
import { ButtonStylePicker } from './button-style-picker'
import { BackgroundUpload } from './background-upload' // Import
import { Label } from '@/components/ui/label'

export function ThemePicker() {
    const { profile, updateTheme } = useProfileStore()

    if (!profile) return null

    const currentTheme = profile.theme_config || DEFAULT_THEME

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize your public profile look.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-8">
                    <FontPicker />
                    <ButtonStylePicker />
                    <BackgroundUpload />
                </div>

                <div className="space-y-4">
                    <Label className="text-base font-semibold">Theme Colors</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {THEME_PRESETS.map((preset) => {
                            const isSelected = profile.theme_config?.id === preset.id // Simplified check
                            // In reality user might have custom colors, so exact ID match is best effort for presets

                            return (
                                <button
                                    key={preset.id}
                                    onClick={() => updateTheme(preset)}
                                    className={`group relative aspect-square rounded-xl border-2 transition-all overflow-hidden ${isSelected ? 'border-black ring-2 ring-black ring-offset-2' : 'border-transparent hover:border-gray-200'}`}
                                >
                                    {/* Preview Visualization */}
                                    <div
                                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4"
                                        style={{ background: preset.backgroundColor }}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full border-2"
                                            style={{ borderColor: preset.variant === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}
                                        />
                                        <div
                                            className="w-16 h-2 rounded-full"
                                            style={{ backgroundColor: preset.primaryColor }}
                                        />
                                        <div
                                            className="w-10 h-2 rounded-full opacity-50"
                                            style={{ backgroundColor: preset.primaryColor }}
                                        />
                                    </div>

                                    {/* Label */}
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm text-xs font-medium text-center truncate">
                                        {preset.id.replace('_', ' ').toUpperCase()}
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-2 right-2 bg-black text-white rounded-full p-1 shadow-md">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
