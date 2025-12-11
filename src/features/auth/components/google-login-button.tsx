'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Chrome } from 'lucide-react'

export function GoogleLoginButton() {
    const handleLogin = async () => {
        const supabase = createClient()

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/api/auth/callback`,
            },
        })
    }

    return (
        <Button
            variant="outline"
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2"
        >
            <Chrome className="w-4 h-4" />
            Login with Google
        </Button>
    )
}
