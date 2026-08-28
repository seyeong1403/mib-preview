/* MIB main.js v2 — worldpanasia.com 실측 모션 이식
   ① 히어로: 최초 스크롤 잠금 → 휠 다운(deltaY>20) 시 박스 풀스크린 확장(on) → 1초 후 stop → 잠금 해제
             최상단에서 휠 업(deltaY<-20) 시 원상복귀(closeVisual)  [파나시아 인라인 스크립트와 동일 로직]
   ② 핀 섹션: GSAP ScrollTrigger — main-con1 top top, end +=150%, scrub 2, pin
             main-con2 408x271 → 100%/100% → inner opacity 0→1(0.8) ['>' 시퀀스]  [원본 타임라인 그대로]
   ③ main-con3: 좌측 이미지 clipPath inset(0 100% 0 0) → inset(0 0 0 0), scrub 2  [원본 그대로]
   ④ 스와이퍼: business(slidesPerView auto·spaceBetween 30·freeMode·scrollbar),
             history(3장 센터·initialSlide 5·nav), practice(auto·scrollbar)  [원본 파라미터]
*/
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isLocking = false;
  var touchStartY = 0;

  /* ---------- ① 히어로 (파나시아 로직 이식) ---------- */
  function lockScroll(ms) {
    if (isLocking) return;
    isLocking = true;
    var stop = function (e) { e.preventDefault(); e.stopPropagation(); return false; };
    window.addEventListener('wheel', stop, { passive: false });
    window.addEventListener('touchmove', stop, { passive: false });
    setTimeout(function () {
      window.removeEventListener('wheel', stop, { passive: false });
      window.removeEventListener('touchmove', stop, { passive: false });
      isLocking = false;
    }, ms || 900);
  }

  var box = document.querySelector('.mv-ix_visual_box');
  var wrap = document.querySelector('.mv-ix_visual_wrap');
  var header = document.getElementById('header');
  var mv = document.getElementById('mv-ix');

  function openVisual() {
    if (box.classList.contains('on')) return;
    lockScroll(1000);
    box.classList.add('on');
    header.classList.add('white');
    document.documentElement.classList.remove('no_scroll');
    document.body.classList.remove('no_scroll');
    /* 실측: 박스 top을 wrap 화면 오프셋만큼 끌어올려 풀스크린 정렬 */
    box.style.top = '-' + Math.round(wrap.getBoundingClientRect().top + window.scrollY) + 'px';
    setTimeout(function () {
      box.classList.add('stop');
      /* 잠금 해제로 스크롤바가 생기면 폭이 14px 줄어드므로 핀 치수 재계산 */
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }, 1000);
  }

  function closeVisual() {
    if (!box.classList.contains('on')) return;
    if (window.scrollY !== 0) return;
    box.classList.remove('stop');
    box.classList.remove('on');
    document.documentElement.classList.add('no_scroll');
    document.body.classList.add('no_scroll');
    header.classList.remove('white');
    box.style.top = '0';
  }

  /* 최초 진입 잠금 (원본과 동일) */
  document.documentElement.classList.add('no_scroll');
  document.body.classList.add('no_scroll');

  if (reduceMotion) {
    /* 리듀스드 모션: 잠금 없이 펼친 상태로 시작 */
    box.classList.add('on', 'stop');
    header.classList.add('white');
    document.documentElement.classList.remove('no_scroll');
    document.body.classList.remove('no_scroll');
    box.style.top = '-' + Math.round(wrap.getBoundingClientRect().top + window.scrollY) + 'px';
  } else {
    mv.addEventListener('wheel', function (e) {
      if (isLocking) return;
      if (e.deltaY > 20) openVisual();
      else if (e.deltaY < -20) closeVisual();
    }, { passive: true });

    mv.addEventListener('touchstart', function (e) { touchStartY = e.touches[0].clientY; }, { passive: true });
    mv.addEventListener('touchmove', function (e) {
      if (isLocking) return;
      var diff = touchStartY - e.touches[0].clientY;
      if (diff > 15) openVisual();
      else if (diff < -15) closeVisual();
    }, { passive: true });

    /* 최상단으로 되돌아오면 히어로 상태 복구 대비: 휠 업은 #mv-ix 위에서만 잡히므로
       스크롤 0 도달 시 mv가 다시 이벤트를 받는 구조(원본과 동일) */
  }

  /* 헤더 배경 전환: 히어로를 지나면 bgbg (실측: white.bgbg → 흰 배경 + 검정 텍스트) */
  function onScroll() {
    if (window.scrollY > window.innerHeight * 0.6) header.classList.add('bgbg');
    else header.classList.remove('bgbg');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- ② 핀 섹션 GSAP (원본 타임라인 파라미터 그대로) ---------- */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();
    mm.add(
      { desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' },
      function (ctx) {
        var desktop = ctx.conditions.desktop;
        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.main-con1',
            start: 'top top',
            end: '+=150%',
            scrub: 2,
            pin: '.mainCon-gsap-wrap',
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });
        if (desktop) {
          tl.fromTo('.main-con2',
            { width: '408px', height: '271px', top: '50%', right: '10%' },
            { width: '100%', height: '100%', top: '0%', right: '0%', ease: 'none', duration: 1 });
        } else {
          tl.fromTo('.main-con2',
            { width: '50px', height: '50px', top: '50%', right: '10%' },
            { width: '100%', height: '100%', top: '0%', right: '0%', ease: 'none', duration: 1 });
        }
        tl.fromTo('.main-con2 .container .inner',
          { opacity: 0, pointerEvents: 'none' },
          { opacity: 1, duration: 0.8, pointerEvents: 'auto' }, '>');
        return function () { if (tl.scrollTrigger) tl.scrollTrigger.kill(); tl.kill(); };
      }
    );

    /* ---------- ③ main-con3 clipPath 와이프 (원본 그대로) ---------- */
    gsap.fromTo('.main-con3 .left .list li img',
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)', ease: 'none',
        scrollTrigger: { trigger: '.main-con3', start: 'top bottom', end: 'center bottom', scrub: 2 }
      });
  } else if (reduceMotion && window.gsap) {
    /* 모션 축소: 핀 없이 최종 상태 고정 */
    gsap.set('.main-con2', { width: '100%', height: '100%', top: '0%', right: '0%' });
    gsap.set('.main-con2 .container .inner', { opacity: 1, pointerEvents: 'auto' });
    gsap.set('.main-con3 .left .list li img', { clipPath: 'inset(0 0% 0 0)' });
  }

  /* ---------- ④ 스와이퍼 (원본 파라미터 이식) ---------- */
  /* 사업분야 마퀴: 슬라이드 세트를 복제해 linear infinite로 계속 흐름 (호버 시 정지) */
  var GAP = 30, SPEED = 70; /* px/s */
  function setupMarquee(el) {
    var wrap = el.querySelector('.swiper-wrapper');
    if (!wrap || wrap.dataset.marquee) return;
    var setW = wrap.scrollWidth;
    if (!setW) return; /* display:none 상태 — 활성화 때 다시 */
    setW += GAP;
    var originals = Array.prototype.slice.call(wrap.children);
    var container = el.querySelector('.swiper').getBoundingClientRect().width || 1200;
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
    wrap.dataset.marquee = '1';
  }
  if (window.Swiper) {
    setupMarquee(document.querySelector('.business-swiper.active'));

    new Swiper('.news-swiper .swiper', {
      slidesPerView: 'auto',
      spaceBetween: 30,
      freeMode: true,
      slidesOffsetAfter: 50,
      scrollbar: { el: '.news-scrollbar', hide: false, draggable: true, snapOnRelease: false }
    });
  }

  /* 사업분야 탭 (원본: 탭 클릭 → 스와이퍼 표시 전환 + slideTo(0) + 배경 교체) */
  var bgLayer = document.querySelector('.business-bg');
  /* 누끼 도입 후 밝은 제품사진 배경은 대비가 무너져 다크 팹 사진으로 통일 (2026-08-28) */
  var bgImages = [
    'images/company/hero-fab.jpg',
    'images/company/hero-fab.jpg',
    'images/company/hero-fab.jpg',
    'images/company/hero-fab.jpg',
    'images/company/hero-fab.jpg',
    'images/company/hero-fab.jpg'
  ];
  bgLayer.style.backgroundImage = 'url(' + bgImages[0] + ')';

  function activateBizTab(idx) {
    idx = String(idx);
    document.querySelectorAll('.btn-area ul li').forEach(function (li) {
      var btn = li.querySelector('button');
      var on = btn.dataset.wrap === idx;
      li.classList.toggle('active', on);
      btn.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('.business-swiper').forEach(function (el) {
      var on = el.dataset.wrap === idx;
      el.classList.toggle('active', on);
      if (on) setupMarquee(el);
    });
    bgLayer.style.backgroundImage = 'url(' + bgImages[+idx] + ')';
  }

  document.querySelectorAll('.btn-area ul li button').forEach(function (btn) {
    btn.addEventListener('click', function () { activateBizTab(btn.dataset.wrap); });
  });

  /* GNB·링크에서 컨설팅 탭 딥링크 */
  document.querySelectorAll('[data-biz-tab]').forEach(function (a) {
    a.addEventListener('click', function () { activateBizTab(a.dataset.bizTab); });
  });

  /* ---------- 전체메뉴 오버레이 ---------- */
  var allMenu = document.querySelector('.allMenuWrap');
  function setMenu(open) {
    allMenu.classList.toggle('open', open);
    allMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  document.querySelectorAll('.allMenuBtn, .mobileMenuBtn').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(true); });
  });
  allMenu.querySelector('.closeBtn').addEventListener('click', function () { setMenu(false); });
  allMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- topBtn ---------- */
  document.querySelector('#footer .topBtn').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();
