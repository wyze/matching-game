import { Text } from './Text'
import { styled } from '../stitches.config'

type DifficultyToggleProps = {
  difficulty: 'normal' | 'hard'
  toggle: () => void
}

const Button = styled('span', {
  backgroundColor: '#ffffff',
  borderRadius: 22.5,
  boxShadow: '0 0 2px 0 rgba(10, 10, 10, .29)',
  content: "''",
  left: 2,
  height: 21,
  position: 'absolute',
  top: 2,
  transition: '.2s',
  width: 21,

  variants: {
    difficulty: {
      normal: {},
      hard: {
        left: 'calc(100% - 2px)',
        transform: 'translateX(-100%)',
      },
    },
  },
})

const Checkbox = styled('input', {
  height: 0,
  position: 'absolute',
  visibility: 'hidden',
  width: 0,
})

const Label = styled('label', {
  alignItems: 'center',
  backgroundColor: '$blueGray400',
  borderRadius: 50,
  display: 'flex',
  cursor: 'pointer',
  height: 25,
  justifyContent: 'space-between',
  position: 'relative',
  top: 1,
  transition: 'background-color .2s',
  width: 50,

  [`&:active ${Button}`]: {
    width: 30,
  },

  variants: {
    difficulty: {
      normal: {},
      hard: {
        backgroundColor: '$blueGray700',
      },
    },
  },
})

const Container = styled('span', {
  placeItems: 'center',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 10,
})

export function DifficultyToggle({
  difficulty,
  toggle,
}: DifficultyToggleProps) {
  return (
    <Container>
      <Text>Easy</Text>
      <span>
        <Checkbox
          checked={difficulty === 'hard'}
          onChange={toggle}
          id="difficulty-toggle"
          type="checkbox"
        />
        <Label difficulty={difficulty} htmlFor="difficulty-toggle">
          <Button difficulty={difficulty} />
        </Label>
      </span>
      <Text>Hard</Text>
    </Container>
  )
}
