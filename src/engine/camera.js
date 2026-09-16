/**
 * 直立式自適應 2D 攝影機系統
 * 負責世界座標與螢幕座標轉換、視角平滑跟隨玩家與地圖邊界限制
 */
export class Camera {
  constructor(viewportWidth, viewportHeight, mapWidth, mapHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;

    this.x = 0;
    this.y = 0;
  }

  /**
   * 視窗大小改變時更新攝影機視錐
   */
  resize(width, height) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  /**
   * 平滑跟隨目標玩家
   */
  follow(targetX, targetY) {
    // 將玩家置於視窗中央
    let desiredX = targetX - this.viewportWidth / 2;
    let desiredY = targetY - this.viewportHeight / 2;

    // 地圖邊界防穿幫夾取（Clamping）
    if (this.mapWidth > this.viewportWidth) {
      desiredX = Math.max(0, Math.min(desiredX, this.mapWidth - this.viewportWidth));
    } else {
      desiredX = (this.mapWidth - this.viewportWidth) / 2;
    }

    if (this.mapHeight > this.viewportHeight) {
      desiredY = Math.max(0, Math.min(desiredY, this.mapHeight - this.viewportHeight));
    } else {
      desiredY = (this.mapHeight - this.viewportHeight) / 2;
    }

    // 初次載入直接對齊玩家中心，後續平滑插值跟隨
    if (!this.initialized) {
      this.x = desiredX;
      this.y = desiredY;
      this.initialized = true;
    } else {
      this.x += (desiredX - this.x) * 0.15;
      this.y += (desiredY - this.y) * 0.15;
    }
  }

  /**
   * 將螢幕觸控點（Canvas 像素）轉為世界座標（地圖像素）
   */
  screenToWorld(screenX, screenY) {
    return {
      x: screenX + this.x,
      y: screenY + this.y
    };
  }

  /**
   * 套用攝影機位移至畫布繪製環境
   */
  apply(ctx) {
    ctx.save();
    ctx.translate(-Math.round(this.x), -Math.round(this.y));
  }

  /**
   * 復原畫布繪製環境
   */
  restore(ctx) {
    ctx.restore();
  }
}
