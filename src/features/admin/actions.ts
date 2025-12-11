'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Checks if the current user is an admin
 */
export async function checkIsAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    return !!data?.is_admin
}

/**
 * Bans a user
 */
export async function banUser(userId: string) {
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) {
        throw new Error('Unauthorized')
    }

    const supabase = await createClient()
    const { error } = await supabase
        .from('profiles')
        .update({ is_banned: true })
        .eq('id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/admin/users')
}

/**
 * Unbans a user
 */
export async function unbanUser(userId: string) {
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) {
        throw new Error('Unauthorized')
    }

    const supabase = await createClient()
    const { error } = await supabase
        .from('profiles')
        .update({ is_banned: false })
        .eq('id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/admin/users')
}

/**
 * Gets paginated list of users
 */
export async function getUsers(page = 1, limit = 50) {
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) {
        throw new Error('Unauthorized')
    }

    const supabase = await createClient()
    const start = (page - 1) * limit
    const end = start + limit - 1

    const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false }) // created_at might not exist in all rows if not migrated, warning
        .range(start, end)

    // Fallback sort if created_at missing or just simple fetch
    if (error) {
        // Try simple fetch without order if it failed (e.g. column missing)
        const { data: fallbackData, count: fallbackCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .range(start, end)

        return {
            users: fallbackData || [],
            totalCount: fallbackCount || 0,
            currentPage: page,
            totalPages: Math.ceil((fallbackCount || 0) / limit)
        }
    }

    return {
        users: data || [],
        totalCount: count || 0,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit)
    }
}
