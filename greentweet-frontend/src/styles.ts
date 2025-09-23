import styled, { createGlobalStyle } from 'styled-components'

export const colors = {
  primary: '#1d9c5a',
  secondary: '#76c893',
  bgDark: '#15211f',
  textLight: '#ffffff',
  textMuted: '#6b7573'
}

export const fonts = {
  texts: '"Inter", sans-serif;',
  titles: '"Roboto", sans-serif;'
}

const GlobalCss = createGlobalStyle`
* {
    margin:0;
    padding: 0;
    box-sizing:border-box;
    font-family: ${fonts.texts};
}

body {
  background: ${colors.bgDark};
  color: ${colors.textLight};
}
`
export const Container = styled.div`
  max-width: 1024px;
  width: 100%;
  margin: 0 auto;
`

export default GlobalCss
