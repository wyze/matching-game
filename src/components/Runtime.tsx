import { SpringValues } from 'react-spring'
import { Text } from './Text'
import { elapsedTime } from '../utils'
import { useEffect, useState } from 'react'

type RuntimeProps = {
  end: number
  start: number
  style: SpringValues<{
    opacity: number
  }>
}

export function Runtime({ start, end, style }: RuntimeProps) {
  const [, forceRender] = useState(0)

  useEffect(() => {
    if (end === 0) {
      const interval = setInterval(() => forceRender(Math.random()), 1000)

      return () => clearInterval(interval)
    }
  }, [end])

  return (
    <Text style={style}>
      Runtime: {elapsedTime(start, end || performance.now())}
    </Text>
  )
}
