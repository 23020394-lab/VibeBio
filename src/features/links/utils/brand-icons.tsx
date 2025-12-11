import { Facebook, Youtube, Instagram, Twitter, Linkedin, Github, Coffee, DollarSign, Globe, Heart, Music } from 'lucide-react'

export const getBrandIcon = (url: string) => {
    try {
        const hostname = new URL(url).hostname.replace('www.', '')

        if (hostname.includes('facebook') || hostname.includes('fb.com')) return <Facebook className="w-5 h-5" />
        if (hostname.includes('youtube') || hostname.includes('youtu.be')) return <Youtube className="w-5 h-5" />
        if (hostname.includes('instagram')) return <Instagram className="w-5 h-5" />
        if (hostname.includes('twitter') || hostname.includes('x.com')) return <Twitter className="w-5 h-5" />
        if (hostname.includes('linkedin')) return <Linkedin className="w-5 h-5" />
        if (hostname.includes('github')) return <Github className="w-5 h-5" />
        if (hostname.includes('tiktok')) return <Music className="w-5 h-5" />
        
        // Commerce / Support
        if (hostname.includes('buymeacoffee') || hostname.includes('ko-fi')) return <Coffee className="w-5 h-5" />
        if (hostname.includes('paypal') || hostname.includes('patreon')) return <Heart className="w-5 h-5" />

        return <Globe className="w-5 h-5" /> // Default
    } catch (e) {
        return <Globe className="w-5 h-5" />
    }
}
