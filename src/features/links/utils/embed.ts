export function getEmbedData(url: string): { type: 'youtube' | 'spotify' | null, id: string | null } {
    try {
        const urlObj = new URL(url)

        // YouTube
        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
            let videoId = null
            if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1)
            } else {
                videoId = urlObj.searchParams.get('v')
            }
            if (videoId) return { type: 'youtube', id: videoId }
        }

        // Spotify
        if (urlObj.hostname.includes('spotify.com')) {
            // https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
            const parts = urlObj.pathname.split('/')
            const type = parts[1] // track, album, playlist
            const id = parts[2]

            if (['track', 'album', 'playlist', 'artist'].includes(type) && id) {
                // Spotify embed URL format usually requires reconstruction
                return { type: 'spotify', id: `${type}/${id}` }
            }
        }

    } catch (e) {
        return { type: null, id: null }
    }

    return { type: null, id: null }
}
