'use client'

import { logAnalyticsEvent } from '../actions'
import { ReactNode } from 'react'

interface TrackedLinkProps {
    userId: string
    linkId: string
    url: string
    title: string
    className?: string
    style?: React.CSSProperties
    children: ReactNode
}

export function TrackedLink({ userId, linkId, url, title, className, style, children }: TrackedLinkProps) {
    const handleClick = () => {
        // Fire and forget
        logAnalyticsEvent(userId, 'link_click', {
            link_id: linkId,
            url: url,
            title: title
        })
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            style={style}
            onClick={handleClick}
        >
            {children}
        </a>
    )
}
