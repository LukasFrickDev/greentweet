import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultAvatar from '../../assets/logo.png'
import { searchApi } from '../../api/search'
import type { Post } from '../../types/Post'
import type { Profile } from '../../types/Profile'
import type { SearchResponse } from '../../types/Search'
import * as S from './styles'

const emptyResults: SearchResponse = { users: [], posts: [] }

export type SearchBarProps = {
  onPostSelect?: (post: Post) => void
  placeholder?: string
  className?: string
}

const SearchBar = ({ onPostSelect, placeholder = 'Buscar perfis ou posts...', className }: SearchBarProps) => {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<SearchResponse>(emptyResults)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const hasResults = useMemo(() => results.users.length > 0 || results.posts.length > 0, [results])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const query = term.trim()
    if (!query) {
      setResults(emptyResults)
      setIsLoading(false)
      setError(null)
      return
    }

    if (query.length < 2) {
      setResults(emptyResults)
      return
    }

    let isCurrent = true
    setIsLoading(true)
    setError(null)

    const timeout = window.setTimeout(async () => {
      try {
        const { data } = await searchApi.search(query)
        if (isCurrent) {
          setResults(data)
        }
      } catch {
        if (isCurrent) {
          setError('Não foi possível buscar agora. Tente novamente.')
          setResults(emptyResults)
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }, 400)

    return () => {
      isCurrent = false
      window.clearTimeout(timeout)
    }
  }, [term])

  const handleSelectUser = (profile: Profile) => {
    navigate(`/profile/${profile.username}`)
    setTerm('')
    setResults(emptyResults)
    setIsOpen(false)
  }

  const handleSelectPost = (post: Post) => {
    if (onPostSelect) {
      onPostSelect(post)
    } else {
      navigate(`/profile/${post.author_username}`)
    }
    setTerm('')
    setResults(emptyResults)
    setIsOpen(false)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <S.Container ref={containerRef} className={className}>
      <S.Input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      {isOpen && (
        <S.Dropdown>
          {isLoading && <S.LoadingState>Buscando...</S.LoadingState>}
          {!isLoading && error && <S.ErrorState>{error}</S.ErrorState>}

          {!isLoading && !error && hasResults && (
            <>
              {results.users.length > 0 && (
                <S.Section>
                  <S.SectionTitle>Perfis</S.SectionTitle>
                  {results.users.map((profile) => (
                    <S.ItemButton key={`user-${profile.id}`} onClick={() => handleSelectUser(profile)}>
                      <S.Avatar
                        src={profile.avatar || defaultAvatar}
                        alt={profile.username}
                        onError={(event) => {
                          (event.currentTarget as HTMLImageElement).src = defaultAvatar
                        }}
                      />
                      <S.ItemContent>
                        <strong>@{profile.username}</strong>
                        {(profile.first_name || profile.last_name) && (
                          <span>
                            {[profile.first_name, profile.last_name].filter(Boolean).join(' ')}
                          </span>
                        )}
                      </S.ItemContent>
                    </S.ItemButton>
                  ))}
                </S.Section>
              )}

              {results.posts.length > 0 && (
                <S.Section>
                  <S.SectionTitle>Posts</S.SectionTitle>
                  {results.posts.map((post) => (
                    <S.ItemButton key={`post-${post.id}`} onClick={() => handleSelectPost(post)}>
                      <S.ItemContent>
                        <strong>@{post.author_username}</strong>
                        <span>{post.content.length > 80 ? `${post.content.slice(0, 80)}…` : post.content}</span>
                      </S.ItemContent>
                    </S.ItemButton>
                  ))}
                </S.Section>
              )}
            </>
          )}

          {!isLoading && !error && !hasResults && term.trim().length >= 2 && (
            <S.EmptyState>Nenhum resultado encontrado.</S.EmptyState>
          )}
        </S.Dropdown>
      )}
    </S.Container>
  )
}

export default SearchBar
