import { OneThroughTwelve } from './types'
import { assign, createMachine } from 'xstate'
import { numbers, shuffle } from './utils'

type GameContext = {
  available: OneThroughTwelve[]
  difficulty: 'normal' | 'hard'
  flipped: [number, number]
  matched: number[]
  stats: {
    attempts: number
    combo: number
    end: number
    longest: number
    score: number
    start: number
  }
}

const context: GameContext = {
  available: [],
  difficulty: 'normal',
  flipped: [-1, -1],
  matched: [],
  stats: {
    attempts: 0,
    combo: 0,
    end: 0,
    longest: 0,
    score: 0,
    start: 0,
  },
}

type FlipEvent = {
  card: number
  type: 'FLIP'
}

export const gameMachine = createMachine<GameContext>({
  id: 'game',
  initial: 'idle',
  context,
  states: {
    idle: {
      on: {
        FLIP: {
          actions: assign<GameContext, FlipEvent>({
            flipped: (_, event) => [event.card, -1],
            stats: ({ stats }) => ({
              ...stats,
              start: performance.now(),
            }),
          }),
          target: 'matching',
        },
        TOGGLE: {
          actions: assign<GameContext>({
            difficulty: ({ difficulty }) =>
              difficulty === 'normal' ? 'hard' : 'normal',
          }),
        },
      },
    },
    selecting: {
      on: {
        FLIP: {
          actions: assign<GameContext, FlipEvent>({
            flipped: (_, event) => [event.card, -1],
          }),
          target: 'matching',
        },
      },
    },
    matching: {
      on: {
        FLIP: {
          actions: assign<GameContext, FlipEvent>({
            flipped: ({ flipped: [flipped] }, event) => [flipped, event.card],
            stats: ({ stats }) => ({ ...stats, attempts: stats.attempts + 1 }),
          }),
          target: 'comparing',
        },
      },
    },
    comparing: {
      after: {
        500: [
          {
            cond: (context) => context.matched.length === 11,
            target: 'completed',
          },
          { target: 'selecting' },
        ],
      },
      exit: assign<GameContext>(
        ({
          available,
          difficulty,
          flipped: [first, second],
          matched,
          stats,
        }) => {
          const isMatch = available[first] === available[second]
          const isHard = difficulty === 'hard'

          const combo = isMatch ? stats.combo + 1 : 0
          const longest = Math.max(stats.longest, combo)
          const score = Math.max(
            0,
            (isHard ? (isMatch ? 0 : -10) : 0) + stats.score + combo * 10
          )

          return {
            flipped: [-1, -1],
            matched: isMatch
              ? [...matched, available[first]]
              : isHard
              ? matched.slice(0, -1)
              : matched,
            stats: { ...stats, combo, longest, score },
          }
        }
      ),
    },
    completed: {
      entry: assign<GameContext>({
        stats: ({ stats }) => ({ ...stats, end: performance.now() }),
      }),
    },
  },
  on: {
    RESTART: {
      actions: assign({
        ...context,
        available: () => shuffle([...numbers, ...numbers]),
        difficulty: ({ difficulty }) => difficulty,
      }),
      target: 'idle',
    },
  },
})
