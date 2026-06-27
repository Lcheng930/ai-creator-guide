import DefaultTheme from 'vitepress/theme'
import { h, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import './style.css'

// ================================================================
// 金色粒子拖尾 — Canvas 实现
// 长拖尾、金色渐变、粒子生命周期
// ================================================================
function createGoldTrail() {
  const canvas = document.createElement('canvas')
  canvas.id = 'gold-trail-canvas'
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  let particles = []
  let mouseX = -100
  let mouseY = -100
  let lastMouseX = -100
  let lastMouseY = -100
  let animId = null

  const MAX_PARTICLES = 60
  const TRAIL_LIFESPAN = 900 // ms

  // 金色系
  const colors = [
    'rgba(212,153,60,',   // --accent #d4993c
    'rgba(232,176,79,',   // --accent-hover
    'rgba(255,215,0,',    // gold
    'rgba(255,236,139,',  // light goldenrod
    'rgba(184,134,11,',   // dark goldenrod
  ]

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  function spawnParticle(x, y) {
    if (particles.length >= MAX_PARTICLES) {
      particles.shift()
    }
    const color = colors[Math.floor(Math.random() * colors.length)]
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 3 + 1.5,
      color,
      life: 1,
      decay: 1 / (TRAIL_LIFESPAN / 16),
    })
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 鼠标移动时生成粒子（根据移动速度调整密度）
    const dx = mouseX - lastMouseX
    const dy = mouseY - lastMouseY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > 3 && mouseX > 0 && mouseY > 0) {
      const count = Math.min(Math.floor(dist / 4), 3)
      for (let i = 0; i < count; i++) {
        spawnParticle(
          lastMouseX + (dx * i) / count,
          lastMouseY + (dy * i) / count
        )
      }
    }

    // 渲染粒子
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.life -= p.decay
      if (p.life <= 0) {
        particles.splice(i, 1)
        continue
      }

      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.98
      p.vy *= 0.98

      const alpha = p.life * 0.7
      const size = p.size * p.life

      ctx.beginPath()
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
      ctx.fillStyle = p.color + alpha + ')'
      ctx.shadowColor = p.color + (alpha * 0.6) + ')'
      ctx.shadowBlur = size * 4
      ctx.fill()
    }

    // 重置阴影避免影响其他渲染
    ctx.shadowBlur = 0

    lastMouseX = mouseX
    lastMouseY = mouseY
    animId = requestAnimationFrame(animate)
  }

  const onMove = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  document.addEventListener('pointermove', onMove, { passive: true })
  animate()

  return () => {
    cancelAnimationFrame(animId)
    document.removeEventListener('pointermove', onMove)
    window.removeEventListener('resize', resize)
    canvas.remove()
  }
}

// ================================================================
// 客户端交互组件
// ================================================================
const ClientInteractions = {
  setup() {
    const route = useRoute()
    let cleanupGoldTrail = null

    onMounted(() => {
      // ---- 鼠标聚光灯 ----
      const spotlight = document.createElement('div')
      spotlight.className = 'mouse-spotlight'
      document.body.prepend(spotlight)

      let raf = null
      const onMoveSpot = (e) => {
        if (raf) return
        raf = requestAnimationFrame(() => {
          spotlight.style.setProperty('--mx', `${e.clientX}px`)
          spotlight.style.setProperty('--my', `${e.clientY}px`)
          raf = null
        })
      }

      if (matchMedia('(hover: hover)').matches) {
        document.addEventListener('pointermove', onMoveSpot, { passive: true })
        // ---- 金色粒子拖尾 ----
        cleanupGoldTrail = createGoldTrail()
      }

      // ---- 滚动 reveal ----
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      )

      const observeElements = () => {
        document.querySelectorAll(
          '.vp-doc h2, .vp-doc h3, .vp-doc pre, .vp-doc blockquote, .vp-doc table, .VPFeature'
        ).forEach((el, i) => {
          if (!el.classList.contains('reveal')) {
            el.classList.add('reveal', `reveal-delay-${(i % 4) + 1}`)
            observer.observe(el)
          }
        })
      }

      setTimeout(observeElements, 150)
      watch(route, () => setTimeout(observeElements, 250))

      // ---- 分类色系 ----
      const applyCategory = () => {
        const p = window.location.pathname
        document.documentElement.classList.remove(
          'category-hyperframes', 'category-agentskills', 'category-aivideo', 'category-claude'
        )
        if (p.includes('hyperframes')) document.documentElement.classList.add('category-hyperframes')
        if (p.includes('agent-skills')) document.documentElement.classList.add('category-agentskills')
        if (p.includes('aivideo') || p.includes('ai-video')) document.documentElement.classList.add('category-aivideo')
        if (p.includes('claude')) document.documentElement.classList.add('category-claude')
      }

      applyCategory()
      watch(route, applyCategory)
    })

    onUnmounted(() => {
      cleanupGoldTrail?.()
    })

    return () => null
  }
}

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-bottom': () => h(ClientInteractions)
  })
}
