# JARVIS AI — Brand Identity & Agent Implementation Rules

> **Purpose:** This file is the brand source of truth for any AI coding agent building Jarvis websites, dashboards, interfaces, presentations, proposals, or emails.  
> **Use in Claude Code:** Keep this file at the repository root as `CLAUDE.md`.  
> **Asset reference:** `assets/jarvis-ai-logo-reference.jpeg`

---

## 1. Non-Negotiable Brand Direction

Jarvis AI is a Saudi-based AI engineering agency that designs autonomous operational architecture for enterprises. It does not position itself as a generic chatbot, software dashboard, or surface-level automation vendor.

**Core position:**  
Jarvis identifies operational friction, connects fragmented functions, and engineers intelligent systems that execute with control, visibility, and scale.

**Brand character:**
- Engineering-led
- Precise
- Enterprise-grade
- Intelligent
- Structured
- Saudi-built with global ambition
- Confident without exaggeration

**Never make Jarvis feel:**
- Playful, childish, trendy, or casual
- Like a generic SaaS template
- Like a basic AI chatbot company
- Overly futuristic without business meaning
- Overloaded with decoration or random gradients

---

## 2. Approved Strategic Language

These statements define the established brand voice and may be used where appropriate:

- **ENGINEERED IN SAUDI. USED GLOBALLY.**
- **The issue is not effort. It is structure.**
- **Jarvis redesigns that structure.**
- **Autonomy is not automation. It is engineered control.**
- **No assumptions. No surface fixes. Only structural clarity.**
- **We architect autonomous environments that execute intelligently.**
- **SaaS makes you adapt. We engineer systems that adapt to you.**

### Writing rules

Write in short, controlled statements. Sound like an engineering company speaking to decision-makers.

**Use:**
- Operational architecture
- Intelligent workflow synchronization
- Autonomous execution
- Structural clarity
- Executive visibility
- Secure API orchestration
- Integrated data pipelines
- Bottlenecks, execution speed, control, scale

**Avoid:**
- “Revolutionize your business”
- “Game-changing AI”
- “Magic,” “effortless,” “next-level”
- Emoji-heavy copy
- Empty claims without an operational outcome
- Overuse of the words “AI-powered” or “automation”

### Copy pattern

Preferred structure:
1. State the operational problem.
2. Reframe it as a structural issue.
3. Present Jarvis as engineered control.
4. Finish with a clear business impact or action.

Example:
> Departments do not fail because people lack effort. They fail when systems cannot coordinate execution. Jarvis engineers the operating layer that connects data, decisions, and action.

---

## 3. Visual Identity

### 3.1 Logo

The supplied logo is the official reference artwork:
- Black background
- White `JARVIS AI` wordmark
- Orange circuit-based symbol forming a technology/architecture mark
- Minimal grey circuit details

**Logo usage rules:**
- Use the supplied logo asset wherever a logo is required until an official SVG/vector export is provided.
- Prefer the logo on a deep black background.
- Do not recreate, redraw, stretch, rotate, outline, bevel, glow, or recolor the logo.
- Do not place the logo on busy imagery.
- Do not replace the orange with blue, purple, neon green, or generic “AI gradient” colors.
- Keep generous clear space around the logo; minimum clear space is approximately the height of the letter `J` in the wordmark.
- On small mobile headers, use the supplied full logo only when legible. If an approved icon-only SVG is not available, do not invent one.

**Implementation asset path:**
```text
/assets/jarvis-ai-logo-reference.jpeg
```

> The current asset is a raster reference on black. For production-quality large displays, request an official SVG or transparent PNG export rather than tracing or regenerating it.

---

## 4. Color System

The identity is built around deep black, high-contrast white, and Jarvis orange. The orange token below is calibrated from the supplied raster logo and should be replaced only if an official vector brand value is supplied later.

### Primary palette

| Token | Hex | Use |
|---|---:|---|
| `--jarvis-black` | `#050505` | Main page and email hero background |
| `--jarvis-panel` | `#0D1016` | Cards, dashboards, elevated surfaces |
| `--jarvis-border` | `#232833` | Dividers, outlines, subtle technical grids |
| `--jarvis-white` | `#F7F7F5` | Primary text and wordmark-safe contrast |
| `--jarvis-muted` | `#A0A4AC` | Secondary text, labels, metadata |
| `--jarvis-orange` | `#F36C34` | Main accent, CTA, rules, key highlights |
| `--jarvis-orange-bright` | `#FF572A` | Hover or high-priority highlight only |
| `--jarvis-success` | `#79D58A` | System status / success indication only |

### Color rules

