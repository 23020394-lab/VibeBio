'use client'

import { useEffect, useState } from 'react'
import { useProfileStore } from '../store'
import { AvatarUpload } from './avatar-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export function ProfileEditor() {
    const { profile, fetchProfile, updateProfile, isLoading } = useProfileStore()
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        bio: '',
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                username: profile.username || '',
                bio: profile.bio || '',
            })
        }
    }, [profile])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            await updateProfile(formData)
            alert('Profile updated!')
        } catch (error) {
            alert('Error updating profile')
        } finally {
            setIsSaving(false)
        }
    }

    if (!profile && isLoading) return <div>Loading profile...</div>

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Customize your public appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <AvatarUpload
                    uid={profile?.id || ''}
                    url={profile?.avatar_url || null}
                    onUpload={(url) => updateProfile({ avatar_url: url })}
                />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="unique_username"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullname">Display Name</Label>
                        <Input
                            id="fullname"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            placeholder="Your Name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell the world about your vibe..."
                        />
                    </div>

                    <Button type="submit" disabled={isSaving || isLoading}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
