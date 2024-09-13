'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'

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
  const [targetPosition, setTargetPosition] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [scale, setScale] = useState(0)
  const [clickScale, setClickScale] = useState(1)
  const [isHoveringButton, setIsHoveringButton] = useState(false)
  const [size, setSize] = useState({ width: 12, height: 12 })
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })

  const delay = 0.15
  const maxScale = 2.5

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
      x: lerp(prev.x, targetPosition.x, delay),
      y: lerp(prev.y, targetPosition.y, delay),
    }))

    setScale((prev) =>
      lerp(
        prev,
        isVisible
          ? Math.min((isHoveringButton ? 2.5 : 1) * clickScale, maxScale)
          : 0,
        delay
      )
    )

    setSize((prev) => {
      const newSize = calculateSizeChange(targetPosition, lastPosition)
      return {
        width: lerp(prev.width, newSize.width, delay),
        height: lerp(prev.height, newSize.height, delay),
      }
    })

    setLastPosition(targetPosition)
  }, [
    targetPosition,
    isVisible,
    lastPosition,
    calculateSizeChange,
    isHoveringButton,
    clickScale,
  ])

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
    setTargetPosition({ x: e.clientX, y: e.clientY })
    setIsVisible(true)
  }, [])

  const handleMouseOut = useCallback(() => {
    setIsVisible(false)
  }, [])

  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName.toLowerCase() === 'button' &&
        !excludeIds.includes(target.id)
      ) {
        setIsHoveringButton(true)
      }
    },
    [excludeIds]
  )

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName.toLowerCase() === 'button' &&
        !excludeIds.includes(target.id)
      ) {
        setIsHoveringButton(false)
      }
    },
    [excludeIds]
  )

  const handleMouseDown = useCallback(() => {
    setClickScale((prevScale) => Math.min(prevScale + 0.5, 1.5))
  }, [])

  const handleMouseUp = useCallback(() => {
    setClickScale(1)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseOut)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseLeave)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', handleMouseOut)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseLeave)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [
    handleMouseMove,
    handleMouseOut,
    handleMouseOver,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  ])

  const style = useMemo(
    () =>
      ({
        position: 'absolute',
        left: mousePosition.x,
        top: mousePosition.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        backdropFilter: 'invert(1)',
        width: size.width,
        height: size.height,
        borderRadius: '50%',
        pointerEvents: 'none',
        transition: 'opacity 0.5s ease-out',
        opacity: isVisible ? 1 : 0,
        zIndex: 99999,
      } as React.CSSProperties),
    [mousePosition, scale, size, isVisible]
  )

  return <div ref={followerRef} style={style} />
}
