Create a new photography portfolio website for Viktor.
This is the project foundation prompt — establish the 
tech stack, global styles, and app shell only.
No sections yet.

---

## PROJECT SETUP

Tech stack:
- React 18 + TypeScript + Vite
- Framer Motion 11 — all animations
- Lenis — smooth scroll, initialized globally
- Google Fonts via <link> in index.html

Run: npm create vite@latest — React + TypeScript template
Then: npm install framer-motion lenis

---

## GLOBAL STYLES (src/styles/global.css)

Font imports in index.html:
"Playfair Display" weights 400, 700, 900
"DM Sans" weights 300, 400, 500

CSS variables:
--color-bg: #ffffff
--color-bg-alt: #f8f8f6
--color-dark: #0a0a0a
--color-text: #1a1a1a
--color-muted: #9ca3af
--color-accent: #1a1a1a
--font-display: 'Playfair Display', serif
--font-body: 'DM Sans', sans-serif

Global resets:
- box-sizing border-box
- margin 0, padding 0
- scroll-behavior: auto (Lenis handles smoothness)
- img: display block, max-width 100%
- NO default link styles

---

## APP SHELL (src/App.tsx)

Initialize Lenis in useEffect:
const lenis = new Lenis()
const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf) }
requestAnimationFrame(raf)
return () => lenis.destroy()

Custom cursor component (src/components/Cursor.tsx):
- Small filled circle 8px, color #1a1a1a
- Larger ring 36px lagging behind, border 1px solid #1a1a1a
- On hover over [data-cursor="view"]: 
  ring expands to 64px, label "VIEW" appears inside
- position fixed, pointer-events none, z-index 9999
- body { cursor: none }

Loading screen (src/components/LoadingScreen.tsx):
- White background
- Center: "VIKTOR" in Playfair Display 900, 
  3rem, #1a1a1a — types in character by character
- Fades out after 1.5s
- AnimatePresence, removed from DOM after exit

---

## FILE STRUCTURE

src/
  components/
    Cursor.tsx
    LoadingScreen.tsx
  sections/         (empty for now)
  styles/
    global.css
  App.tsx
  main.tsx

index.html — Google Fonts link tags