- Default background is black or near-black.
- Orange is an accent, not a full-screen decoration. Use it for calls to action, lines, status highlights, active tabs, key numbers, or limited section blocks.
- White carries the primary information.
- Grey carries secondary system information.
- Avoid multiple bright colors. This brand should feel controlled.
- Do not introduce purple/blue AI gradients.
- For data charts, begin with neutral greys and highlight the key Jarvis-controlled metric in orange.

### CSS variables

```css
:root {
  --jarvis-black: #050505;
  --jarvis-panel: #0D1016;
  --jarvis-border: #232833;
  --jarvis-white: #F7F7F5;
  --jarvis-muted: #A0A4AC;
  --jarvis-orange: #F36C34;
  --jarvis-orange-bright: #FF572A;
  --jarvis-success: #79D58A;
}
```

---

## 5. Typography

The existing identity uses a wide, technical, uppercase display style paired with clear modern supporting text. Use this hierarchy consistently.

### Digital product and website typography

| Purpose | Preferred font | Fallback |
|---|---|---|
| Display headlines / hero labels | `Michroma` | `Space Grotesk`, `Arial`, sans-serif |
| Body text / UI / forms | `Inter` | `Arial`, sans-serif |
| Technical metadata / status labels | `IBM Plex Mono` | `Consolas`, monospace |

### Typography rules

- Headlines should commonly be uppercase with tight, confident phrasing.
- Use display font sparingly: hero lines, section labels, critical metric headers.
- Use Inter for readability in dashboards, websites, forms, and longer content.
- Use monospace only for status indicators, system labels, timestamps, technical tags, or logs.
- Avoid rounded friendly fonts, decorative serif fonts, and handwritten fonts.

### Suggested style tokens

```css
.jarvis-display {
  font-family: "Michroma", "Space Grotesk", Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.96;
}

.jarvis-body {
  font-family: "Inter", Arial, sans-serif;
  line-height: 1.55;
}

.jarvis-meta {
  font-family: "IBM Plex Mono", Consolas, monospace;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
}
```

---

## 6. UI and Website Design Language

### 6.1 Overall direction

Every interface should feel like a controlled enterprise operating system: minimal, sharp, dark, structured, and information-led.

**Design principles:**
- Grid-based layouts
- High information clarity
- Strong visual hierarchy
- Technical labels and status indicators used intentionally
- Thin borders and clean dividers
- Orange used as a strategic attention signal
- Large negative space in marketing pages
- Dense but organized information in dashboards

### 6.2 Layout

**Marketing pages:**
- Full-width dark hero
- Small technical eyebrow label, such as `SYSTEM STATUS: ONLINE`
- Large uppercase headline
- Short structured supporting copy
- One primary CTA in orange and one secondary text or outline action
- Architectural diagrams, process flows, or operational module blocks instead of generic stock imagery

**Dashboards / platforms:**
- Dark shell with structured side navigation
- Panels using `--jarvis-panel` and thin `--jarvis-border`
- Active navigation marked with orange line or accent
- Metrics use large white values and limited orange emphasis
- Show system states clearly: active, running, awaiting approval, exception, blocked

### 6.3 Components

**Buttons**
- Primary: orange background, black text, squared or lightly rounded edges
- Secondary: transparent/dark background, border, white text
- No oversized pill buttons unless the existing application system specifically requires them

**Cards**
- Dark panel on black background
- Thin border
- Tight header with technical label
- Minimal shadow or no shadow
- Orange only for highlighted card state or key marker

**Navigation**
- Clean, restrained, uppercase labels acceptable
- Use active orange marker
- No bright gradients or decorative glassmorphism

**Forms**
- Dark inputs with thin neutral borders
- Clear white text, muted helper text
- Orange focus border
- Validation must be direct and useful

**Icons and diagrams**
- Prefer thin line icons, process maps, circuit/connection motifs, node networks, workflow blocks
- Keep icons geometric and consistent
- Do not use cartoon illustrations

### 6.4 Motion

Motion should communicate system state, not entertainment:
- Subtle line reveals
- Status pulse for online/running indicators
- Soft panel transitions
- Data-flow animation only when relevant

Avoid:
- Bouncy motion
- Decorative floating objects
- Excessive parallax
- Flashing or distracting neon effects

---

## 7. Email Identity

Emails must remain professional, clear, and compatible across common email clients.

### Email visual rules

- Use white or near-black backgrounds depending on email purpose:
  - Corporate outreach and proposals: white body with black text and orange accent rule.
  - Launch or brand announcement: black hero block with white text and orange CTA.
- Use the logo reference on black only where it remains readable.
- Email-safe font fallback: `Arial, Helvetica, sans-serif`.
- Keep orange to buttons, dividers, small headings, or linked actions.
- Avoid complex animations, heavy background graphics, or dark full-body emails for long messages.

### Email tone

