---
name: gucci-luxury-web-design
description: >-
  Use this skill whenever the user asks to design, create, or elevate a website, landing page,
  or e-commerce product showcase in the style of ultra-luxury fashion houses like Gucci (gucci.com/kr/ko),
  Chanel, Dior, Saint Laurent, or Apple. Covers Haute Couture editorial typography, luxury minimalist color
  palettes (Alabaster, Jet Black, Champagne Gold), monumental CTAs, Gucci-style collapsible accordions,
  and interactive Three.js 3D 360° virtual atelier showrooms with precision angle scrubbers and couture hotspots.
---

# Gucci Luxury Web & 3D Showcase (오뜨 꾸뛰르 럭셔리 웹 & 3D 쇼룸)

This skill provides the comprehensive design system, layout rules, and WebGL Three.js interactive patterns to create world-class, ultra-luxury websites inspired by **Gucci Korea (gucci.com/kr/ko)** and European Haute Couture fashion houses.

---

## 1. When to Use This Skill
Activate this skill whenever:
1. The user asks for a website that looks like **Gucci**, **Chanel**, **Dior**, **Hermès**, **Apple**, or high-fashion luxury boutiques.
2. The user requests a luxury minimalist ("sang trọng, tối giản, đẳng cấp, haute couture") aesthetic for an e-commerce product or portfolio.
3. The user wants an interactive **3D 360° virtual showroom/atelier** to rotate and inspect a product from every angle.
4. The user wants Korean luxury e-commerce formatting (KRW `₩`, NaverPay/KakaoPay, Seoul flagship concierge, Korean legal footer compliance).

---

## 2. Core Visual Identity & Design Tokens

### Luxury Color Palette
```css
:root {
  /* Editorial Canvas */
  --bg-canvas: #FAF9F5;          /* Warm Alabaster Studio Canvas */
  --bg-card: #FFFFFF;            /* Pure Card White */
  --bg-subtle: #F3F1EC;          /* Soft Sand / Silk */
  
  /* Luxury Blacks & Text */
  --color-black: #111111;        /* Monumental Jet Black */
  --color-charcoal: #2A2A2A;
  --color-body: #4A4A4A;          /* Editorial High-Legibility Grey */
  --color-muted: #7A7A7A;
  
  /* Champagne Gold Accents (Gucci Iconic Brass) */
  --color-gold: #C5A880;          /* Signature Champagne Gold */
  --color-gold-hover: #B39268;
  --color-gold-light: #F8F4ED;
  --color-gold-border: rgba(197, 168, 128, 0.35);
  
  /* Hairline Borders */
  --border-hairline: rgba(0, 0, 0, 0.08);
  --border-light: #E8E5DF;
}
```

### Typography System
Always import editorial serif fonts combined with crisp Korean/international sans-serif:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Sans+KR:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

- **Brand Wordmarks**: `font-family: 'Cinzel', 'Playfair Display', serif; text-transform: uppercase; letter-spacing: 0.28em;`
- **Product Titles & Quotes**: `font-family: 'Playfair Display', 'Cormorant Garamond', serif; font-weight: 600;`
- **Body & Korean Text**: `font-family: 'Noto Sans KR', sans-serif; line-height: 1.7; font-weight: 300 to 500;`

---

## 3. Structural Layout: The Gucci Blueprint

### A. Top Announcement Strip
- Jet Black (`#111111`) with Champagne Gold badge (`ATELIER EXCLUSIVE`).
- Thin gold countdown or complimentary service note: `무료 특급 배송 & 시그니처 선물 포장 서비스`.

### B. Header with Grand Centered Wordmark
```html
<header class="site-header">
  <div class="header-container">
    <nav class="nav-menu">
      <a href="#collection" class="nav-link">컬렉션 (COLLECTION)</a>
      <a href="#atelier" class="nav-link">장인 디테일 (ATELIER)</a>
      <a href="#virtual3d" class="nav-link nav-link-gold">✦ 3D 버추얼 룸</a>
    </nav>

    <a href="#" class="brand-logo-gucci">
      <span class="brand-wordmark">B R A N D  N A M E</span>
      <span class="brand-submark">H A U T E  C O U T U R E  •  S E O U L</span>
    </a>

    <div class="header-actions">
      <a href="tel:0215888888" class="concierge-link">컨시어지 1588-8888</a>
      <button class="cart-trigger-btn" id="openCartBtn">쇼핑백 (0)</button>
      <a href="#order" class="header-cta-btn">온라인 주문</a>
    </div>
  </div>
</header>
```

