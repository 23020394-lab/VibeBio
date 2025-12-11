'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Ban, CheckCircle, Shield, ShieldAlert } from 'lucide-react'
import { banUser, unbanUser } from '../actions'

interface User {
    id: string
    full_name: string | null
    username: string | null
    avatar_url: string | null
    is_admin: boolean
    is_banned: boolean
}

interface UserListProps {
    users: User[] // Using strict typing based on SQL
}

export function UserList({ users: initialUsers }: UserListProps) {
    const [users, setUsers] = useState(initialUsers)
    const [isLoading, setIsLoading] = useState<string | null>(null)

    const handleBan = async (userId: string) => {
        try {
            setIsLoading(userId)
            await banUser(userId)
            setUsers(users.map(u => u.id === userId ? { ...u, is_banned: true } : u))
        } catch (error: any) {
            alert(error.message)
        } finally {
            setIsLoading(null)
        }
    }

    const handleUnban = async (userId: string) => {
        try {
            setIsLoading(userId)
            await unbanUser(userId)
            setUsers(users.map(u => u.id === userId ? { ...u, is_banned: false } : u))
        } catch (error: any) {
            alert(error.message)
        } finally {
            setIsLoading(null)
        }
    }

    return (
        <div className="space-y-4">
            {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>{user.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{user.full_name || 'Vibe User'}</h3>
                                {user.is_admin && <Badge variant="secondary" className="gap-1"><Shield className="w-3 h-3" /> Admin</Badge>}
                                {user.is_banned && <Badge variant="destructive" className="gap-1"><Ban className="w-3 h-3" /> Banned</Badge>}
                            </div>
                            <p className="text-sm text-gray-500">@{user.username || 'unknown'}</p>
                        </div>
                    </div>

                    {!user.is_admin && (
                        <div className="flex items-center gap-2">
                            {user.is_banned ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUnban(user.id)}
                                    disabled={isLoading === user.id}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Unban
                                </Button>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <ShieldAlert className="w-4 h-4 mr-2" />
                                            Ban User
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Ban this user?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will prevent the user from accessing their profile and dashboard.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-600 hover:bg-red-700"
                                                onClick={() => handleBan(user.id)}
                                            >
                                                {isLoading === user.id ? 'Banning...' : 'Yes, Ban User'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
