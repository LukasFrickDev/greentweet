import * as S from './styles'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { logout } from '../../store/slices/authSlice'
import axios from 'axios'

interface Tweet {
  id: number
  author: {
    id: number
    name: string
    avatarUrl: string
  }
  content: string
  createdAt: string
  likesCount: number
}

const Feed = () => {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: RootState) => state.auth.token)
  const [newTweet, setNewTweet] = useState('')
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(false)

  // 1) Função que busca tweets
  const fetchTweets = async () => {
    if (!token) {
      dispatch(logout())
      return
    }
    try {
      const res = await axios.get<Tweet[]>('/api/tweets')
      setTweets(
        res.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      )
    } catch {
      dispatch(logout())
    }
  }

  // 2) Chama no mount
  useEffect(() => {
    fetchTweets()
  }, [fetchTweets, token])

  // 3) Ao enviar tweet, re-fetch e/ou prepend
  const handleTweetSubmit = async () => {
    if (!newTweet.trim()) return
    setLoading(true)
    try {
      const res = await axios.post<Tweet>('/api/tweets', { content: newTweet })
      // opcional: inspecione o formato retornado
      console.log('created tweet:', res.data)

      // a) Prepend manual
      setTweets((prev) => [res.data, ...prev])

      // b) OU re-fetch completo (descomente se preferir)
      // await fetchTweets()

      setNewTweet('')
    } catch (err) {
      console.error('Erro ao tweetar:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <S.Container>
      <S.Header>
        <h1>GreenTweet</h1>
        <button onClick={() => dispatch(logout())}>Logout</button>
      </S.Header>

      <S.NewTweetWrapper>
        <S.TweetInput
          placeholder="No que você está pensando?"
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
        />
        <S.TweetButton disabled={loading} onClick={handleTweetSubmit}>
          {loading ? 'Tweetando...' : 'Tweetar'}
        </S.TweetButton>
      </S.NewTweetWrapper>

      <S.TweetsWrapper>
        {tweets &&
          tweets.map((tweet) => (
            <S.TweetCard key={tweet.id}>
              <S.Avatar src={tweet.author.avatarUrl} alt={tweet.author.name} />
              <S.TweetBody>
                <header>
                  <span className="author">{tweet.author.name}</span>
                  <span className="date">
                    {new Date(tweet.createdAt).toLocaleString()}
                  </span>
                </header>
                <p>{tweet.content}</p>
                <footer>
                  <button>Curtir ({tweet.likesCount})</button>
                  <button>Responder</button>
                </footer>
              </S.TweetBody>
            </S.TweetCard>
          ))}
      </S.TweetsWrapper>
    </S.Container>
  )
}

export default Feed
