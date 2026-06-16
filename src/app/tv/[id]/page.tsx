import MediaDetailsView from '@/components/MediaDetailsView'

interface TvPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TvPage({ params }: TvPageProps) {
  const { id } = await params
  const mediaId = parseInt(id)

  return (
    <MediaDetailsView
      mediaId={mediaId}
      mediaType="tv"
    />
  )
}
