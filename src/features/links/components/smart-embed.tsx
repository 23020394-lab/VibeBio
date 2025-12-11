import { getEmbedData } from '../utils/embed'

interface SmartEmbedProps {
    url: string
    title: string
}

export function SmartEmbed({ url, title }: SmartEmbedProps) {
    const { type, id } = getEmbedData(url)

    if (!type || !id) return null

    if (type === 'youtube') {
        return (
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-black">
                <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>
        )
    }

    if (type === 'spotify') {
        return (
            <div className="w-[100%] mx-auto sm:w-full h-[83px] rounded-xl overflow-hidden shadow-sm border border-slate-200">
                <iframe
                    src={`https://open.spotify.com/embed/${id}`}
                    className="w-[175%] h-[165px] scale-[0.57] origin-top-left sm:w-full sm:h-full sm:scale-100"
                    frameBorder="0"
                    scrolling="no"
                    style={{ overflow: 'hidden' }}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                />
            </div>
        )
    }

    return null
}
