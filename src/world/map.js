/**
 * 陽明里 1024 x 1024 純手繪水彩繪本風格地圖引擎
 * 採用使用者認可之吉卜力/動森風格全景手繪插畫作為真實底圖
 * 零程式畫路、零生硬線條，30 處地標精確錨定於各建築門前
 */
import { LANDMARKS } from "./landmarks.js?v=20260916_v3";

export class YangmingMap {
  constructor() {
    this.width = 682;
    this.height = 1024;
    this.animTimer = 0;

    // 載入純淨手繪水彩全景底圖（支援防呆相容）
    if (typeof Image !== "undefined") {
      this.mapImage = new Image();
      this.mapImage.src = "./assets/map_illustrated.jpg";
      this.isLoaded = false;
      this.mapImage.onload = () => {
        this.isLoaded = true;
      };
    } else {
      this.mapImage = null;
      this.isLoaded = false;
    }
  }

  /**
   * 碰撞邊界檢測：全島自由漫步，四周邊界阻擋
   */
  checkCollision(x, y, radius = 20) {
    if (x < 25 || x > this.width - 25 || y < 25 || y > this.height - 25) {
      return true;
    }
    return false;
  }

  /**
   * 取得可通行目標點（手機友善點擊尋路 Tap-to-Move）
   */
  getClosestWalkablePoint(targetX, targetY) {
    return {
      x: Math.max(30, Math.min(this.width - 30, targetX)),
      y: Math.max(30, Math.min(this.height - 30, targetY))
    };
  }

  /**
   * 繪製 1024 x 1024 水彩繪本全景地圖
   */
  render(ctx, camera, playerX, playerY) {
    this.animTimer += 0.016;

    // 1. 底層自然環境基底
    ctx.fillStyle = "#eaf4ec";
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. 繪製純淨手繪插畫全景底圖（以 682 x 1024 原圖比例 1:1 繪製）
    if (this.mapImage && this.mapImage.complete && this.mapImage.naturalWidth > 0) {
      ctx.drawImage(this.mapImage, 0, 0, this.width, this.height);
    } else {
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("陽明里手繪散步地圖載入中...", this.width / 2, this.height / 2);
    }

    // 3. 僅在玩家靠近地標時繪製單一互動名稱提示，嚴禁額外繪製任何數字編號
    this.renderNearbyPromptOnly(ctx, playerX, playerY);
  }

  /**
   * 僅繪製靠近時的單一焦點地名（不繪製任何多餘數字徽章）
   */
  renderNearbyPromptOnly(ctx, playerX, playerY) {
    if (playerX === undefined || playerY === undefined) return;

    let closestLm = null;
    let minDist = 65;

    for (const lm of LANDMARKS) {
      const d = Math.hypot(lm.x - playerX, lm.y - playerY);
      if (d < minDist) {
        minDist = d;
        closestLm = lm;
      }
    }

    if (closestLm) {
      ctx.save();
      ctx.translate(closestLm.x, closestLm.y);

      // 地面呼吸互動微光圈（半透明金色）
      const pulse = Math.sin(this.animTimer * 4) * 3;
      ctx.strokeStyle = "rgba(250, 204, 21, 0.75)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 16 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      // 靠近時僅浮現純地名膠囊（不加編號）
      this.drawNearbyLabel(ctx, closestLm.name);

      ctx.restore();
    }
  }

  /**
   * 繪製靠近時的單一焦點名稱膠囊
   */
  drawNearbyLabel(ctx, name) {
    ctx.save();
    ctx.font = "bold 13px sans-serif";
    const textW = ctx.measureText(name).width;
    const pillW = textW + 22;
    const pillH = 28;
    const pillY = -52;

    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.38)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(-pillW / 2, pillY, pillW, pillH, 14);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 0, pillY + pillH / 2);
    ctx.restore();
  }
}
