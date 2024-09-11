import { useState, useEffect, useRef, useCallback } from 'react'

const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t

const MouseFollow: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [targetPosition, setTargetPosition] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [scale, setScale] = useState(0) // Add state for scale

  const animationFrameRef = useRef<number | null>(null)
  const delay = 0.15 // Adjust this value for more/less delay

  const animate = useCallback(() => {
    setMousePosition((prev) =>
      prev
        ? {
            x: lerp(prev.x, targetPosition.x, delay),
            y: lerp(prev.y, targetPosition.y, delay),
          }
        : { x: targetPosition.x, y: targetPosition.y }
    )

    // Smoothly interpolate the scale
    setScale((prev) => lerp(prev, isVisible ? 1 : 0, delay))

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [targetPosition, isVisible])

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animate])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setTargetPosition({ x: e.clientX, y: e.clientY })
    setIsVisible(true)
  }, [])

  const handleMouseOut = useCallback(() => {
    setIsVisible(false)
  }, [])

  // const handleMouseEnterButton = useCallback((e: MouseEvent) => {
  //   if (e.currentTarget instanceof HTMLButtonElement) {
  //     setScale(2)
  //   }
  // }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseOut)
    // window.addEventListener('mouseenter', handleMouseEnterButton)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', handleMouseOut)
    }
  }, [handleMouseMove, handleMouseOut])

  return (
    <div
      style={{
        position: 'absolute',
        left: mousePosition?.x ?? 0,
        top: mousePosition?.y ?? 0,
        transform: `translate(-50%, -50%) scale(${scale})`, // Apply interpolated scale
        backdropFilter: 'invert(1)',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        pointerEvents: 'none',
        transition: 'opacity 0.5s ease-out',
        opacity: isVisible ? 1 : 0,
        zIndex: 99999,
      }}
    />
  )
}

export default MouseFollow
