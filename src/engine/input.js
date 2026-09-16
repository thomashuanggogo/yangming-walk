/**
 * 跨平台輸入管理器（電腦鍵盤 + 手機虛擬手把 + 地圖單指點擊導航）
 */
export class InputManager {
  constructor(canvasElement, onCanvasTapCallback) {
    this.canvas = canvasElement;
    this.onCanvasTap = onCanvasTapCallback;

    // 即時方向與操作狀態
    this.dx = 0;
    this.dy = 0;
    this.interactPressed = false;

    // 鍵盤按鍵紀錄集合
    this.activeKeys = new Set();

    // 觸控虛擬方向狀態
    this.touchDirections = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    this.initKeyboardListeners();
    this.initGamepadTouchListeners();
    this.initCanvasTapListeners();
  }

  /**
   * 初始化電腦鍵盤監聽（WASD、方向鍵、E 鍵、空白鍵）
   */
  initKeyboardListeners() {
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", "e", " ", "enter"].includes(key)) {
        e.preventDefault();
      }

      this.activeKeys.add(key);
      this.updateDirectionFromKeys();

      if (key === "e" || key === " " || key === "enter") {
        this.interactPressed = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      this.activeKeys.delete(key);
      this.updateDirectionFromKeys();

      if (key === "e" || key === " " || key === "enter") {
        this.interactPressed = false;
      }
    });
  }

  /**
   * 更新鍵盤合成向量
   */
  updateDirectionFromKeys() {
    let keyDx = 0;
    let keyDy = 0;

    if (this.activeKeys.has("arrowup") || this.activeKeys.has("w")) keyDy -= 1;
    if (this.activeKeys.has("arrowdown") || this.activeKeys.has("s")) keyDy += 1;
    if (this.activeKeys.has("arrowleft") || this.activeKeys.has("a")) keyDx -= 1;
    if (this.activeKeys.has("arrowright") || this.activeKeys.has("d")) keyDx += 1;

    // 若有虛擬方向按鍵按下，疊加計算
    if (this.touchDirections.up) keyDy -= 1;
    if (this.touchDirections.down) keyDy += 1;
    if (this.touchDirections.left) keyDx -= 1;
    if (this.touchDirections.right) keyDx += 1;

    this.dx = Math.max(-1, Math.min(1, keyDx));
    this.dy = Math.max(-1, Math.min(1, keyDy));
  }

  /**
   * 初始化手機虛擬手把（D-pad 與互動大按鈕）
   */
  initGamepadTouchListeners() {
    const dpadButtons = document.querySelectorAll(".ctrl-btn[data-dir]");
    dpadButtons.forEach(btn => {
      const dir = btn.getAttribute("data-dir");

      const handlePress = (e) => {
        e.preventDefault();
        btn.classList.add("active");
        this.touchDirections[dir] = true;
        this.updateDirectionFromKeys();
      };

      const handleRelease = (e) => {
        e.preventDefault();
        btn.classList.remove("active");
        this.touchDirections[dir] = false;
        this.updateDirectionFromKeys();
      };

      btn.addEventListener("touchstart", handlePress, { passive: false });
      btn.addEventListener("touchend", handleRelease, { passive: false });
      btn.addEventListener("touchcancel", handleRelease, { passive: false });

      btn.addEventListener("mousedown", handlePress);
      btn.addEventListener("mouseup", handleRelease);
      btn.addEventListener("mouseleave", handleRelease);
    });

    // 右側主要動作鍵（調查 / 對話）
    const actionBtn = document.getElementById("btn-action-interact");
    if (actionBtn) {
      const triggerAction = (e) => {
        e.preventDefault();
        this.interactPressed = true;
        // 一個短暫延遲後自動重設，模擬觸發
        setTimeout(() => {
          this.interactPressed = false;
        }, 150);
      };

      actionBtn.addEventListener("touchstart", triggerAction, { passive: false });
      actionBtn.addEventListener("click", triggerAction);
    }
  }

  /**
   * 初始化畫布點擊尋路（支援手機手指輕觸與滑鼠點擊）
   */
  initCanvasTapListeners() {
    const handleTap = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const screenX = (clientX - rect.left) * scaleX;
      const screenY = (clientY - rect.top) * scaleY;

      if (this.onCanvasTap) {
        this.onCanvasTap(screenX, screenY);
      }
    };

    this.canvas.addEventListener("click", (e) => {
      handleTap(e.clientX, e.clientY);
    });

    this.canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleTap(touch.clientX, touch.clientY);
      }
    }, { passive: true });
  }

  /**
   * 讀取並重設互動單次觸發
   */
  consumeInteract() {
    const triggered = this.interactPressed;
    this.interactPressed = false;
    return triggered;
  }
}
