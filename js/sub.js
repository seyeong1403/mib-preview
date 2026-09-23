/* MIB sub.js — 서브페이지 공통 (헤더/전체메뉴/topBtn) */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 서브는 헤더 상시 흰 배경 */
  var header = document.getElementById('header');
  header.classList.add('bgbg');

  /* 전체메뉴 오버레이 */
  var allMenu = document.querySelector('.allMenuWrap');
  function setMenu(open) {
    allMenu.classList.toggle('open', open);
    allMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  document.querySelectorAll('.allMenuBtn, .mobileMenuBtn').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(true); });
  });
  if (allMenu) {
    allMenu.querySelector('.closeBtn').addEventListener('click', function () { setMenu(false); });
    allMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* topBtn */
  var top = document.querySelector('#footer .topBtn');
  if (top) top.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* 문의 폼 (정적 시안: 제출 시 안내) */
  var form = document.querySelector('.formWrap form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('문의 접수 기능은 개발 단계(CI4 연동)에서 활성화됩니다.');
  });

  /* ---------- 설비 이미지 확대 보기 (라이트박스) ---------- */
  var facCards = Array.prototype.slice.call(document.querySelectorAll('.facCard'));
  if (facCards.length) {
    var items = facCards.map(function (card) {
      var img = card.querySelector('.img img');
      return {
        src: img ? img.getAttribute('src').replace('/facility/', '/facility/2x/') : '',
        name: (card.querySelector('.name') || {}).textContent || '',
        spec: (card.querySelector('.spec') || {}).textContent || ''
      };
    });
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', '\uc124\ube44 \uc774\ubbf8\uc9c0 \ud06c\uac8c \ubcf4\uae30');
    lb.innerHTML =
      '<button class="lb-close" type="button" aria-label="\ub2eb\uae30"></button>' +
      '<button class="lb-arrow prev" type="button" aria-label="\uc774\uc804 \uc124\ube44">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>' +
      '<button class="lb-arrow next" type="button" aria-label="\ub2e4\uc74c \uc124\ube44">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>' +
      '<div class="lb-box"><div class="lb-img"><img src="" alt=""></div>' +
      '<p class="lb-name"></p><p class="lb-spec"></p></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('.lb-img img');
    var lbName = lb.querySelector('.lb-name');
    var lbSpec = lb.querySelector('.lb-spec');
    var cur = 0;
    function show(i) {
      cur = (i + items.length) % items.length;
      lbImg.src = items[cur].src;
      lbImg.alt = items[cur].name;
      lbName.textContent = items[cur].name;
      lbSpec.textContent = items[cur].spec;
    }
    function openLb(i) {
      show(i);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    }
    function closeLb() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
    facCards.forEach(function (card, i) {
      card.setAttribute('data-zoom', '');
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('click', function () { openLb(i); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
      });
    });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-arrow.prev').addEventListener('click', function () { show(cur - 1); });
    lb.querySelector('.lb-arrow.next').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

})();
