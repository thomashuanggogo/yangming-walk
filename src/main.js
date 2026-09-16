/**
 * 遊戲主程式入口（main.js）
 * 處理高解析度螢幕自適應、視窗縮放與遊戲引擎啟動
 */
import { GameEngine } from "./engine/game.js";

// 全域 Canvas roundRect Polyfill，確保所有瀏覽器環境皆能順暢運行
if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    const r = typeof radii === "number" ? radii : (Array.isArray(radii) ? (radii[0] || 0) : 0);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    return this;
  };
}

function initGame() {
  const canvas = document.getElementById("game-canvas");
  const viewportContainer = document.getElementById("viewport-container");

  if (!canvas || !viewportContainer) {
    console.error("找不到遊戲畫布或外層容器！");
    return;
  }

  // 建立遊戲引擎實例
  const game = new GameEngine(canvas);

  /**
   * 根據容器寬高動態重設 Canvas 解析度（包含尺寸保底防呆機制）
   */
  const handleResize = () => {
    const rect = viewportContainer.getBoundingClientRect();
    
    let width = Math.floor(rect.width);
    let height = Math.floor(rect.height);

    if (width <= 0 || height <= 0) {
      width = viewportContainer.clientWidth || window.innerWidth || 360;
      height = viewportContainer.clientHeight || (window.innerHeight - 150) || 540;
    }

    if (width > 0 && height > 0) {
      game.resize(width, height);
    }
  };

  // 初始調整大小並啟動遊戲
  handleResize();
  game.start();

  // 排版渲染微任務延遲二次校準（確保不同瀏覽器排版完成後畫布無黑邊或空白）
  setTimeout(handleResize, 100);
  setTimeout(handleResize, 300);

  // 監聽視窗縮放與手機螢幕方向改變
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 150);
  });
}

// 支援 DOM ready 與已就緒狀態雙重保險
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGame);
} else {
  initGame();
}

