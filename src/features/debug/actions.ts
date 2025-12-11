'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function fixUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: 'No user logged in' }
    }

    try {
        console.log('Attempting to fix profile for:', user.id)

        // 1. Check if exists
        const { data: existing } = await supabase.from('profiles').select('*').eq('id', user.id).single()

        if (existing) {
            console.log('Profile exists:', existing)
            // Force update username if missing
            if (!existing.username) {
                const username = user.email?.split('@')[0] + '_fixed'
                await supabase.from('profiles').update({ username }).eq('id', user.id)
            }
            return { success: true, message: 'Profile already exists (Refreshed)' }
        }

        // 2. Insert if missing
        const username = (user.user_metadata?.user_name || user.email?.split('@')[0] || 'user') + '_' + Math.floor(Math.random() * 1000)

        const { error } = await supabase.from('profiles').insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || 'Vibe User',
            avatar_url: user.user_metadata?.avatar_url,
            username: username,
            bio: 'Ready to vibe!',
            updated_at: new Date().toISOString()
        })

        if (error) {
            console.error('Insert Error:', error)
            return { success: false, message: 'Failed to create profile: ' + error.message }
        }

        revalidatePath('/dashboard')
        return { success: true, message: 'Profile created successfully!' }
    } catch (e: any) {
        return { success: false, message: 'Server Error: ' + e.message }
    }
}
