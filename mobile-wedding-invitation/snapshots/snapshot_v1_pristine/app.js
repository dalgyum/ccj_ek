/**
 * Mobile Wedding Invitation - Main Application JavaScript
 * Couple: 문의겸 ♥ 김민정
 * Features: Envelope Intro Overlay, Live D-Day counter, Enhanced Gallery (Grid/Slide/Lightbox), Account Copy, RSVP, BGM Player
 */

document.addEventListener('DOMContentLoaded', () => {
  initDDayTimer();
  initGallery();
  initLightbox();
  initAccordions();
  initCopyActions();
  initModals();
  initBgmPlayer();
  initPetals();
  initShareActions();
  initQuickNav();

  // Disable Pinch Zoom & Gesture Zoom for mobile photos and page
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  });
});

/* ----------------------------------------------------
   0. Envelope Intro Overlay Open Function
---------------------------------------------------- */
function openInvitationOverlay() {
  const overlay = document.getElementById('envelopeOverlay');
  if (overlay) {
    overlay.classList.add('opened');
  }
}
window.openInvitationOverlay = openInvitationOverlay;

/* ----------------------------------------------------
   1. Live D-Day Countdown Timer
---------------------------------------------------- */
function initDDayTimer() {
  // Target Wedding Date: November 21, 2026 at 12:00 (PM 12:00)
  const targetDate = new Date('2026-11-21T12:00:00').getTime();

  const daysEl = document.getElementById('ddayDays');
  const hoursEl = document.getElementById('ddayHours');
  const minsEl = document.getElementById('ddayMinutes');
  const secsEl = document.getElementById('ddaySeconds');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ----------------------------------------------------
   2. Enhanced Gallery (Grid/Slide Toggle & Carousel)
---------------------------------------------------- */
const defaultGalleryImages = [
  './images/gallery/1.jpg',
  './images/gallery/2.jpg',
  './images/gallery/3.jpg',
  './images/gallery/4.jpg',
  './images/gallery/5.jpg'
];

const galleryImages = (typeof WEDDING_CONFIG !== 'undefined' && WEDDING_CONFIG.galleryImages)
  ? WEDDING_CONFIG.galleryImages
  : defaultGalleryImages;

let currentSlideIndex = 0;

function initGallery() {
  const gridBtn = document.getElementById('viewGridBtn');
  const slideBtn = document.getElementById('viewSlideBtn');
  const gridContainer = document.getElementById('galleryGrid');
  const sliderWrapper = document.getElementById('gallerySliderWrapper');

  if (!gridBtn || !slideBtn || !gridContainer || !sliderWrapper) return;

  // Render Grid Items dynamically
  gridContainer.innerHTML = '';
  galleryImages.forEach((src, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-index', idx);
    item.innerHTML = `<img src="${src}" alt="갤러리 사진 ${idx + 1}" loading="lazy"><div class="gallery-hover-overlay"><i class="fa-solid fa-expand"></i></div>`;
    gridContainer.appendChild(item);
  });

  // Render Slide Items dynamically
  const track = document.getElementById('sliderTrack');
  if (track) {
    track.innerHTML = '';
    galleryImages.forEach((src, idx) => {
      const slide = document.createElement('div');
      slide.className = 'slide-item';
      slide.setAttribute('data-index', idx);
      slide.innerHTML = `<img src="${src}" alt="갤러리 슬라이드 ${idx + 1}">`;
      track.appendChild(slide);
    });
  }

  const switchView = (targetView) => {
    if (targetView === 'grid') {
      if (gridContainer.classList.contains('hidden')) {
        gridBtn.classList.add('active');
        slideBtn.classList.remove('active');
        
        sliderWrapper.classList.add('gallery-view-animating');
        setTimeout(() => {
          sliderWrapper.classList.add('hidden');
          sliderWrapper.classList.remove('gallery-view-animating');
          
          gridContainer.classList.add('gallery-view-animating');
          gridContainer.classList.remove('hidden');
          requestAnimationFrame(() => {
            gridContainer.classList.remove('gallery-view-animating');
          });
        }, 150);
      }
    } else if (targetView === 'slide') {
      if (sliderWrapper.classList.contains('hidden')) {
        slideBtn.classList.add('active');
        gridBtn.classList.remove('active');
        
        gridContainer.classList.add('gallery-view-animating');
        setTimeout(() => {
          gridContainer.classList.add('hidden');
          gridContainer.classList.remove('gallery-view-animating');
          
          sliderWrapper.classList.add('gallery-view-animating');
          sliderWrapper.classList.remove('hidden');
          updateSliderPosition();
          requestAnimationFrame(() => {
            sliderWrapper.classList.remove('gallery-view-animating');
          });
        }, 150);
      }
    }
  };

  gridBtn.addEventListener('click', () => switchView('grid'));
  slideBtn.addEventListener('click', () => switchView('slide'));

  // Slider Carousel Controls
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  // Render dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    galleryImages.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        currentSlideIndex = idx;
        updateSliderPosition();
      });
      dotsContainer.appendChild(dot);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex - 1 + galleryImages.length) % galleryImages.length;
      updateSliderPosition();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex + 1) % galleryImages.length;
      updateSliderPosition();
    });
  }

  // Touch Swipe Support for Slider Carousel
  let startX = 0;
  let isSwiping = false;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          currentSlideIndex = (currentSlideIndex + 1) % galleryImages.length;
        } else {
          currentSlideIndex = (currentSlideIndex - 1 + galleryImages.length) % galleryImages.length;
        }
        updateSliderPosition();
      }
      isSwiping = false;
    }, { passive: true });
  }
}

