// Little Bloom - Ultra-Realistic Haute Couture 3D Baby Romper Virtual Atelier
// 72-Frame Cinema-Grade Photogrammetric 360 Turntable Engine (5.0° Per Frame Precision)
// GSAP 3 Observer, PointerCapture Physics, Kinetic Inertia, Laser 3D Scan & Macro Dolly-Zoom

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
    this.sensitivity = 0.75; // Responsive degrees per mouse pixel

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
        title: '시그니처 선인장 엠보싱 배지',
        sub: 'MINIMALIST ATELIER CREST',
        desc: '왼쪽 가슴에 미니멀하게 새겨진 리틀블룸 시그니처 원형 엠블럼. 무독성 친환경 염료와 실로 수놓아 아이 입에 닿아도 안전합니다.',
        specs: ['무연 자수 스레드', '친환경 에코 패치', '핸드메이드 미니멀 디자인'],
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
        desc: '아이를 눕힌 상태에서 빠르고 편안하게 기저귀를 교체할 수 있는 인체공학 위치의 스냅 구조. 알레르기 안심 YKK 무니켈 스냅을 적용했습니다.',
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
        desc: '등 상단에 섬세하게 부착된 오가닉 인증 실크 패치. 고급스러운 아틀리에 감성을 드러내는 시그니처 디테일입니다.',
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
    this.container.style.touchAction = 'none';

    // 1. Studio Lighting Atmosphere Layer
    this.lightAtmosphere = document.createElement('div');
    this.lightAtmosphere.className = 'studio-lighting-layer lighting-studio';
    this.container.appendChild(this.lightAtmosphere);

    // 2. 3D Laser Scan Sweep Overlay
    this.scannerOverlay = document.createElement('div');
    this.scannerOverlay.className = 'three-scanner-overlay';
    this.scannerOverlay.innerHTML = `
      <div class="scanner-beam"></div>
      <div class="scanner-data-box">
        <span class="scanner-dot"></span>
        <span class="scanner-status">✦ 3D PHOTOGRAMMETRIC RECONSTRUCTION</span>
        <span class="scanner-pct" id="scannerPct">100%</span>
      </div>
    `;
    this.container.appendChild(this.scannerOverlay);

    // 3. Main 360 Turntable Viewport Stage
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
    this.stage.style.touchAction = 'none';
    this.container.appendChild(this.stage);

    // 4. High-Performance Display Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'atelier-360-canvas';
    this.canvas.width = 1024;
    this.canvas.height = 1024;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.objectFit = 'contain';
    this.canvas.style.cursor = 'grab';
    this.canvas.style.willChange = 'filter';
    this.canvas.style.touchAction = 'none';
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.stage.appendChild(this.canvas);

    // 5. Hotspot Layer
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

    // 6. Floating Controls Bar (Black Glassmorphism Pill)
    this.controlsBar = document.createElement('div');
    this.controlsBar.className = 'three-controls-bar';
    this.controlsBar.innerHTML = `
      <div class="control-badge-hint" id="threeLookbookBadge">
        <span class="pulse-gold-dot"></span>
        <span id="threeAngleText">정면 룩북 (0°)</span>
      </div>
      <div class="three-actions-cluster">
        <button class="three-btn active" id="btnThreeRotate" title="360° 자동 회전">⏵ 회전 중</button>
        <button class="three-btn" id="btnThreeSpeed" title="회전 속도">1.0x</button>
        <button class="three-btn" id="btnThreeLighting" title="스튜디오 조명 변환">💡 스튜디오</button>
        <button class="three-btn" id="btnThreeReset" title="시점 원위치">⟲ 리셋</button>
      </div>
    `;
    this.container.appendChild(this.controlsBar);

    this.angleBadgeText = this.controlsBar.querySelector('#threeAngleText');
    this.btnRotate = this.controlsBar.querySelector('#btnThreeRotate');
    this.btnSpeed = this.controlsBar.querySelector('#btnThreeSpeed');
    this.btnLight = this.controlsBar.querySelector('#btnThreeLighting');
    this.btnReset = this.controlsBar.querySelector('#btnThreeReset');

    // 7. Swiss Watch Precision Bezel Scrubber Module
    this.scrubberModule = document.createElement('div');
    this.scrubberModule.className = 'three-scrubber-bar';
    this.scrubberModule.innerHTML = `
      <div class="scrubber-header">
        <div class="dial-title-wrap">
          <span class="gold-sparkle">✦</span>
          <span class="scrubber-label">360° PRECISION DIAL</span>
          <span class="scrubber-val" id="scrubberDegDisplay">0°</span>
        </div>
        <div class="quick-angle-presets">
          <button class="preset-angle-btn active" data-angle="0">0° 정면</button>
          <button class="preset-angle-btn" data-angle="90">90° 우측</button>
          <button class="preset-angle-btn" data-angle="180">180° 후면</button>
          <button class="preset-angle-btn" data-angle="270">270° 좌측</button>
        </div>
        <span class="scrubber-view-badge" id="scrubberViewBadge">정면 룩북 (0°)</span>
      </div>
      <div class="slider-track-wrap">
        <input type="range" class="scrubber-slider" id="scrubberRange" min="0" max="360" step="0.5" value="0">
        <div class="dial-tick-marks">
          <span>0°</span>
          <span>45°</span>
          <span>90°</span>
          <span>135°</span>
          <span>180°</span>
          <span>225°</span>
          <span>270°</span>
          <span>315°</span>
          <span>360°</span>
        </div>
      </div>
    `;
    this.container.appendChild(this.scrubberModule);

    this.scrubberInput = this.scrubberModule.querySelector('#scrubberRange');
    this.scrubberDisplay = this.scrubberModule.querySelector('#scrubberDegDisplay');
    this.scrubberViewBadge = this.scrubberModule.querySelector('#scrubberViewBadge');
    this.presetBtns = this.scrubberModule.querySelectorAll('.preset-angle-btn');

    // 8. Haute Couture Specimen Placard
    this.placard = document.createElement('div');
    this.placard.className = 'haute-specimen-placard';
    this.placard.id = 'hautePlacard';
    this.placard.innerHTML = `
      <div class="placard-inner">
        <div class="placard-top-bar">
          <span class="placard-num" id="placardNum">DETAIL 01</span>
          <span class="placard-gucci-seal">LITTLE BLOOM ATELIER</span>
          <button class="placard-close-btn" id="placardCloseBtn" aria-label="닫기">✕</button>
        </div>
        <h4 class="placard-title" id="placardTitle">무자극 라운드 넥 & 오가닉 마감</h4>
        <p class="placard-sub" id="placardSub">COMFORT CREW NECKLINE</p>
        <p class="placard-desc" id="placardDesc">민감한 아기 목둘레를 부드럽게 감싸는 1x1 립 조직 마감.</p>
        <ul class="placard-specs-list" id="placardSpecs"></ul>
        <div class="placard-footer-hint">⟲ 빈 공간을 클릭하면 전체 시점으로 복귀합니다.</div>
      </div>
    `;
    this.container.appendChild(this.placard);

    this.btnPlacardClose = this.placard.querySelector('#placardCloseBtn');

    // Trigger Laser Scan Sweep Animation
    this.triggerLaserScan();
  }

  triggerLaserScan() {
    if (!this.scannerOverlay) return;
    const beam = this.scannerOverlay.querySelector('.scanner-beam');
    const pct = this.scannerOverlay.querySelector('#scannerPct');

    if (window.gsap) {
      const tl = gsap.timeline();
      tl.to(beam, { duration: 1.1, top: '100%', ease: 'power1.inOut' });
      tl.to({ v: 0 }, {
        duration: 1.1,
        v: 100,
        ease: 'none',
        onUpdate: function() {
          if (pct) pct.textContent = `${Math.round(this.targets()[0].v)}%`;
        }
      }, 0);
      tl.to(this.scannerOverlay, {
        duration: 0.4,
        opacity: 0,
        delay: 0.1,
        onComplete: () => {
          this.scannerOverlay.style.display = 'none';
        }
      });
    } else {
      setTimeout(() => {
        this.scannerOverlay.style.display = 'none';
      }, 1200);
    }
  }

  // ================= FRAME PRELOADING =================
  preloadAllFrames() {
    for (let i = 0; i < this.totalFrames; i++) {
      const img = new Image();
      img.onload = () => {
        this.loadedImages[i] = img;
        this.imagesLoadedCount++;
        if (i === 0 && this.lastDrawnIndex === -1) {
          this.drawFrame(0);
        }
      };
      img.onerror = () => {
        this.loadedImages[i] = this.loadedImages[0] || null;
      };
      img.src = this.frameUrls[i];
    }
  }

  drawFrame(index) {
    const img = this.loadedImages[index] || this.loadedImages[0];
    if (!img) return;

    this.ctx.drawImage(img, 0, 0, 1024, 1024);
    this.lastDrawnIndex = index;
  }

  // ================= PHYSICS & RENDER LOOP =================
  startPhysicsLoop() {
    const tick = (time, deltaTime) => {
      const dt = Math.min((deltaTime ? deltaTime / 1000 : 0.016), 0.1);

      // 1. Auto-rotation
      if (this.isAutoRotate && !this.isDragging && !this.isScrubbing && !this.isZoomed) {
        const speedDeg = 24 * this.rotateSpeed; // 24 deg/s
        this.targetAngle += speedDeg * dt;
      }

      // 2. Exponential Physics Damping (Lerp factor 0.3)
      const diff = this.targetAngle - this.currentAngle;
      if (Math.abs(diff) > 0.001) {
        this.currentAngle += diff * 0.3;
      }

      // 3. Continuous wrapped angle & frame calculation (72 frames = 5.0 deg each)
      const normAngle = ((this.currentAngle % 360) + 360) % 360;
      const frameIndex = Math.round(normAngle / this.degreesPerFrame) % this.totalFrames;

      // 4. Draw frame ONLY when index changes (Zero-GC optimization)
      if (frameIndex !== this.lastDrawnIndex) {
        this.drawFrame(frameIndex);
      }

      // 5. Update UI & Hotspots
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

  updateHotspots(normAngle) {
    this.hotspots.forEach(hp => {
      const el = this.hotspotElements[hp.id];
      if (!el) return;

      // Calculate angular distance to optimal viewing angle
      let angleDist = Math.abs(normAngle - hp.targetAngle);
      if (angleDist > 180) angleDist = 360 - angleDist;

      // Hotspot is visible within 65 degrees of target angle
      const isVisible = angleDist <= 65;

      if (isVisible !== hp.lastVisible) {
        hp.lastVisible = isVisible;
        if (isVisible) {
          el.style.opacity = '1';
          el.style.pointerEvents = 'auto';
          el.style.transform = 'translate(-50%, -50%) scale(1)';
        } else {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.style.transform = 'translate(-50%, -50%) scale(0.6)';
        }
      }
    });
  }

  updateScrubberUI(normAngle) {
    const rounded = Math.round(normAngle);
    if (rounded === this.lastRoundedAngle) return;
    this.lastRoundedAngle = rounded;

    // 1. Scrubber Degree Display
    if (this.scrubberDisplay) {
      this.scrubberDisplay.textContent = `${rounded}°`;
    }

    // 2. Range Input Value
    if (this.scrubberInput && !this.isScrubbing) {
      this.scrubberInput.value = rounded;
    }

    // 3. Lookbook Angle Header Badge Text
    const nearestPreset = Math.round(rounded / 45) * 45 % 360;
    const viewName = this.angleNames[nearestPreset] || `${rounded}° 시점`;
    if (this.angleBadgeText) {
      this.angleBadgeText.textContent = `${viewName} (${rounded}°)`;
    }
    if (this.scrubberViewBadge) {
      this.scrubberViewBadge.textContent = `${viewName} (${rounded}°)`;
    }

    // 4. Highlight Preset Buttons
    if (this.presetBtns) {
      this.presetBtns.forEach(btn => {
        const bDeg = parseInt(btn.getAttribute('data-angle'), 10);
        const isCurrent = Math.abs(rounded - bDeg) < 15 || (bDeg === 0 && rounded > 345);
        btn.classList.toggle('active', isCurrent);
      });
    }
  }

  // ================= MACRO DOLLY-ZOOM HOTSPOTS =================
  focusOnHotspot(hp) {
    this.isZoomed = true;
    this.activeHotspotId = hp.id;
    this.isAutoRotate = false;
    this.updateRotateButtonUI();

    // Smoothly glide angle to detail orientation
    const norm = ((this.targetAngle % 360) + 360) % 360;
    let shortestDelta = hp.targetAngle - norm;
    if (shortestDelta > 180) shortestDelta -= 360;
    if (shortestDelta < -180) shortestDelta += 360;
    this.targetAngle += shortestDelta;

    // Macro Dolly Zoom
    this.stage.style.transformOrigin = hp.zoomOrigin;
    if (window.gsap) {
      gsap.to(this.stage, {
        scale: hp.zoomScale,
        duration: 0.8,
        ease: 'expo.out'
      });
    } else {
      this.stage.style.transform = `scale(${hp.zoomScale})`;
    }

    // Populate Specimen Placard
    this.placard.querySelector('#placardNum').textContent = `DETAIL ${hp.num}`;
    this.placard.querySelector('#placardTitle').textContent = hp.title;
    this.placard.querySelector('#placardSub').textContent = hp.sub;
    this.placard.querySelector('#placardDesc').textContent = hp.desc;

    const specsEl = this.placard.querySelector('#placardSpecs');
    specsEl.innerHTML = '';
    hp.specs.forEach(spec => {
      const li = document.createElement('li');
      li.textContent = spec;
      specsEl.appendChild(li);
    });

    this.placard.classList.add('active');
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
    } else {
      this.stage.style.transform = 'scale(1)';
    }

    this.placard.classList.remove('active');
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
      { id: 'studio', label: '💡 스튜디오', filter: 'brightness(1) contrast(1.02)' },
      { id: 'runway', label: '💡 런웨이', filter: 'brightness(1.08) contrast(1.18) saturate(1.06)' },
      { id: 'sunset', label: '💡 웜 선셋', filter: 'brightness(1.04) contrast(1.05) sepia(0.22) saturate(1.15)' }
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
  }

  updateRotateButtonUI() {
    if (this.btnRotate) {
      this.btnRotate.classList.toggle('active', this.isAutoRotate);
      this.btnRotate.innerHTML = this.isAutoRotate ? '<span>⏵ 회전 중</span>' : '<span>⏸ 정지됨</span>';
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
      this.velocity = (dx / dt);
      this.lastMoveX = clientX;
      this.lastMoveTime = now;

      const totalDelta = clientX - this.dragStartX;
      this.targetAngle = this.dragStartAngle - (totalDelta * this.sensitivity);
    };

    const onEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';

      // Kinetic Inertia Coasting
      if (Math.abs(this.velocity) > 0.2) {
        const momentumDeg = -this.velocity * 90;
        this.targetAngle += momentumDeg;
      }
    };

    // Modern Unified Pointer Events with setPointerCapture (100% Reliable Everywhere)
    this.canvas.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      try { this.canvas.setPointerCapture(e.pointerId); } catch(err) {}
      onStart(e.clientX);
    });

    this.canvas.addEventListener('pointermove', (e) => {
      onMove(e.clientX);
    });

    const finishPointer = (e) => {
      try { this.canvas.releasePointerCapture(e.pointerId); } catch(err) {}
      onEnd();
    };

    this.canvas.addEventListener('pointerup', finishPointer);
    this.canvas.addEventListener('pointercancel', finishPointer);

    // Global Window Fallback Listeners
    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) onMove(e.clientX);
    });
    window.addEventListener('pointerup', () => {
      if (this.isDragging) onEnd();
    });

    // Precision Scrubber Input
    this.isScrubbing = false;
    this.scrubberInput.addEventListener('pointerdown', () => {
      this.isScrubbing = true;
      this.isAutoRotate = false;
      this.updateRotateButtonUI();
      if (window.gsap) gsap.killTweensOf(this);
    });

    window.addEventListener('pointerup', () => {
      this.isScrubbing = false;
    });

    this.scrubberInput.addEventListener('input', (e) => {
      const deg = parseFloat(e.target.value);
      this.targetAngle = deg;
    });

    // Quick Angle Preset Buttons
    this.presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.resetZoom();
        const angle = parseFloat(btn.getAttribute('data-angle'));
        this.rotateToAngleSmooth(angle);
      });
    });

    // Floating Bar Buttons
    this.btnRotate.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isAutoRotate = !this.isAutoRotate;
      if (this.isAutoRotate && this.isZoomed) this.resetZoom();
      this.updateRotateButtonUI();
    });

    const speeds = [1.0, 1.5, 2.0, 0.5];
    let spIdx = 0;
    this.btnSpeed.addEventListener('click', (e) => {
      e.stopPropagation();
      spIdx = (spIdx + 1) % speeds.length;
      this.rotateSpeed = speeds[spIdx];
      this.btnSpeed.textContent = `${this.rotateSpeed.toFixed(1)}x`;
    });

    this.btnLight.addEventListener('click', (e) => {
      e.stopPropagation();
      this.cycleLighting();
    });

    this.btnReset.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetZoom();
      this.rotateToAngleSmooth(0);
      this.isAutoRotate = true;
      this.updateRotateButtonUI();
    });

    // Placard Close & Canvas Click
    if (this.btnPlacardClose) {
      this.btnPlacardClose.addEventListener('click', (e) => {
        e.stopPropagation();
        this.resetZoom();
      });
    }

    this.canvas.addEventListener('click', () => {
      if (this.isZoomed) this.resetZoom();
    });
  }
}

// Attach to window
window.Romper3DViewer = Romper3DViewer;
