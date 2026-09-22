/* MIB main.js v3 — 2026-09 업체 수정 반영
   스크롤 인터랙션 전면 제거(휠 히어로·GSAP 핀·와이프·리빌 폐기).
   유지: 소재 마퀴(자동 흐름 — 업체 승인), 전체메뉴, topBtn. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 소재 마퀴 (세트 복제 + rAF 구동: 자동 흐름 + 호버 정지 + 화살표 점프) ---------- */
  var GAP = 24, SPEED = 60; /* px/s */
  document.querySelectorAll('.matWrap').forEach(function (box) {
    var el = box.querySelector('.matMarquee');
    var wrap = el && el.querySelector('.swiper-wrapper');
    if (!wrap) return;
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

    var pos = 0, hover = false, tween = null, last = null;
    var step = (originals[0] ? originals[0].getBoundingClientRect().width : 430) + GAP;
    function apply() {
      wrap.style.transform = 'translateX(' + (-((pos % setW) + setW) % setW) + 'px)';
    }
    function tick(t) {
      if (last !== null && !hover && !tween && !reduceMotion) {
        pos += SPEED * Math.min(t - last, 100) / 1000;
        apply();
      }
      if (tween) {
        var k = Math.min((t - tween.t0) / 300, 1);
        var e = 1 - Math.pow(1 - k, 3); /* ease-out */
        pos = tween.from + (tween.to - tween.from) * e;
        apply();
        if (k >= 1) tween = null;
      }
      last = t;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    el.addEventListener('mouseenter', function () { hover = true; });
    el.addEventListener('mouseleave', function () { hover = false; });

    function jump(dir) {
      var from = tween ? tween.to : pos;
      if (reduceMotion) { pos = from + dir * step; tween = null; apply(); return; }
      tween = { from: pos, to: from + dir * step, t0: performance.now() };
    }
    var prev = box.querySelector('.matArrow.prev');
    var next = box.querySelector('.matArrow.next');
    if (prev) prev.addEventListener('click', function () { jump(-1); });
    if (next) next.addEventListener('click', function () { jump(1); });
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
