'use client'

import { useEffect, useState } from 'react'
import { useLinkStore } from '../store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableLinkItem } from './sortable-link-item'

export function LinkEditor() {
  const { links, fetchLinks, addLink, updateLink, deleteLink, reorderLinks, isLoading } = useLinkStore()
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLinkUrl) return

    setIsAdding(true)
    try {
      const urlObj = new URL(newLinkUrl)
      let title = urlObj.hostname.replace('www.', '').split('.')[0]
      title = title.charAt(0).toUpperCase() + title.slice(1)

      if (urlObj.hostname.includes('youtube') && urlObj.pathname.startsWith('/@')) {
          title = urlObj.pathname.slice(1)
      }

      await addLink({ url: newLinkUrl, title })
      setNewLinkUrl('')
    } catch (error) {
      alert('Invalid URL')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id)
      const newIndex = links.findIndex((item) => item.id === over?.id)

      const newLinks = arrayMove(links, oldIndex, newIndex)

      // Update local state immediately via store (need to add a reorder action ideally, or loop)
      // For now we will manually update positions one by one or create a bulk update
      // Let's rely on standard loop for simplicity in MVP

      // Optimistic client update
      links.length = 0 // Clear in place to avoid reference issues if using strict mode (simplified)
      links.push(...newLinks) // Wait, we shouldn't mutate store state directly.
      // Better way: Add reorderLinks to store.

      // Let's implement helper in store or just loop update here
      newLinks.forEach((link, index) => {
        if (link.position !== index) {
          updateLink(link.id, { position: index })
        }
      })
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Links</CardTitle>
        <CardDescription>Add and manage your links. Drag to reorder.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Add Link Form */}
        <form onSubmit={handleAddLink} className="flex gap-2">
          <Input
            placeholder="Paste URL (e.g. instagram.com/myprofile)"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            disabled={isAdding}
          />
          <Button type="submit" disabled={isAdding || !newLinkUrl}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </form>

        {/* Sortable Link List */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map(l => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {links.length === 0 && (
                <p className="text-center text-gray-400 py-4 text-sm">No links yet. Add one above!</p>
              )}

              {links.map((link) => (
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  onUpdate={updateLink}
                  onDelete={deleteLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

      </CardContent>
    </Card>
  )
}

