"use client"

import * as React from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckIcon, DownloadIcon } from "lucide-react"

export interface QRCodeResult {
  data: string
  size: number
  output: string 
}

type QRCodeDisplayProps = {
  data?: QRCodeResult | null
  isLoading?: boolean
  error?: string | null
}

export function QRCodeDisplay({ data, isLoading, error }: QRCodeDisplayProps) {
  const [downloading, setDownloading] = React.useState(false)
  const [downloaded, setDownloaded] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)

  const resetTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const request = React.useRef<AbortController | null>(null)
  React.useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    request.current?.abort()
  }, [])

  const handleDownload = async () => {
    if (!data?.output) return
    setDownloading(true)
    setLocalError(null)
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    try {
      const response = await fetch(data.output, { signal: controller.signal })
      if (!response.ok) throw new Error("Download failed")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "qrcode.png"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDownloaded(true)
      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setDownloaded(false), 1200)
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return
      setLocalError("No se pudo descargar. Inténtalo de nuevo.")
    } finally {
      if (!controller.signal.aborted) setDownloading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>QR Code</CardTitle>
        <CardDescription>
          {data?.data
            ? data.data.length > 50
              ? `${data.data.slice(0, 50)}...`
              : data.data
            : "Vista previa de código QR"}
        </CardDescription>
      </CardHeader>

      {/* Loading */}
      {isLoading && (
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-full max-w-[300px] aspect-square rounded-lg bg-muted animate-pulse motion-reduce:animate-none" />
          <div className="h-4 w-28 bg-muted rounded animate-pulse motion-reduce:animate-none" />
          <Button disabled className="w-full">
            Descargar PNG
          </Button>
        </CardContent>
      )}

      {/* Error */}
      {!isLoading && error && (
        <CardContent>
          <div className="text-sm text-red-600" role="status" aria-live="assertive">
            {error}
          </div>
        </CardContent>
      )}

      {/* Empty */}
      {!isLoading && !error && !data && (
        <CardContent className="text-sm text-muted-foreground">
          Todavía no hay una imagen para mostrar.
        </CardContent>
      )}

      {/* Data */}
      {!isLoading && !error && !localError && data && (
        <CardContent className="flex flex-col items-center gap-4">
          <div
            className="w-full rounded-lg bg-white p-4"
            style={{ maxWidth: `${data.size}px` }}
          >
            <Image
              unoptimized
              src={data.output}
              alt={
                data.data.length > 50
                  ? `QR code for '${data.data.slice(0, 50)}...'`
                  : `QR code for '${data.data}'`
              }
              width={data.size}
              height={data.size}
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
            />
          </div>
          <div className="text-sm text-muted-foreground">Tamaño: {data.size}px</div>
          {localError && <p role="alert" className="text-sm text-destructive">{localError}</p>}
          <Button
            onClick={handleDownload}
            disabled={downloading || !data.output}
            className="w-full"
            aria-busy={downloading}
            aria-live="polite"
            aria-label={
              downloaded
                ? "QR code saved"
                : downloading
                ? "Downloading QR code"
                : "Download QR code as PNG"
            }
          >
            {downloaded ? (
              <>
                <CheckIcon className="mr-1.5" />
                Guardado
              </>
            ) : (
              <>
                <DownloadIcon className="mr-1.5" />
                {downloading ? "Descargando..." : "Descargar PNG"}
              </>
            )}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

export default QRCodeDisplay
