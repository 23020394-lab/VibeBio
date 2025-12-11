
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { SmartEmbed } from '@/features/links/components/smart-embed'
import { getEmbedData } from '@/features/links/utils/embed'
import { PageViewTracker } from '@/features/analytics/components/page-view-tracker'
import { TrackedLink } from '@/features/analytics/components/tracked-link'
import { getBrandIcon } from '@/features/links/utils/brand-icons'
import { fonts, FontName } from '@/features/themes/utils/fonts'

interface Props {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params
    const supabase = await createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (!profile) {
        return {
            title: 'User Not Found | VibeBio',
            description: 'The requested profile could not be found.',
        }
    }

    const title = `${profile.full_name || username} (@${username}) | VibeBio`
    const description = profile.bio || `Check out ${profile.full_name || username}'s links on VibeBio.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: profile.avatar_url ? [profile.avatar_url] : [],
            type: 'profile',
            username: username,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: profile.avatar_url ? [profile.avatar_url] : [],
        }
    }
}

export default async function PublicProfilePage({ params }: Props) {
    const { username } = await params
    const supabase = await createClient()

    // Fetch profile by username
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (!profile) {
        notFound()
    }

    // Check if user is banned
    if (profile.is_banned) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Suspended</h1>
                    <p className="text-gray-500">
                        This profile has been suspended for violating our terms of service.
                    </p>
                </div>
            </div>
        )
    }



    // Fetch active links
    const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', profile.id)
        .eq('is_active', true)
        .order('position', { ascending: true })

    const theme = profile.theme_config || {
        primaryColor: '#000000',
        backgroundColor: '#ffffff',
        variant: 'light'
    }

    // Quick contrast check for text color (simplified)
    const textColor = theme.variant === 'dark' ? 'text-white' : 'text-gray-900'
    const bioColor = theme.variant === 'dark' ? 'text-gray-300' : 'text-gray-600'
    const borderColor = theme.variant === 'dark' ? 'border-gray-700' : 'border-gray-200'

    // Extendable
    const fontName = (theme.font || 'Inter') as FontName
    const fontConfig = fonts[fontName] || fonts['Inter']

    return (
        <div
            className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 bg-cover bg-center bg-no-repeat bg-fixed ${fontConfig.className}`}
            style={{
                background: theme.backgroundImage ? `url(${theme.backgroundImage})` : theme.backgroundColor,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: theme.backgroundColor // Fallback
            }}
        >
            {/* Background Overlay if image exists */}
            {theme.backgroundImage && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
            )}

            <PageViewTracker userId={profile.id} username={username} />
            <div
                className={`max-w-md w-full space-y-8 p-4 sm:p-8 rounded-3xl shadow-xl transition-colors duration-500 relative z-10`}
                style={{
                    background: theme.variant === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 shadow-lg mb-4" style={{ borderColor: theme.backgroundColor }}>
                        {profile.avatar_url ? (
                            <Image
                                src={profile.avatar_url}
                                alt={profile.full_name || username}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-purple-400 to-pink-500" />
                        )}
                    </div>

                    <h1 className={`text-xl sm:text-2xl font-bold ${textColor}`}>{profile.full_name || username}</h1>
                    <p className={`font-medium opacity-80 ${textColor}`}>@{profile.username}</p>

                    {profile.bio && (
                        <p className={`mt-4 text-center leading-relaxed ${bioColor}`}>
                            {profile.bio}
                        </p>
                    )}
                </div>

                <div className="mt-8 space-y-4">
                    {links && links.length > 0 ? (
                        links.map((link) => {
                            const { type } = getEmbedData(link.url)

                            if (type) {
                                return <SmartEmbed key={link.id} url={link.url} title={link.title} />
                            }

                            return (
                                <TrackedLink
                                    key={link.id}
                                    userId={profile.id}
                                    linkId={link.id}
                                    url={link.url}
                                    title={link.title}
                                    className={`relative block w-full p-3 sm:p-4 flex items-center justify-center gap-2 transition-all group overflow-hidden ${link.is_highlighted ? 'scale-[1.02] font-bold' : 'hover:scale-[1.02]'
                                        }`}
                                    style={{
                                        // Shape
                                        borderRadius: theme.buttonStyle === 'square' ? '0px' : theme.buttonStyle === 'pill' ? '9999px' : '0.75rem',

                                        // Variant Logic
                                        backgroundColor: theme.buttonVariant === 'solid'
                                            ? theme.primaryColor
                                            : link.is_highlighted ? `${theme.primaryColor}10` : 'transparent',

                                        color: theme.buttonVariant === 'solid'
                                            ? theme.backgroundColor // Inverted text for solid
                                            : theme.primaryColor,

                                        border: theme.buttonVariant === 'outline' || theme.buttonVariant === 'shadow'
                                            ? `2px solid ${theme.primaryColor}`
                                            : `2px solid transparent`,

                                        boxShadow: theme.buttonVariant === 'shadow'
                                            ? `4px 4px 0px ${theme.primaryColor}`
                                            : link.is_highlighted
                                                ? `0 0 15px ${theme.primaryColor}40`
                                                : 'none'
                                    }}
                                >
                                    {link.is_highlighted && "⭐ "}
                                    <span className="mr-2">{getBrandIcon(link.url)}</span>
                                    {link.title}
                                </TrackedLink>
                            )
                        })
                    ) : (
                        <div className="p-4 text-center text-gray-400 text-sm">
                            No links yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
