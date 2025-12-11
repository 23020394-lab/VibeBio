'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function logAnalyticsEvent(
  userId: string,
  type: 'page_view' | 'link_click',
  meta: any = {}
) {
  const supabase = await createClient()
  const headersList = await headers()

  // Simple visitor ID based on IP + User Agent (Not perfect, but good enough for MVP privacy-friendly tracking)
  const ip = headersList.get('x-forwarded-for') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'
  const visitorId = Buffer.from(`${ip}-${userAgent}`).toString('base64')

  try {
    await supabase.from('analytics').insert({
      user_id: userId,
      type,
      meta,
      visitor_id: visitorId
    })
  } catch (error) {
    console.error('Failed to log analytics:', error)
  }
}
