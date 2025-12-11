import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Link, LinkState } from './types'

export const useLinkStore = create<LinkState>((set, get) => ({
  links: [],
  isLoading: false,
  error: null,

  fetchLinks: async () => {
    set({ isLoading: true, error: null })
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user logged in')

      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true })

      if (error) throw error
      set({ links: data || [] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  addLink: async ({ title, url }) => {
    const supabase = createClient()
    set({ isLoading: true, error: null })
    const { links } = get()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user logged in')

      const newPosition = links.length > 0
        ? Math.max(...links.map(l => l.position)) + 1
        : 0

      const { data, error } = await supabase
        .from('links')
        .insert({
          user_id: user.id,
          title,
          url,
          position: newPosition,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      set({ links: [...links, data] })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateLink: async (id, updates) => {
    const supabase = createClient()
    // Optimistic update
    const { links } = get()
    set({
      links: links.map(l => l.id === id ? { ...l, ...updates } : l)
    })

    try {
      const { error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', id)

      if (error) {
        // Revert on error - simplified for now, ideally fetch fresh state
        throw error
      }
    } catch (error: any) {
      set({ error: error.message })
      // Revert optimistic update
      set({ links })
    }
  },

  deleteLink: async (id) => {
    const supabase = createClient()
    const { links } = get()

    // Optimistic update
    set({ links: links.filter(l => l.id !== id) })

    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error: any) {
      set({ error: error.message })
      set({ links }) // Revert
    }
  },
  reorderLinks: async (newLinks) => {
    // Optimistic update
    set({ links: newLinks })

    const supabase = createClient()

    // Update all positions in DB
    // Ideally use an RPC for atomic update, but loop is fine for MVP small lists

    // We only update items that changed position
    const updates = newLinks.map((link, index) => ({
      id: link.id,
      user_id: link.user_id,
      position: index,
      title: link.title,
      url: link.url
    }))

    try {
      const { error } = await supabase.from('links').upsert(updates)
      if (error) throw error
    } catch (error: any) {
      set({ error: error.message })
      // Revert? (Complex, leaving simple for now)
    }
  }
}))
