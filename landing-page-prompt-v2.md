# Claude Code Prompt v2 — Full Pre-Login Landing Page

Copy everything below into Claude Code. This replaces the earlier scope. Build the complete pre-login page in this order: Hero, About (3 entry points), Why Real Experience Wins (with ranking table), Footer.

Do not use em dashes anywhere in generated copy or comments. Write plain sentences with periods or commas instead.

---

## Role & Scope

Build the full public pre-login page for **[NAME YOUR PRODUCT]**, a platform connecting pre-uni students, undergrads, and graduates to help each other choose the right university and field based on real academic outcomes. No auth logic, no Supabase wiring yet. This is the visual shell only, with working animations.

---

## Tech Stack

- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS
- Framer Motion for scroll and UI animation
- React Three Fiber + drei (three.js) for the 3D hero background
- A lightweight counter hook (build custom with Framer Motion's `useSpring`/`useMotionValue`, no heavy extra dependency needed) for the live counter
- Custom typewriter component built with Framer Motion or plain state and `setInterval`, not a generic pre-styled npm typewriter package
- shadcn/ui as base primitives, adapted to the dark theme, plus 21st.dev MCP for reference patterns only, not verbatim copies
- lucide-react for icons
- Fonts via `next/font`, free license only
- Use the `uiuxpromax` skill first to lock the design system (type scale, spacing, color tokens, motion tokens) before writing component code

---

## Theme and Visual Direction

**Dark theme. No gradients anywhere**, not in backgrounds, not in text, not in buttons, not in borders. Every color used should be flat and intentional.

### Color Palette (pick and commit during the design tokens step)
- Background: near black, not pure black, something like `#0A0A0A` or `#0D0D0C`, with a very subtle texture or grain if it helps avoid a flat dead look
- Text: warm off white, not pure white, around `#F2F1EC`
- One accent color only, used sparingly and with intention. Choose one direction and commit:
  - Muted gold/amber (feels premium and academic)
  - Deep emerald
  - Electric ice blue, used sparingly so it does not feel techy/generic
- Accent is used for CTAs, the typewriter cursor, key underlines, and small highlight details only, never as a background wash

### Typography
- One big, bold, confident display typeface for headings, something with real character (Fontshare's Clash Display, Cabinet Grotesk, or similar free option), used large
- One clean readable sans for body copy
- Headline sizing should feel dramatic on desktop and still readable and well broken on mobile, do not just shrink the container

### What to avoid (AI slop checklist)
- No gradients, ever
- No generic particle/dot grid backgrounds (this is explicitly called out, avoid it)
- No floating glassy blobs
- No stock photography of students on laptops
- No emoji as icons
- No cliché copy like "Unlock," "Empower," "Elevate," "Seamless," "Your journey starts here"
- No em dashes in any copy or comments
- No "everything is a rounded card with a soft shadow" default look

---

## Section 1: Hero

### Layout
- Big, centered, bold headline, exact copy:

```
Choose your university
based on outcomes,
not rankings.
```

- Below the headline, a typewriter line that loops continuously through three words, one at a time, smooth character-by-character type and delete animation:
  - "pre-uni students"
  - "undergrads"
  - "graduates"
  - Frame it with a short fixed prefix so it reads naturally, something like "Built for" + the looping word. Write the final copy yourself, keep it short and natural, no cliché phrasing.
- Below that, two buttons: **Login** and **Sign Up**. Sign Up should read as the primary action (filled, accent color), Login as secondary (outline or ghost style). No gradient fills.
- A live counter beneath or beside the buttons, animated counting up on load (and optionally re-triggering on scroll into view). Show a number that represents platform activity, for example "Experiences shared" or "Universities compared." Since this is pre-launch, use a placeholder number I can swap later, but wire up the actual count-up animation logic properly.

### 3D Background
This is the part that must feel premium and not generic. Build it with React Three Fiber. Requirements:
- Not a flat particle dot-grid, not a generic starfield, not a wireframe globe cliché
- Something abstract and slow, for example a small cluster of soft-lit geometric shapes (icosahedrons, low-poly forms, or thin connecting lines suggesting a network of people/experiences) drifting and slowly rotating, reacting subtly to mouse movement or scroll
- Use the single accent color for any glow or highlight, everything else stays dark and desaturated
- Keep it subtle behind the text, the text must stay fully readable at all times, consider a slight vignette or blur/opacity falloff behind the copy
- Performance: this must not tank mobile performance. Detect low-end devices or small viewports and either simplify the scene (fewer objects, lower geometry detail) or fall back to a static, subtly animated CSS/SVG version on mobile. Respect `prefers-reduced-motion` with a fully static fallback.

---

## Section 2: About the Website (Three Entry Points)

Present the three user types as one connected system, not three disconnected cards:
- **Pre-uni students**: explore universities and fields matched to their academic background
- **Undergrads**: confirm if they made the right choice, share how it is going so far
- **Graduates**: rate their university and field out of 10, set a recommendation level, share where they ended up

Visually suggest this as a loop or cycle, graduates' input feeds back into what pre-uni students see when choosing. Use scroll-driven reveal animation (Framer Motion `useScroll` + `useTransform`) as the user scrolls through this section, staggered and subtle, not just a generic fade-up.

---

## Section 3: Why Real Experience Wins

- A short, confident section making the case that lived experience beats brochures and rankings
- Include a clean comparison table or structured grid explaining what the platform actually weighs when ranking someone's opinion, so users trust the system. Build this as a real, well-designed table component (not a generic bordered HTML table), dark themed, using the accent color only for emphasis, not fills. Include rows like:

| Signal | What it means |
|---|---|
| Verified status | Confirmed enrollment or graduation, not anonymous claims |
| Recency | How recent the experience is, older reviews are weighted differently |
| Detail and specificity | Vague one-line reviews carry less weight than detailed accounts |
| Consistency | Whether the review lines up with other reviews of the same program |
| Community validation | Other students marking a review as genuinely helpful |
| Outcome data | What happened after graduation, further study, employment, relevance to the field |

Feel free to refine the wording of the "what it means" column, keep it short and direct, no filler.

---

## Section 4: Footer

- Clean, dark, minimal footer
- Logo/name, a short one-line tagline, nav links (About, Contact, Privacy), social links if relevant, copyright line
- No gradient, no clutter, keep it quiet since the page above already did the heavy lifting

---

## Motion Rules (applies across the whole page)

- Scroll-driven reveals should use scroll progress, not just "fade in when in view"
- Keep all motion GPU-cheap: animate `transform` and `opacity` only
- Respect `prefers-reduced-motion` everywhere, including the 3D background and typewriter (typewriter can fall back to a static cross-fade between words if reduced motion is on)
- Mobile: reduce animation complexity and 3D scene weight, test scroll smoothness specifically on mobile Safari and Chrome Android

---

## Mobile Responsiveness (highest priority)

- Design mobile-first, test at 375px before scaling up
- Headline must break cleanly at small widths, do not let it awkwardly wrap mid-word
- Login/Sign Up buttons must be full comfortable tap targets on mobile, likely stacked rather than side by side below a certain breakpoint
- The 3D background must not cause jank or battery drain on mobile, use the simplified/fallback version described above
- Table in Section 3 must reflow cleanly on mobile, consider a stacked card layout per row instead of a horizontal table below a certain breakpoint
- No horizontal scroll or overflow at any breakpoint

---

## Process — Follow in Order

1. Run the `uiuxpromax` skill first, lock the design system: exact color tokens, type scale, spacing scale, motion tokens. Show me this before writing component code.
2. Use 21st.dev MCP to reference relevant premium dark-theme hero and marketing patterns, adapt rather than copy.
3. Propose the exact typewriter framing copy and the counter's label/number before finalizing.
4. Build the 3D hero background as its own isolated component first, confirm it performs well and stays subtle, before wiring the rest of the hero around it.
5. Build each section as its own component file.
6. Wire scroll-driven motion throughout.
7. Do a full mobile-first responsiveness and performance pass, including the 3D scene and the table.
8. Confirm `prefers-reduced-motion` fallback across typewriter, scroll reveals, and the 3D background.

---

## Deliverable Structure

```
app/
  page.tsx
components/
  landing/
    hero-section.tsx
    hero-background-3d.tsx
    typewriter.tsx
    live-counter.tsx
    about-section.tsx
    why-experience-section.tsx
    ranking-table.tsx
    footer.tsx
lib/
  fonts.ts
  design-tokens.ts
```

Keep components typed and cleanly commented, especially the 3D scene and the scroll-linked animation logic, so it is maintainable later.
