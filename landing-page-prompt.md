# Claude Code Prompt — Public Landing Page (Hero + 2 Sections)

Copy everything below into Claude Code as your prompt.

---

## Role & Scope

You are building **only the public marketing/landing page** of a webapp called **UniLens** — a platform where pre-university students, undergraduates, and graduates connect to help each other choose the right university and field of study based on real academic experience.

Do NOT build auth, dashboards, forms, or Supabase logic in this session. This session is scoped to **one page**: a Hero section + 2 supporting sections that communicate the product's purpose to all three user types (pre-uni students, undergrads, graduates) before they sign up.

---

## Tech Stack (lock this in now, even though only the landing page is being built)

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion (`useScroll`, `useTransform`, `useInView`) for scroll-driven effects
- **Components:** shadcn/ui as the base primitive layer + **21st.dev MCP** for pulling/inspecting premium component references — don't copy them verbatim, adapt them to this design system
- **Icons:** lucide-react
- **Fonts:** self-hosted via `next/font`, pulled from Fontshare or Google Fonts (must be free/open license)
- **Backend (future sessions):** Supabase — not touched in this task
- **Design process:** Use the `uiuxpromax` skill FIRST to establish a design system (type scale, spacing scale, color tokens, motion tokens) before writing any component code. Don't start coding blind.

---

## Design Direction — This Must NOT Look Like Generic AI-Generated SaaS

Explicitly avoid all of the following "AI slop" patterns:
- Purple-to-blue gradient backgrounds or gradient text
- Generic floating 3D blobs / abstract glassy orbs
- Centered hero with a bold headline + subtext + two pill buttons + a stock illustration on the right (the default Vercel/Linear clone look)
- Inter/Poppins as the only font — used everywhere by every AI-built site
- Emoji used as icons
- Generic stock photography of "students smiling at laptops"
- Cliché SaaS copywriting: "Unlock," "Empower," "Elevate," "Seamless," "Supercharge," "Your journey starts here"
- Overuse of rounded-2xl cards with soft drop shadows on every element (the "everything is a card" trap)

Instead, aim for an **editorial, confident, slightly academic-but-modern feel** — closer to a well-designed university prospectus or a Stripe/Arc-style content site than a generic startup template.

### Typography
- Pick exactly 2 typefaces, both free:
  - A **distinctive display/serif or grotesk** for headlines (e.g. Fontshare's "Clash Display," "Cabinet Grotesk," or "Instrument Serif" — pick one that feels editorial, not corporate)
  - A **clean, highly legible sans** for body copy (e.g. "General Sans," "Geist," or "Satoshi" from Fontshare)
- Use a real type scale (not just text-xl/2xl/3xl defaults) — establish this in the design tokens step
- Headlines should feel large and confident on desktop, but must scale down gracefully on mobile without breaking line-length

### Color Palette
- Avoid purple/blue gradients entirely
- Base palette: warm off-white/cream or soft paper background, deep ink/charcoal (not pure black) for text, and **one** confident accent color — pick something distinctive like a deep terracotta, forest green, or amber/mustard, not the default indigo
- Use the accent sparingly (CTAs, key highlights, underlines) — not as a background wash everywhere
- Support a light and dark surface variant if time allows, but light/editorial is the priority

### Layout
- Asymmetric, editorial grid — not everything centered
- Generous whitespace/negative space
- Real content hierarchy, not decorative filler shapes

---

## Section-by-Section Content Brief

### 1. Hero Section
- Communicate in one glance: this is where pre-uni students, current undergrads, and graduates share real experience to help each other choose the right university and field
- Headline: write 2–3 original options, avoid generic startup phrasing (no "Unlock your future")
- Subheadline: one sentence, plain language, no jargon
- Two distinct CTAs reflecting the platform's dual nature — one for "I'm choosing a university" (pre-uni), one for "I'm already in / graduated — share your experience" (undergrad/grad)
- A scroll cue (subtle, not a generic bouncing mouse icon)

### 2. Section Two — "How It Works" / Three Paths, One Platform
- Visually represent the three user types (pre-uni student → undergrad → graduate) as one continuous journey/loop, not three disconnected cards
- Short copy per stage:
  - Pre-uni: explore universities and fields matched to their academic background
  - Undergrad: confirm if they chose right, share their experience so far
  - Graduate: rate their university/field out of 10, give a recommendation level, share career outcome
- This section should visually suggest a cycle — graduates' input feeds back into what pre-uni students see

### 3. Section Three — Why Real Experience Beats Rankings
- The core value proposition: decisions based on people who actually lived it, not just marketing rankings or brochures
- Could include a stat-style callout, a short illustrative quote-style example (write original placeholder content, not fake real testimonials), or a simple visual comparing "official ranking" vs "real student rating"
- End with a final CTA reinforcing the platform's purpose

---

## Scroll-Driven Animation Spec

- Use Framer Motion's `useScroll` (scoped to each section via `target` refs) + `useTransform` for scroll-linked motion — not just fade-in-on-mount
- Hero: subtle parallax between headline, subtext, and background elements as the user scrolls into section two
- Section transitions: staggered reveal of text/elements tied to scroll progress, not just a generic fade-up on `whileInView`
- Keep motion **subtle and premium** — small translateY/opacity/scale shifts, not spinning or bouncing elements
- **Must respect `prefers-reduced-motion`** — provide a static fallback
- Animations must be GPU-cheap (transform/opacity only, no animating layout properties) so they stay smooth on mid-range mobile devices

---

## Mobile Responsiveness — Highest Priority

Most users will access this on mobile, so:
- Build **mobile-first**: design and test the 375px viewport before scaling up to desktop
- Simplify or reduce animation complexity on mobile (fewer parallax layers, shorter travel distances) to protect scroll performance
- All tap targets (CTAs, nav) must be comfortably sized for touch (minimum ~44px)
- Test text wrapping and line-length at small widths — headline font size must scale down appropriately, not just shrink the container
- Verify no horizontal scroll/overflow at any breakpoint
- Verify the scroll-driven animations don't cause janky/reflow behavior on mobile Safari specifically

---

## Process — Follow These Steps in Order

1. Use the `uiuxpromax` skill to define the design system first: type scale, spacing scale, color tokens, motion tokens. Show me this before writing component code.
2. Use 21st.dev MCP to reference premium component patterns relevant to scroll-driven hero/marketing sections — adapt, don't copy wholesale.
3. Propose 2–3 headline/copy directions for the Hero before finalizing.
4. Build section by section: Hero → How It Works → Why Real Experience — each as its own component file.
5. Wire up scroll-driven animation per the spec above.
6. Do a mobile-first responsiveness pass and confirm no overflow/jank at 375px, 768px, and 1440px.
7. Confirm `prefers-reduced-motion` fallback works.

---

## Deliverable Structure

```
app/
  page.tsx
components/
  landing/
    hero-section.tsx
    how-it-works-section.tsx
    value-prop-section.tsx
lib/
  fonts.ts
  design-tokens.ts (or tailwind.config extension)
```

Keep components typed, clean, and commented where the scroll-animation logic isn't self-explanatory.
