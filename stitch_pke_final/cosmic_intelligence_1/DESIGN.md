---
name: Cosmic Intelligence
colors:
  surface: '#101419'
  surface-dim: '#101419'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#e0e2eb'
  on-surface-variant: '#c1c7d4'
  inverse-surface: '#e0e2eb'
  inverse-on-surface: '#2d3137'
  outline: '#8b919e'
  outline-variant: '#414752'
  surface-tint: '#a5c8ff'
  primary: '#a5c8ff'
  on-primary: '#00315f'
  primary-container: '#4f9eff'
  on-primary-container: '#003465'
  inverse-primary: '#005faf'
  secondary: '#cebdff'
  on-secondary: '#381385'
  secondary-container: '#4f319c'
  on-secondary-container: '#bea8ff'
  tertiary: '#00e0b3'
  on-tertiary: '#00382b'
  tertiary-container: '#00b18d'
  on-tertiary-container: '#003c2e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a5c8ff'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#004786'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#21005e'
  on-secondary-fixed-variant: '#4f319c'
  tertiary-fixed: '#28ffcd'
  tertiary-fixed-dim: '#00e0b3'
  on-tertiary-fixed: '#002118'
  on-tertiary-fixed-variant: '#00513f'
  background: '#101419'
  on-background: '#e0e2eb'
  surface-variant: '#31353c'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.7'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is centered on the concept of "Cosmic Intelligence," positioning the Personal Knowledge Engine as a vast, interconnected nebula of information. The target audience consists of researchers, engineers, and creative polymaths who require a high-focus environment that feels both cinematic and technologically advanced.

The visual style is a refined evolution of **Glassmorphism**, characterized by:
- **Depth and Atmosphere:** Deep, near-black backgrounds layered with translucent frosted panels.
- **Luminosity:** Elements should appear to emit a soft internal glow, mimicking the bioluminescence of digital synapses.
- **Precision:** 1px borders and sharp typography contrast against soft background blurs to maintain a sense of rigorous organization.
- **Tactility:** A subtle 4% noise texture overlay is applied globally to the UI to break digital flatness and provide a physical, filmic quality.

## Colors
This design system utilizes a "Deep Space" palette. The core experience is strictly dark-mode to reduce eye strain during deep work sessions.

- **Base Background:** #020408 provides the infinite canvas.
- **Primary (Electric Blue):** Used for active states, primary actions, and key navigation nodes.
- **Secondary (Soft Violet):** Used for categorical organization, tags, and secondary accents to provide a cosmic gradient feel.
- **Highlight (Neon Teal):** Reserved for "Aha!" moments—success states, new insights, and system-level notifications.
- **Surface:** A high-transparency white layer that creates the glass effect when paired with background blurs.

## Typography
The typography strategy balances high-impact geometric headers with ultra-legible functional text.

- **Headlines:** Use Plus Jakarta Sans (as a geometric alternative to Clash Display) with tight tracking to anchor the page.
- **Body:** Geist is the primary workhorse, offering a technical yet approachable feel for long-form knowledge consumption.
- **Functional:** JetBrains Mono is used for labels, metadata, and code snippets, reinforcing the "engine" aspect of the product. 
- **Hierarchy:** Maintain clear vertical rhythm. Use uppercase for labels with increased letter-spacing to denote system-level information.

## Layout & Spacing
The design system employs a **Fluid Grid** model to accommodate complex data visualizations and knowledge graphs.

- **Grid:** A 12-column system on desktop, scaling to 4 columns on mobile.
- **Rhythm:** An 8px base unit drives all padding and margin decisions. 
- **Panels:** Content is organized into "Crystalline Containers." On desktop, a persistent left-hand "Command Rail" (width: 80px) houses high-level navigation, while the main content area utilizes flexible glass panels that can expand or collapse.
- **Breakpoints:** Mobile (<600px), Tablet (600px-1024px), and Desktop (>1024px). On mobile, panels lose their side margins and hug the screen edges to maximize reading space.

## Elevation & Depth
Depth is not communicated through traditional shadows, but through **Tonal Luminance** and **Backdrop Blurs**.

1.  **Level 0 (Base):** The near-black background (#020408) with a global noise overlay.
2.  **Level 1 (Sub-panels):** Surfaces with `rgba(255, 255, 255, 0.02)` and no blur, used for grouping content within a page.
3.  **Level 2 (Glass Cards):** Surfaces with `rgba(255, 255, 255, 0.04)`, 20px backdrop blur, and a 1px `rgba(255, 255, 255, 0.1)` border.
4.  **Level 3 (Overlays/Modals):** Surfaces with higher opacity `rgba(255, 255, 255, 0.08)`, 40px backdrop blur, and a subtle inner glow (`box-shadow: inset 0 0 12px rgba(79, 158, 255, 0.1)`).

Borders should use linear gradients (from top-left to bottom-right) to simulate a light source hitting the edges of a crystal.

## Shapes
The shape language is "Soft-Tech." While the engine is powerful, the UI should feel inviting. 

- **Primary Radius:** 0.5rem (8px) for standard buttons and input fields.
- **Container Radius:** 1rem (16px) for cards and main UI panels to create a softer, more premium aesthetic.
- **Interactive Elements:** Buttons and interactive chips use the 0.5rem standard.
- **Status Indicators:** 100% (circle) for status dots and user avatars.

## Components
- **Buttons:** Primary buttons feature a solid Electric Blue background with a white label. Secondary buttons use the glass panel style (border + blur) with a subtle hover effect that increases the border's luminosity.
- **Input Fields:** Dark, transparent backgrounds with a 1px border. On focus, the border transitions to a gradient of Primary-to-Secondary, and a soft outer glow is applied.
- **Chips & Tags:** Small, Pill-shaped elements. Tags use Secondary (Violet) with 10% opacity fills and 100% opacity text for a "holographic" look.
- **Cards:** The core of the PKE. Every card must have a 20px backdrop-filter. Content should be padded by 24px (md spacing).
- **Knowledge Nodes:** Circular interactive elements for graph views, using a glow-pulse animation when selected.
- **Command Palette:** A central overlay component using Level 3 elevation, featuring a blurred background that obscures the entire UI to focus the user on search and commands.