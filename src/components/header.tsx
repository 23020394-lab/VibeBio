import { LogoutButton } from '@/features/auth/components/logout-button'
import { Profile } from '@/features/profiles/types'
import { Button } from '@/components/ui/button'
import { Shield } from 'lucide-react'
import Link from 'next/link'
import { ShareDialog } from '@/features/share/components/share-dialog'

interface HeaderProps {
    profile: Profile | null
}

export function Header({ profile }: HeaderProps) {
    return (
        <header className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {profile?.full_name || 'Viber'}</p>
            </div>
            <div className="flex items-center gap-4">
                <ShareDialog username={profile?.username || ''} />
                {profile?.is_admin && (
                    <Link href="/admin/users">
                        <Button variant="outline" size="sm">
                            <Shield className="w-4 h-4 mr-2" />
                            Admin
                        </Button>
                    </Link>
                )}
                <LogoutButton />
            </div>
        </header>
    )
}

