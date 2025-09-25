import styled from 'styled-components'
import { colors } from '../../styles'
import { breakpoints } from '../../styles'
import { fontSizes } from '../../styles'
import { fonts } from '../../styles'

export const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  background: ${colors.bgDark};
  color: ${colors.textLight};
  min-height: 100vh;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  h1 {
    margin: 0;
    font-family: 'Azonix', sans-serif;
    color: ${colors.primary};
    font-size: ${fontSizes.large};

    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.large};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.large};
    }
  }

  .logout-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: ${colors.textLight};
    font-size: ${fontSizes.small};
    padding: 0.45rem 0.85rem;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: ${colors.primary};
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;

    h1 {
      flex: 0 1 auto;
      text-align: left;
    }

    .logout-btn {
      order: 1;
      margin-left: auto;
    }
  }
`

export const SearchWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    order: 2;
    justify-content: center;
    gap: 0.75rem;
  }
`

export const Content = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const NewTweetWrapper = styled.div`
  background: #1e2a28;
  border: 1px solid ${colors.textMuted};
  border-radius: 8px;
  padding: 1rem;
`

export const FeedFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  flex-wrap: wrap;
`

export const FilterButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 0.4rem 1.2rem;
  color: ${colors.textLight};
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  font-size: ${fontSizes.small};

  &:hover {
    border-color: ${colors.primary};
    color: ${colors.primary};
  }

  &.active {
    background: ${colors.primary};
    border-color: ${colors.primary};
    color: ${colors.textLight};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
    padding: 0.35rem 1rem;
  }
`

export const TweetInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${colors.textMuted};
  background: #1e2a28;
  color: ${colors.textLight};
  resize: vertical;
  font-size: ${fontSizes.small};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: ${fontSizes.tablet.small};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const FooterNewTweet = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

`

export const UploadControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`

export const UploadButton = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 1.1rem;
  border: 1px dashed ${colors.primary};
  border-radius: 999px;
  color: ${colors.primary};
  font-size: ${fontSizes.small};
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  &:hover {
    background: rgba(29, 156, 90, 0.15);
    border-color: ${colors.primary};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const RemoveImageButton = styled.button`
  border: 1px solid ${colors.danger};
  background: transparent;
  color: ${colors.danger};
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  font-size: ${fontSizes.small};
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;

  &:hover {
    background: ${colors.danger};
    color: ${colors.textLight};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const UploadHint = styled.span`
  display: block;
  margin-top: 0.4rem;
  color: ${colors.textMuted};
  font-size: ${fontSizes.mobile.small};

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const ImageError = styled.span`
  display: block;
  margin-top: 0.35rem;
  color: ${colors.danger};
  font-size: ${fontSizes.small};
`

export const ImagePreview = styled.div`
  margin-top: 0.75rem;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const TweetButton = styled.button`
  margin-top: 2rem;
  background: ${colors.primary};
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
  font-size: ${fontSizes.small};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const FollowInfo = styled.div`
  display: flex;
  gap: 1rem;
  font-size: ${fontSizes.small};

  button {
    background: transparent;
    border: none;
    color: ${colors.textLight};
    font-family: ${fonts.texts};
    font-size: inherit;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s ease;

    &:hover {
      color: ${colors.primary};
    }

    strong {
      color: ${colors.primary};
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};

    button {
      gap: 0.25rem;
    }
  }
`

export const TweetsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const LoadMoreButton = styled.button`
  align-self: center;
  margin-top: 0.5rem;
  background: transparent;
  border: 1px solid ${colors.primary};
  color: ${colors.primary};
  padding: 0.5rem 1.4rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: ${fontSizes.small};
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${colors.primary};
    color: ${colors.textLight};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const TagFilterBanner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.primary};
  border-radius: 8px;
  background: rgba(29, 156, 90, 0.12);
  font-size: ${fontSizes.small};

  strong {
    color: ${colors.primary};
  }

  button {
    background: transparent;
    border: 1px solid ${colors.primary};
    color: ${colors.primary};
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    cursor: pointer;
    font-size: ${fontSizes.small};
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: ${colors.primary};
      color: ${colors.textLight};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: ${fontSizes.mobile.small};

    button {
      align-self: stretch;
      text-align: center;
    }
  }
`

export const Aside = styled.aside`
  background: #1e2a28;
  border: 1px solid ${colors.textMuted};
  border-radius: 8px;
  padding: 1rem;
  height: fit-content;

  @media (max-width: ${breakpoints.mobile}) {
    order: -1;
  }
`

export const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  a {
    text-decoration: none;
  }

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${colors.primary};
  }

  h2 {
    margin: 0.75rem 0;
    font-size: ${fontSizes.medium};
    color: ${colors.textLight};
  
    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.medium};
    }


    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.medium};
    }
  }

  p {
    font-size: ${fontSizes.small};
    color: ${colors.textMuted};
    margin-bottom: 0.75rem;

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }
`

export const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  gap: 0rem;
`

export const TagsSection = styled.div`
  margin-top: 1.5rem;

  h3 {
    margin: 0 0 0.75rem;
    color: ${colors.primary};
    font-size: ${fontSizes.medium};

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.medium};
    }
  }
`

export const TagList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const TagButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
  cursor: pointer;
  color: ${colors.textLight};
  font-family: ${fonts.texts};
  font-size: ${fontSizes.small};
  transition: background 0.2s, border-color 0.2s;

  span {
    font-weight: 600;
  }

  strong {
    color: ${colors.primary};
    font-size: ${fontSizes.small};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: ${colors.primary};
  }
`

export const TagInfo = styled.p`
  margin: 0;
  font-family: ${fonts.texts};
  font-size: ${fontSizes.small};
  color: ${colors.textMuted};

  &.error {
    color: #ff6b6b;
  }
`

export const Notifications = styled.div`
  margin-top: 1.5rem;

  h3 {
    margin-bottom: 0.75rem;
    color: ${colors.primary};
    font-size: ${fontSizes.medium};

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.medium};
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  li {
    font-size: ${fontSizes.small};
    padding: 0.5rem;
    border-radius: 4px;
    background: #1e2a28;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }

  li:hover {
    background: #263632;
  }

  li.unread {
    font-weight: bold;
    border: 1px solid ${colors.primary};
    color: ${colors.textLight};
  }

  li.read {
    border: 1px solid ${colors.textMuted};
    color: ${colors.textMuted};
    font-weight: normal;
  }
`

export const SeeMoreButton = styled.button`
  margin-top: 0.75rem;
  background: transparent;
  border: none;
  color: ${colors.primary};
  cursor: pointer;
  font-size: ${fontSizes.small};
  text-align: left;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`