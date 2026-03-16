// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

// data-aos 속성값을 GSAP 애니메이션으로 매핑하는 함수
function getFromVars(type) {
  switch (type) {
    case "fade-up":
      return { y: 40, opacity: 0 };
    case "fade-right":
      return { x: 40, opacity: 0 };
    case "fade-left":
      return { x: -40, opacity: 0 };
    case "fade-in":
      return { opacity: 0 };
    default:
      return { opacity: 0 };
  }
}

// 섹션 1 (.sec_petit01)만 애니메이션 적용
function initSectionPetit01() {
  gsap.utils.toArray("[gsap]").forEach((el) => {
    const type = el.getAttribute("gsap");
    const delay = parseInt(el.getAttribute("gsap-delay") || 0, 10) / 1000;

    gsap.from(el, {
      ...getFromVars(type),
      opacity: 0,
      duration: 0.5,
      ease: "power1.inOut",
      delay: delay,
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // 뷰포트 하단 15% 위치에서 트리거
        end: "bottom top", // 요소가 위로 사라질 때 reverse
        // toggleActions: "play none none reverse"
        toggleActions: "play none restart reverse"
        // ↓ 위로 올라갔다가 다시 내려올 때 재실행
        // markers: true, // 디버깅용 (필요하면 주석 해제)
      }
    });
  });
}

// 실행
window.addEventListener("load", () => {
  initSectionPetit01();
  ScrollTrigger.refresh(); // 위치 재계산
});

// 맨 위에서 다시 내려올 때 확실히 다시 실행되게
window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY <= 1) ScrollTrigger.refresh();
  },
  { passive: true }
);
