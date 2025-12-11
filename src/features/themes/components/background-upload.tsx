'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useProfileStore } from '@/features/profiles/store'

export function BackgroundUpload() {
    const { profile, updateTheme } = useProfileStore()
    const [uploading, setUploading] = useState(false)

    const backgroundImage = profile?.theme_config?.backgroundImage

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) return

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${profile?.id}-bg-${Math.random()}.${fileExt}`
            const supabase = createClient()

            // We reuse 'avatars' bucket for now or create a 'backgrounds' bucket?
            // Let's assume 'avatars' is public enough or use a general 'public' bucket if available.
            // For MVP, we stick to 'avatars' to avoid easy RLS issues unless we created a 'backgrounds' bucket.
            // Actually, based on previous context, 'avatars' is the only explicitly mentioned storage bucket.
            // Let's try 'avatars' first.

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

            updateTheme({ backgroundImage: data.publicUrl })
        } catch (error: any) {
            console.error('Background upload error:', error)
            alert('Error uploading background')
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        updateTheme({ backgroundImage: undefined })
    }

    return (
        <div className="space-y-4">
            <Label className="text-base font-semibold">Background Image</Label>

            {backgroundImage ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 group">
                    <Image
                        src={backgroundImage}
                        alt="Background"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Label htmlFor="bg-upload-change" className="cursor-pointer">
                            <Button variant="secondary" size="sm" className="pointer-events-none">
                                <Upload className="w-4 h-4 mr-2" />
                                Change
                            </Button>
                        </Label>
                        <Button variant="destructive" size="sm" onClick={handleRemove}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <Label htmlFor="bg-upload-new" className="cursor-pointer block">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:bg-gray-50 hover:border-gray-300 transition-all text-center">
                        <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                            <ImageIcon className="w-5 h-5 text-gray-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Click to upload background</p>
                        <p className="text-xs text-gray-400 mt-1">Recommended: 1920x1080 (Max 2MB)</p>
                    </div>
                </Label>
            )}

            <Input
                id="bg-upload-new"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
            />
            <Input
                id="bg-upload-change"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
            />
        </div>
    )
}
