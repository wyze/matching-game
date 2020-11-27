import { Icon } from './Icon'
import { OneThroughTwelve } from '../types'
import { animated, to, useSpring } from 'react-spring'
import { styled } from '../stitches.config'
import { svgs } from '../svgs'
import { useMemo } from 'react'

type CardProps = {
  icon: OneThroughTwelve
  index: number
  flip: (card: number) => void
  state: 'hidden' | 'flipped' | 'matched'
}

type Svgs<Keys extends string> = {
  [Key in Keys]: {
    backgroundImage: string
  }
}

const variants = Object.keys(svgs) as Array<keyof typeof svgs>
const random = () => variants[Math.floor(Math.random() * variants.length)]

const CardContainer = styled('div', {
  border: '1px solid $blueGray500',
  borderRadius: 4,
  overflow: 'hidden',
  position: 'relative',
  transition: 'opacity .2s',

  variants: {
    state: {
      flipped: {},
      hidden: {
        ':hover': {
          cursor: 'pointer',
          opacity: 0.8,
        },
      },
      matched: {},
    },
  },
})

const Animated = styled(animated.div, {
  height: '100%',
  position: 'absolute',
  width: '100%',
  willChange: 'transform, opacity',
})

const CardBackground = styled(Animated, {
  backgroundColor: '#dfdbe5',
  borderRadius: 4,

  variants: {
    svg: variants.reduce(
      (acc, variant) => ({
        ...acc,
        [variant]: { backgroundImage: svgs[variant] },
      }),
      {} as Svgs<keyof typeof svgs>
    ),
  },
})

const CardText = styled(Animated, {
  display: 'grid',
  placeItems: 'center',

  variants: {
    color: {
      1: { color: '#8b5cf6' },
      2: { color: '#3b82f6' },
      3: { color: '#06b6d4' },
      4: { color: '#10b981' },
      5: { color: '#84cc16' },
      6: { color: '#f59e0b' },
      7: { color: '#ef4444' },
      8: { color: '#d946ef' },
      9: { color: '#fbcfe8' },
      10: { color: '#e9d5ff' },
      11: { color: '#c7d2fe' },
      12: { color: '#bae6fd' },
    },
  },
})

export function Card({ icon, index, flip, state }: CardProps) {
  const { transform, opacity } = useSpring({
    opacity: state !== 'hidden' ? 1 : 0,
    transform: `perspective(600px) rotateX(${state !== 'hidden' ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })

  const svg = useMemo(() => random(), [])

  return (
    <CardContainer
      onClick={state === 'hidden' ? () => flip(index) : undefined}
      state={state}
    >
      <CardBackground
        svg={svg}
        style={{ opacity: to(opacity, (o) => 1 - o), transform }}
      />
      <CardText
        style={{
          opacity,
          transform: to(transform, (t) => `${t} rotateX(180deg)`),
        }}
        color={icon}
      >
        <Icon icon={icon} />
      </CardText>
    </CardContainer>
  )
}
