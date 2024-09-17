'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t

interface MouseFollowerProps {
  excludeIds?: string[]
}

export function MouseFollower({ excludeIds = [] }: MouseFollowerProps) {
  const followerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [state, setState] = useState({
    targetPosition: { x: 0, y: 0 },
    isVisible: false,
    scale: 0,
    clickScale: 1,
    isHoveringButton: false,
    size: { width: 12, height: 12 },
    lastPosition: { x: 0, y: 0 },
  })

  const delay = useRef(0.15).current
  const maxScale = useRef(2.5).current

  const calculateSizeChange = useCallback(
    (current: { x: number; y: number }, last: { x: number; y: number }) => {
      const dx = current.x - last.x
      const dy = current.y - last.y
      const sizeChange = 10

      const newWidth =
        Math.abs(dx) > Math.abs(dy)
          ? 12
          : Math.max(sizeChange, 12 - 0.15 * Math.abs(dy))
      const newHeight =
        Math.abs(dx) > Math.abs(dy)
          ? Math.max(sizeChange, 12 - 0.18 * Math.abs(dx))
          : 12

      return { width: newWidth, height: newHeight }
    },
    []
  )

  const animate = useCallback(() => {
    setMousePosition((prev) => ({
      x: lerp(prev.x, state.targetPosition.x, delay),
      y: lerp(prev.y, state.targetPosition.y, delay),
    }))

    setState((prev) => {
      const newScale = lerp(
        prev.scale,
        state.isVisible
          ? Math.min(
            (state.isHoveringButton ? 2.5 : 1) * state.clickScale,
            maxScale
          )
          : 0,
        delay
      )

      const newSize = calculateSizeChange(
        state.targetPosition,
        state.lastPosition
      )

      return {
        ...prev,
        scale: newScale,
        size: {
          width: lerp(prev.size.width, newSize.width, delay),
          height: lerp(prev.size.height, newSize.height, delay),
        },
        lastPosition: state.targetPosition,
      }
    })
  }, [state, calculateSizeChange, delay, maxScale])

  useEffect(() => {
    let animationFrameId: number

    const animationLoop = () => {
      animate()
      animationFrameId = requestAnimationFrame(animationLoop)
    }

    animationFrameId = requestAnimationFrame(animationLoop)

    return () => cancelAnimationFrame(animationFrameId)
  }, [animate])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setState((prev) => ({
      ...prev,
      targetPosition: { x: e.clientX, y: e.clientY },
      isVisible: true,
    }))
  }, [])

  const handleMouseOut = useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: false }))
  }, [])

  const handleMouseEnterButton = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' && !excludeIds.includes(target.id)) {
        setState((prev) => ({ ...prev, isHoveringButton: true }))
      }
    },
    [excludeIds]
  )

  const handleMouseLeaveButton = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' && !excludeIds.includes(target.id)) {
        setState((prev) => ({ ...prev, isHoveringButton: false }))
      }
    },
    [excludeIds]
  )

  const handleMouseDown = useCallback(() => {
    setState((prev) => ({
      ...prev,
      clickScale: Math.min(prev.clickScale + 0.5, 1.5),
    }))
  }, [])

  const handleMouseUp = useCallback(() => {
    setState((prev) => ({ ...prev, clickScale: 1 }))
  }, [])

  useEffect(() => {
    const handleEvents = () => {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseout', handleMouseOut)
      document.addEventListener('mouseenter', handleMouseEnterButton, true)
      document.addEventListener('mouseleave', handleMouseLeaveButton, true)
      window.addEventListener('mousedown', handleMouseDown)
      window.addEventListener('mouseup', handleMouseUp)
    }

    handleEvents()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mouseenter', handleMouseEnterButton, true)
      document.removeEventListener('mouseleave', handleMouseLeaveButton, true)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [
    handleMouseMove,
    handleMouseOut,
    handleMouseEnterButton,
    handleMouseLeaveButton,
    handleMouseDown,
    handleMouseUp,
  ])

  const style = useMemo(
    () =>
    ({
      position: 'fixed',
      left: mousePosition.x,
      top: mousePosition.y,
      transform: `translate(-50%, -50%) scale(${state.scale})`,
      backdropFilter: 'invert(1)',
      width: state.size.width,
      height: state.size.height,
      borderRadius: '50%',
      pointerEvents: 'none',
      transition: 'opacity 0.5s ease-out',
      zIndex: 99999,
    } as React.CSSProperties),
    [mousePosition, state]
  )

  return <div ref={followerRef} style={style} />
}
