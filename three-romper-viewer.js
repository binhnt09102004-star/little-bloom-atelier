// Little Bloom - Ultra-Realistic Haute Couture 3D Baby Romper Interactive Atelier
// 72-Frame Ultra-Dense Cinema Turntable Engine (5.0° Per Frame Precision)
// Zero-GC Render Loop, Exponential Physics Damping, and GSAP Macro Dolly-Zoom

class Romper3DViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // 72 Cinema-Grade Studio Frames (5.0° Per Frame for 100% Seamless Persistence of Vision)
    this.totalFrames = 72;
    this.degreesPerFrame = 360 / this.totalFrames; // 5.0°
    this.frameUrls = [];
    for (let i = 0; i < this.totalFrames; i++) {
      this.frameUrls.push(`assets/spin360/72frames/frame_${i}.jpg`);
    }

    this.loadedImages = new Array(this.totalFrames);
    this.imagesLoadedCount = 0;
    this.lastDrawnIndex = -1;
    this.lastRoundedAngle = -1;

    // Continuous Physics State
    this.currentAngle = 0; // Current rendered angle (smooth lerped)
    this.targetAngle = 0;  // Target angle (driven by drag, auto-rotate, or preset)
    this.sensitivity = 0.38; // Degrees per mouse pixel

    this.isAutoRotate = true;
    this.rotateSpeed = 1.0;
    this.currentLighting = 'studio';

    // Drag Physics Tracking
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartAngle = 0;
    this.lastMoveTime = 0;
    this.lastMoveX = 0;
    this.velocity = 0;

    this.isZoomed = false;
    this.activeHotspotId = null;

    // Angle Names for Lookbook View Badge
    this.angleNames = {
      0: '정면 룩북 (FRONT VIEW)',
      45: '우전측면 (3/4 RIGHT)',
      90: '우측 프로필 (RIGHT PROFILE)',
      135: '우후측면 (3/4 BACK)',
      180: '후면 룩북 (BACK VIEW)',
      225: '좌후측면 (3/4 BACK-LEFT)',
      270: '좌측 프로필 (LEFT PROFILE)',
      315: '좌전측면 (3/4 FRONT-LEFT)'
    };

    // Haute Couture Hotspots
    this.hotspots = [
      {
        id: 'collar',
        num: '01',
        title: '무자극 라운드 넥 & 오가닉 마감',
        sub: 'COMFORT CREW NECKLINE',
        desc: '민감한 아기 목둘레를 부드럽게 감싸는 1x1 립 조직 마감. 목 뒤 택(Tag)은 외부에 배치하여 피부 마찰을 원천 차단했습니다.',
        specs: ['100% GOTS 오가닉 코튼', '무자극 플랫록 스티치', '외부 봉제 케어 라벨'],
        x: 50,
        y: 19,
        zoomOrigin: '50% 19%',
        zoomScale: 2.4,
        targetAngle: 0,
        lastVisible: null
      },
      {
        id: 'badge',
        num: '02',
        title: '시그니처 블룸 엠블럼',
        sub: 'MINIMALIST ATELIER CREST',
        desc: '왼쪽 가슴에 미니멀하게 새겨진 리틀블룸 시그니처 원형 엠블럼. 무독성 친환경 염료와 실로 수놓아 아이 입에 닿아도 안전합니다.',
        specs: ['무연 자수 스레드', '친환경 에코 패치', '하이엔드 미니멀 디자인'],
        x: 58,
        y: 28,
        zoomOrigin: '58% 28%',
        zoomScale: 2.6,
        targetAngle: 0,
        lastVisible: null
      },
      {
        id: 'snaps',
        num: '03',
        title: '안쪽 다리 무니켈 이지 스냅',
        sub: 'ERGONOMIC DIAPER SNAPS',
        desc: '아이를 눕힌 상태에서 빠르고 편안하게 기저귀를 교체할 수 있는 인체공학 아치형 스냅 구조. 알레르기 안심 YKK 무니켈 스냅을 적용했습니다.',
        specs: ['YKK 무니켈(Nickel-Free) 스냅', '5구 인체공학 곡선 배치', '간편 기저귀 퀵 오픈'],
        x: 50,
        y: 67,
        zoomOrigin: '50% 67%',
        zoomScale: 2.4,
        targetAngle: 0,
        lastVisible: null
      },
      {
        id: 'cuffs',
        num: '04',
        title: '2단 롤업 스마트 커프스',
        sub: '2-STAGE FOLDABLE CUFFS',
        desc: '아이의 빠른 성장에 맞추어 소매와 발목을 접거나 펴서 착용 가능한 2단 롤업 시스템. 찬바람을 막아주고 체온을 일정하게 유지합니다.',
        specs: ['2단계 길이 조절', '신축성 우수한 립 밴딩', '체온 보호 윈드블록'],
        x: 23,
        y: 45,
        zoomOrigin: '23% 45%',
        zoomScale: 2.5,
        targetAngle: 45,
        lastVisible: null
      },
      {
        id: 'backtag',
        num: '05',
        title: '오가닉 코튼 백 라벨',
        sub: 'AUTHENTIC ORGANIC EMBLEM',
        desc: '등 상단에 섬세하게 부착된 오가닉 인증 심볼 패치. 고급스러운 아틀리에 감성을 드러내는 시그니처 디테일입니다.',
        specs: ['친환경 패브릭 라벨', '피부 무접촉 겉감 부착', 'GOTS 공식 인증 로고'],
        x: 50,
        y: 20,
        zoomOrigin: '50% 20%',
        zoomScale: 2.4,
        targetAngle: 180,
        lastVisible: null
      }
    ];

    this.initDOM();
    this.preloadAllFrames();
    this.setupInteractions();
    this.startPhysicsLoop();
  }

  initDOM() {
    this.container.innerHTML = '';
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    this.container.style.userSelect = 'none';
    this.container.style.backgroundColor = '#F9F8F5';

    // 1. Studio Lighting Atmosphere Layer
    this.lightAtmosphere = document.createElement('div');
    this.lightAtmosphere.className = 'studio-lighting-layer lighting-studio';
    this.container.appendChild(this.lightAtmosphere);

    // 2. Main 360 Turntable Viewport Stage
    this.stage = document.createElement('div');
    this.stage.className = 'atelier-360-stage';
    this.stage.style.position = 'relative';
    this.stage.style.width = '100%';
    this.stage.style.height = '100%';
    this.stage.style.display = 'flex';
    this.stage.style.alignItems = 'center';
    this.stage.style.justifyContent = 'center';
    this.stage.style.transformOrigin = '50% 50%';
    this.stage.style.willChange = 'transform';
    this.container.appendChild(this.stage);

    // 3. High-Performance Display Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'atelier-360-canvas';
    this.canvas.width = 1024;
    this.canvas.height = 1024;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.objectFit = 'contain';
    this.canvas.style.cursor = 'grab';
    this.canvas.style.willChange = 'filter';
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.stage.appendChild(this.canvas);

    // 4. Hotspot Layer
    this.hotspotLayer = document.createElement('div');
    this.hotspotLayer.className = 'atelier-hotspot-layer';
    this.hotspotLayer.style.position = 'absolute';
    this.hotspotLayer.style.top = '0';
    this.hotspotLayer.style.left = '0';
    this.hotspotLayer.style.width = '100%';
    this.hotspotLayer.style.height = '100%';
    this.hotspotLayer.style.pointerEvents = 'none';
    this.stage.appendChild(this.hotspotLayer);

    // Render Hotspot Pins
    this.hotspotElements = {};
    this.hotspots.forEach(hp => {
      const pin = document.createElement('div');
      pin.className = 'haute-jewelry-hotspot';
      pin.id = `hotspot-${hp.id}`;
      pin.style.left = `${hp.x}%`;
      pin.style.top = `${hp.y}%`;
      pin.style.pointerEvents = 'auto';

      pin.innerHTML = `
        <div class="jewelry-ring"></div>
        <div class="jewelry-core"></div>
        <div class="jewelry-radar"></div>
        <span class="jewelry-number">${hp.num}</span>
      `;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        this.focusOnHotspot(hp);
      });

      this.hotspotLayer.appendChild(pin);
      this.hotspotElements[hp.id] = pin;
    });

    // 5. Black Glassmorphism Floating Top Controls
    this.controlsBar = document.createElement('div');
    this.controlsBar.className = 'three-floating-controls';
    this.controlsBar.innerHTML = `
      <button class="three-btn active" id="btnToggleRotate" title="360도 회전 멈춤/재생">
        <span>⏵ 회전 중</span>
      </button>
      <button class="three-btn" id="btnSpeedToggle" title="회전 속도 변경">
        <span id="speedLabel">1.0x</span>
      </button>
      <button class="three-btn" id="btnLightingToggle" title="조명 모드 전환">
        <span>💡 밀라노 스튜디오</span>
      </button>
      <button class="three-btn" id="btnResetView" title="기본 정면 뷰 복귀">
        <span>⟲ 시점 리셋</span>
      </button>
    `;
    this.container.appendChild(this.controlsBar);

    // 6. Haute Couture Specimen Placard Tooltip
    this.placard = document.createElement('div');
    this.placard.className = 'three-hotspot-tooltip';
    this.placard.id = 'atelierPlacard';
    this.placard.innerHTML = `
      <span class="tooltip-badge">ATELIER CRAFTSMANSHIP</span>
      <strong id="placardTitle">무자극 라운드 넥 & 오가닉 마감</strong>
      <p class="tooltip-sub" id="placardSub">COMFORT CREW NECKLINE</p>
      <p class="tooltip-body" id="placardDesc">민감한 아기 목둘레를 부드럽게 감싸는 1x1 립 조직 마감.</p>
      <ul class="tooltip-specs-list" id="placardSpecs"></ul>
      <button class="btn-tooltip-zoom-back" id="btnPlacardBack">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 12l6-6M3 12l6 6"/></svg>
        <span>⟲ 전신 뷰 복귀 (Toàn cảnh)</span>
      </button>
    `;
    this.container.appendChild(this.placard);

    // 7. Swiss-Watch Precision Angle Scrubber (0° — 360°)
    this.scrubberBar = document.createElement('div');
    this.scrubberBar.className = 'three-scrubber-bar';
    this.scrubberBar.innerHTML = `
      <div class="scrubber-header">
        <div class="dial-title-wrap">
          <span class="gold-sparkle">✦</span>
          <span class="scrubber-label">360° PRECISION DIAL:</span>
          <strong class="scrubber-val" id="scrubberValDisplay">0°</strong>
          <span class="scrubber-view-badge" id="scrubberViewName">정면 룩북 (FRONT)</span>
        </div>
        <div class="quick-angle-presets">
          <button class="preset-angle-btn active" data-angle="0">0° 정면</button>
          <button class="preset-angle-btn" data-angle="90">90° 우측</button>
          <button class="preset-angle-btn" data-angle="180">180° 후면</button>
          <button class="preset-angle-btn" data-angle="270">270° 좌측</button>
        </div>
      </div>
      <div class="slider-track-wrap">
        <input type="range" min="0" max="360" value="0" class="scrubber-slider" id="scrubberSlider" aria-label="360도 정밀 회전 다이얼">
        <div class="dial-tick-marks">
          <span>0°</span>
          <span>90°</span>
          <span>180°</span>
          <span>270°</span>
          <span>360°</span>
        </div>
      </div>
    `;
    this.container.appendChild(this.scrubberBar);

    // Cache All DOM References (Zero querySelector in render loop!)
    this.scrubberInput = document.getElementById('scrubberSlider');
    this.scrubberValDisplay = document.getElementById('scrubberValDisplay');
    this.scrubberViewName = document.getElementById('scrubberViewName');
    this.btnRotate = document.getElementById('btnToggleRotate');
    this.btnSpeed = document.getElementById('btnSpeedToggle');
    this.speedLabel = document.getElementById('speedLabel');
    this.btnLight = document.getElementById('btnLightingToggle');
    this.btnReset = document.getElementById('btnResetView');
    this.btnPlacardBack = document.getElementById('btnPlacardBack');
    this.presetBtns = Array.from(this.container.querySelectorAll('.preset-angle-btn'));
  }

  preloadAllFrames() {
    this.frameUrls.forEach((url, i) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.loadedImages[i] = img;
        this.imagesLoadedCount++;
        // Render initial frame immediately once frame 0 is available
        if (i === 0 && this.lastDrawnIndex === -1) {
          this.drawFrame(0);
        }
      };
      img.src = url;
    });
  }

  // ================= ULTRA-EFFICIENT 120 FPS DRAW ENGINE =================
  // Draws ONLY when frameIndex changes. Zero ghosting, zero CPU waste.
  drawFrame(frameIndex) {
    if (!this.ctx) return;
    const img = this.loadedImages[frameIndex];
    if (img && img.complete) {
      this.ctx.drawImage(img, 0, 0, 1024, 1024);
      this.lastDrawnIndex = frameIndex;
    }
  }

  // Zero-GC Hotspot Updates (Only updates DOM when visibility state actually toggles)
  updateHotspots(deg) {
    for (let i = 0; i < this.hotspots.length; i++) {
      const hp = this.hotspots[i];
      const pin = this.hotspotElements[hp.id];
      if (!pin) continue;

      let isVisible = true;
      if (hp.id === 'collar' || hp.id === 'badge' || hp.id === 'snaps') {
        isVisible = (deg >= 300 || deg <= 60);
      } else if (hp.id === 'backtag') {
        isVisible = (deg >= 120 && deg <= 240);
      } else if (hp.id === 'cuffs') {
        isVisible = !(deg >= 150 && deg <= 210);
      }

      // Check if state changed to avoid DOM thrashing
      if (hp.lastVisible !== isVisible || hp.lastZoomed !== this.isZoomed) {
        hp.lastVisible = isVisible;
        hp.lastZoomed = this.isZoomed;

        if (isVisible && !this.isZoomed) {
          pin.style.opacity = '1';
          pin.style.pointerEvents = 'auto';
          pin.style.transform = 'translate(-50%, -50%) scale(1)';
        } else if (this.isZoomed && this.activeHotspotId === hp.id) {
          pin.style.opacity = '1';
          pin.style.pointerEvents = 'auto';
          pin.style.transform = 'translate(-50%, -50%) scale(1.15)';
        } else {
          pin.style.opacity = '0';
          pin.style.pointerEvents = 'none';
          pin.style.transform = 'translate(-50%, -50%) scale(0.6)';
        }
      }
    }
  }

  // Zero-GC Scrubber Updates (Only updates when rounded degree integer changes)
  updateScrubberUI(deg) {
    const rounded = Math.round(deg);
    if (rounded === this.lastRoundedAngle) return;
    this.lastRoundedAngle = rounded;

    if (this.scrubberValDisplay) this.scrubberValDisplay.textContent = `${rounded}°`;
    if (this.scrubberInput && !this.isScrubbing) this.scrubberInput.value = rounded;

    if (this.scrubberViewName) {
      const nearestAngle = Math.round(rounded / 45) * 45 % 360;
      this.scrubberViewName.textContent = this.angleNames[nearestAngle] || '아틀리에 360°';
    }

    // Active preset buttons
    for (let i = 0; i < this.presetBtns.length; i++) {
      const btn = this.presetBtns[i];
      const btnAngle = parseFloat(btn.getAttribute('data-angle'));
      const diff = Math.abs(btnAngle - (rounded % 360));
      const isActive = (diff < 8 || diff > 352);
      if (btn.classList.contains('active') !== isActive) {
        btn.classList.toggle('active', isActive);
      }
    }
  }

  // ================= GSAP TICKER & EXPONENTIAL LERP PHYSICS LOOP =================
  // Ultra-fluid 60/120 FPS continuous rotation loop driven by GSAP Ticker
  startPhysicsLoop() {
    const tick = (time, deltaTime) => {
      const dt = Math.min((deltaTime ? deltaTime / 1000 : 0.016), 0.1);

      // 1. Auto-rotation progression
      if (this.isAutoRotate && !this.isDragging && !this.isScrubbing && !this.isZoomed) {
        const speedDeg = 20 * this.rotateSpeed; // 20 deg per second
        this.targetAngle += speedDeg * dt;
      }

      // 2. Exponential Physics Damping (Lerp factor 0.25)
      const diff = this.targetAngle - this.currentAngle;
      if (Math.abs(diff) > 0.001) {
        this.currentAngle += diff * 0.25;
      }

      // 3. Continuous wrapped angle & frame calculation (72 frames = 5.0 deg each)
      const normAngle = (window.gsap && gsap.utils && gsap.utils.wrap)
        ? gsap.utils.wrap(0, 360, this.currentAngle) 
        : ((this.currentAngle % 360) + 360) % 360;
      const frameIndex = Math.round(normAngle / this.degreesPerFrame) % this.totalFrames;

      // 4. Draw frame ONLY when index changes (Zero GPU overhead!)
      if (frameIndex !== this.lastDrawnIndex) {
        this.drawFrame(frameIndex);
      }

      // 5. Update UI & Hotspots with zero-GC caching
      this.updateHotspots(normAngle);
      this.updateScrubberUI(normAngle);
    };

    if (window.gsap && gsap.ticker) {
      gsap.ticker.add(tick);
    } else {
      let lastTime = performance.now();
      const rAF = (now) => {
        const dtMs = now - lastTime;
        lastTime = now;
        tick(now / 1000, dtMs);
        requestAnimationFrame(rAF);
      };
      requestAnimationFrame(rAF);
    }
  }

  // ================= CINEMATIC GSAP MACRO DOLLY-ZOOM =================
  focusOnHotspot(hp) {
    this.isZoomed = true;
    this.activeHotspotId = hp.id;
    this.isAutoRotate = false;
    this.updateRotateButtonUI();

    // 1. Smoothly glide to the optimal presentation angle for this detail
    const norm = ((this.targetAngle % 360) + 360) % 360;
    let shortestDelta = hp.targetAngle - norm;
    if (shortestDelta > 180) shortestDelta -= 360;
    if (shortestDelta < -180) shortestDelta += 360;
    this.targetAngle += shortestDelta;

    // 2. Cinematic Macro Dolly Zoom
    this.stage.style.transformOrigin = hp.zoomOrigin;
    if (window.gsap) {
      gsap.to(this.stage, {
        scale: hp.zoomScale,
        duration: 0.8,
        ease: 'expo.out'
      });

      // 3. Populate and Animate Haute Couture Placard
      document.getElementById('placardTitle').textContent = hp.title;
      document.getElementById('placardSub').textContent = hp.sub;
      document.getElementById('placardDesc').textContent = hp.desc;

      const specsEl = document.getElementById('placardSpecs');
      specsEl.innerHTML = '';
      hp.specs.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsEl.appendChild(li);
      });

      this.placard.classList.add('active');
      gsap.fromTo(this.placard, 
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)', delay: 0.1 }
      );
    } else {
      this.stage.style.transform = `scale(${hp.zoomScale})`;
      this.placard.classList.add('active');
    }

    if (window.showToast) {
      window.showToast(`[${hp.num}] ${hp.title} 매크로 포커스`, '✦');
    }
  }

  resetZoom() {
    this.isZoomed = false;
    this.activeHotspotId = null;

    if (window.gsap) {
      gsap.to(this.stage, {
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        onComplete: () => {
          this.stage.style.transformOrigin = '50% 50%';
        }
      });

      gsap.to(this.placard, {
        opacity: 0,
        scale: 0.92,
        y: 15,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          this.placard.classList.remove('active');
        }
      });
    } else {
      this.stage.style.transform = 'scale(1)';
      this.placard.classList.remove('active');
    }
  }

  rotateToAngleSmooth(targetPreset) {
    const norm = ((this.targetAngle % 360) + 360) % 360;
    let delta = targetPreset - norm;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    if (window.gsap) {
      gsap.to(this, {
        targetAngle: this.targetAngle + delta,
        duration: 0.85,
        ease: 'power3.inOut'
      });
    } else {
      this.targetAngle += delta;
    }
  }

  cycleLighting() {
    const modes = [
      { id: 'studio', label: '💡 밀라노 스튜디오', filter: 'brightness(1) contrast(1.02)' },
      { id: 'runway', label: '💡 런웨이 글래머', filter: 'brightness(1.08) contrast(1.18) saturate(1.06)' },
      { id: 'sunset', label: '💡 웜 선셋 (황혼)', filter: 'brightness(1.04) contrast(1.05) sepia(0.22) saturate(1.15)' }
    ];

    let nextIdx = 0;
    if (this.currentLighting === 'studio') nextIdx = 1;
    else if (this.currentLighting === 'runway') nextIdx = 2;
    else nextIdx = 0;

    const selected = modes[nextIdx];
    this.currentLighting = selected.id;
    this.btnLight.innerHTML = `<span>${selected.label}</span>`;

    if (window.gsap) {
      gsap.to(this.canvas, {
        filter: selected.filter,
        duration: 0.45,
        ease: 'sine.out'
      });
    } else {
      this.canvas.style.filter = selected.filter;
    }

    if (window.showToast) {
      window.showToast(`${selected.label} 모드로 전환되었습니다.`, '💡');
    }
  }

  updateRotateButtonUI() {
    if (this.btnRotate) {
      this.btnRotate.classList.toggle('active', this.isAutoRotate);
      this.btnRotate.innerHTML = this.isAutoRotate ? '<span>⏵ 회전 중</span>' : '<span>⏸ 일시정지</span>';
    }
  }

  setColor(colorKey) {
    this.currentColor = colorKey;
    const filter = (colorKey === 'beige') 
      ? 'sepia(0.28) saturate(0.82) brightness(1.08)' 
      : 'brightness(1) contrast(1.02)';
    if (window.gsap) {
      gsap.to(this.canvas, { filter: filter, duration: 0.4 });
    } else {
      this.canvas.style.filter = filter;
    }
  }

  onResize() {
    if (this.lastDrawnIndex >= 0) {
      this.drawFrame(this.lastDrawnIndex);
    }
  }

  // ================= DIRECT KINETIC INTERACTION HANDLERS =================
  setupInteractions() {
    const onStart = (clientX) => {
      if (this.isZoomed) return;
      this.isDragging = true;
      this.dragStartX = clientX;
      this.dragStartAngle = this.targetAngle;
      this.lastMoveX = clientX;
      this.lastMoveTime = performance.now();
      this.velocity = 0;
      this.canvas.style.cursor = 'grabbing';
      if (window.gsap) gsap.killTweensOf(this);
    };

    const onMove = (clientX) => {
      if (!this.isDragging) return;
      const now = performance.now();
      const dt = Math.max(now - this.lastMoveTime, 1);
      const dx = clientX - this.lastMoveX;
      this.velocity = (dx / dt); // pixels per ms
      this.lastMoveX = clientX;
      this.lastMoveTime = now;

      const totalDelta = clientX - this.dragStartX;
      // Direct, responsive update without tween queue latency
      this.targetAngle = this.dragStartAngle - (totalDelta * this.sensitivity);
    };

    const onEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';

      // Kinetic Inertia Coasting
      if (Math.abs(this.velocity) > 0.25) {
        const momentumDeg = -this.velocity * 120;
        this.targetAngle += momentumDeg;
      }
    };

    // 1. GSAP Observer (Unified pointer, touch, and momentum handling)
    if (window.Observer) {
      Observer.create({
        target: this.canvas,
        type: 'pointer,touch',
        dragMinimum: 1,
        onPress: () => {
          if (this.isZoomed) return;
          this.isDragging = true;
          this.canvas.style.cursor = 'grabbing';
          if (window.gsap) gsap.killTweensOf(this);
        },
        onDrag: (self) => {
          if (this.isZoomed) return;
          this.targetAngle -= self.deltaX * this.sensitivity;
        },
        onRelease: (self) => {
          this.isDragging = false;
          this.canvas.style.cursor = 'grab';
          const vx = self.velocityX;
          if (Math.abs(vx) > 60) {
            this.targetAngle -= vx * 0.08;
          }
        }
      });
    } else {
      // Direct Pointer Fallback
      this.canvas.addEventListener('mousedown', (e) => onStart(e.clientX));
      window.addEventListener('mousemove', (e) => onMove(e.clientX));
      window.addEventListener('mouseup', onEnd);

      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) onStart(e.touches[0].clientX);
      }, { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) onMove(e.touches[0].clientX);
      }, { passive: true });
      window.addEventListener('touchend', onEnd);
    }

    // 2. Precision Scrubber Input
    this.isScrubbing = false;
    this.scrubberInput.addEventListener('mousedown', () => {
      this.isScrubbing = true;
      this.isAutoRotate = false;
      this.updateRotateButtonUI();
      if (window.gsap) gsap.killTweensOf(this);
    });
    window.addEventListener('mouseup', () => {
      this.isScrubbing = false;
    });
    this.scrubberInput.addEventListener('input', (e) => {
      const deg = parseFloat(e.target.value);
      this.targetAngle = deg;
    });

    // 3. Quick Angle Preset Buttons
    this.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.resetZoom();
        const angle = parseFloat(btn.getAttribute('data-angle'));
        this.rotateToAngleSmooth(angle);
        if (this.scrubberInput) this.scrubberInput.value = angle;
      });
    });

    // 4. Floating Bar Buttons
    this.btnRotate.addEventListener('click', () => {
      this.isAutoRotate = !this.isAutoRotate;
      if (this.isAutoRotate && this.isZoomed) this.resetZoom();
      this.updateRotateButtonUI();
    });

    this.btnSpeed.addEventListener('click', () => {
      if (this.rotateSpeed === 1.0) {
        this.rotateSpeed = 2.0;
        this.speedLabel.textContent = '2.0x';
      } else if (this.rotateSpeed === 2.0) {
        this.rotateSpeed = 0.5;
        this.speedLabel.textContent = '0.5x';
      } else {
        this.rotateSpeed = 1.0;
        this.speedLabel.textContent = '1.0x';
      }
    });

    this.btnLight.addEventListener('click', () => {
      this.cycleLighting();
    });

    this.btnReset.addEventListener('click', () => {
      this.resetZoom();
      this.rotateToAngleSmooth(0);
      this.isAutoRotate = true;
      this.updateRotateButtonUI();
      if (window.showToast) window.showToast('기본 정면 뷰로 복귀되었습니다.', '⟲');
    });

    this.btnPlacardBack.addEventListener('click', () => {
      this.resetZoom();
    });

    this.canvas.addEventListener('click', () => {
      if (this.isZoomed) this.resetZoom();
    });
  }
}

// Global initialization
window.Romper3DViewer = Romper3DViewer;
window.initRomper3DViewer = function() {
  if (document.getElementById('romper3DContainer')) {
    window.romperViewerInstance = new Romper3DViewer('romper3DContainer');
    return window.romperViewerInstance;
  }
};
