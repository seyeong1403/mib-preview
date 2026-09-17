/* MIB main.js v3 — 2026-09 업체 수정 반영
   스크롤 인터랙션 전면 제거(휠 히어로·GSAP 핀·와이프·리빌 폐기).
   유지: 소재 마퀴(자동 흐름 — 업체 승인), 전체메뉴, topBtn. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 소재 마퀴 (세트 복제 + linear infinite, 호버 시 정지) ---------- */
  var GAP = 24, SPEED = 60; /* px/s */
  document.querySelectorAll('.matMarquee').forEach(function (el) {
    var wrap = el.querySelector('.swiper-wrapper');
    if (!wrap || reduceMotion) return;
    var setW = wrap.scrollWidth;
    if (!setW) return;
    setW += GAP;
    var originals = Array.prototype.slice.call(wrap.children);
    var container = el.getBoundingClientRect().width || 1200;
    while (wrap.scrollWidth < setW + container + 100) {
      originals.forEach(function (s) {
        var c = s.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        wrap.appendChild(c);
      });
    }
    wrap.style.setProperty('--set-w', setW + 'px');
    wrap.style.setProperty('--marquee-dur', (setW / SPEED) + 's');
    wrap.classList.add('marquee');
  });

  /* ---------- 전체메뉴 오버레이 ---------- */
  var allMenu = document.querySelector('.allMenuWrap');
  function setMenu(open) {
    if (!allMenu) return;
    allMenu.classList.toggle('open', open);
    allMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  document.querySelectorAll('.mobileMenuBtn, .allMenuBtn').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(true); });
  });
  if (allMenu) {
    allMenu.querySelector('.closeBtn').addEventListener('click', function () { setMenu(false); });
    allMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- topBtn ---------- */
  var top = document.querySelector('#footer .topBtn');
  if (top) top.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();
