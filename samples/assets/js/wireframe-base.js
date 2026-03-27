/**
 * FlowFrame Wireframe Base Script
 * 와이어프레임 HTML에서 공통으로 사용하는 기본 스크립트
 * CDN: {SUPABASE_URL}/storage/v1/object/public/wireframe-assets/js/wireframe-base.js
 */

(function () {
  "use strict";

  /**
   * 메타데이터 파싱 — flowframe-meta 블록에서 JSON 추출
   * FlowFrame iframe에서 postMessage로 메타데이터를 전달할 때 사용
   */
  function getFlowFrameMeta() {
    var el = document.getElementById("flowframe-meta");
    if (!el) return null;
    try {
      return JSON.parse(el.textContent || "");
    } catch (e) {
      return null;
    }
  }

  /**
   * FlowFrame iframe 통신
   * 와이어프레임이 iframe 안에서 로드되면 부모 창에 메타데이터를 전달
   */
  function notifyParent() {
    if (window.parent === window) return; // iframe이 아니면 무시

    var meta = getFlowFrameMeta();
    if (!meta) return;

    window.parent.postMessage(
      { type: "flowframe:wireframe-loaded", meta: meta },
      "*"
    );
  }

  /**
   * feature 하이라이트
   * data-feature 속성이 있는 요소에 hover 시 아웃라인 표시
   */
  function initFeatureHighlight() {
    var features = document.querySelectorAll("[data-feature]");

    features.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        el.style.outline = "2px dashed #4a90d9";
        el.style.outlineOffset = "2px";
      });
      el.addEventListener("mouseleave", function () {
        el.style.outline = "";
        el.style.outlineOffset = "";
      });
    });
  }

  // ── Init ──
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      notifyParent();
      initFeatureHighlight();
    });
  } else {
    notifyParent();
    initFeatureHighlight();
  }
})();
