import { ThemeConfig } from '../themes/types'

export interface Profile {
    id: string
    updated_at: string | null
    username: string | null
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    theme_config: ThemeConfig | null
    is_admin?: boolean
    is_banned?: boolean
}

export interface ProfileState {
    profile: Profile | null
    isLoading: boolean
    error: string | null
    fetchProfile: () => Promise<void>
    updateProfile: (updates: Partial<Profile>) => Promise<void>
    uploadAvatar: (file: File) => Promise<string | null>
    updateTheme: (config: Partial<ThemeConfig>) => Promise<void>
}