function updateSliderPosition() {
  const track = document.getElementById('sliderTrack');
  const dots = document.querySelectorAll('.slider-dots .dot');

  if (track) {
    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  }

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlideIndex);
  });
}

/* ----------------------------------------------------
   3. Fullscreen Gallery Lightbox Modal
---------------------------------------------------- */
let currentLightboxIndex = 0;

function initLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const counterEl = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');
  const thumbsContainer = document.getElementById('lightboxThumbnails');

  if (!lightboxModal || !lightboxImg) return;

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item, .slide-item');
    if (item && item.hasAttribute('data-index')) {
      const idx = parseInt(item.getAttribute('data-index') || '0', 10);
      openLightbox(idx);
    }
  });

  let isLightboxAnimating = false;

  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent('none');
    renderThumbnails();
    lightboxModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function updateLightboxContent(direction = 'none') {
    if (isLightboxAnimating && direction !== 'none') return;

    if (counterEl) {
      counterEl.innerText = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
    }
    updateActiveThumbnail();

    if (direction === 'none') {
      lightboxImg.src = galleryImages[currentLightboxIndex];
      return;
    }

    isLightboxAnimating = true;
    const outClass = direction === 'next' ? 'lightbox-slide-next-out' : 'lightbox-slide-prev-out';
    const inClass = direction === 'next' ? 'lightbox-slide-next-in' : 'lightbox-slide-prev-in';

    lightboxImg.classList.add(outClass);

    setTimeout(() => {
      lightboxImg.src = galleryImages[currentLightboxIndex];

      lightboxImg.classList.remove(outClass);
      lightboxImg.classList.add(inClass);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lightboxImg.classList.remove(inClass);
          setTimeout(() => {
            isLightboxAnimating = false;
          }, 380);
        });
      });
    }, 140);
  }

  function renderThumbnails() {
    if (!thumbsContainer) return;
    thumbsContainer.innerHTML = '';
    galleryImages.forEach((src, idx) => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.className = `thumb-item ${idx === currentLightboxIndex ? 'active' : ''}`;
      thumb.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const dir = idx > currentLightboxIndex ? 'next' : 'prev';
        currentLightboxIndex = idx;
        updateLightboxContent(dir);
      });
      thumbsContainer.appendChild(thumb);
    });
  }

  function updateActiveThumbnail() {
    const thumbs = document.querySelectorAll('.thumb-item');
    thumbs.forEach((t, idx) => {
      t.classList.toggle('active', idx === currentLightboxIndex);
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxContent('prev');
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
      updateLightboxContent('next');
    });
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Touch Swipe Support for Lightbox Modal
  let touchStartX = 0;
  let touchStartY = 0;
  lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  lightboxModal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        updateLightboxContent('next');
      } else {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxContent('prev');
      }
    }
  }, { passive: true });
}

