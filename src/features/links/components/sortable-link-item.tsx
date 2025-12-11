'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GripVertical, Trash2, ExternalLink, Star } from 'lucide-react'
import { Link } from '../types'

interface SortableLinkItemProps {
    link: Link
    onUpdate: (id: string, updates: Partial<Link>) => void
    onDelete: (id: string) => void
}

export function SortableLinkItem({ link, onUpdate, onDelete }: SortableLinkItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm group hover:border-gray-300 transition-colors"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-move text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 touch-none"
            >
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-2">
                <Input
                    value={link.title}
                    onChange={(e) => onUpdate(link.id, { title: e.target.value })}
                    className="h-8 font-medium border-transparent hover:border-gray-200 focus:border-gray-200 px-2 -ml-2"
                />
                <div className="flex items-center gap-2 text-xs text-gray-500 px-2 -ml-2">
                    <span className="truncate max-w-[200px]">{link.url}</span>
                    <Button variant="ghost" size="icon" className="h-4 w-4" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    className={link.is_highlighted ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50" : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"}
                    onClick={() => onUpdate(link.id, { is_highlighted: !link.is_highlighted })}
                >
                    <Star className={`w-4 h-4 ${link.is_highlighted ? "fill-current" : ""}`} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(link.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
