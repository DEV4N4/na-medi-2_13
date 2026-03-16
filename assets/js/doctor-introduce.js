gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

(() => {
  let sections = [];
  let currentIndex = 0;
  let isAnimating = false;

  // ✅ 현재 스크롤 위치에 따라 currentIndex를 업데이트 (모바일 Native Scroll 대응용)
  function syncIndexWithScroll() {
    const y = window.scrollY;
    let nearest = 0;
    let minDist = Infinity;

    sections.forEach((sec, i) => {
      // getBoundingClientRect는 비용이 비싸므로, offsetTop 사용 권장 (성능 최적화)
      // 하지만 기존 로직 유지를 위해 필요한 경우 유지하되, 약간의 스로틀링이 있으면 좋습니다.
      const top = sec.getBoundingClientRect().top + window.scrollY;
      const dist = Math.abs(top - y);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });

    currentIndex = nearest;
  }

  function goToSection(index) {
    if (isAnimating) return;
    const target = sections[index];
    if (!target) return;

    isAnimating = true;

    gsap.to(window, {
      scrollTo: { y: target, autoKill: false },
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimating = false;
        currentIndex = index;
        ScrollTrigger.refresh(); // 애니메이션 후 위치 재계산
      }
    });
  }

  function init() {
    sections = gsap.utils.toArray("section.observer");
    if (!sections.length) return;

    syncIndexWithScroll();

    // ✅ 반응형 분기
    ScrollTrigger.matchMedia({
      // 1️⃣ 데스크톱 (1025px 이상): 휠 이벤트 제어 (섹션 단위 이동)
      "(min-width: 1025px)": () => {
        Observer.create({
          target: window,
          type: "wheel",
          preventDefault: true, // 기본 스크롤 막음
          tolerance: 10,
          onDown: () => {
            if (isAnimating) return;
            goToSection(Math.min(currentIndex + 1, sections.length - 1));
          },
          onUp: () => {
            if (isAnimating) return;
            goToSection(Math.max(currentIndex - 1, 0));
          }
        });
      },

      // 2️⃣ 모바일/태블릿 (1024px 이하): 아무것도 안 함 (Native Scroll)
      "(max-width: 1024px)": () => {
        // 여기에 Observer를 만들지 않으면, 브라우저 기본 터치 스크롤이 작동합니다.
        // 즉, "쭉쭉 내려가는" 일반적인 웹사이트처럼 동작합니다.
      }
    });

    // ✅ 스크롤 이벤트 리스너 (모바일에서 Native Scroll 할 때 인덱스 추적용)
    window.addEventListener(
      "scroll",
      () => {
        // 애니메이션 중이 아닐 때만 계산 (성능 보호)
        if (!isAnimating) syncIndexWithScroll();
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      ScrollTrigger.refresh();
      syncIndexWithScroll();
    });
  }

  window.addEventListener("load", init);
})();
