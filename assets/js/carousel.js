'use strict';

// Carrossel independente do restante do site: HTML, CSS e JS puros.
(() => {
  const slider = document.querySelector('.portifolio .slide-container');
  if (!slider) return;
  const track = slider.querySelector('.card-wrapper');
  const originalCards = [...track.querySelectorAll('.card')];
  const viewport = slider.querySelector('.slide-content');
  const prevButton = slider.querySelector('.slide-nav--prev');
  const nextButton = slider.querySelector('.slide-nav--next');
  const pagination = slider.querySelector('.slide-pagination');
  const status = slider.querySelector('.slide-status');
  const modal = document.getElementById('project-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalLink = document.getElementById('modal-link');
  const modalClose = modal.querySelector('.modal_close');
  const totalCards = originalCards.length;
  if (!totalCards) return;

  let visibleCount = 3;
  let currentIndex = 0; // Inclui os clones no início do track.
  let moving = false;
  let finishFallback = null;
  let lastFocus = null;
  let suppressClick = false;

  function cardsPerView() {
    if (window.matchMedia('(max-width: 640px)').matches) return 1;
    if (window.matchMedia('(max-width: 980px)').matches) return 2;
    return 3;
  }
  function realIndex() {
    return ((currentIndex - visibleCount) % totalCards + totalCards) % totalCards;
  }
  function cloneCard(card) {
    const clone = card.cloneNode(true);
    clone.dataset.clone = 'true';
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('button, a[href]').forEach(control => control.tabIndex = -1);
    return clone;
  }
  function stepWidth() {
    const first = track.querySelector('.card');
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  }
  function updateDots() {
    const idx = realIndex();
    [...pagination.querySelectorAll('.slide-dot')].forEach((dot, i) => {
      dot.classList.toggle('is-active', i === idx);
      if (i === idx) dot.setAttribute('aria-current','true');
      else dot.removeAttribute('aria-current');
    });
    status.textContent = `Projeto ${idx + 1} de ${totalCards}`;
  }
  function positionTrack(animated = false) {
    if (!animated) track.style.transition = 'none';
    else track.style.removeProperty('transition');
    track.style.transform = `translate3d(${-currentIndex * stepWidth()}px,0,0)`;
    if (!animated) {
      void track.offsetHeight;
      track.style.removeProperty('transition');
    }
    updateDots();
  }
  function buildTrack() {
    const selected = currentIndex ? realIndex() : 0;
    track.querySelectorAll('[data-clone="true"]').forEach(clone => clone.remove());
    visibleCount = Math.min(cardsPerView(),totalCards);
    const before = originalCards.slice(-visibleCount).map(cloneCard);
    const after = originalCards.slice(0,visibleCount).map(cloneCard);
    track.prepend(...before);
    track.append(...after);
    currentIndex = visibleCount + selected;
    moving = false;
    clearTimeout(finishFallback);
    positionTrack(false);
    const canSlide = totalCards > 1;
    prevButton.hidden = !canSlide;
    nextButton.hidden = !canSlide;
  }
  function finishMovement() {
    clearTimeout(finishFallback);
    if (currentIndex < visibleCount) currentIndex += totalCards;
    else if (currentIndex >= visibleCount + totalCards) currentIndex -= totalCards;
    positionTrack(false);
    moving = false;
  }
  function animateMove() {
    moving = true;
    positionTrack(true);
    clearTimeout(finishFallback);
    // Fallback para browsers que não disparam transitionend (ex.: movimento reduzido).
    finishFallback = setTimeout(finishMovement, 530);
  }
  function navigate(direction) {
    if (moving || totalCards <= 1) return;
    currentIndex += direction;
    animateMove();
  }
  track.addEventListener('transitionend', event => {
    if (event.target === track && event.propertyName === 'transform' && moving) finishMovement();
  });
  prevButton.addEventListener('click', () => navigate(-1));
  nextButton.addEventListener('click', () => navigate(1));

  for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slide-dot';
    dot.setAttribute('aria-label', `Ir para o projeto ${i + 1}`);
    dot.addEventListener('click', () => {
      if (moving || realIndex() === i) return;
      currentIndex = visibleCount + i;
      animateMove();
    });
    pagination.appendChild(dot);
  }

  // Toque e arraste pelo mouse/caneta. A rolagem vertical permanece livre.
  const gesture = { active:false, pointerId:null, startX:0, startY:0, baseX:0, dx:0, dragging:false };
  function currentTranslateX() {
    const transform = getComputedStyle(track).transform;
    if (transform === 'none') return -currentIndex * stepWidth();
    return new DOMMatrixReadOnly(transform).m41;
  }
  viewport.querySelectorAll('img').forEach(img => { img.draggable = false; });
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (gesture.active || totalCards <= 1 || modal.open) return;
    gesture.active = true;
    gesture.pointerId = event.pointerId;
    gesture.startX = event.clientX;
    gesture.startY = event.clientY;
    gesture.dx = 0;
    gesture.dragging = false;
    gesture.baseX = currentTranslateX();
    if (moving) {
      clearTimeout(finishFallback);
      track.style.transition = 'none';
      track.style.transform = `translate3d(${gesture.baseX}px,0,0)`;
      moving = false;
    }
  });
  viewport.addEventListener('pointermove', event => {
    if (!gesture.active || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (!gesture.dragging) {
      if (Math.abs(dx) < 10 || Math.abs(dx) <= Math.abs(dy)) return;
      gesture.dragging = true;
      track.style.transition = 'none';
      track.classList.add('is-dragging');
      viewport.setPointerCapture(event.pointerId);
    }
    gesture.dx = dx;
    track.style.transform = `translate3d(${gesture.baseX + dx}px,0,0)`;
  });
  function finishGesture(event, canceled = false) {
    if (!gesture.active || event.pointerId !== gesture.pointerId) return;
    const dragged = gesture.dragging;
    const dx = gesture.dx;
    gesture.active = false;
    gesture.dragging = false;
    track.classList.remove('is-dragging');
    if (dragged) {
      suppressClick = true;
      const threshold = Math.min(65,stepWidth()*.18);
      if (!canceled && Math.abs(dx) >= threshold) currentIndex += dx < 0 ? 1 : -1;
      // Recoloca o track na posição correta com transição.
      void track.offsetHeight;
      animateMove();
    } else {
      positionTrack(false);
    }
  }
  viewport.addEventListener('pointerup', event => finishGesture(event));
  viewport.addEventListener('pointercancel', event => finishGesture(event, true));
  viewport.addEventListener('click', event => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  // Modal: delegação de evento inclui as cópias do loop infinito.
  track.addEventListener('click', event => {
    const button = event.target.closest('.button--details');
    if (!button || suppressClick) return;
    const card = button.closest('.card');
    const image = card.querySelector('.card-img');
    const link = card.querySelector('.button--visit');
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalTitle.textContent = card.querySelector('.name').textContent;
    modalDescription.textContent = card.dataset.details || card.querySelector('.description').textContent;
    modalLink.hidden = !link;
    if (link) {
      modalLink.href = link.getAttribute('href');
      modalLink.target = link.target || '_self';
      modalLink.rel = link.rel || '';
      modalLink.firstChild.textContent = link.textContent.trim() + ' ';
    }
    lastFocus = button;
    modal.showModal();
    modalClose.focus();
  });
  modalClose.addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    const box = modal.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) modal.close();
  });
  modal.addEventListener('close', () => {
    if (lastFocus?.isConnected) lastFocus.focus();
  });
  modalLink.addEventListener('click', () => {
    if (modalLink.getAttribute('href')?.startsWith('#')) modal.close();
  });
  slider.addEventListener('keydown', event => {
    if (modal.open || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); navigate(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1); }
  });
  let resizeJob = null;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeJob);
    resizeJob = requestAnimationFrame(() => {
      if (cardsPerView() !== visibleCount) buildTrack();
      else positionTrack(false);
    });
  });
  buildTrack();
})();
