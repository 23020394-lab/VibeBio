import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Profile, ProfileState } from './types'
import { DEFAULT_THEME, ThemeConfig } from '../themes/types'

export const useProfileStore = create<ProfileState>((set, get) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null })
        const supabase = createClient()

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user logged in')

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            // Handle case where profile doesn't exist yet (PGRST116)
            if (error && error.code === 'PGRST116') {
                const newProfile = {
                    id: user.id,
                    updated_at: null,
                    username: null,
                    full_name: user.user_metadata?.full_name || null,
                    avatar_url: user.user_metadata?.avatar_url || null,
                    bio: null,
                    theme_config: null
                }
                set({ profile: newProfile, isLoading: false })
                return
            }

            if (error) throw error
            set({ profile: data })
        } catch (error: any) {
            set({ error: error.message })
        } finally {
            set({ isLoading: false })
        }
    },

    updateProfile: async (updates) => {
        set({ isLoading: true, error: null })
        const supabase = createClient()

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user logged in')

            // Use upsert to handle both insert and update
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    ...updates,
                    updated_at: new Date().toISOString()
                })

            if (error) throw error

            // Update local state, merging with existing or creating new
            const updatedProfile = get().profile
                ? { ...get().profile!, ...updates }
                : {
                    id: user.id,
                    created_at: new Date().toISOString(),
                    username: null,
                    full_name: null,
                    avatar_url: null,
                    bio: null,
                    theme_config: null,
                    ...updates
                } as Profile

            set({ profile: updatedProfile })
        } catch (error: any) {
            console.error('Update Profile Error:', JSON.stringify(error, null, 2))
            set({ error: error.message || JSON.stringify(error) })
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    uploadAvatar: async (file) => {
        return null
    },

    updateTheme: async (config) => {
        const { profile } = get()
        if (!profile) return

        // Merge deep-ish
        const currentConfig = profile.theme_config || DEFAULT_THEME
        const newConfig = { ...currentConfig, ...config }

        // Optimistic
        set({ profile: { ...profile, theme_config: newConfig } })

        const supabase = createClient()
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ theme_config: newConfig })
                .eq('id', profile.id)

            if (error) throw error
        } catch (error: any) {
            set({ error: error.message })
            // Revert?
        }
    }
}))
