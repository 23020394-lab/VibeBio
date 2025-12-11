import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, MousePointerClick } from 'lucide-react'
import { AnalyticsSummary } from '../queries'

export function AnalyticsStats({ totalViews, totalClicks }: AnalyticsSummary) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Views
                    </CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalViews}</div>
                    <p className="text-xs text-muted-foreground">
                        Lifetime page views
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Clicks
                    </CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalClicks}</div>
                    <p className="text-xs text-muted-foreground">
                        Lifetime link clicks
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
