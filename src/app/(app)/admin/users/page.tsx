import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { checkIsAdmin, getUsers } from '@/features/admin/actions'
import { UserList } from '@/features/admin/components/user-list'
import { Users, Shield } from 'lucide-react'

export default async function AdminUsersPage() {
    const isAdmin = await checkIsAdmin()

    if (!isAdmin) {
        redirect('/dashboard')
    }

    const { users, totalCount, currentPage, totalPages } = await getUsers(1, 50)

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Admin Panel</h1>
                        <p className="text-gray-500">Manage users and platform settings</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            User Management
                        </CardTitle>
                        <CardDescription>
                            {totalCount} total users • Page {currentPage} of {totalPages}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserList users={users} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
