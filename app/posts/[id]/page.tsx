import { PostDetailClient } from "./post-detail-client"

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PostDetailClient id={id} />
}
