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
  tertiary: '#ffb867'
  on-tertiary: '#482900'
  tertiary-container: '#dd8900'
  on-tertiary-container: '#4d2c00'
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
  tertiary-fixed: '#ffddba'
  tertiary-fixed-dim: '#ffb867'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#101419'
  on-background: '#e0e2eb'
  surface-variant: '#31353c'
typography:
  display-xl:
    fontFamily: Sora
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 120px
---

## Brand & Style
The design system embodies a "Cosmic Intelligence" narrative—a fusion of vast, deep-space exploration and high-performance computational power. The aesthetic is rooted in **Glassmorphism 2.0**, prioritizing depth through transparency, luminous accents, and sophisticated optical effects.

The target audience consists of developers, data scientists, and tech-forward explorers who value a high-fidelity, immersive environment. The UI should evoke a sense of "technological awe"—combining the infinite calm of deep space with the sharp, precise energy of a futuristic command center. To achieve this, use layered translucency, ultra-fine luminous borders, and subtle grain textures to prevent the "plastic" look often associated with glass effects.

## Colors
The palette is centered on a high-contrast dark mode foundation.
- **Deep Space (#020408):** The absolute foundation. Use this for the base background layer.
- **Electric Blue (#4F9EFF):** The primary action color. Used for primary buttons, active states, and high-priority data points.
- **Soft Violet (#A78BFA):** The secondary accent. Used for secondary brand elements, feature highlights, and interactive hover states to create a "nebula" glow.

For accessibility, ensure all text overlays on these colors maintain a 4.5:1 contrast ratio. Use "Electric Blue" sparingly for text to ensure legibility; prioritize white (#FFFFFF) for primary content and a muted slate (#94A3B8) for secondary descriptions.

## Typography
This design system utilizes **Sora** (as a high-contrast geometric substitute for Clash Display) for headlines to provide a technical, futuristic edge. **Plus Jakarta Sans** is used for all body text and labels to maintain warmth and high legibility within complex layouts.

- **Headlines:** Use Sora with tight letter spacing for a "locked-in" architectural feel.
- **Body:** Use Plus Jakarta Sans with generous line height to ensure readability against dark, textured backgrounds.
- **Mono:** Utilize Geist for technical metadata or code snippets to reinforce the "intelligence" aspect of the brand.

## Layout & Spacing
The layout follows a **Fluid Grid** model. Content is organized within a 12-column system for desktop, transitioning to 4 columns for mobile.

- **Hero Sections:** Utilize a centered or split-half layout with at least 120px of vertical padding to allow the background glass effects to breathe.
- **Feature Grids:** Use an 8px spacing scale. Feature cards should utilize `stack-lg` (32px) internal padding to maintain a premium feel.
- **Negative Space:** Embracing whitespace (or "dark space") is critical. Avoid cluttering the interface; let the luminous borders define the structure rather than heavy background fills.

## Elevation & Depth
Depth is created through **Glassmorphism 2.0** techniques rather than traditional shadows.

1.  **Backdrop Blur:** Every surface above the base level must use a 12px to 20px backdrop blur.
2.  **Luminous Borders:** Apply a 1px solid or gradient border (Top/Left: `rgba(255,255,255,0.15)`, Bottom/Right: `rgba(255,255,255,0.05)`) to simulate light catching the edge of a glass pane.
3.  **Grain Texture:** A subtle noise overlay (2% opacity) should be applied to the primary background to add tactile "physicality" to the digital space.
4.  **Z-Axis:**
    *   **Level 0:** Base (#020408).
    *   **Level 1:** Content cards (12% opacity white fill + blur).
    *   **Level 2:** Modals/Popovers (18% opacity white fill + 32px blur + soft outer glow).

## Shapes
Standardize on **Rounded (0.5rem)** corners for most interactive elements. This strikes a balance between the precision of hard angles and the approachability of circles.

- **Buttons & Inputs:** 8px (0.5rem) corner radius.
- **Feature Cards:** 16px (1rem) corner radius.
- **Authentication Forms:** 12px (0.75rem) corner radius to differentiate them as central focal points.

## Components
### Hero Sections
Heros must feature a "Core Glow" – a radial gradient of #4F9EFF at 10% opacity behind the main heading. Use `display-xl` typography with a subtle text shadow to lift it off the glass background.

### Interactive Feature Grids
Cards should have no background color in their default state, only the 1px luminous border. On hover, the background transitions to a 10% white tint, and the border color shifts to the Electric Blue primary.

### Multi-Method Authentication Forms
- **Input Fields:** Semi-transparent fills (4% white) with a 1px border. On focus, the border glows with the Soft Violet (#A78BFA) accent.
- **SSO Buttons (Google/GitHub):** Use the 1px luminous border style with 14px labels. Use the brand's monochrome logos to maintain visual harmony.
- **Primary Action:** The "Sign In" button should be a solid Electric Blue gradient to provide the strongest call-to-action on the page.

### Chips & Badges
Use "Pill" shapes with 10% opacity fills of the primary color and 12px `label-md` text. These should be used for metadata and status indicators.