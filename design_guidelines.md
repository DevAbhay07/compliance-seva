# Legal Metrology Compliance Checker - Design Guidelines

## Design Approach: Government Reference-Based Design
Following UX4G (User Experience for Government) standards with inspiration from Gemini's clean, professional aesthetic. This government-grade application requires trustworthy, accessible design that conveys authority and reliability.

## Core Design Elements

### A. Color Palette

**Status Colors:**
- Success Green: 142 76% 36% (Compliant products)
- Warning Orange: 25 95% 53% (Violations detected)
- Error Red: 0 84% 60% (Critical failures)
- Neutral Gray: 210 11% 71% (Secondary text, borders)

**Dark Mode:**
- Background: 220 13% 9%
- Surface: 220 13% 14%

### B. Typography
- **Primary Font:** Noto Sans (Google Fonts)
- **Headings:** 700 weight, government-standard hierarchy
- **Body Text:** 400 weight, 16px minimum for accessibility
- **Code/Data:** Noto Sans Mono for compliance codes

### C. Layout System
**Spacing Units:** Tailwind 2, 4, 6, 8, 12, 16
- Consistent 8px grid system
- Government-standard content widths (max-w-7xl)
- Generous whitespace for professional appearance

### D. Component Library

**Navigation:**
- Clean header with government logo placement
- Breadcrumb navigation for complex workflows
- Persistent sidebar for dashboard sections

**Forms:**
- Large, accessible input fields (min-height: 44px)
- Clear validation states with descriptive messages
- Government-compliant form layouts

**Data Display:**
- Clean cards with subtle shadows
- Status indicators with color + icon combinations
- Compliance score meters with clear visual hierarchy
- Tabular data with proper spacing and zebra striping

**Interactive Elements:**
- Primary buttons with government blue
- Outline buttons with blurred backgrounds on hero sections
- Loading states for AI processing
- Modal overlays for detailed reports

## Page-Specific Guidelines

### Landing Page (Gemini-inspired)
- **Hero Section:** Clean, minimal with government seal/logo
- collapsable side bar with smooth animatiions
- **Sections:** Hero, Features, How It Works, Get Started
- **Visual Treatment:** Subtle gradients (220 75% 35% to 210 80% 50%)
- **Typography Scale:** Large, confident headings with government authority

### Scanner Interface
- **Camera Viewfinder:** Clean overlay with corner guides
- **Upload Options:** Three clear modes - Camera, Gallery, URL
- **Progress Indicators:** Government-standard loading states
- **Results Display:** Structured compliance breakdown

### Dashboard
- **Metrics Cards:** Clean grid layout with status colors
- **Charts:** Simple bar/line charts with government color scheme
- **Quick Actions:** Prominent CTA buttons for common tasks

## Images
- **Government Seal/Logo:** Header placement, official insignia
- **Product Sample Images:** Mockup product labels for demonstrations
- **No Large Hero Images:** Keep focus on functionality over decoration
- **Icons:** Material Icons for consistency and accessibility

## Accessibility & Government Standards
- WCAG 2.1 AA compliance mandatory
- High contrast ratios (4.5:1 minimum)
- Keyboard navigation support
- Screen reader optimization
- Multi-language support preparation