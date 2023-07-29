export type CreateCommentInput = {
  videoId: number
  userId: number
  content: string
  parentId?: number
}
