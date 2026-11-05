// 화면 크기/비율에 관계없이 스크롤 없이 한 화면(#screen)에 맞춰 축소·확대한다.
// 모든 페이지가 같은 기준 높이(DESIGN_HEIGHT)를 공유하므로, 페이지마다 내용 길이가 달라도
// 같은 화면 크기에서는 항상 같은 배율로 보인다(페이지 간 크기가 들쭉날쭉해지는 것을 방지).
// 페이지 콘텐츠가 동적으로 바뀌는 경우(예: 연도 전환) window.__fitScreen()을 다시 호출하면 된다.
(function () {
  const DESIGN_HEIGHT = 900; // 모든 페이지가 이 높이 안에 들어오도록 맞춰져 있다.

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    const screenEl = document.getElementById("screen");
    const stageEl = document.getElementById("stage");
    if (!screenEl || !stageEl) return;

    function viewportSize() {
      if (window.visualViewport) {
        return { w: window.visualViewport.width, h: window.visualViewport.height };
      }
      return { w: window.innerWidth, h: window.innerHeight };
    }

    function fitScreen() {
      screenEl.style.transform = "none";
      const naturalW = screenEl.offsetWidth;
      const naturalH = screenEl.offsetHeight;
      // 실제 내용이 DESIGN_HEIGHT보다 커지는 경우(예상치 못한 콘텐츠 추가)에도
      // 잘리지 않도록 둘 중 더 큰 값을 기준으로 삼는다.
      const refH = Math.max(DESIGN_HEIGHT, naturalH);
      const vp = viewportSize();
      // 휴대폰마다 화면 비율이 조금씩 달라서, 가로를 먼저 꽉 채우고
      // (대부분의 폰에서 좌우 여백 없이 꽉 차게 보인다) 그 결과 세로가 화면을 넘치는
      // 드문 경우(가로로 넓고 낮은 화면)에만 세로 기준으로 다시 맞춘다.
      let scale = vp.w / naturalW;
      if (refH * scale > vp.h) {
        scale = vp.h / refH;
      }
      scale = Math.min(scale, 1);
      screenEl.style.transform = "scale(" + scale + ")";
    }

    window.addEventListener("resize", fitScreen);
    window.addEventListener("orientationchange", fitScreen);
    window.addEventListener("load", fitScreen);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", fitScreen);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitScreen);
    }
    document.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) img.addEventListener("load", fitScreen);
    });
    [0, 50, 150, 400, 1000].forEach(function (t) {
      setTimeout(fitScreen, t);
    });
    fitScreen();

    window.__fitScreen = fitScreen;
  });
})();
