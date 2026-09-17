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
})();
