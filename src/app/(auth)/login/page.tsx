import { GoogleLoginButton } from '@/features/auth/components/google-login-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-tight">VibeBio</CardTitle>
                    <CardDescription className="text-gray-500">
                        Create your aesthetic bio link in seconds.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <GoogleLoginButton />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <p className="text-center text-xs text-gray-400">
                            By clicking continue, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

