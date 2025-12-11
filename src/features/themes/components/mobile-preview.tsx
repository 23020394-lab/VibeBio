'use client'

import { RotateCw, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

interface MobilePreviewProps {
    username: string
}

export function MobilePreview({ username }: MobilePreviewProps) {
    const [refreshKey, setRefreshKey] = useState(0)

    const refresh = () => setRefreshKey(prev => prev + 1)

    return (
        <div className="sticky top-8">
            <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-sm font-medium text-gray-500">Live Preview</span>
                <Link href={`/${username}`} target="_blank">
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:text-blue-700">
                        Open <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>

                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-gray-800">
                    <iframe
                        key={refreshKey}
                        src={`/${username}`}
                        className="w-full h-full border-none scrollbar-hide"
                        title="Mobile Preview"
                    />
                </div>

                {/* Refresh Button Overlay */}
                <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-4 right-4 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
                    onClick={refresh}
                    title="Refresh Preview"
                >
                    <RotateCw className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