/* ----------------------------------------------------
   4. Account Accordions (계좌 복사 전용, 카카오페이 제거)
---------------------------------------------------- */
function initAccordions() {
  const groomContent = document.getElementById('groomAccountContent');
  const brideContent = document.getElementById('brideAccountContent');

  // Load from config if present, or defaults
  const groomAccounts = (typeof WEDDING_CONFIG !== 'undefined' && WEDDING_CONFIG.accounts && WEDDING_CONFIG.accounts.groom) ? WEDDING_CONFIG.accounts.groom : [
    { label: '신랑', holder: '문의겸', bank: '새마을금고', number: '9003-2232-3607-4' },
    { label: '아버지', holder: '문만표', bank: '국민은행', number: '000-00-000000' },
    { label: '어머니', holder: '김인희', bank: '농협은행', number: '000-00-000000' }
  ];

  const brideAccounts = (typeof WEDDING_CONFIG !== 'undefined' && WEDDING_CONFIG.accounts && WEDDING_CONFIG.accounts.bride) ? WEDDING_CONFIG.accounts.bride : [
    { label: '신부', holder: '김민정', bank: '카카오뱅크', number: '3333-00-0000000' },
    { label: '아버지', holder: '김광기', bank: '우리은행', number: '1002-000-000000' },
    { label: '어머니', holder: '김종순', bank: '하나은행', number: '000-000000-00000' }
  ];

  if (groomContent) {
    let groomHtml = '';
    groomAccounts.forEach(acc => {
      const fullAcc = `${acc.bank} ${acc.number}`;
      const payBtnHtml = acc.payLink ? `
        <a href="${acc.payLink}" target="_blank" rel="noopener noreferrer" class="kakaopay-btn">
          <i class="fa-solid fa-comment-dollar"></i> 카카오페이 송금
        </a>
      ` : '';
      groomHtml += `
        <div class="account-card">
          <div class="account-owner">${acc.label} ${acc.holder}</div>
          <div class="account-number-row">
            <span class="account-details">${fullAcc}</span>
            <button class="copy-btn" data-copy="${fullAcc}">복사</button>
          </div>
          ${payBtnHtml}
        </div>
      `;
    });
    groomContent.innerHTML = groomHtml;
  }

  if (brideContent) {
    let brideHtml = '';
    brideAccounts.forEach(acc => {
      const fullAcc = `${acc.bank} ${acc.number}`;
      const payBtnHtml = acc.payLink ? `
        <a href="${acc.payLink}" target="_blank" rel="noopener noreferrer" class="kakaopay-btn">
          <i class="fa-solid fa-comment-dollar"></i> 카카오페이 송금
        </a>
      ` : '';
      brideHtml += `
        <div class="account-card">
          <div class="account-owner">${acc.label} ${acc.holder}</div>
          <div class="account-number-row">
            <span class="account-details">${fullAcc}</span>
            <button class="copy-btn" data-copy="${fullAcc}">복사</button>
          </div>
          ${payBtnHtml}
        </div>
      `;
    });
    brideContent.innerHTML = brideHtml;
  }

  const groomToggle = document.getElementById('groomAccountToggle');
  const brideToggle = document.getElementById('brideAccountToggle');

  if (groomToggle) {
    groomToggle.addEventListener('click', () => {
      const item = groomToggle.closest('.accordion-item');
      if (!item) return;
      const isActive = item.classList.toggle('active');
      const label = groomToggle.querySelector('span');
      if (label) {
        label.innerText = isActive ? '신랑측 계좌번호 닫기' : '신랑측 계좌번호 보기';
      }
    });
  }

  if (brideToggle) {
    brideToggle.addEventListener('click', () => {
      const item = brideToggle.closest('.accordion-item');
      if (!item) return;
      const isActive = item.classList.toggle('active');
      const label = brideToggle.querySelector('span');
      if (label) {
        label.innerText = isActive ? '신부측 계좌번호 닫기' : '신부측 계좌번호 보기';
      }
    });
  }
}

