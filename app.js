// Little Bloom (리틀블룸) - Application Logic (Korean Version with 3D Viewer)

document.addEventListener('DOMContentLoaded', () => {
  // State
  const state = {
    color: 'sage',
    colorName: '세이지 그린',
    colorImg: 'assets/romper-sage.png',
    size: '66',
    sizeName: '66호 (권장 3 ~ 6개월)',
    sizeHint: '권장 월령 3~6개월, 신장 60~66cm, 몸무게 5~7kg',
    qty: 1,
    unitPrice: 29000,
    originalPrice: 39000,
    shippingFee: 3000,
    cart: [
      {
        id: 1,
        name: '베이직 아기 우주복',
        color: '세이지 그린',
        size: '66호',
        price: 29000,
        qty: 1,
        img: 'assets/romper-sage.png'
      }
    ]
  };

  let viewer3DInstance = null;

  // DOM Elements
  const mainProductImg = document.getElementById('mainProductImg');
  const thumbCards = document.querySelectorAll('.thumb-card');
  const colorBtns = document.querySelectorAll('.color-swatch-btn');
  const selectedColorName = document.getElementById('selectedColorName');
  const sizeBtns = document.querySelectorAll('.size-btn');
  const sizeSummaryBanner = document.getElementById('sizeSummaryBanner');
  const mobileSizeDisplay = document.getElementById('mobileSizeDisplay');
  const tableRows = document.querySelectorAll('[data-table-size]');

  // View Mode Tabs
  const tabPhotoView = document.getElementById('tabPhotoView');
  const tab3DView = document.getElementById('tab3DView');
  const photoViewport = document.getElementById('photoViewport');
  const threeViewport = document.getElementById('threeViewport');
  const photoThumbRow = document.getElementById('photoThumbRow');
  const bannerSwitchTo3D = document.getElementById('bannerSwitchTo3D');
  const btnClick3D = document.getElementById('btnClick3D');

  // Qty Elements
  const qtyInput = document.getElementById('qtyInput');
  const qtyMinusBtn = document.getElementById('qtyMinusBtn');
  const qtyPlusBtn = document.getElementById('qtyPlusBtn');
  const formQty = document.getElementById('formQty');
  const formQtyMinus = document.getElementById('formQtyMinus');
  const formQtyPlus = document.getElementById('formQtyPlus');

  // Form & Summary Elements
  const formColorSelect = document.getElementById('formColorSelect');
  const formSizeSelect = document.getElementById('formSizeSelect');
  const summaryThumb = document.getElementById('summaryThumb');
  const summaryMeta = document.getElementById('summaryMeta');
  const summaryQtyDisplay = document.getElementById('summaryQtyDisplay');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryShipping = document.getElementById('summaryShipping');
  const summaryTotalPrice = document.getElementById('summaryTotalPrice');
  const summaryFreeshipHint = document.getElementById('summaryFreeshipHint');
  const fastOrderForm = document.getElementById('fastOrderForm');

  // Cart Drawer Elements
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const drawerItemsCount = document.getElementById('drawerItemsCount');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartGrandTotal = document.getElementById('cartGrandTotal');
  const freeshipProgressBar = document.getElementById('freeshipProgressBar');
  const freeshipStatusText = document.getElementById('freeshipStatusText');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const buyNowBtn = document.getElementById('buyNowBtn');
  const continueShoppingBtn = document.getElementById('continueShoppingBtn');

  // Size Calculator
  const babyWeightInput = document.getElementById('babyWeightInput');
  const babyMonthInput = document.getElementById('babyMonthInput');
  const calcSizeBtn = document.getElementById('calcSizeBtn');
  const calcResultText = document.getElementById('calcResultText');
  const applyCalcSizeBtn = document.getElementById('applyCalcSizeBtn');
  const quickSizeFinderBtn = document.getElementById('quickSizeFinderBtn');

  // Modals & Lightbox
  const openLightboxBtn = document.getElementById('openLightboxBtn');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  const successModal = document.getElementById('successModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  const successPhone = document.getElementById('successPhone');
  const successOrderCode = document.getElementById('successOrderCode');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // Korean Currency Formatter
  const formatKRW = (num) => {
    return num.toLocaleString('ko-KR') + '원';
  };

  // 1. Countdown Timer
  let countdownSeconds = 6 * 3600 + 42 * 60 + 15;
  const countdownTimer = document.getElementById('countdownTimer');
  setInterval(() => {
    countdownSeconds--;
    if (countdownSeconds <= 0) countdownSeconds = 12 * 3600;
    const h = String(Math.floor(countdownSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((countdownSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(countdownSeconds % 60).padStart(2, '0');
    if (countdownTimer) countdownTimer.textContent = `${h}:${m}:${s}`;
  }, 1000);

  // 2. Tab Switcher (Photo vs 3D View)
  function switchTo3DView() {
    tabPhotoView.classList.remove('active');
    tab3DView.classList.add('active');
    photoViewport.style.display = 'none';
    threeViewport.style.display = 'flex';

    if (window.gsap) {
      gsap.fromTo(threeViewport, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' });
    }

    setTimeout(() => {
      if (!viewer3DInstance && window.Romper3DViewer) {
        viewer3DInstance = new window.Romper3DViewer('romper3DContainer');
        viewer3DInstance.setColor(state.color);
      } else if (viewer3DInstance) {
        viewer3DInstance.onResize();
        viewer3DInstance.setColor(state.color);
      }
    }, 40);
    showToast('3D 360° 버추얼 아틀리에가 활성화되었습니다!', '✦');
  }

  function switchToPhotoView() {
    tab3DView.classList.remove('active');
    tabPhotoView.classList.add('active');
    threeViewport.style.display = 'none';
    photoViewport.style.display = 'flex';
    if (window.gsap) {
      gsap.fromTo(photoViewport, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' });
    }
  }

  tab3DView.addEventListener('click', switchTo3DView);
  tabPhotoView.addEventListener('click', switchToPhotoView);
  if (bannerSwitchTo3D) bannerSwitchTo3D.addEventListener('click', switchTo3DView);
  if (btnClick3D) btnClick3D.addEventListener('click', (e) => {
    e.stopPropagation();
    switchTo3DView();
  });

  // 3. Thumbnail Click -> Update Main Image
  thumbCards.forEach(card => {
    card.addEventListener('click', () => {
      // If currently in 3D view, switch back to photo view to see thumbnail
      if (threeViewport.style.display === 'flex') {
        switchToPhotoView();
      }
      thumbCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const imgUrl = card.getAttribute('data-img');
      const title = card.getAttribute('data-title') || '리틀블룸 우주복';
      mainProductImg.src = imgUrl;
      mainProductImg.alt = title;
    });
  });

  // 4. Color Switcher
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const color = btn.getAttribute('data-color');
      const name = btn.getAttribute('data-name');
      const img = btn.getAttribute('data-img');

      state.color = color;
      state.colorName = name;
      state.colorImg = img;

      selectedColorName.textContent = name;
      mainProductImg.src = img;
      summaryThumb.src = img;
      formColorSelect.value = color;

      // Sync 3D viewer color
      if (viewer3DInstance) {
        viewer3DInstance.setColor(color);
      }

      // Sync thumbnails
      thumbCards.forEach(card => {
        if (card.getAttribute('data-img') === img) {
          thumbCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        }
      });

      updateOrderSummary();
      showToast(`색상이 '${name}'(으)로 변경되었습니다.`, '🎨');
    });
  });

  formColorSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    const targetBtn = document.querySelector(`.color-swatch-btn[data-color="${val}"]`);
    if (targetBtn) targetBtn.click();
  });

  // 5. Size Selector
  function selectSize(sizeCode, ageText, weightText, heightText) {
    state.size = sizeCode;
    state.sizeName = `${sizeCode}호 (${ageText})`;
    state.sizeHint = `권장 월령 ${ageText}, 신장 ${heightText}, 몸무게 ${weightText}`;

    sizeBtns.forEach(b => {
      if (b.getAttribute('data-size') === sizeCode) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    sizeSummaryBanner.innerHTML = `<span>선택된 옵션: <strong>${sizeCode}호</strong> (${state.sizeHint})</span>`;
    mobileSizeDisplay.textContent = `${sizeCode}호`;
    formSizeSelect.value = sizeCode;

    // Highlight in comparison table
    tableRows.forEach(row => {
      if (row.getAttribute('data-table-size') === sizeCode) {
        row.classList.add('highlight-row');
      } else {
        row.classList.remove('highlight-row');
      }
    });

    updateOrderSummary();
  }

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sizeCode = btn.getAttribute('data-size');
      const ageText = btn.getAttribute('data-age');
      const weightText = btn.getAttribute('data-weight');
      const heightText = btn.getAttribute('data-height');
      selectSize(sizeCode, ageText, weightText, heightText);
      showToast(`${sizeCode}호 사이즈가 선택되었습니다.`, '📏');
    });
  });

  formSizeSelect.addEventListener('change', (e) => {
    const targetBtn = document.querySelector(`.size-btn[data-size="${e.target.value}"]`);
    if (targetBtn) targetBtn.click();
  });

  // 6. Quantity Steppers
  function setQty(newQty) {
    if (newQty < 1) newQty = 1;
    if (newQty > 50) newQty = 50;
    state.qty = newQty;
    qtyInput.value = newQty;
    formQty.value = newQty;
    updateOrderSummary();
  }

  qtyMinusBtn.addEventListener('click', () => setQty(state.qty - 1));
  qtyPlusBtn.addEventListener('click', () => setQty(state.qty + 1));
  formQtyMinus.addEventListener('click', () => setQty(state.qty - 1));
  formQtyPlus.addEventListener('click', () => setQty(state.qty + 1));

  // 7. Update Order Summary Calculations (KRW)
  function updateOrderSummary() {
    const subtotal = state.qty * state.unitPrice;
    const isFreeship = state.qty >= 2;
    const shipping = isFreeship ? 0 : state.shippingFee;
    const total = subtotal + shipping;

    summaryMeta.textContent = `${state.colorName} • ${state.size}호`;
    summaryQtyDisplay.textContent = `주문 수량: ${state.qty}벌`;
    summarySubtotal.textContent = formatKRW(subtotal);

    if (isFreeship) {
      summaryShipping.innerHTML = '<strong style="color: #2E7D32;">0원 (무료배송)</strong>';
      summaryFreeshipHint.innerHTML = '🎉 <strong>축하합니다!</strong> 2벌 이상 구매로 전국 무료배송 혜택이 적용되었습니다!';
      summaryFreeshipHint.style.background = '#E8F5E9';
      summaryFreeshipHint.style.color = '#2E7D32';
    } else {
      summaryShipping.textContent = formatKRW(state.shippingFee);
      summaryFreeshipHint.innerHTML = '💡 <em>1벌 더 추가하시면 전국 무료배송 혜택이 적용됩니다!</em>';
      summaryFreeshipHint.style.background = 'rgba(200, 150, 62, 0.12)';
      summaryFreeshipHint.style.color = '#936B1B';
    }

    summaryTotalPrice.textContent = formatKRW(total);
  }

  // 8. Smart Size Calculator
  function calculateSize() {
    const weight = parseFloat(babyWeightInput.value) || 6.5;
    const months = parseInt(babyMonthInput.value, 10) || 5;

    let recSize = '66';
    let recText = '';

    if (weight < 7.2 && months <= 6) {
      recSize = '66';
      recText = `현재 ${months}개월 (${weight}kg) 아기에게는 <strong>66호 (권장 3~6개월)</strong>가 예쁘게 맞습니다! 품과 소매 길이가 알맞아요.`;
    } else if (weight < 9.2 && months <= 9) {
      recSize = '73';
      recText = `현재 ${months}개월 (${weight}kg) 아기에게는 <strong>73호 (권장 6~9개월)</strong>를 추천합니다! 활동량이 많아지는 시기에 편안해요.`;
    } else if (weight < 11.2 && months <= 12) {
      recSize = '80';
      recText = `현재 ${months}개월 (${weight}kg) 아기에게는 <strong>80호 (권장 9~12개월)</strong>가 편안하게 맞습니다! 아기가 기어 다닐 때도 넉넉합니다.`;
    } else {
      recSize = '90';
      recText = `현재 ${months}개월 (${weight}kg) 아기에게는 <strong>90호 (권장 12~18개월)</strong>가 가장 좋습니다! 걸음마 시기에도 안성맞춤이에요.`;
    }

    calcResultText.innerHTML = recText;
    applyCalcSizeBtn.setAttribute('data-target-size', recSize);
    applyCalcSizeBtn.textContent = `${recSize}호로 선택하기`;
  }

  calcSizeBtn.addEventListener('click', calculateSize);
  applyCalcSizeBtn.addEventListener('click', () => {
    const targetSize = applyCalcSizeBtn.getAttribute('data-target-size') || '66';
    const targetBtn = document.querySelector(`.size-btn[data-size="${targetSize}"]`);
    if (targetBtn) {
      targetBtn.click();
      window.scrollTo({
        top: document.getElementById('productShowcase').offsetTop - 60,
        behavior: 'smooth'
      });
      showToast(`${targetSize}호 사이즈가 적용되었습니다.`, '✨');
    }
  });

  quickSizeFinderBtn.addEventListener('click', () => {
    document.querySelector('.size-finder-bar-section').scrollIntoView({ behavior: 'smooth' });
  });

  // 9. Cart Drawer Logic
  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountBadge.textContent = totalItems;
    drawerItemsCount.textContent = `${totalItems}개 상품`;

    // Free shipping progress
    if (totalItems >= 2) {
      freeshipProgressBar.style.width = '100%';
      freeshipStatusText.textContent = '🎉 무료배송 혜택이 적용되었습니다!';
    } else if (totalItems === 1) {
      freeshipProgressBar.style.width = '50%';
      freeshipStatusText.textContent = '1벌 더 담으시면 무료배송 혜택이 적용됩니다!';
    } else {
      freeshipProgressBar.style.width = '0%';
      freeshipStatusText.textContent = '2벌 이상 구매 시 무료배송 혜택!';
    }

    // Render items
    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: #888;">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🛍️</div>
          <p>장바구니가 비어 있습니다.</p>
        </div>
      `;
      cartGrandTotal.textContent = '0원';
      return;
    }

    let grandTotal = 0;
    cartItemsList.innerHTML = state.cart.map((item, idx) => {
      const itemSub = item.qty * item.price;
      grandTotal += itemSub;
      return `
        <div class="drawer-item" data-index="${idx}">
          <img src="${item.img}" alt="${item.name}">
          <div class="drawer-item-info">
            <span class="drawer-item-title">${item.name}</span>
            <span class="drawer-item-meta">${item.color} • ${item.size}</span>
            <span class="drawer-item-price">${formatKRW(item.price)}</span>
            <div class="drawer-qty-row">
              <span style="font-size: 0.8rem; font-weight: 600;">수량: ${item.qty}벌</span>
              <button class="drawer-remove-btn" onclick="removeItemFromCart(${idx})">삭제</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    cartGrandTotal.textContent = formatKRW(grandTotal);
  }

  window.removeItemFromCart = (index) => {
    state.cart.splice(index, 1);
    updateCartUI();
    showToast('장바구니에서 상품이 삭제되었습니다.', '🗑️');
  };

  function openCart() {
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('active');
    updateCartUI();
  }

  function closeCart() {
    cartOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
  }

  openCartBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  continueShoppingBtn.addEventListener('click', closeCart);
  document.getElementById('cartCheckoutBtn').addEventListener('click', () => {
    closeCart();
  });

  addToCartBtn.addEventListener('click', () => {
    const existing = state.cart.find(
      i => i.color === state.colorName && i.size === `${state.size}호`
    );
    if (existing) {
      existing.qty += state.qty;
    } else {
      state.cart.push({
        id: Date.now(),
        name: '베이직 아기 우주복',
        color: state.colorName,
        size: `${state.size}호`,
        price: state.unitPrice,
        qty: state.qty,
        img: state.colorImg
      });
    }

    updateCartUI();
    showToast(`장바구니에 ${state.qty}벌 담겼습니다! (${state.colorName}, ${state.size}호)`, '🛍️');

    // Bounce badge animation
    cartCountBadge.style.transform = 'scale(1.4)';
    setTimeout(() => cartCountBadge.style.transform = 'scale(1)', 250);
  });

  buyNowBtn.addEventListener('click', () => {
    document.getElementById('orderSection').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('custName').focus();
  });

  // 10. Fast Order Form Submission
  fastOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    if (!name || !phone || !address) {
      showToast('배송 정보를 모두 정확히 입력해 주세요!', '⚠️');
      return;
    }

    const orderId = 'LB-' + Math.floor(100000 + Math.random() * 900000);
    successPhone.textContent = phone;
    successOrderCode.textContent = orderId;

    successModal.classList.add('active');
    showToast('주문서가 성공적으로 접수되었습니다!', '🎉');
  });

  closeSuccessModalBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
    fastOrderForm.reset();
    setQty(1);
  });

  // 11. FAQ Accordions
  const accordions = document.querySelectorAll('.accordion-item');
  accordions.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      accordions.forEach(acc => acc.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 11b. Gucci Luxury Product Details Accordions
  const gucciAccordions = document.querySelectorAll('.gucci-accordion-item');
  gucciAccordions.forEach(item => {
    const trigger = item.querySelector('.gucci-accordion-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    }
  });

  // 12. Lightbox Modal
  openLightboxBtn.addEventListener('click', () => {
    lightboxImg.src = mainProductImg.src;
    lightboxCaption.textContent = `${state.colorName} • ${state.size}호`;
    lightboxModal.classList.add('active');
  });

  function closeLightbox() {
    lightboxModal.classList.remove('active');
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);

  // 13. Toast Notification Utility (Enhanced with GSAP Micro-Springs)
  function showToast(message, icon = '✨') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-content">
        <strong>리틀블룸 알림</strong>
        <p>${message}</p>
      </div>
    `;
    toastContainer.appendChild(toast);

    if (window.gsap) {
      gsap.fromTo(toast, 
        { opacity: 0, y: 22, scale: 0.92 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.5)' }
      );
      setTimeout(() => {
        gsap.to(toast, { 
          opacity: 0, 
          y: -15, 
          scale: 0.9, 
          duration: 0.35, 
          ease: 'power2.in', 
          onComplete: () => toast.remove() 
        });
      }, 3200);
    } else {
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    }
  }

  // Initial setup
  updateOrderSummary();
  updateCartUI();
});
