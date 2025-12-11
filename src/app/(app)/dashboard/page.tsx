import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/features/auth/components/logout-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileEditor } from '@/features/profiles/components/profile-editor'
import { LinkEditor } from '@/features/links/components/link-editor'
import { ThemePicker } from '@/features/themes/components/theme-picker'
import { MobilePreview } from '@/features/themes/components/mobile-preview'


import { AnalyticsStats } from '@/features/analytics/components/analytics-stats'
import { getAnalyticsSummary } from '@/features/analytics/queries'
import { Header } from '@/components/header' // Assuming Header component is imported from here

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return <div>Please log in</div>
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const stats = await getAnalyticsSummary(user.id)

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Header profile={profile} />


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnalyticsStats {...stats} />
                        <ProfileEditor />
                        <LinkEditor />
                        <ThemePicker />
                    </div>

                    <div className="hidden lg:block">
                        <MobilePreview username={profile.username} />
                    </div>
                </div>
            </div>
        </div>
    )
}
