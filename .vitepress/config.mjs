import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  base: '/ai-creator-guide/',
  title: 'AI 创客指南',
  description: 'HyperFrames、Agent Skills、AI 视频制作深度教程 —— 用 AI 十倍提升创作效率',
  appearance: 'dark',
  head: [
    ['meta', { name: 'keywords', content: 'HyperFrames,Agent Skills,AI视频,AI短剧,Claude Code,提示词工程,AI教程' }],
    ['meta', { name: 'author', content: 'Lcheng' }],
    ['meta', { name: 'theme-color', content: '#08080a' }],
    ['link', { rel: 'icon', href: '/ai-creator-guide/favicon.ico' }],
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '关于', link: '/about' },
    ],
    sidebar: {
      '/posts/': [
        {
          text: '系列教程',
          items: [
            { text: 'HyperFrames 完全指南', link: '/posts/hyperframes-guide' },
            { text: 'Agent Skills 完全指南', link: '/posts/agent-skills-guide' },
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Lcheng930' },
    ],
    footer: {
      message: 'AI 创客指南 · 用代码思维做视频，用 Agent 思维做开发',
    },
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
  },
  markdown: {
    lineNumbers: true,
    theme: {
      dark: 'dracula',
      light: 'dracula',
    },
  },
})
