/**
 * 陽明里 2D 遊戲核心驅動引擎
 * 管理遊戲主迴圈、相機跟隨、實體更新、接近偵測與互動觸發
 */
import { YangmingMap } from "../world/map.js";
import { LANDMARKS } from "../world/landmarks.js?v=20260916_v3";
import { Player } from "../entities/player.js";
import { NpcManager } from "../entities/npc.js";
import { CoinManager } from "../entities/coin.js";
import { Camera } from "./camera.js";
import { InputManager } from "./input.js";
import { UIManager } from "../ui/dialog.js";

export class GameEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");

    // 初始化世界地圖
    this.map = new YangmingMap();

    // 玩家初始起點（位於中央山仔后核心，派出所與麥當勞前方步道）
    this.player = new Player(340, 470);

    // NPC 人物管理器
    this.npcManager = new NpcManager();

    // 必經景點浮動金幣管理器
    this.coinManager = new CoinManager((coin, count, total) => {
      this.ui.updateCoinCount(count, total);
      this.ui.showToast(`收集到【${coin.landmarkName}】金幣！(${count}/${total})`);
      if (count >= total) {
        setTimeout(() => {
          this.ui.showToast("太棒了！已收集全地圖所有 30 處景點金幣！");
        }, 1000);
      }
    });

    // 直立相機系統
    this.camera = new Camera(this.canvas.width, this.canvas.height, this.map.width, this.map.height);

    // UI 介面與導覽管理器
    this.ui = new UIManager();
    this.ui.setMapImage(this.map.image);
    this.ui.setVisitedLandmarks(this.player.visitedLandmarks);
    this.ui.updateCoinCount(this.coinManager.collectedCount, this.coinManager.totalCoins);

    // 跨平台輸入系統（支援點擊尋路與虛擬鍵盤）
    this.input = new InputManager(this.canvas, (screenX, screenY) => {
      this.coinManager.initAudio();
      const worldPos = this.camera.screenToWorld(screenX, screenY);
      const snapped = this.map.getClosestWalkablePoint(worldPos.x, worldPos.y);
      this.player.setTarget(snapped.x, snapped.y);
    });

    // 接近中的可互動目標（地標或 NPC）
    this.activeInteractable = null;

    // 綁定浮動氣泡按鈕直接點擊事件
    const proximityPromptBtn = document.getElementById("proximity-prompt");
    if (proximityPromptBtn) {
      proximityPromptBtn.addEventListener("click", () => {
        this.triggerInteraction();
      });
    }

    this.lastTime = performance.now();
    this.isRunning = false;
  }

  /**
   * 啟動遊戲主迴圈
   */
  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
    this.ui.showToast("歡迎漫步陽明里！點擊畫面或使用下方按鈕移動");
  }

  /**
   * 視窗動態自適應
   */
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.camera.resize(width, height);
  }

  /**
   * 遊戲核心主迴圈
   */
  loop(currentTime) {
    if (!this.isRunning) return;

    // 計算時間差（秒），限制最大 dt 避免切換分頁時物理穿透
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * 邏輯更新
   */
  update(dt) {
    // 彈窗開啟時暫停角色移動
    if (!this.ui.isDialogOpen) {
      this.player.update(dt, this.input, this.map);
    }

    // 更新必經景點金幣旋轉、浮動與收集碰撞
    this.coinManager.update(dt, this.player.x, this.player.y);

    // 相機平滑跟隨玩家
    this.camera.follow(this.player.x, this.player.y);

    // 檢測周圍可互動目標
    this.checkProximity();

    // 處理互動鍵觸發
    if (this.input.consumeInteract()) {
      this.triggerInteraction();
    }
  }

  /**
   * 檢測玩家是否靠近地標或 NPC
   */
  checkProximity() {
    if (this.ui.isDialogOpen) {
      this.ui.hideProximity();
      return;
    }

    let nearest = null;
    let minDist = Infinity;

    // 1. 檢測 4 大地標
    for (const lm of LANDMARKS) {
      const dist = Math.hypot(lm.x - this.player.x, lm.y - this.player.y);
      if (dist <= lm.radius && dist < minDist) {
        minDist = dist;
        nearest = { type: "landmark", data: lm };
      }
    }

    // 2. 檢測 NPC 人物
    const nearbyNpc = this.npcManager.getNearbyNpc(this.player.x, this.player.y, 40);
    if (nearbyNpc) {
      nearest = { type: "npc", data: nearbyNpc };
    }

    this.activeInteractable = nearest;

    if (nearest) {
      const label = nearest.type === "landmark" 
        ? `查看：${nearest.data.name}` 
        : `對話：${nearest.data.name}`;
      this.ui.showProximity(label);
    } else {
      this.ui.hideProximity();
    }
  }

  /**
   * 執行調查或對話
   */
  triggerInteraction() {
    if (!this.activeInteractable || this.ui.isDialogOpen) return;

    if (this.activeInteractable.type === "landmark") {
      const lm = this.activeInteractable.data;
      const isFirstVisit = !this.player.visitedLandmarks.has(lm.id);

      if (isFirstVisit) {
        this.player.visitedLandmarks.add(lm.id);
        this.player.saveVisited();
        this.ui.setVisitedLandmarks(this.player.visitedLandmarks);
      }

      this.ui.showLandmarkDialog(lm, isFirstVisit);
    } else if (this.activeInteractable.type === "npc") {
      this.ui.showNpcDialog(this.activeInteractable.data);
    }
  }

  /**
   * 畫面渲染繪製
   */
  render() {
    // 清空目前螢幕
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 套用相機視野偏移
    this.camera.apply(this.ctx);

    // 1. 繪製陽明里地圖背景與建築（傳入玩家座標以動態展開靠近之地標標籤）
    this.map.render(this.ctx, this.camera, this.player.x, this.player.y);

    // 2. 繪製必經景點浮動旋轉金幣（位於地圖上方、角色下方）
    this.coinManager.render(this.ctx);

    // 3. 繪製 NPC 角色
    this.npcManager.render(this.ctx);

    // 4. 繪製玩家角色
    this.player.render(this.ctx);

    // 復原相機視角
    this.camera.restore(this.ctx);
  }
}
