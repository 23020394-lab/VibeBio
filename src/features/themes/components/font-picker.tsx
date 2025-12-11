'use client'

import { fonts, FontName } from '../utils/fonts'
import { ThemeConfig } from '../types'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProfileStore } from '@/features/profiles/store'

export function FontPicker() {
    const { profile, updateTheme } = useProfileStore()
    const theme = (profile?.theme_config || {}) as ThemeConfig

    const handleFontChange = (value: string) => {
        updateTheme({ font: value as FontName })
    }

    return (
        <div className="space-y-4">
            <Label className="text-base font-semibold">Typography</Label>
            <div className="grid gap-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor="font-select" className="text-sm font-normal text-gray-500">
                        Font Family
                    </Label>
                    <Select value={theme.font || 'Inter'} onValueChange={handleFontChange}>
                        <SelectTrigger className="w-[180px]" id="font-select">
                            <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(fonts).map((fontName) => (
                                <SelectItem key={fontName} value={fontName}>
                                    <span style={{ fontFamily: fonts[fontName as FontName].style.fontFamily }}>
                                        {fontName}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
