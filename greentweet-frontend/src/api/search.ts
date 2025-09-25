import api from './axios'
import type { SearchResponse } from '../types/Search'

export const searchApi = {
  search: (query: string) =>
    api.get<SearchResponse>('/search/', {
      params: { q: query },
    }),
}
