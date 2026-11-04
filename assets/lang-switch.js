// 언어 전환 버튼(지구본 아이콘) + 모든 페이지 공통 텍스트(헤더/푸터) 번역을 담당한다.
// 페이지마다 다른 내용(연도별 기록 등)은 각 페이지가 window.__applyLanguage(langCode)를
// 직접 정의해두면, 언어가 바뀔 때마다 이 파일이 그 함수를 호출해준다.
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  const LANGS = [
    { code: "ko", label: "한국어", htmlLang: "ko" },
    { code: "en", label: "English", htmlLang: "en" },
    { code: "zh", label: "中文", htmlLang: "zh-CN" },
    { code: "ja", label: "日本語", htmlLang: "ja" }
  ];

  // 모든 페이지에 공통인 텍스트(헤더 제목, 버튼 설명, 푸터)
  const COMMON = {
    ko: {
      headerTitle: "제주 4·3 디지털 아카이브",
      langLabel: "언어 선택",
      homeLabel: "홈으로",
      footerKr: "제주 4·3 디지털 아카이브",
      footerUniv: "제주대학교",
      footerMsgLines: ["4·3의 기록과 기억을 보존하고", "다음 세대에 전합니다."]
    },
    en: {
      headerTitle: "Jeju 4·3 Digital Archive",
      langLabel: "Language",
      homeLabel: "Home",
      footerKr: "Jeju 4·3 Digital Archive",
      footerUniv: "Jeju National University",
      footerMsgLines: ["Preserving the memory of 4·3", "for the next generation."]
    },
    zh: {
      headerTitle: "济州4·3数字档案馆",
      langLabel: "选择语言",
      homeLabel: "返回首页",
      footerKr: "济州4·3数字档案馆",
      footerUniv: "济州大学校",
      footerMsgLines: ["保存4·3的记录与记忆，", "传递给下一代。"]
    },
    ja: {
      headerTitle: "済州4·3デジタルアーカイブ",
      langLabel: "言語選択",
      homeLabel: "ホームへ",
      footerKr: "済州4·3デジタルアーカイブ",
      footerUniv: "済州大学校",
      footerMsgLines: ["4·3の記録と記憶を保存し、", "次の世代に伝えます。"]
    }
  };

  function applyCommon(lang) {
    const t = COMMON[lang] || COMMON.ko;
    document.documentElement.lang = (LANGS.find(function (l) { return l.code === lang; }) || LANGS[0]).htmlLang;

    // 언어별로 글자 길이가 달라져도 한글 버전과 같은 화면 크기를 유지할 수 있도록,
    // body에 lang-xx 클래스를 달아두면 각 페이지 CSS에서 폰트 크기 등을 언어별로 미세 조정할 수 있다.
    document.body.className = document.body.className.replace(/\blang-\w+\b/g, "").trim();
    document.body.classList.add("lang-" + lang);

    const headerTitle = document.querySelector(".header .title");
    if (headerTitle) headerTitle.textContent = t.headerTitle;

    const langBtn = document.getElementById("langBtn");
    if (langBtn) langBtn.setAttribute("aria-label", t.langLabel);

    const homeBtn = document.querySelector(".home-btn");
    if (homeBtn) homeBtn.setAttribute("aria-label", t.homeLabel);

    const footerKr = document.querySelector(".footer .kr");
    if (footerKr) footerKr.textContent = t.footerKr;

    const footerUniv = document.querySelector(".footer .univ");
    // "@ JEJU NATIONAL UNIVERSITY" 영문 표기는 그대로 두고, 학교 이름(.kr 톤) 줄이 따로 있는 페이지만 바꾼다.
    if (footerUniv && footerUniv.dataset.translate !== "false") {
      footerUniv.textContent = "@ JEJU NATIONAL UNIVERSITY";
    }

    const footerMsg = document.querySelector(".footer .msg");
    if (footerMsg) {
      footerMsg.innerHTML = t.footerUniv + "<br>" + t.footerMsgLines.join("<br>");
    }
  }

  ready(function () {
    const btn = document.getElementById("langBtn");
    const dropdown = document.getElementById("langDropdown");
    if (!btn || !dropdown) return;

    let current = localStorage.getItem("site-lang") || "ko";

    function renderOptions() {
      dropdown.innerHTML = "";
      LANGS.forEach(function (l) {
        const opt = document.createElement("button");
        opt.type = "button";
        opt.className = "lang-option" + (l.code === current ? " active" : "");
        const label = document.createElement("span");
        label.textContent = l.label;
        const dot = document.createElement("span");
        dot.className = "dot";
        opt.appendChild(label);
        opt.appendChild(dot);
        opt.addEventListener("click", function () {
          current = l.code;
          localStorage.setItem("site-lang", current);
          renderOptions();
          closeDropdown();
          applyCommon(current);
          if (window.__applyLanguage) window.__applyLanguage(current);
        });
        dropdown.appendChild(opt);
      });
    }

    function openDropdown() { dropdown.classList.add("open"); }
    function closeDropdown() { dropdown.classList.remove("open"); }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.contains("open") ? closeDropdown() : openDropdown();
    });
    document.addEventListener("click", function (e) {
      if (dropdown.classList.contains("open") && !dropdown.contains(e.target) && e.target !== btn) {
        closeDropdown();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDropdown();
    });

    renderOptions();
    window.__currentLang = current;
    applyCommon(current);
    if (window.__applyLanguage) window.__applyLanguage(current);
  });
})();
