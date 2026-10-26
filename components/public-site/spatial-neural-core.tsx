"use client"

import { useEffect, useRef } from "react"

export function SpatialNeuralCore() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let disposed = false
    let frameId = 0
    let observer: IntersectionObserver | undefined
    let resizeObserver: ResizeObserver | undefined
    let renderer: import("three").WebGLRenderer | undefined
    let scene: import("three").Scene | undefined
    let isVisible = true
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0
    let render: () => void = () => undefined
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const onPointerMove = (event: PointerEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2
    }

    const renderFrame = (render: () => void) => {
      if (disposed || !isVisible) return
      render()
      if (!reducedMotion) frameId = window.requestAnimationFrame(() => renderFrame(render))
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })

    void import("three")
      .then((THREE) => {
        if (disposed || !container) return

        const width = Math.max(container.clientWidth, 1)
        const height = Math.max(container.clientHeight, 1)
        const localScene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
        camera.position.set(0, 0, width < height ? 22 : 18)

        let localRenderer: import("three").WebGLRenderer
        try {
          localRenderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: window.devicePixelRatio <= 1.5,
            powerPreference: "low-power",
          })
        } catch (error) {
          console.warn("Spatial hero animation could not initialize WebGL.", error)
          return
        }

        scene = localScene
        renderer = localRenderer
        localRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
        localRenderer.setSize(width, height)
        localRenderer.setClearColor(0x000000, 0)
        localRenderer.domElement.setAttribute("aria-hidden", "true")
        localRenderer.domElement.setAttribute("role", "presentation")
        container.appendChild(localRenderer.domElement)

        localScene.add(new THREE.AmbientLight(0xffffff, 1.05))

        const blueLight = new THREE.DirectionalLight(0x3b82f6, 2.2)
        blueLight.position.set(10, 12, 10)
        localScene.add(blueLight)

        const cyanLight = new THREE.DirectionalLight(0x06b6d4, 1.5)
        cyanLight.position.set(-10, -8, -5)
        localScene.add(cyanLight)

        const pointLight = new THREE.PointLight(0x2563eb, 2.5, 25)
        pointLight.position.set(0, 0, 4)
        localScene.add(pointLight)

        const coreGroup = new THREE.Group()
        localScene.add(coreGroup)

        const coreSphere = new THREE.Mesh(
          new THREE.SphereGeometry(3.2, 40, 40),
          new THREE.MeshPhongMaterial({
            color: 0x1d4ed8,
            emissive: 0x0f172a,
            specular: 0x60a5fa,
            shininess: 90,
            transparent: true,
            opacity: 0.76,
          }),
        )
        coreGroup.add(coreSphere)

        const wireMesh = new THREE.Mesh(
          new THREE.IcosahedronGeometry(4.2, 2),
          new THREE.MeshBasicMaterial({
            color: 0x0284c7,
            wireframe: true,
            transparent: true,
            opacity: 0.36,
          }),
        )
        coreGroup.add(wireMesh)

        const innerSphere = new THREE.Mesh(
          new THREE.SphereGeometry(1.8, 32, 32),
          new THREE.MeshBasicMaterial({
            color: 0x67e8f9,
            transparent: true,
            opacity: 0.45,
          }),
        )
        coreGroup.add(innerSphere)

        const ringGroup = new THREE.Group()
        localScene.add(ringGroup)

        const createRing = (
          radius: number,
          color: number,
          opacity: number,
          rotationX: number,
          rotationY: number,
        ) => {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(radius, 0.035, 12, 100),
            new THREE.MeshBasicMaterial({
              color,
              transparent: true,
              opacity,
            }),
          )
          ring.rotation.x = rotationX
          ring.rotation.y = rotationY
          ringGroup.add(ring)
          return ring
        }

        const ringOne = createRing(6, 0x0284c7, 0.48, Math.PI / 3, Math.PI / 6)
        const ringTwo = createRing(7.2, 0x6366f1, 0.38, -Math.PI / 4, Math.PI / 4)
        const ringThree = createRing(8.4, 0x2563eb, 0.32, Math.PI / 2.3, -Math.PI / 5)

        const nodeColors = [0x38bdf8, 0x818cf8, 0x34d399, 0xfbbf24, 0xf43f5e, 0x06b6d4]
        const agentNodes = nodeColors.map((color, index) => {
          const node = new THREE.Mesh(
            new THREE.SphereGeometry(0.28, 14, 14),
            new THREE.MeshStandardMaterial({
              color,
              emissive: color,
              emissiveIntensity: 0.42,
              roughness: 0.28,
            }),
          )
          const angle = (index / nodeColors.length) * Math.PI * 2
          const radius = 6.2 + (index % 3) * 0.8
          node.userData = {
            angle,
            speed: 0.003 + (index % 3) * 0.0015,
            radius,
            yOffset: (index % 2 === 0 ? 1 : -1) * (0.8 + index * 0.3),
          }
          localScene.add(node)
          return node
        })

        const particleCount = window.innerWidth < 640 ? 120 : 240
        const particlePositions = new Float32Array(particleCount * 3)
        for (let index = 0; index < particleCount; index += 1) {
          const radius = 4.5 + Math.random() * 8.5
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(Math.random() * 2 - 1)
          const offset = index * 3
          particlePositions[offset] = radius * Math.sin(phi) * Math.cos(theta)
          particlePositions[offset + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7
          particlePositions[offset + 2] = radius * Math.cos(phi)
        }

        const particleGeometry = new THREE.BufferGeometry()
        particleGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(particlePositions, 3),
        )
        const particles = new THREE.Points(
          particleGeometry,
          new THREE.PointsMaterial({
            color: 0x60a5fa,
            size: 0.1,
            transparent: true,
            opacity: 0.48,
          }),
        )
        localScene.add(particles)

        const resize = () => {
          if (!container.clientWidth || !container.clientHeight) return
          camera.aspect = container.clientWidth / container.clientHeight
          camera.position.z = container.clientWidth < container.clientHeight ? 22 : 18
          camera.updateProjectionMatrix()
          localRenderer.setSize(container.clientWidth, container.clientHeight)
        }
        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(container)

        observer = new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting
          if (isVisible && !frameId) {
            frameId = window.requestAnimationFrame(() => {
              frameId = 0
              renderFrame(render)
            })
          } else if (!isVisible && frameId) {
            window.cancelAnimationFrame(frameId)
            frameId = 0
          }
        })
        observer.observe(container)

        const startTime = performance.now()
        render = () => {
          const elapsedTime = (performance.now() - startTime) / 1000
          targetX += (mouseX - targetX) * 0.035
          targetY += (mouseY - targetY) * 0.035

          coreGroup.rotation.y = elapsedTime * 0.16 + targetX * 0.35
          coreGroup.rotation.x = Math.sin(elapsedTime * 0.12) * 0.08 - targetY * 0.24
          wireMesh.rotation.y = -elapsedTime * 0.13
          wireMesh.rotation.z = elapsedTime * 0.09

          const scale = 1 + Math.sin(elapsedTime * 1.2) * 0.025
          coreSphere.scale.setScalar(scale)

          ringOne.rotation.z = elapsedTime * 0.11
          ringTwo.rotation.z = -elapsedTime * 0.085
          ringThree.rotation.y = elapsedTime * 0.13
          ringGroup.rotation.y = targetX * 0.2
          ringGroup.rotation.x = -targetY * 0.16

          for (const node of agentNodes) {
            node.userData.angle += node.userData.speed
            node.position.x = Math.cos(node.userData.angle) * node.userData.radius
            node.position.z = Math.sin(node.userData.angle) * node.userData.radius
            node.position.y =
              Math.sin(elapsedTime * 0.9 + node.userData.angle) * 0.7 +
              node.userData.yOffset * 0.45
          }

          particles.rotation.y = elapsedTime * 0.025
          particles.rotation.x = elapsedTime * 0.012
          localRenderer.render(localScene, camera)
        }

        renderFrame(render)
      })
      .catch((error: unknown) => {
        if (!disposed) console.warn("Spatial hero animation failed to load.", error)
      })

    return () => {
      disposed = true
      window.removeEventListener("pointermove", onPointerMove)
      window.cancelAnimationFrame(frameId)
      observer?.disconnect()
      resizeObserver?.disconnect()
      if (scene) {
        scene.traverse((object) => {
          if ("geometry" in object) {
            const mesh = object as import("three").Mesh
            mesh.geometry?.dispose()
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            for (const material of materials) material?.dispose()
          }
        })
      }
      renderer?.dispose()
      renderer?.domElement.remove()
    }
  }, [])

  return <div ref={containerRef} className="public-home-neural-canvas" aria-hidden="true" />
}
