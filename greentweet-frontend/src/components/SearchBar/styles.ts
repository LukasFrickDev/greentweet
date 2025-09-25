import styled from 'styled-components'
import { colors, fonts } from '../../styles'
import { breakpoints, fontSizes } from '../../styles'
import type { SearchBarProps } from '.'

export const Container = styled.div<{ className?: string } & SearchBarProps>`
  position: relative;
  width: 100%;
  max-width: ${(props: SearchBarProps) => (props.className === 'feed-search' ? '320px' : '240px')};

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 100%;
  }
`

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  border: 1px solid ${colors.textMuted};
  background: ${colors.bgDark};
  color: ${colors.textLight};
  font-family: ${fonts.texts};
  font-size: ${fontSizes.small};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(66, 245, 135, 0.15);
  }

  &::placeholder {
    color: ${colors.textMuted};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  left: 0;
  background: ${colors.bgDark};
  border: 1px solid ${colors.textMuted};
  border-radius: 12px;
  padding: 0.75rem;
  max-height: 320px;
  overflow-y: auto;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  z-index: 25;
`

export const Section = styled.div`
  & + & {
    margin-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 0.75rem;
  }
`

export const SectionTitle = styled.p`
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: ${colors.textMuted};
  font-family: ${fonts.texts};
`

export const ItemButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  border-radius: 8px;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`

export const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  strong {
    font-family: ${fonts.titles};
    font-size: ${fontSizes.small};
    color: ${colors.textLight};
  }

  span {
    font-family: ${fonts.texts};
    font-size: 0.75rem;
    color: ${colors.textMuted};
  }
`

export const EmptyState = styled.p`
  margin: 0;
  font-family: ${fonts.texts};
  font-size: ${fontSizes.small};
  color: ${colors.textMuted};
`

export const LoadingState = styled.p`
  margin: 0;
  font-family: ${fonts.texts};
  font-size: ${fontSizes.small};
  color: ${colors.primary};
`

export const ErrorState = styled.p`
  margin: 0;
  font-family: ${fonts.texts};
  font-size: ${fontSizes.small};
  color: #ff6b6b;
`
