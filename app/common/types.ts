export type FavoriteStatus = 'added' | 'removed'
export type SortType = 'asc' | 'desc'

export type PaginatedFilters = {
  singleActress?: boolean
  tags?: string[]
}

export type PaginatedSorts = {
  code?: SortType
  createdAt?: SortType
  updatedAt?: SortType
  releaseDate?: SortType
  likes?: SortType
  views?: SortType
  viewsInDay?: SortType
  viewsInWeek?: SortType
  viewsInMonth?: SortType
}

export type PaginatedOptionList = {
  page: number
  limit: number
  filters: PaginatedFilters
  sorts: PaginatedSorts
}

/**
 * Inputs
 */
export type CreateCommentInput = {
  videoId: number
  userId: number
  content: string
  parentId?: number
}
