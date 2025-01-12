'use client'

import React, { useEffect, useRef } from 'react'

interface Node {
    x: number
    y: number
    vx: number
    vy: number
}

const NetworkAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        const nodeCount = 50
        const nodes: Node[] = []
        const connectionDistance = 150

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
            })
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'rgba(0, 128, 128, 0.5)' // Teal color
            ctx.strokeStyle = 'rgba(0, 128, 128, 0.2)' // Lighter teal for connections

            nodes.forEach((node, i) => {
                node.x += node.vx
                node.y += node.vy

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1

                ctx.beginPath()
                ctx.arc(node.x, node.y, 3, 0, Math.PI * 2)
                ctx.fill()

                // Draw connections
                for (let j = i + 1; j < nodes.length; j++) {
                    const otherNode = nodes[j]
                    if (otherNode) {
                        const dx = otherNode.x - node.x
                        const dy = otherNode.y - node.y
                        const distance = Math.sqrt(dx * dx + dy * dy)

                        if (distance < connectionDistance) {
                            ctx.beginPath()
                            ctx.moveTo(node.x, node.y)
                            ctx.lineTo(otherNode.x, otherNode.y)
                            ctx.stroke()
                        }
                    }
                }
            })
            requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}

export default NetworkAnimation

