import styled from 'styled-components'
export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background: var(--bg-dark);
  color: var(--text-light);
  min-height: 100vh;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h1 {
    font-family: 'Azonix', sans-serif;
    color: var(--primary);
  }

  button {
    background: var(--primary);
    border: none;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
`

export const NewTweetWrapper = styled.div`
  background: var(--bg-dark);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`

export const TweetInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #444;
  background: #1e2a28;
  color: var(--text-light);
  resize: vertical;
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`

export const TweetButton = styled.button`
  margin-top: 0.75rem;
  background: var(--primary);
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
`

export const TweetsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const TweetCard = styled.div`
  background: #1e2a28;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
`

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`

export const TweetBody = styled.div`
  flex: 1;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    .author {
      font-weight: bold;
      font-size: 0.95rem;
    }

    .date {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
  }

  p {
    font-size: 0.9rem;
    line-height: 1.3;
  }

  footer {
    margin-top: 0.75rem;
    display: flex;
    gap: 1rem;

    button {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.9rem;

      &:hover {
        color: var(--primary);
      }
    }
  }
`
