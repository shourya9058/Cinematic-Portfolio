<div align="center">

<br />

```
╔══════════════════════════════════════════════════════╗
║                                                      ║
║       S H O U R Y A   S I N G H   ·   2 0 2 6       ║
║          FULL STACK DEVELOPER · PORTFOLIO            ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

<br />

# ⬛ CINEMATIC PORTFOLIO

### *A high-fidelity, scrollytelling portfolio built for impact.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-EF008F?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://greensock.com/gsap/)

<br/>

> *"Building reliable systems while crafting clean and engaging digital experiences."*

<br/>

[![Live Demo](https://img.shields.io/badge/⬥%20LIVE%20DEMO-8B0000?style=for-the-badge)](https://shourya-singh-portfolio.vercel.app/)
[![GitHub](https://img.shields.io/badge/Source%20Code-181717?style=for-the-badge&logo=github)](https://github.com/shourya9058/Cinematic-Portfolio)

</div>

---

<br/>

## ▌ THE VISION

This isn't a resume — it's an **experience**.

Designed as a cinematic, scrollytelling journey through my work and identity as a Full Stack Developer. Every section is a scene. Every interaction is intentional. Built with performance, aesthetics, and storytelling as core pillars.

<br/>

## ▌ ARCHITECTURE

```
Portfolio 2026/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Main page — all sections composed here
│   ├── layout.tsx              # Root layout & font setup
│   ├── globals.css             # Design tokens, keyframes, global styles
│   └── projects/[slug]/        # Dynamic project detail pages
│       └── page.tsx            # Scroll-driven cinematic project showcase
│
├── components/                 # Feature components
│   ├── Navbar.tsx              # Sticky nav with scroll-hide + mobile overlay
│   ├── Overlay.tsx             # Hero section with parallax typography
│   ├── ScrollyCanvas.tsx       # 120-frame image sequence (Hero)
│   ├── ScrollStorySection.tsx  # Cinematic horizontal scroll reveal
│   ├── AboutSection.tsx        # Comic-panel dual-layout about section
│   ├── SkillsSection.tsx       # 120-frame image sequence (Skills)
│   ├── SkillOverlay.tsx        # HUD-style skill labels over canvas
│   ├── ExperienceSection.tsx   # Animated road-to-mastery timeline
│   ├── Projects.tsx            # Scrollytelling project grid
│   ├── ProjectCard.tsx         # Individual project card with parallax
│   ├── ContactSection.tsx      # Animated contact form with EmailJS
│   ├── Footer.tsx              # Brand footer with social links
│   ├── Preloader.tsx           # Asset-aware cinematic preloader
│   └── ProjectDetail/          # Project page building blocks
│       ├── ScrollClipImage.tsx # GPU-accelerated clip-path scroll wipe
│       └── MediaCarousel3D.tsx # Physics-based 3D media carousel
│
└── constants/
    └── projects.ts             # All project data in one place
```

<br/>

## ▌ FEATURE HIGHLIGHTS

| Feature | Description |
|---|---|
| **Image Sequences** | 120-frame canvas-rendered sequences for Hero & Skills sections, driven by scroll position — no video files |
| **Scroll-driven Story** | Cinematic horizontal text reveals mapped directly to scroll progress via Framer Motion |
| **Comic Panel About** | Dual-layer panel system with B&W → Colour hover transitions, responsive to mobile |
| **3D Carousel** | Physics-simulated card carousel with drag, swipe, and keyboard navigation |
| **Clip-path Wipe** | GPU-composited `clip-path` scroll wipe between project slides, powered by GSAP ScrollTrigger |
| **Scroll Fill Text** | Per-word reveal animation on the project overview, timed precisely to scroll position |
| **EmailJS Contact** | Fully validated contact form with rate limiting, honeypot, profanity filtering, and success states |
| **Cinematic Preloader** | Asset-aware preloader that waits for all image sequences before revealing the site |
| **Mobile Responsive** | Cinematic experience maintained across all viewport sizes — desktop UI unchanged |

<br/>

## ▌ TECH STACK

```
FRONTEND          Next.js 15  ·  TypeScript  ·  Tailwind CSS
ANIMATION         Framer Motion  ·  GSAP + ScrollTrigger
RENDERING         Canvas API (image sequences)  ·  CSS Compositor Layer (will-change)
FORMS             EmailJS
FONTS             Inter  ·  Syncopate  ·  Bangers (Google Fonts)
DEPLOYMENT        Vercel
```

<br/>

## ▌ GETTING STARTED

### Prerequisites
- Node.js `v18+`
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/shourya9058/Cinematic-Portfolio.git

# Navigate to the project
cd Cinematic-Portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The image sequence frames (`/public/sequence/` and `/public/sequence2/`) are required for the canvas animations. Ensure they are present or the preloader will wait indefinitely.

<br/>

## ▌ PERFORMANCE

This portfolio was engineered for zero compromise between aesthetics and speed.

- ✦ **GPU-composited animations** — `will-change: transform` on all major layers
- ✦ **Compositor-thread floating** — CSS `@keyframes` instead of GSAP repeat loops
- ✦ **No `filter: blur` on transitions** — replaced with `scale + opacity` (fully composited)
- ✦ **`overflow-x: clip`** — zero horizontal overflow without breaking `position: sticky`
- ✦ **Scroll-away Navbar** — hides on downscroll to give content full breathing room

<br/>

## ▌ CONTACT

<div align="center">

**Shourya Singh**
*Full Stack Developer · Computer Science 2026*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shaurya-singh007/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Shourya-Singh-07)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/_shauryasingh__)

<br/>

*Built with obsession. Deployed with precision.*

```
███████╗██╗  ██╗ ██████╗ ██╗   ██╗██████╗ ██╗   ██╗ █████╗
██╔════╝██║  ██║██╔═══██╗██║   ██║██╔══██╗╚██╗ ██╔╝██╔══██╗
███████╗███████║██║   ██║██║   ██║██████╔╝ ╚████╔╝ ███████║
╚════██║██╔══██║██║   ██║██║   ██║██╔══██╗  ╚██╔╝  ██╔══██║
███████║██║  ██║╚██████╔╝╚██████╔╝██║  ██║   ██║   ██║  ██║
╚══════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
```

</div>

---

<div align="center">
<sub>© 2026 Shourya Singh · All Rights Reserved</sub>
</div>
