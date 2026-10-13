// Little Bloom - Haute Couture 3D Garment Atelier (Three.js WebGL Real-time Mesh Engine)
// Full 360° Horizontal Orbit, Vertical Tilt, Zoom, Physical Mesh Curvature, Dynamic Lights & 3D Hotspots

class Romper3DViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.clientWidth || 500;
    this.height = this.container.clientHeight || 500;

    this.isAutoRotate = true;
    this.rotateSpeed = 1.0;
    this.currentLighting = 'studio';
    this.activeHotspotId = null;
    this.isZoomed = false;

    // View Angle Names
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

    // 3D Hotspot Data with Exact 3D Model Coordinates
    this.hotspots = [
      {
        id: 'collar',
        num: '01',
        title: '무자극 라운드 넥 & 오가닉 마감',
        sub: 'COMFORT CREW NECKLINE',
        desc: '민감한 아기 목둘레를 부드럽게 감싸는 1x1 립 조직 마감. 목 뒤 택(Tag)은 외부에 배치하여 피부 마찰을 원천 차단했습니다.',
        specs: ['100% GOTS 오가닉 코튼', '무자극 플랫록 스티치', '외부 봉제 케어 라벨'],
        pos: new THREE.Vector3(0, 0.82, 0.22),
        normal: new THREE.Vector3(0, 0.2, 1).normalize(),
        targetCam: new THREE.Vector3(0, 0.85, 1.8),
        targetLook: new THREE.Vector3(0, 0.78, 0.1)
      },
      {
        id: 'badge',
        num: '02',
        title: '선인장 시그니처 엠보싱 배지',
        sub: 'SIGNATURE EMBOSSED BADGE',
        desc: '자연에서 영감받은 미니멀하고 사랑스러운 시그니처 선인장 모티브. 친환경 무독성 천연 염료로 아기 입에 닿아도 안전합니다.',
        specs: ['친환경 무독성 소재', '소프트 라운딩 엣지', '입체 엠보싱 공법'],
        pos: new THREE.Vector3(0.24, 0.58, 0.26),
        normal: new THREE.Vector3(0.1, 0, 1).normalize(),
        targetCam: new THREE.Vector3(0.3, 0.6, 1.6),
        targetLook: new THREE.Vector3(0.24, 0.58, 0.2)
      },
      {
        id: 'snaps',
        num: '03',
        title: '이지 체인지 가랑이 스냅 버튼',
        sub: 'EASY-CHANGE DIAPER SNAPS',
        desc: '기저귀 교체 시 옷을 다 벗기지 않고 밑단만 개폐할 수 있는 인체공학 스냅 구조. 알레르기 안심 무니켈 YKK 스냅을 적용했습니다.',
        specs: ['YKK 정품 무니켈 스냅', '밑단 풀 오픈 방식', '기저귀 여유 입체 패턴'],
        pos: new THREE.Vector3(0, -0.52, 0.18),
        normal: new THREE.Vector3(0, -0.2, 1).normalize(),
        targetCam: new THREE.Vector3(0, -0.5, 1.8),
        targetLook: new THREE.Vector3(0, -0.55, 0.1)
      },
      {
        id: 'cuffs',
        num: '04',
        title: '2-WAY 턴업 롤업 밴딩 소매 & 발목',
        sub: '2-WAY EXTENDABLE CUFFS',
        desc: '아기 성장에 맞춰 소매와 발목을 접거나 펼쳐 입히는 2단계 확장 시스템. 바람을 막아주고 체온을 포근하게 유지합니다.',
        specs: ['무압박 신축 립 밴드', '성장 맞춤 2-Way 확장', '흘러내림 방지 설계'],
        pos: new THREE.Vector3(-0.92, 0.22, 0.14),
        normal: new THREE.Vector3(-0.8, 0, 0.6).normalize(),
        targetCam: new THREE.Vector3(-1.0, 0.25, 1.7),
        targetLook: new THREE.Vector3(-0.85, 0.2, 0.1)
      },
      {
        id: 'backtag',
        num: '05',
        title: '외장형 럭셔리 라벨 & 시그니처 헴',
        sub: 'EXTERNAL ATELIER LABEL',
        desc: '옷 안쪽에 상처가 나지 않도록 외부에 봉제된 아뜰리에 시그니처 라벨. 매끄러운 오가닉 원단 결이 돋보이는 후면 실루엣입니다.',
        specs: ['피부 자극 제로 외장 라벨', '프리미엄 봉제 마감', '등 결림 없는 플랫 디자인'],
        pos: new THREE.Vector3(0, 0.80, -0.22),
        normal: new THREE.Vector3(0, 0, -1).normalize(),
        targetCam: new THREE.Vector3(0, 0.85, -1.8),
        targetLook: new THREE.Vector3(0, 0.78, -0.1)
      }
    ];

    this.init();
  }

  init() {
    this.container.innerHTML = '';

    // 1. Build Overlay UI (Controls, Scanner, Bezel Dial, Spec Placard)
    this.buildUI();

    // 2. Initialize Three.js WebGL Scene
    this.initThree();

    // 3. Build 3D Mesh & Materials
    this.build3DGarment();

    // 4. Create 3D Hotspot DOM Elements
    this.initHotspots();

    // 5. Setup Window Events
    window.addEventListener('resize', () => this.onResize());

    // 6. Trigger 3D Scan Laser Effect
    this.trigger3DScanAnimation();

    // 7. Start Render Loop
    this.animate();
  }

  buildUI() {
    // 3D Scanner Overlay
    this.scannerOverlay = document.createElement('div');
    this.scannerOverlay.className = 'three-scanner-overlay';
    this.scannerOverlay.innerHTML = `
      <div class="scanner-beam"></div>
      <div class="scanner-data-box">
        <span class="scanner-dot"></span>
        <span class="scanner-status">✦ 3D PHOTOGRAMMETRIC MESH SCANNING</span>
        <span class="scanner-pct" id="scannerPct">0%</span>
      </div>
    `;
    this.container.appendChild(this.scannerOverlay);

    // Floating Glass Controls Bar
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

    // Bottom Swiss Precision Dial
    this.dialContainer = document.createElement('div');
    this.dialContainer.className = 'three-bezel-container';
    this.dialContainer.innerHTML = `
      <div class="bezel-track-wrap">
        <div class="bezel-dial-header">
          <span class="bezel-title">✦ 3D PRECISION ORBIT DIAL</span>
          <span class="bezel-value" id="bezelValueText">0°</span>
        </div>
        <div class="bezel-ticks-track" id="bezelTrack">
          <!-- Dial ticks generated dynamically -->
        </div>
        <div class="bezel-cursor-needle"></div>
      </div>
      <div class="bezel-presets-row">
        <button class="bezel-preset-btn active" data-deg="0">0° 정면</button>
        <button class="bezel-preset-btn" data-deg="90">90° 우측</button>
        <button class="bezel-preset-btn" data-deg="180">180° 후면</button>
        <button class="bezel-preset-btn" data-deg="270">270° 좌측</button>
      </div>
    `;
    this.container.appendChild(this.dialContainer);

    // Haute Couture Specimen Placard
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
        <div class="placard-specs-list" id="placardSpecs"></div>
        <div class="placard-footer-hint">⟲ 빈 공간을 클릭하면 전체 시점으로 복귀합니다.</div>
      </div>
    `;
    this.container.appendChild(this.placard);

    // Generate Swiss Bezel Dial Ticks
    this.renderBezelTicks();

    // Bind Controls UI Events
    this.bindControlsEvents();
  }

  renderBezelTicks() {
    const track = this.dialContainer.querySelector('#bezelTrack');
    if (!track) return;
    let ticksHtml = '';
    for (let deg = 0; deg <= 360; deg += 5) {
      const isMajor = deg % 45 === 0;
      const isMedium = deg % 15 === 0 && !isMajor;
      const cls = isMajor ? 'major' : isMedium ? 'medium' : 'minor';
      ticksHtml += `
        <div class="bezel-tick ${cls}" data-deg="${deg}">
          ${isMajor ? `<span class="tick-label">${deg}°</span>` : ''}
        </div>
      `;
    }
    track.innerHTML = ticksHtml;
  }

  initThree() {
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
    this.defaultCamPos = new THREE.Vector3(0, 0, 4.2);
    this.defaultTarget = new THREE.Vector3(0, 0, 0);
    this.camera.position.copy(this.defaultCamPos);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.85;
    this.controls.zoomSpeed = 0.8;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 6.2;
    this.controls.maxPolarAngle = Math.PI * 0.82; // Bound vertical tilt
    this.controls.minPolarAngle = Math.PI * 0.18;
    this.controls.autoRotate = this.isAutoRotate;
    this.controls.autoRotateSpeed = 2.0;
    this.controls.target.copy(this.defaultTarget);

    // Studio Lights
    this.setupLighting();
  }

  setupLighting() {
    this.lightsGroup = new THREE.Group();
    this.scene.add(this.lightsGroup);

    // Ambient
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.lightsGroup.add(this.ambientLight);

    // Main Studio Key Light
    this.keyLight = new THREE.DirectionalLight(0xfff8ee, 1.6);
    this.keyLight.position.set(3, 4, 4);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.lightsGroup.add(this.keyLight);

    // Fill Light
    this.fillLight = new THREE.DirectionalLight(0xe8f0ea, 0.9);
    this.fillLight.position.set(-3, 2, 3);
    this.lightsGroup.add(this.fillLight);

    // Rim Backlight (Highlighting cloth silhouette)
    this.rimLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    this.rimLight.position.set(0, 3, -4);
    this.lightsGroup.add(this.rimLight);
  }

  build3DGarment() {
    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    const textureLoader = new THREE.TextureLoader();

    // 1. Front High-Res Texture
    const frontTex = textureLoader.load('assets/romper_front_cutout.png', () => {
      this.renderer.render(this.scene, this.camera);
    });
    frontTex.colorSpace = THREE.SRGBColorSpace;

    // 2. Back High-Res Texture
    const backTex = textureLoader.load('assets/romper_back_cutout.png', () => {
      this.renderer.render(this.scene, this.camera);
    });
    backTex.colorSpace = THREE.SRGBColorSpace;

    const W = 2.2;
    const H = 2.6;
    const segX = 48;
    const segY = 48;

    // A. Front Curved 3D Shell
    const frontGeo = new THREE.PlaneGeometry(W, H, segX, segY);
    const pos = frontGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const nx = x / (W * 0.5);
      const ny = y / (H * 0.5);
      const radX = 1 - Math.min(1, Math.abs(nx));
      const radY = Math.max(0, 1 - Math.abs(ny - 0.15));
      let z = 0.20 * Math.sin(radX * Math.PI * 0.5) * Math.sin(radY * Math.PI * 0.5);
      if (y > 0 && y < 0.75) z += 0.03 * (1 - Math.abs(nx)); // Soft chest volume
      pos.setZ(i, z);
    }
    frontGeo.computeVertexNormals();

    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      transparent: true,
      alphaTest: 0.18,
      roughness: 0.82,
      metalness: 0.04,
      side: THREE.FrontSide
    });
    this.frontMesh = new THREE.Mesh(frontGeo, frontMat);
    this.frontMesh.castShadow = true;
    this.modelGroup.add(this.frontMesh);

    // B. Back Curved 3D Shell
    const backGeo = new THREE.PlaneGeometry(W, H, segX, segY);
    const bPos = backGeo.attributes.position;
    for (let i = 0; i < bPos.count; i++) {
      const x = bPos.getX(i);
      const y = bPos.getY(i);
      const nx = x / (W * 0.5);
      const ny = y / (H * 0.5);
      const radX = 1 - Math.min(1, Math.abs(nx));
      const radY = Math.max(0, 1 - Math.abs(ny - 0.15));
      let z = -0.18 * Math.sin(radX * Math.PI * 0.5) * Math.sin(radY * Math.PI * 0.5);
      if (y < 0 && y > -0.6) z -= 0.04 * (1 - Math.abs(nx)); // Diaper seat volume
      bPos.setZ(i, z);
    }
    backGeo.computeVertexNormals();

    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      transparent: true,
      alphaTest: 0.18,
      roughness: 0.82,
      metalness: 0.04,
      side: THREE.FrontSide
    });
    this.backMesh = new THREE.Mesh(backGeo, backMat);
    this.backMesh.rotation.y = Math.PI;
    this.backMesh.castShadow = true;
    this.modelGroup.add(this.backMesh);

    // C. Volumetric Cotton Inner Core (Prevents see-through hollow gaps from profile angles)
    const coreGeo = new THREE.CylinderGeometry(0.48, 0.52, 1.4, 24, 8);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x829480, // Rich Sage Green
      roughness: 0.9,
      metalness: 0.02
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.coreMesh.position.set(0, 0.1, 0);
    this.coreMesh.scale.set(1.0, 1.0, 0.32);
    this.modelGroup.add(this.coreMesh);

    // D. 3D Ribbed Neckline Collar Torus
    const collarGeo = new THREE.TorusGeometry(0.32, 0.038, 16, 32);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x8a9c88,
      roughness: 0.88
    });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.position.set(0, 0.82, 0.18);
    collarMesh.rotation.x = Math.PI * 0.42;
    this.modelGroup.add(collarMesh);

    // E. 3D Embossed Cactus Badge with Gold Rim
    const badgeGeo = new THREE.CylinderGeometry(0.098, 0.098, 0.018, 32);
    const badgeMat = new THREE.MeshStandardMaterial({
      color: 0x879784,
      roughness: 0.55,
      metalness: 0.15
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0.24, 0.58, 0.24);
    badgeMesh.rotation.x = Math.PI * 0.5;
    this.modelGroup.add(badgeMesh);

    // F. 3D Metallic Crotch Snaps
    const snapGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.012, 16);
    const snapMat = new THREE.MeshStandardMaterial({
      color: 0xd6cbbd, // Champagne Nickel YKK
      metalness: 0.88,
      roughness: 0.22
    });
    const snapPositions = [
      [0, -0.48, 0.16],
      [-0.08, -0.56, 0.15],
      [0.08, -0.56, 0.15],
      [-0.14, -0.68, 0.13],
      [0.14, -0.68, 0.13]
    ];
    snapPositions.forEach(posArr => {
      const snap = new THREE.Mesh(snapGeo, snapMat);
      snap.position.set(posArr[0], posArr[1], posArr[2]);
      snap.rotation.x = Math.PI * 0.5;
      this.modelGroup.add(snap);
    });

    // G. 3D Rolled Sleeve Cuffs
    const cuffGeo = new THREE.TorusGeometry(0.16, 0.042, 14, 24);
    const cuffMat = new THREE.MeshStandardMaterial({ color: 0x849682, roughness: 0.85 });
    
    const leftCuff = new THREE.Mesh(cuffGeo, cuffMat);
    leftCuff.position.set(-0.92, 0.22, 0.10);
    leftCuff.rotation.set(0.2, 0.4, 0.5);
    this.modelGroup.add(leftCuff);

    const rightCuff = new THREE.Mesh(cuffGeo, cuffMat);
    rightCuff.position.set(0.92, 0.22, 0.10);
    rightCuff.rotation.set(0.2, -0.4, -0.5);
    this.modelGroup.add(rightCuff);

    // H. Soft Ground Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(3.0, 3.0);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(20, 25, 20, 0.32)');
    grad.addColorStop(0.4, 'rgba(20, 25, 20, 0.15)');
    grad.addColorStop(1, 'rgba(20, 25, 20, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.set(0, -1.48, 0);
    shadowPlane.rotation.x = -Math.PI * 0.5;
    this.scene.add(shadowPlane);
  }

  initHotspots() {
    this.hotspotElements = [];

    this.hotspots.forEach(spot => {
      const el = document.createElement('button');
      el.className = 'haute-jewelry-hotspot';
      el.id = `hotspot-${spot.id}`;
      el.setAttribute('aria-label', `${spot.num} ${spot.title}`);
      el.innerHTML = `
        <span class="hotspot-pulse-ring"></span>
        <span class="hotspot-core-gem">${spot.num}</span>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectHotspot(spot);
      });

      this.container.appendChild(el);
      this.hotspotElements.push({ spot, el });
    });

    // Close Placard & Reset Macro Zoom
    const closeBtn = this.placard.querySelector('#placardCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.resetMacroZoom();
      });
    }

    this.container.addEventListener('click', (e) => {
      if (this.isZoomed && !e.target.closest('.haute-specimen-placard') && !e.target.closest('.haute-jewelry-hotspot')) {
        this.resetMacroZoom();
      }
    });
  }

  updateHotspots() {
    if (!this.hotspotElements || !this.camera || !this.modelGroup) return;

    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);

    const wp = new THREE.Vector3();
    const wn = new THREE.Vector3();

    this.hotspotElements.forEach(({ spot, el }) => {
      // Transform spot position and normal with model transform
      wp.copy(spot.pos).applyMatrix4(this.modelGroup.matrixWorld);
      wn.copy(spot.normal).transformDirection(this.modelGroup.matrixWorld);

      // Project 3D coordinate to screen
      const screenPos = wp.clone().project(this.camera);

      // Check if visible (in front of camera and normal facing towards camera)
      const dot = wn.dot(camDir.clone().negate());
      const isFacing = dot > -0.15;
      const isInFrustum = screenPos.z > -1 && screenPos.z < 1;

      if (isFacing && isInFrustum) {
        const x = (screenPos.x * 0.5 + 0.5) * this.width;
        const y = (-(screenPos.y * 0.5) + 0.5) * this.height;

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.opacity = Math.max(0, Math.min(1, (dot + 0.15) * 1.5));
        el.style.pointerEvents = 'auto';
      } else {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      }
    });
  }

  selectHotspot(spot) {
    this.isZoomed = true;
    this.activeHotspotId = spot.id;
    this.controls.autoRotate = false;

    const btnRotate = this.container.querySelector('#btnThreeRotate');
    if (btnRotate) {
      btnRotate.classList.remove('active');
      btnRotate.textContent = '⏸ 정지됨';
    }

    // Smooth Dolly-Zoom Camera to Detail
    if (window.gsap) {
      gsap.to(this.camera.position, {
        duration: 1.2,
        x: spot.targetCam.x,
        y: spot.targetCam.y,
        z: spot.targetCam.z,
        ease: 'power2.out'
      });

      gsap.to(this.controls.target, {
        duration: 1.2,
        x: spot.targetLook.x,
        y: spot.targetLook.y,
        z: spot.targetLook.z,
        ease: 'power2.out'
      });
    }

    // Populate Specimen Placard
    this.placard.querySelector('#placardNum').textContent = `DETAIL ${spot.num}`;
    this.placard.querySelector('#placardTitle').textContent = spot.title;
    this.placard.querySelector('#placardSub').textContent = spot.sub;
    this.placard.querySelector('#placardDesc').textContent = spot.desc;

    const specsWrap = this.placard.querySelector('#placardSpecs');
    specsWrap.innerHTML = spot.specs.map(s => `
      <div class="placard-spec-tag">
        <span class="spec-bullet">✦</span>
        <span>${s}</span>
      </div>
    `).join('');

    this.placard.classList.add('active');
  }

  resetMacroZoom() {
    this.isZoomed = false;
    this.activeHotspotId = null;
    this.placard.classList.remove('active');

    if (window.gsap) {
      gsap.to(this.camera.position, {
        duration: 1.0,
        x: this.defaultCamPos.x,
        y: this.defaultCamPos.y,
        z: this.defaultCamPos.z,
        ease: 'power2.out'
      });

      gsap.to(this.controls.target, {
        duration: 1.0,
        x: this.defaultTarget.x,
        y: this.defaultTarget.y,
        z: this.defaultTarget.z,
        ease: 'power2.out'
      });
    } else {
      this.camera.position.copy(this.defaultCamPos);
      this.controls.target.copy(this.defaultTarget);
    }
  }

  trigger3DScanAnimation() {
    if (!this.scannerOverlay) return;
    const beam = this.scannerOverlay.querySelector('.scanner-beam');
    const pct = this.scannerOverlay.querySelector('#scannerPct');

    if (window.gsap) {
      const tl = gsap.timeline();
      tl.to(beam, {
        duration: 1.4,
        top: '100%',
        ease: 'power1.inOut'
      });
      tl.to({ val: 0 }, {
        duration: 1.4,
        val: 100,
        ease: 'none',
        onUpdate: function() {
          if (pct) pct.textContent = `${Math.round(this.targets()[0].val)}%`;
        }
      }, 0);
      tl.to(this.scannerOverlay, {
        duration: 0.6,
        opacity: 0,
        onComplete: () => {
          this.scannerOverlay.style.display = 'none';
        }
      });
    } else {
      setTimeout(() => {
        this.scannerOverlay.style.display = 'none';
      }, 1500);
    }
  }

  bindControlsEvents() {
    // 1. Auto-Rotate Toggle
    const btnRotate = this.container.querySelector('#btnThreeRotate');
    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        this.isAutoRotate = !this.isAutoRotate;
        this.controls.autoRotate = this.isAutoRotate;
        btnRotate.classList.toggle('active', this.isAutoRotate);
        btnRotate.textContent = this.isAutoRotate ? '⏵ 회전 중' : '⏸ 정지됨';
      });
    }

    // 2. Speed Cycle (1.0x -> 1.5x -> 2.0x -> 0.5x)
    const btnSpeed = this.container.querySelector('#btnThreeSpeed');
    const speeds = [1.0, 1.5, 2.0, 0.5];
    let speedIdx = 0;
    if (btnSpeed) {
      btnSpeed.addEventListener('click', () => {
        speedIdx = (speedIdx + 1) % speeds.length;
        this.rotateSpeed = speeds[speedIdx];
        this.controls.autoRotateSpeed = 2.0 * this.rotateSpeed;
        btnSpeed.textContent = `${this.rotateSpeed.toFixed(1)}x`;
      });
    }

    // 3. Studio Lighting Toggle
    const btnLighting = this.container.querySelector('#btnThreeLighting');
    const lightingModes = [
      { id: 'studio', label: '💡 스튜디오', keyColor: 0xfff8ee, keyInt: 1.6, fillInt: 0.9, rimInt: 1.2 },
      { id: 'runway', label: '💡 런웨이', keyColor: 0xffffff, keyInt: 2.2, fillInt: 0.4, rimInt: 2.4 },
      { id: 'sunset', label: '💡 웜 선셋', keyColor: 0xffd1a4, keyInt: 1.8, fillInt: 1.1, rimInt: 1.5 }
    ];
    let lightIdx = 0;
    if (btnLighting) {
      btnLighting.addEventListener('click', () => {
        lightIdx = (lightIdx + 1) % lightingModes.length;
        const mode = lightingModes[lightIdx];
        btnLighting.textContent = mode.label;

        if (window.gsap) {
          gsap.to(this.keyLight, { duration: 0.8, intensity: mode.keyInt });
          gsap.to(this.fillLight, { duration: 0.8, intensity: mode.fillInt });
          gsap.to(this.rimLight, { duration: 0.8, intensity: mode.rimInt });
          this.keyLight.color.setHex(mode.keyColor);
        } else {
          this.keyLight.intensity = mode.keyInt;
          this.fillLight.intensity = mode.fillInt;
          this.rimLight.intensity = mode.rimInt;
          this.keyLight.color.setHex(mode.keyColor);
        }
      });
    }

    // 4. Reset View
    const btnReset = this.container.querySelector('#btnThreeReset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.resetMacroZoom();
        this.orbitToAngle(0);
      });
    }

    // 5. Lookbook Presets
    const presetBtns = this.dialContainer.querySelectorAll('.bezel-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const deg = parseFloat(btn.dataset.deg || 0);
        this.orbitToAngle(deg);
      });
    });
  }

  orbitToAngle(targetDeg) {
    if (this.isZoomed) this.resetMacroZoom();

    // Compute target camera position in orbit circle at radius 4.2
    const rad = (targetDeg * Math.PI) / 180;
    const r = this.defaultCamPos.length();

    const targetX = r * Math.sin(rad);
    const targetZ = r * Math.cos(rad);
    const targetY = 0;

    if (window.gsap) {
      gsap.to(this.camera.position, {
        duration: 1.0,
        x: targetX,
        y: targetY,
        z: targetZ,
        ease: 'power2.inOut',
        onUpdate: () => {
          this.controls.update();
        }
      });
    } else {
      this.camera.position.set(targetX, targetY, targetZ);
      this.controls.update();
    }
  }

  updateDial() {
    if (!this.camera) return;

    // Calculate current azimuth angle from camera position
    let angleRad = Math.atan2(this.camera.position.x, this.camera.position.z);
    let angleDeg = (angleRad * 180) / Math.PI;
    if (angleDeg < 0) angleDeg += 360;

    const roundedDeg = Math.round(angleDeg);

    // Update Bezel Value
    const valText = this.dialContainer.querySelector('#bezelValueText');
    if (valText) valText.textContent = `${roundedDeg}°`;

    // Move Bezel Track
    const track = this.dialContainer.querySelector('#bezelTrack');
    if (track) {
      const offsetPct = (roundedDeg / 360) * 100;
      track.style.transform = `translateX(calc(50% - ${offsetPct}%))`;
    }

    // Update Lookbook Badge Header Text
    const nearestPreset = Math.round(roundedDeg / 45) * 45 % 360;
    const viewName = this.angleNames[nearestPreset] || `${roundedDeg}° 시점`;
    const angleBadgeText = this.container.querySelector('#threeAngleText');
    if (angleBadgeText) {
      angleBadgeText.textContent = `${viewName} (${roundedDeg}°)`;
    }

    // Highlight Preset Buttons
    const presetBtns = this.dialContainer.querySelectorAll('.bezel-preset-btn');
    presetBtns.forEach(btn => {
      const bDeg = parseInt(btn.dataset.deg, 10);
      const isCurrent = Math.abs(roundedDeg - bDeg) < 15 || (bDeg === 0 && roundedDeg > 345);
      btn.classList.toggle('active', isCurrent);
    });
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    // Update OrbitControls
    if (this.controls) {
      this.controls.update();
    }

    // Update Precision Dial
    this.updateDial();

    // Update 3D Floating Hotspots
    this.updateHotspots();

    // Render 3D Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    this.width = this.container.clientWidth || 500;
    this.height = this.container.clientHeight || 500;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  setColor(color) {
    // Both sage green and beige can be tinted if needed
    if (this.coreMesh) {
      if (color === 'beige') {
        this.coreMesh.material.color.setHex(0xbab09c);
      } else {
        this.coreMesh.material.color.setHex(0x829480);
      }
    }
  }
}

// Attach to window
window.Romper3DViewer = Romper3DViewer;