/* ----------------------------------------------------
   5. Clipboard Copy Actions & Toast Notifications
---------------------------------------------------- */
function initCopyActions() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if (btn) {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        copyToClipboard(textToCopy, '계좌번호가 복사되었습니다.');
      }
    }
  });

  const addressBtn = document.getElementById('copyAddressBtn');
  const addressEl = document.getElementById('venueAddress');
  if (addressBtn && addressEl) {
    addressBtn.addEventListener('click', () => {
      copyToClipboard(addressEl.innerText, '예식장 주소가 복사되었습니다.');
    });
  }
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('복사에 실패했습니다.');
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}

/* ----------------------------------------------------
   6. Contact & RSVP Modals
---------------------------------------------------- */
function initModals() {
  const openRsvpBtn = document.getElementById('openRsvpBtn');
  const closeRsvpBtn = document.getElementById('closeRsvpBtn');
  const rsvpModal = document.getElementById('rsvpModal');
  const rsvpForm = document.getElementById('rsvpForm');

  if (openRsvpBtn && rsvpModal) {
    openRsvpBtn.addEventListener('click', () => {
      rsvpModal.classList.remove('hidden');
    });
  }
  if (closeRsvpBtn && rsvpModal) {
    closeRsvpBtn.addEventListener('click', () => {
      rsvpModal.classList.add('hidden');
    });
  }

  if (rsvpForm && rsvpModal) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvpName')?.value;
      showToast(`${name || '하객'}님의 참석 의사가 전달되었습니다. 감사합니다!`);
      rsvpForm.reset();
      rsvpModal.classList.add('hidden');
    });
  }

  if (rsvpModal) {
    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) {
        rsvpModal.classList.add('hidden');
      }
    });
  }
}

/* ----------------------------------------------------
   7. Background Music (BGM) Player
---------------------------------------------------- */
function initBgmPlayer() {
  const bgmBtn = document.getElementById('bgmToggleBtn');
  const audio = document.getElementById('bgmAudio');
  if (!bgmBtn || !audio) return;

  const statusText = bgmBtn.querySelector('.bgm-status');
  let isPlaying = false;

  bgmBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      bgmBtn.classList.remove('active');
      if (statusText) statusText.innerText = 'BGM OFF';
      isPlaying = false;
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          bgmBtn.classList.add('active');
          if (statusText) statusText.innerText = 'BGM ON';
          isPlaying = true;
        }).catch(err => {
          console.warn('Audio play failed:', err);
          showToast('버튼을 다시 한번 클릭하면 음악이 재생됩니다.');
        });
      }
    }
  });
}

