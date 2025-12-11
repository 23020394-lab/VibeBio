export interface Link {
  id: string
  user_id: string
  title: string
  url: string
  icon: string | null
  is_active: boolean
  is_highlighted: boolean
  position: number
  created_at: string
}

export interface LinkState {
  links: Link[]
  isLoading: boolean
  error: string | null
  fetchLinks: () => Promise<void>
  addLink: (link: Pick<Link, 'title' | 'url'>) => Promise<void>
  updateLink: (id: string, updates: Partial<Link>) => Promise<void>
  deleteLink: (id: string) => Promise<void>
  reorderLinks: (links: Link[]) => Promise<void>
}
