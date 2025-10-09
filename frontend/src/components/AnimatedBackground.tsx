import React, { useEffect, useRef, useCallback, useState } from 'react'

interface AnimatedBackgroundProps {
  className?: string
}

interface CircuitNode {
  x: number
  y: number
  vx: number
  vy: number
  connections: number[]
  pulse: number
  lastPulse: number
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const nodesRef = useRef<CircuitNode[]>([])
  const timeRef = useRef(0)

  // Initialize circuit nodes
  const initNodes = useCallback((width: number, height: number) => {
    const nodeCount = Math.floor((width * height) / 15000) // Adaptive density
    const nodes: CircuitNode[] = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: [],
        pulse: 0,
        lastPulse: Math.random() * 1000
      })
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 120 && Math.random() < 0.3) {
          nodes[i].connections.push(j)
          nodes[j].connections.push(i)
        }
      }
    }

    nodesRef.current = nodes
  }, [])

  // Draw PCB-like grid
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const gridSize = 40
    const offsetX = (time * 0.1) % gridSize
    const offsetY = (time * 0.05) % gridSize

    ctx.strokeStyle = `rgba(59, 130, 246, ${0.03 + Math.sin(time * 0.001) * 0.01})`
    ctx.lineWidth = 0.5

    // Vertical lines
    for (let x = -offsetX; x < width + gridSize; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = -offsetY; y < height + gridSize; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw grid intersection points
    ctx.fillStyle = `rgba(59, 130, 246, ${0.05 + Math.sin(time * 0.002) * 0.02})`
    for (let x = -offsetX; x < width + gridSize; x += gridSize) {
      for (let y = -offsetY; y < height + gridSize; y += gridSize) {
        if ((x + y) % (gridSize * 4) === 0) {
          ctx.beginPath()
          ctx.arc(x, y, 1, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
  }, [])

  // Draw circuit nodes and connections
  const drawCircuit = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const nodes = nodesRef.current
    const mouse = mouseRef.current

    // Update node positions and pulses
    nodes.forEach((node, i) => {
      // Mouse interaction
      const dx = mouse.x - node.x
      const dy = mouse.y - node.y
      const mouseDistance = Math.sqrt(dx * dx + dy * dy)
      
      if (mouseDistance < 150) {
        const force = (150 - mouseDistance) / 150
        node.vx += (dx / mouseDistance) * force * 0.02
        node.vy += (dy / mouseDistance) * force * 0.02
      }

      // Update position
      node.x += node.vx
      node.y += node.vy
      node.vx *= 0.98 // Friction
      node.vy *= 0.98

      // Boundary collision
      if (node.x < 0 || node.x > width) {
        node.vx *= -0.8
        node.x = Math.max(0, Math.min(width, node.x))
      }
      if (node.y < 0 || node.y > height) {
        node.vy *= -0.8
        node.y = Math.max(0, Math.min(height, node.y))
      }

      // Pulse animation
      if (time - node.lastPulse > 2000 + Math.random() * 3000) {
        node.pulse = 1
        node.lastPulse = time
      }
      node.pulse = Math.max(0, (node.pulse || 0) - 0.02)
    })

    // Draw connections
    ctx.strokeStyle = `rgba(59, 130, 246, 0.1)`
    ctx.lineWidth = 0.5
    nodes.forEach((node, i) => {
      node.connections.forEach(connectionIndex => {
        const connectedNode = nodes[connectionIndex]
        const dx = node.x - connectedNode.x
        const dy = node.y - connectedNode.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 120) {
          const alpha = Math.max(0, 0.1 - distance / 1200)
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(connectedNode.x, connectedNode.y)
          ctx.stroke()
        }
      })
    })

    // Draw nodes
    nodes.forEach((node, i) => {
      // Validate node properties
      const pulse = Math.max(0, Math.min(1, node.pulse || 0))
      const x = isFinite(node.x) ? node.x : 0
      const y = isFinite(node.y) ? node.y : 0
      
      // Node glow effect
      if (pulse > 0) {
        const radius = 15 * pulse
        if (isFinite(radius) && radius > 0) {
          const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, radius
          )
          gradient.addColorStop(0, `rgba(59, 130, 246, ${0.3 * pulse})`)
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Node core
      const nodeSize = 1.5 + pulse * 2
      ctx.fillStyle = `rgba(59, 130, 246, ${0.4 + pulse * 0.6})`
      ctx.beginPath()
      ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
      ctx.fill()

      // Node border
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.6 + pulse * 0.4})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
      ctx.stroke()
    })
  }, [])

  // Draw floating PCB elements
  const drawPCBElements = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const elements = [
      { x: width * 0.2, y: height * 0.3, size: 20, rotation: time * 0.001 },
      { x: width * 0.8, y: height * 0.7, size: 15, rotation: -time * 0.0008 },
      { x: width * 0.6, y: height * 0.2, size: 12, rotation: time * 0.0012 },
      { x: width * 0.3, y: height * 0.8, size: 18, rotation: -time * 0.0006 },
    ]

    elements.forEach((element, i) => {
      ctx.save()
      ctx.translate(element.x, element.y)
      ctx.rotate(element.rotation)
      
      // PCB chip body
      ctx.fillStyle = `rgba(30, 41, 59, ${0.1 + Math.sin(time * 0.003 + i) * 0.05})`
      ctx.fillRect(-element.size / 2, -element.size / 2, element.size, element.size)
      
      // Chip pins
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(time * 0.005 + i) * 0.1})`
      ctx.lineWidth = 1
      for (let j = 0; j < 4; j++) {
        const pinLength = 3
        const pinOffset = element.size / 2 + pinLength
        ctx.beginPath()
        
        switch (j) {
          case 0: // Top
            ctx.moveTo(-element.size / 4, -pinOffset)
            ctx.lineTo(-element.size / 4, -element.size / 2)
            ctx.moveTo(element.size / 4, -pinOffset)
            ctx.lineTo(element.size / 4, -element.size / 2)
            break
          case 1: // Right
            ctx.moveTo(pinOffset, -element.size / 4)
            ctx.lineTo(element.size / 2, -element.size / 4)
            ctx.moveTo(pinOffset, element.size / 4)
            ctx.lineTo(element.size / 2, element.size / 4)
            break
          case 2: // Bottom
            ctx.moveTo(-element.size / 4, pinOffset)
            ctx.lineTo(-element.size / 4, element.size / 2)
            ctx.moveTo(element.size / 4, pinOffset)
            ctx.lineTo(element.size / 4, element.size / 2)
            break
          case 3: // Left
            ctx.moveTo(-pinOffset, -element.size / 4)
            ctx.lineTo(-element.size / 2, -element.size / 4)
            ctx.moveTo(-pinOffset, element.size / 4)
            ctx.lineTo(-element.size / 2, element.size / 4)
            break
        }
        ctx.stroke()
      }
      
      ctx.restore()
    })
  }, [])

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    const width = rect.width
    const height = rect.height

    timeRef.current += 16 // ~60fps

    // Clear canvas with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(248, 250, 252, 0.95)')
    gradient.addColorStop(1, 'rgba(241, 245, 249, 0.98)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw layers
    drawGrid(ctx, width, height, timeRef.current)
    drawCircuit(ctx, width, height, timeRef.current)
    drawPCBElements(ctx, width, height, timeRef.current)

    animationRef.current = requestAnimationFrame(animate)
  }, [drawGrid, drawCircuit, drawPCBElements])

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }, [])

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting && !isLoaded) {
          setIsLoaded(true)
        }
      },
      { threshold: 0.1 }
    )

    const canvas = canvasRef.current
    if (canvas) {
      observer.observe(canvas)
    }

    return () => {
      if (canvas) {
        observer.unobserve(canvas)
      }
    }
  }, [isLoaded])

  // Initialize and start animation
  useEffect(() => {
    if (!isVisible || !isLoaded) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    initNodes(rect.width, rect.height)

    // Start animation
    animate()

    // Add mouse event listener
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isVisible, isLoaded, animate, handleMouseMove, initNodes])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!isVisible || !isLoaded) return
      
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      initNodes(rect.width, rect.height)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isVisible, isLoaded, initNodes])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        zIndex: -1
      }}
    />
  )
}

export default AnimatedBackground
