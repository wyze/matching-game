import { createStyled } from '@stitches/react'

export const { css, styled } = createStyled({
  tokens: {
    fonts: {
      $system: 'system-ui',
    },
    colors: {
      $blueGray200: '#e2e8f0',
      $blueGray400: '#94a3b8',
      $blueGray500: '#64748b',
      $blueGray700: '#334155',
    },
    fontSizes: {
      $1: '13px',
      $2: '15px',
      $3: '17px',
    },
  },
})
