import { animated } from 'react-spring'
import { css, styled } from '../stitches.config'

const wiggle = css.keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '85%': { transform: 'rotate(5deg)' },
  '95%': { transform: 'rotate(-5deg)' },
  '100%': { transform: 'rotate(0deg)' },
})

export const Button = styled(animated.button, {
  backgroundColor: '$blueGray700',
  border: '0',
  borderRadius: 4,
  color: '$blueGray200',
  cursor: 'pointer',
  paddingTop: 6,
  paddingBottom: 6,

  ':hover': {
    animation: `${wiggle} .5s`,
  },
})
