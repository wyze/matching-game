import { OneThroughTwelve } from './types'

type Props = Record<string, unknown> | never
type EventOptions<P extends Props> = {
  props: P
  callback?: VoidFunction
}
type EventOptionsTuple<P extends Props> = P extends never
  ? [Omit<EventOptions<P>, 'props'>?]
  : [EventOptions<P>]
type Events = { [K: string]: Props }

declare global {
  interface Window {
    plausible?<E extends Events, N extends keyof E>(
      event: string,
      options?: EventOptionsTuple<E[N]>[0]
    ): void
  }
}

export function elapsedTime(start: number, end: number) {
  const elapsed = (end - start) / 1000
  const diff = {
    days: Math.floor(elapsed / 86400),
    hours: Math.floor((elapsed / 3600) % 24),
    minutes: Math.floor((elapsed / 60) % 60),
    seconds: Math.floor(elapsed % 60),
  }

  return `${diff.days}d ${diff.hours}h ${diff.minutes}m ${diff.seconds}s`.replace(
    /(?:0. )+/,
    ''
  )
}

const formatKeyNames = (
  props: Record<string, unknown>
): Record<string, unknown> =>
  Object.keys(props)
    .map((key) => [
      key,
      key.replace(/((^| )(.))/g, (letter) => letter.toUpperCase()),
    ])
    .reduce(
      (acc, [key, formatted]) => ({ ...acc, [formatted]: props[key] }),
      {}
    )

export function log(event: string, props?: Record<string, unknown>) {
  window.plausible?.(
    event,
    props ? { props: formatKeyNames(props) } : undefined
  )
}

export const numbers: OneThroughTwelve[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
]

export function shuffle(array: OneThroughTwelve[]) {
  const shuffled = array.slice()

  for (let i = shuffled.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1))

    // Swap the values
    ;[shuffled[i], shuffled[random]] = [shuffled[random], shuffled[i]]
  }

  return shuffled
}
