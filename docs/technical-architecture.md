# Technical Architecture

## Stack

- Next.js (App Router)
- JavaScript
- Tailwind CSS v4
- Framer Motion
- Lenis
- Vercel

---

# Architecture Philosophy

The project should remain:
- clean
- modular
- maintainable
- performant
- scalable enough for creative iteration

Avoid unnecessary abstraction.

Do not prematurely optimize.

---

# Folder Structure

Suggested structure:

/app
/components
/sections
/hooks
/lib
/public
/styles
/docs

---

# Animation Strategy

Animations should:
- support emotion
- support storytelling
- support immersion

Animations should NEVER:
- distract
- overwhelm
- reduce readability
- cause performance issues

---

# Performance Priorities

Highest priorities:
1. Mobile performance
2. Smooth scrolling
3. Fast image loading
4. Low layout shift
5. Responsive interactions

---

# Asset Strategy

Use:
- WebP images
- optimized PNG assets
- compressed audio
- lazy loading where appropriate

Avoid:
- unnecessary videos
- giant GIFs
- unoptimized transparency-heavy assets

---

# Audio Strategy

The site may include:
- ambient background music
- subtle interaction sounds
- specific music moments

Audio should:
- remain optional
- never autoplay aggressively
- include mute/unmute controls

---

# Scroll Philosophy

This is not a standard webpage.

Scrolling should feel:
- cinematic
- immersive
- emotionally paced

Sections may:
- pin temporarily
- transition gradually
- overlap softly
- layer visually

But performance remains critical.