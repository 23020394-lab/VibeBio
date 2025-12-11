'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Share2, Download, Copy, Check } from 'lucide-react'
import QRCode from 'react-qr-code'

interface ShareDialogProps {
    username: string
}

export function ShareDialog({ username }: ShareDialogProps) {
    const [copied, setCopied] = useState(false)

    // Use window.location only on client
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const profileUrl = `${origin}/${username}`

    const downloadQR = () => {
        const svg = document.getElementById("profile-qr")
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            const pngFile = canvas.toDataURL("image/png")

            const downloadLink = document.createElement("a")
            downloadLink.download = `vibebio-${username}-qr.png`
            downloadLink.href = pngFile
            downloadLink.click()
        }

        img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }

    const copyLink = () => {
        navigator.clipboard.writeText(profileUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share your VibeBio</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-6 py-4">

                    {/* QR Code */}
                    <div className="p-4 bg-white rounded-xl shadow-sm border">
                        <QRCode
                            id="profile-qr"
                            value={profileUrl}
                            size={200}
                            level="H"
                        />
                    </div>

                    <div className="flex gap-2 w-full">
                        <Button className="flex-1" variant="secondary" onClick={downloadQR}>
                            <Download className="w-4 h-4 mr-2" />
                            Save QR
                        </Button>
                        <Button className="flex-1" onClick={copyLink}>
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? "Copied" : "Copy Link"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
