import { createClient } from '@/lib/supabase/server'

export interface AnalyticsSummary {
    totalViews: number
    totalClicks: number
}

export async function getAnalyticsSummary(userId: string): Promise<AnalyticsSummary> {
    const supabase = await createClient()

    // Run in parallel for speed
    const [viewsResponse, clicksResponse] = await Promise.all([
        supabase
            .from('analytics')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('type', 'page_view'),

        supabase
            .from('analytics')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('type', 'link_click')
    ])

    return {
        totalViews: viewsResponse.count || 0,
        totalClicks: clicksResponse.count || 0
    }
}
