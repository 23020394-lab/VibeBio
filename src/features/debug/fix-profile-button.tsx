'use client'

import { Button } from '@/components/ui/button'
import { fixUserProfile } from './actions'
import { useState } from 'react'

export function FixProfileButton() {
    const [status, setStatus] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const handleFix = async () => {
        setLoading(true)
        const res = await fixUserProfile()
        setStatus(res.message)
        setLoading(false)
        if (res.success) {
            window.location.reload()
        }
    }

    return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg my-4 flex items-center justify-between">
            <div>
                <h3 className="font-bold text-yellow-800">Debug Tool</h3>
                <p className="text-sm text-yellow-700">If your profile is missing, click here to fix it.</p>
                {status && <p className="text-sm font-mono mt-2">{status}</p>}
            </div>
            <Button onClick={handleFix} disabled={loading}>
                {loading ? 'Fixing...' : 'Fix My Profile'}
            </Button>
        </div>
    )
}