/* ----------------------------------------------------
   8. Share Buttons (KakaoTalk SDK & Web Share Fallback)
---------------------------------------------------- */
function initShareActions() {
  const kakaoBtn = document.getElementById('kakaoShareBtn');
  const linkBtn = document.getElementById('linkCopyBtn');

  const kakaoKey = (typeof WEDDING_CONFIG !== 'undefined' && WEDDING_CONFIG.kakaoApiKey) ? WEDDING_CONFIG.kakaoApiKey : '';
  let isKakaoInitialized = false;

  if (window.Kakao && kakaoKey && kakaoKey.trim() !== '') {
    try {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey.trim());
      }
      isKakaoInitialized = window.Kakao.isInitialized();
    } catch (e) {
      console.warn('Kakao SDK initialization error:', e);
    }
  }

  if (kakaoBtn) {
    kakaoBtn.addEventListener('click', () => {
      const shareUrl = window.location.href;
      const title = '문의겸 ♥ 김민정 결혼식에 초대합니다';
      const description = '2026년 11월 21일 토요일 낮 12:00\n예닮교회 3층 예배당';
      const imageUrl = new URL('images/hero.jpg', window.location.href).href;

      if (isKakaoInitialized && window.Kakao.Share) {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: title,
            description: description,
            imageUrl: imageUrl,
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: '모바일 청첩장 보기',
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          ],
        });
      } else if (navigator.share) {
        navigator.share({
          title: title,
          text: `${title}\n${description}`,
          url: shareUrl,
        }).catch(() => {
          copyToClipboard(shareUrl, '청첩장 링크가 복사되었습니다. 카카오톡에 붙여넣어 공유하세요!');
        });
      } else {
        copyToClipboard(shareUrl, '청첩장 주소 링크가 복사되었습니다. 카카오톡에 공유해보세요!');
      }
    });
  }

  if (linkBtn) {
    linkBtn.addEventListener('click', () => {
      copyToClipboard(window.location.href, '청첩장 주소 링크가 복사되었습니다.');
    });
  }
}

/* ----------------------------------------------------
   10. Floating Quick Navigation Bar Handler
---------------------------------------------------- */
function initQuickNav() {
  const quickNav = document.getElementById('floatingQuickNav');
  const btnLocation = document.getElementById('quickBtnLocation');
  const btnRsvp = document.getElementById('quickBtnRsvp');
  const btnAccount = document.getElementById('quickBtnAccount');

  if (!quickNav) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const overlay = document.getElementById('envelopeOverlay');
    const isOverlayActive = overlay && !overlay.classList.contains('opened');

    if (scrollY > 160 && !isOverlayActive) {
      quickNav.classList.remove('hidden');
    } else {
      quickNav.classList.add('hidden');
    }
  });

  if (btnLocation) {
    btnLocation.addEventListener('click', () => {
      const locEl = document.getElementById('location');
      if (locEl) locEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnRsvp) {
    btnRsvp.addEventListener('click', () => {
      const rsvpModal = document.getElementById('rsvpModal');
      if (rsvpModal) {
        rsvpModal.classList.remove('hidden');
      } else {
        const rsvpEl = document.getElementById('rsvp');
        if (rsvpEl) rsvpEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (btnAccount) {
    btnAccount.addEventListener('click', () => {
      const accEl = document.getElementById('account');
      if (accEl) accEl.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ----------------------------------------------------
   9. Falling Petals Canvas Animation & Toggle Control
---------------------------------------------------- */
function initPetals() {
  const canvas = document.getElementById('petalsCanvas');
  const toggleBtn = document.getElementById('petalsToggleBtn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let isPetalsActive = true;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const TOTAL_PETALS = 28;
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : -20;
      this.size = Math.random() * 8 + 6; // 6px ~ 14px
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.03;
      this.opacity = Math.random() * 0.45 + 0.45;
      const colors = ['rgba(200, 141, 148, ', 'rgba(235, 180, 185, ', 'rgba(247, 235, 235, '];
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.angle) * 0.8 + this.speedX;
      this.angle += this.spin;

      if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      
      // Organic petal shape
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
      ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);

      ctx.fillStyle = `${this.colorBase}${this.opacity})`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PETALS; i++) {
    petals.push(new Petal());
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isPetalsActive) {
      petals.forEach(p => {
        p.update();
        p.draw();
      });
    }
    animationFrameId = requestAnimationFrame(render);
  }

  render();

  if (toggleBtn) {
    const statusText = toggleBtn.querySelector('.petals-status');
    toggleBtn.addEventListener('click', () => {
      isPetalsActive = !isPetalsActive;
      if (isPetalsActive) {
        toggleBtn.classList.add('active');
        if (statusText) statusText.innerText = '꽃잎 ON';
      } else {
        toggleBtn.classList.remove('active');
        if (statusText) statusText.innerText = '꽃잎 OFF';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  }
}
