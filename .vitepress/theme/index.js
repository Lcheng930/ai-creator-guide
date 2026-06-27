import DefaultTheme from 'vitepress/theme'
import { h, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import './style.css'

// 客户端交互组件 — 鼠标聚光灯 + 滚动reveal + 分类色系
const ClientInteractions = {
  setup() {
    const route = useRoute()

    onMounted(() => {
      // 鼠标聚光灯
      const spotlight = document.createElement('div')
      spotlight.className = 'mouse-spotlight'
      document.body.prepend(spotlight)

      let raf = null
      const onMove = (e) => {
        if (raf) return
        raf = requestAnimationFrame(() => {
          spotlight.style.setProperty('--mx', `${e.clientX}px`)
          spotlight.style.setProperty('--my', `${e.clientY}px`)
          raf = null
        })
      }

      if (matchMedia('(hover: hover)').matches) {
        document.addEventListener('pointermove', onMove, { passive: true })
      }

      // 滚动 reveal
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

      // 分类色系
      const applyCategory = () => {
        const p = window.location.pathname
        document.documentElement.classList.remove(
          'category-hyperframes', 'category-agentskills', 'category-aivideo'
        )
        if (p.includes('hyperframes')) document.documentElement.classList.add('category-hyperframes')
        if (p.includes('agent-skills')) document.documentElement.classList.add('category-agentskills')
      }

      applyCategory()
      watch(route, applyCategory)
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
