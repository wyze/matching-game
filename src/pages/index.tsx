import { Button, Card, DifficultyToggle, Runtime, Text } from '../components'
import { OneThroughTwelve } from '../types'
import { elapsedTime, log, numbers, shuffle } from '../utils'
import { gameMachine } from '../machines'
import { styled } from '../stitches.config'
import { useCallback, useEffect } from 'react'
import { useMachine } from '@xstate/react'
import { useTransition } from 'react-spring'
import { useUpdateEffect } from '../hooks'
import Confetti from 'react-confetti'
import Head from 'next/head'

type HomeProps = {
  context: {
    available: OneThroughTwelve[]
  }
}

const Background = styled('main', {
  backgroundColor: '$blueGray200',
  display: 'grid',
  gridTemplateColumns: '20vw 1fr 20vw',
  gridTemplateRows: '25vh 1fr 25vh',
  height: '100vh',
  width: '100vw',
})

const Window = styled('div', {
  backgroundColor: '#fafafa',
  border: '1px solid',
  borderColor: '$blueGray400',
  boxShadow: '0 20px 68px $blueGray700',
  borderRadius: 8,
  display: 'grid',
  gap: 10,
  gridColumn: 2,
  gridRow: 2,
  gridTemplateColumns: 'repeat(8, 1fr)',
  gridTemplateRows: 'repeat(3, 1fr)',
  padding: 10,
})

const Stats = styled('div', {
  alignItems: 'center',
  display: 'grid',
  gap: 10,
  gridTemplateRows: 'repeat(7, 1fr)',
  gridRowEnd: 'span 2',
  paddingLeft: 10,
  paddingTop: 10,
  marginBottom: 'auto',
  marginRight: 'auto',
})

const Title = styled('h1', {
  color: '$blueGray700',
  display: 'grid',
  fontFamily: '$system',
  placeItems: 'center',
})

export default function Home(props: HomeProps) {
  const [{ context, matches }, send] = useMachine(gameMachine, props)
  const { available, difficulty, flipped, matched, stats } = context

  const transition = useTransition(!matches('idle'), {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const flip = useCallback(
    (card: number) => {
      send({ card, type: 'FLIP' })
      log('Flip', { card })
    },
    [send]
  )

  const restart = useCallback(() => {
    const { attempts, end, longest, score, start } = stats
    const runtime = elapsedTime(start, end)

    send('RESTART')
    log('Restart', { attempts, difficulty, longest, runtime, score })
  }, [difficulty, send, stats])

  const toggle = useCallback(() => {
    send('TOGGLE')
  }, [send])

  useEffect(() => {
    if (matches('completed')) {
      const { attempts, end, longest, score, start } = stats
      const runtime = elapsedTime(start, end)

      log('Completed', { attempts, difficulty, longest, runtime, score })
    }
  }, [difficulty, matches, stats])

  useEffect(() => {
    if (stats.start > 0) {
      const timeout = setTimeout(() => {
        log('pageview')
      }, 30000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [stats.start])

  useUpdateEffect(() => {
    log('Difficulty', { difficulty })
  }, [difficulty])

  return (
    <>
      <Head>
        <title>Matching Game</title>
        <link rel="icon" href="/favicon.ico" />
        {typeof window === 'undefined' ? null : (
          <script
            async
            defer
            data-domain="matching-game.wyze.dev"
            src="https://plausible.wyze.dev/js/plausible.js"
          ></script>
        )}
      </Head>
      {matches('completed') ? <Confetti recycle={false} /> : null}
      <Background>
        <Stats>
          <DifficultyToggle {...{ difficulty, toggle }} />
          {transition((fade, item) =>
            item ? (
              <>
                <Runtime start={stats.start} end={stats.end} style={fade} />
                <Text style={fade}>Score: {stats.score}</Text>
                <Text style={fade}>Attempts: {stats.attempts}</Text>
                <Text style={fade}>Longest Combo: {stats.longest}</Text>
                <Text style={fade}>Current Combo: {stats.combo}</Text>
                <Button onClick={restart} style={fade}>
                  Restart
                </Button>
              </>
            ) : null
          )}
        </Stats>
        <Title>Matching Game</Title>
        <Window>
          {available.map((text, index) => (
            <Card
              key={`${text}.${index}`}
              flip={flip}
              icon={text}
              index={index}
              state={
                flipped.includes(index)
                  ? 'flipped'
                  : matched.includes(text)
                  ? 'matched'
                  : 'hidden'
              }
            />
          ))}
        </Window>
      </Background>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      context: {
        available: shuffle([...numbers, ...numbers]),
      },
    },
    revalidate: 1,
  }
}