- Direct greeting
- One clear business reason for contacting the recipient
- Brief explanation of the system/outcome
- Specific next action
- Professional sign-off

### Approved email signature style

```text
[Name]
JARVIS AI
Autonomous Operational Architecture
Engineered in Saudi. Used Globally.

partners@jarvisksa.com | jarvisksa.com
```

Do not add unsupported claims, awards, client logos, or numbers without confirmed data.

---

## 8. Image and Graphic Direction

**Use:**
- Dark architectural compositions
- Workflow nodes and operational diagrams
- Thin technical grids
- Enterprise system screens
- Real-world industry visuals treated with dark overlays
- Orange line highlights and controlled data visualization

**Do not use:**
- Humanoid robots
- Glowing brain imagery
- Random circuit backgrounds with no purpose
- Generic futuristic city scenes
- Blue/purple AI stock images
- Playful illustrations or emojis in primary branded work

---

## 9. Content Architecture for Key Pages

### Homepage recommended flow

1. **System-status hero**  
   Establish the operational problem and Jarvis positioning.
2. **The structural issue**  
   Explain manual work, silos, delayed reporting, and lack of visibility.
3. **What Jarvis engineers**  
   Agent-based workflows, secure API orchestration, integrated data pipelines.
4. **Operational intelligence modules**  
   Examples: deal execution, performance operations, predictive analytics.
5. **Business impact**  
   Reduced operational drag, higher execution speed, executive visibility, cost control.
6. **Jarvis Academy**  
   Training and enablement layer for client teams.
7. **Contact / workspace CTA**  
   One clear action.

### Platform interface recommended vocabulary

| Avoid | Prefer |
|---|---|
| Bot | Agent |
| Tasks | Executions or Workflows |
| Automation list | Operational workflows |
| Error | Exception or Intervention required |
| Dashboard home | Control center or Operations overview |
| AI suggestions | Intelligence layer or Recommendations |
| User activity | Execution log or Activity trail |

Use these terms only when clear to the end user. Clarity is always more important than jargon.

---

## 10. Implementation Instructions for Coding Agents

When generating Jarvis-branded output:

1. Read this file before writing copy or styling any interface.
2. Load the supplied logo asset from the defined asset path. Never substitute a text-only approximation when the logo is required.
3. Use the provided color tokens. Do not invent new core brand colors.
4. Default websites and application interfaces to the dark visual system.
5. Default corporate emails to clarity-first layouts with controlled orange accents.
6. Apply the brand voice: precise, structured, engineering-led, and business-outcome focused.
7. Before creating new claims, metrics, partners, features, or contact details, confirm they are supplied in the project data.
8. Keep layouts responsive, accessible, and legible. Brand darkness does not justify low contrast.
9. Do not create generic AI design tropes: purple gradients, robot imagery, glowing neon UI, or vague hype copy.
10. Preserve design consistency across marketing site, platform UI, authentication screens, proposals, and email templates.

### Required accessibility baseline

- Body text contrast must meet WCAG AA.
- Keyboard focus must be visible, using orange focus state where appropriate.
- Buttons must include accessible labels and clear hover/focus states.
- Status should not rely on color alone; include labels or icons.

---

## 11. Pre-Delivery Brand Check

Before finalizing any Jarvis asset, verify:

- [ ] The logo is used without distortion or unauthorized recreation.
- [ ] The palette is primarily black, white, grey, and controlled orange.
- [ ] No generic AI gradients or unrelated bright colors were added.
- [ ] Copy sounds precise and engineering-led, not hype-driven.
- [ ] Headlines are structured and strong; body copy is readable.
- [ ] Interface states and business outcomes are clear.
- [ ] Content does not invent client results, figures, features, or contact information.
- [ ] The work feels like one Jarvis operating system, not separate random templates.

---

## 12. Brand Summary for Fast Context

```yaml
brand:
  name: "JARVIS AI"
  category: "AI engineering agency / autonomous operational architecture"
  origin_positioning: "Engineered in Saudi. Used Globally."
  personality:
    - precise
    - structured
    - enterprise-grade
    - engineering-led
    - confident
  visual_mode: "dark, minimal, technical, high-contrast"
  primary_colors:
    black: "#050505"
    panel: "#0D1016"
    white: "#F7F7F5"
    muted: "#A0A4AC"
    orange: "#F36C34"
  typography:
    display: "Michroma"
    body: "Inter"
    technical: "IBM Plex Mono"
  signature_phrases:
    - "The issue is not effort. It is structure."
    - "Autonomy is not automation. It is engineered control."
    - "No assumptions. No surface fixes. Only structural clarity."
  prohibited_design_tropes:
    - "purple or blue AI gradients"
    - "robot or glowing brain imagery"
    - "playful/cartoon aesthetic"
    - "hype-first generic SaaS copy"
```
