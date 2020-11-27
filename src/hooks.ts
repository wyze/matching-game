import { useEffect, useRef } from 'react'

type UseEffect = Parameters<typeof useEffect>

function useFirstMountState(): boolean {
  const isFirst = useRef(true)

  if (isFirst.current) {
    isFirst.current = false

    return true
  }

  return isFirst.current
}

export function useUpdateEffect(effect: UseEffect[0], deps: UseEffect[1]) {
  const isFirstMount = useFirstMountState()

  useEffect(() => {
    if (!isFirstMount) {
      return effect()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
