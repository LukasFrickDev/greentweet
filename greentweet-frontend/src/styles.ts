import styled, { createGlobalStyle } from 'styled-components'

export const colors = {
  primary: '#1d9c5a',     // verde principal
  secondary: '#76c893',   // verde claro
  danger: '#c62828',      // vermelho para erros/ações destrutivas
  border: '#ddd',         // bordas neutras
  muted: '#aaa',          // botões desabilitados
  bgDark: '#15211f',      // fundo escuro
  textLight: '#ffffff',   // texto claro
  textMuted: '#6b7573',   // texto secundário
  textDark: '#333'        // texto padrão
}

export const fonts = {
  texts: '"Inter", sans-serif;',
  titles: '"Roboto", sans-serif;'
}

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
}

export const fontSizes = {
  large: '2rem',     // títulos grandes
  medium: '1.5rem',  // subtítulos
  small: '1rem',     // texto padrão

  mobile: {
    large: '1.5rem',
    medium: '1.2rem',
    small: '0.9rem',
  },
  tablet: {
    large: '1.8rem',
    medium: '1.3rem',
    small: '1rem',
  },

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

a.author {
  color: ${colors.primary};
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
`

export const Container = styled.div`
  max-width: 1024px;
  width: 100%;
  margin: 0 auto;
`

export default GlobalCss