### C. Hero Split Layout (55/45)
- **Left Gallery Column**:
  - Minimalist Switcher Pill: `[ 룩북 갤러리 (LOOKBOOK) ]` and `[ ✦ 3D 360° 버추얼 아틀리에 (3D ATELIER) ]`.
  - 2D Viewport: High-resolution product imagery with subtle luxury zoom and gold certification pill.
  - 3D Viewport: Interactive WebGL showroom (detailed below).
  - Thumbnail Row: Clean cards with 1px active gold borders.
- **Right Product Configuration Column**:
  - Collection Breadcrumb: `HAUTE COUTURE / 2026 SIGNATURE COLLECTION`
  - Serif Title + Subtitle with KoreanWon Currency (`₩ 29,000`).
  - Swatches: Concentric ring luxury circles.
  - Size Grid: Minimalist boxes + "📐 맞춤 사이즈 어드바이저 (Size Advisor)".
  - Monumental CTAs: Full-width Jet Black button `쇼핑백에 담기 (ADD TO SHOPPING BAG)`.
  - Gucci Collapsible Accordions:
    - `01. 제품 디테일 & 장인 기법 (CRAFTSMANSHIP)`
    - `02. 소재 및 친환경 인증 (MATERIALS & CERTIFICATION)`
    - `03. 시그니처 기프트 패키징 (SIGNATURE PACKAGING)`
    - `04. 무료 특급 배송 & 반품 안내 (SHIPPING & RETURNS)`

---

## 4. Interactive 3D Virtual Atelier (Three.js WebGL Pattern)

When rendering products in 3D:
1. **Scene Aesthetics**:
   - `scene.background = new THREE.Color(0xF9F8F5);` (matches page canvas).
   - `PCFSoftShadowMap` with ground shadow plane (`ShadowMaterial({ opacity: 0.16 })`).
   - 3 Studio lighting presets (Milano Studio Soft, Runway Highlight, Warm Sunlight).
2. **Floating Dark Glass Controls Bar**:
   - Top pill bar in `rgba(17, 17, 17, 0.88)` with `backdrop-filter: blur(12px)` and gold borders.
   - Includes: `✦ 360° ATELIER VIRTUAL VIEW`, `⏵ 회전 중 / ⏸ 정지`, `속도 1.0x`, `💡 조명`, `⟲ 리셋`.
3. **Bottom Precision Angle Dial (Scrubber)**:
   - Live scrubber slider (0° to 360°) synced bidirectionally with mouse rotation.
   - Exact horizontal rotation math around target lookAt vector.
4. **Couture Hotspot Pins**:
   - Pulsing glowing ring pins on the product.
   - Clicking smoothly zooms the camera and opens a luxury tooltip card with `HAUTE COUTURE DETAIL N°` and explanation.
5. **Robust Canvas Sizing**:
   - Always measure container via `getBoundingClientRect()` with fallback > 50px.
   - Call `onResize()` after switching tabs via `setTimeout(..., 40)` to avoid 0x0 WebGL canvas.

---

## 5. Magazine Lookbook & Storytelling Sections
- **Grand Editorial Quote**: Full-bleed section with serif pull quotes (e.g. `"가장 순수한 첫 감촉, 우리 아이를 위한 생애 첫 번째 명품"`).
- **Numbered Atelier Highlights Grid**: 4-5 numbered cards with gold `01`, `02`, `03` and macro photography.
- **Signature Gift Box Section**: Showcasing luxury hard boxes, silk ribbons, and custom calligraphy cards.
- **VIP Customer Reviews**: Rating 4.9/5.0 with verified buyer badges.
- **Korean Legal Footer Compliance**: Full company registry info (`(주)브랜드 코리아`, 사업자등록번호, 통신판매업신고, Cheongdam-dong flagship boutique address, Concierge hotline).

---

## 6. Golden Checklist for Every Project
- [ ] Are headings set in `Cinzel` or `Playfair Display` with uppercase letter spacing (`letter-spacing: 0.18em` to `0.28em`)?
- [ ] Is the primary color palette based on Warm Alabaster (`#FAF9F5`), Jet Black (`#111111`), and Champagne Gold (`#C5A880`)?
- [ ] Does the product page include Gucci-style collapsible detail accordions?
- [ ] Does the 3D viewer support 360° mouse drag, auto-rotation toggle, precision angle dial, and studio lighting presets?
- [ ] Are prices formatted in luxury Korean currency (`₩ 29,000`) with installment benefits?
- [ ] Is the page fully responsive across mobile, tablet, and 4K desktop screens?