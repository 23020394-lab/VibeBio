'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface AvatarUploadProps {
    uid: string
    url: string | null
    onUpload: (url: string) => void
}

export function AvatarUpload({ uid, url, onUpload }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false)

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${uid}-${Math.random()}.${fileExt}`
            const supabase = createClient()

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            // Get public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

            // Await the callback to handle potential re-thrown errors from updateProfile
            await onUpload(data.publicUrl)
        } catch (error: any) {
            console.error('Avatar upload error:', error)
            alert(error.message || 'Error uploading avatar')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-100">
                {url ? (
                    <Image
                        src={url}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        unoptimized // Bypass Next.js optimization for external URLs for now
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <Upload className="w-8 h-8" />
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Change Avatar'}
                    </div>
                </Label>
                <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                />
            </div>
        </div>
    )
}
