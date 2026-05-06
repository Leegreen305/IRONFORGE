import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tac-bg': '#080d18',
        'tac-panel': '#0d1420',
        'tac-panel-alt': '#0a1018',
        'tac-gold': '#c8a84b',
        'tac-gold-dim': '#7a6420',
        'tac-blue': '#3b82f6',
        'tac-blue-dim': '#1e3a5f',
        'tac-red': '#ef4444',
        'tac-red-dim': '#4a1010',
        'tac-green': '#16b960',
        'tac-green-dim': '#0a3020',
        'tac-border': '#1e2d3d',
        'tac-border-bright': '#2d4a6a',
        'tac-dim': '#4a6680',
        'tac-text': '#a0b4c8',
        'tac-text-bright': '#c8dae8',
      },
      fontFamily: {
        mono: ['"Liberation Mono"', '"Courier New"', 'Courier', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
}

export default config
