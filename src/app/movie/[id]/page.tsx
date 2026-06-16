import MediaDetailsView from '@/components/MediaDetailsView'

interface MoviePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  const mediaId = parseInt(id)

  return (
    <MediaDetailsView
      mediaId={mediaId}
      mediaType="movie"
    />
  )
}
