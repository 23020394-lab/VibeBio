import { LogoutButton } from '@/features/auth/components/logout-button'
import { Profile } from '@/features/profiles/types'
import { Button } from '@/components/ui/button'
import { Shield, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { ShareDialog } from '@/features/share/components/share-dialog'

interface HeaderProps {
    profile: Profile | null
}

export function Header({ profile }: HeaderProps) {
    return (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {profile?.full_name || 'Viber'}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <Button variant="default" size="sm" className="block sm:hidden" asChild>
                    <Link href={`/${profile?.username}`} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live
                    </Link>
                </Button>

                <div className="hidden sm:block">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/${profile?.username}`} target="_blank">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Profile
                        </Link>
                    </Button>
                </div>

                <ShareDialog username={profile?.username || ''} />
                {profile?.is_admin && (
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/users">
                            <Shield className="w-4 h-4 mr-2" />
                            Admin
                        </Link>
                    </Button>
                )}
                <LogoutButton />
            </div>
        </header>
    )
}

