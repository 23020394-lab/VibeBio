'use client'

import { useEffect, useRef } from 'react'
import { logAnalyticsEvent } from '../actions'

interface PageViewTrackerProps {
  userId: string
  username: string
}

export function PageViewTracker({ userId, username }: PageViewTrackerProps) {
  const hasLogged = useRef(false)

  useEffect(() => {
    if (hasLogged.current) return

    const logView = async () => {
      try {
        await logAnalyticsEvent(userId, 'page_view', {
          path: `/${username}`,
          referrer: document.referrer
        })
        hasLogged.current = true
      } catch (e) {
        console.error(e)
      }
    }

    logView()
  }, [userId, username])

  return null
}
