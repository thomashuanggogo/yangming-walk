/**
 * 玩家實體類別（方案 A：精緻 Canvas 2D 向量渲染動森 Q 版主角）
 * 具備圓潤臉蛋、腮紅、高光大眼、草帽、背包、4 方向朝向與靈動走動跳步動畫
 */
export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.speed = 155; // 像素/秒

    // 移動方向與動畫狀態
    this.facing = "down"; // up, down, left, right
    this.isMoving = false;
    this.stepTimer = 0;
    this.stepFrame = 0;
    this.animTimer = 0; // 持續時間軸（用於呼吸與待機起伏）

    // 點擊尋路目標點（手機友善 Tap-to-Move）
    this.targetX = null;
    this.targetY = null;

    // 歷史走訪紀錄（支援 LocalStorage 儲存）
    this.visitedLandmarks = new Set();
    try {
      const saved = localStorage.getItem("ym_visited_landmarks");
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) {
          arr.forEach(id => this.visitedLandmarks.add(id));
        }
      }
    } catch (e) {
      console.warn("LocalStorage unavailable", e);
    }
  }

  /**
   * 將走訪紀錄儲存至 LocalStorage
   */
  saveVisited() {
    try {
      localStorage.setItem("ym_visited_landmarks", JSON.stringify(Array.from(this.visitedLandmarks)));
    } catch (e) {
      console.warn("Failed to save visited landmarks", e);
    }
  }

  /**
   * 設定點擊地面的尋路目標
   */
  setTarget(worldX, worldY) {
    this.targetX = worldX;
    this.targetY = worldY;
  }

  /**
   * 清除自動尋路目標
   */
  clearTarget() {
    this.targetX = null;
    this.targetY = null;
  }

  /**
   * 更新玩家位置與碰撞阻擋判定
   */
  update(dt, input, map) {
    this.animTimer += dt;
    let moveX = 0;
    let moveY = 0;

    // 1. 優先檢查方向鍵/虛擬十字鍵輸入
    if (input.dx !== 0 || input.dy !== 0) {
      this.clearTarget();
      moveX = input.dx;
      moveY = input.dy;

      if (moveX !== 0 && moveY !== 0) {
        const length = Math.hypot(moveX, moveY);
        moveX /= length;
        moveY /= length;
      }
    } else if (this.targetX !== null && this.targetY !== null) {
      // 2. 點擊地面自動導航模式
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 6) {
        this.clearTarget();
      } else {
        moveX = dx / dist;
        moveY = dy / dist;
      }
    }

    // 3. 處理位移與碰撞阻擋
    if (moveX !== 0 || moveY !== 0) {
      this.isMoving = true;
      this.stepTimer += dt * 7.5;
      this.stepFrame = Math.floor(this.stepTimer) % 2;

      // 決定角色面向
      if (Math.abs(moveX) > Math.abs(moveY)) {
        this.facing = moveX > 0 ? "right" : "left";
      } else {
        this.facing = moveY > 0 ? "down" : "up";
      }

      // 測試 X 軸移動
      const nextX = this.x + moveX * this.speed * dt;
      if (!map.checkCollision(nextX, this.y, this.radius)) {
        this.x = nextX;
      } else {
        if (this.targetX !== null) this.clearTarget();
      }

      // 測試 Y 軸移動
      const nextY = this.y + moveY * this.speed * dt;
      if (!map.checkCollision(this.x, nextY, this.radius)) {
        this.y = nextY;
      } else {
        if (this.targetY !== null) this.clearTarget();
      }
    } else {
      this.isMoving = false;
      this.stepTimer = 0;
      this.stepFrame = 0;
    }
  }

  /**
   * 繪製玩家角色（方案 A：精緻動森微縮模型向量渲染）
   */
  render(ctx) {
    ctx.save();

    // 計算步行微幅彈跳（Bobbing Effect）與待機輕微呼吸
    const bobOffset = this.isMoving 
      ? Math.sin(this.stepTimer * Math.PI) * 2.5 
      : Math.sin(this.animTimer * 2.8) * 0.8;

    ctx.translate(this.x, this.y + bobOffset);

    // 1. 腳底立體柔和投影（隨跳躍縮放）
    const shadowScale = this.isMoving ? 1 - Math.abs(bobOffset) * 0.05 : 1;
    ctx.fillStyle = "rgba(15, 23, 42, 0.26)";
    ctx.beginPath();
    ctx.ellipse(0, 16 - bobOffset, 16 * shadowScale, 7 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. 雙腳與鞋子（走動交替擺動）
    const legPhase = this.isMoving ? Math.sin(this.stepTimer * Math.PI) : 0;
    this.drawLegsAndShoes(ctx, legPhase);

    // 3. 身體、服裝與配件
    this.drawBody(ctx, legPhase);

    // 4. 頭部、可愛臉蛋、眼睛與草帽
    this.drawHeadAndHat(ctx);

    ctx.restore();

    // 5. 點擊尋路動態地面標記
    if (this.targetX !== null && this.targetY !== null) {
      ctx.save();
      const ringScale = 1 + Math.sin(this.animTimer * 6) * 0.15;
      ctx.strokeStyle = "#e76f51";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(this.targetX, this.targetY, 7 * ringScale, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(231, 111, 81, 0.3)";
      ctx.beginPath();
      ctx.arc(this.targetX, this.targetY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * 繪製腿部與小登山健行鞋
   */
  drawLegsAndShoes(ctx, legPhase) {
    const leftOffset = legPhase * 4;
    const rightOffset = -legPhase * 4;

    // 牛仔短褲褲管底色
    ctx.fillStyle = "#1e3a8a";

    // 繪製左腿鞋履
    this.drawSingleFoot(ctx, -8, 8 + leftOffset, this.facing);
    // 繪製右腿鞋履
    this.drawSingleFoot(ctx, 4, 8 + rightOffset, this.facing);
  }

  drawSingleFoot(ctx, x, y, facing) {
    // 襪子（白）
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(x, y, 6, 4);

    // 棕色小登山鞋
    ctx.fillStyle = "#854d0e";
    ctx.beginPath();
    ctx.roundRect(x - 1, y + 3, 8, 6, 3);
    ctx.fill();

    // 白色鞋底
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(x - 1, y + 7.5, 8, 2);
  }

  /**
   * 繪製身軀、冒險工裝外套與斜背包
   */
  drawBody(ctx, legPhase) {
    ctx.save();

    // 內搭上衣
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-10, -8, 20, 16);

    // 活力暖橙色戶外背心外套
    ctx.fillStyle = "#ea580c";
    ctx.beginPath();
    ctx.roundRect(-12, -9, 24, 18, 5);
    ctx.fill();

    // 外套拉鍊門襟與口袋細節
    ctx.fillStyle = "#c2410c";
    ctx.fillRect(-1.5, -9, 3, 18);
    ctx.fillStyle = "#9a3412";
    ctx.fillRect(-9, -2, 5, 6);
    ctx.fillRect(4, -2, 5, 6);

    // 側背復古皮質旅行包（由左肩斜背到右腰）
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-10, -7);
    ctx.lineTo(8, 7);
    ctx.stroke();

    // 側背包本體與金屬扣
    ctx.fillStyle = "#78350f";
    ctx.beginPath();
    ctx.roundRect(5, 1, 9, 8, 2.5);
    ctx.fill();
    ctx.fillStyle = "#facc15"; // 金扣
    ctx.fillRect(8.5, 3.5, 2.5, 2.5);

    // 手臂雙手（前後微幅擺動）
    const armSwing = legPhase * 3.5;
    ctx.fillStyle = "#ea580c";
    // 左手
    ctx.beginPath();
    ctx.arc(-13, -2 - armSwing, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // 右手
    ctx.beginPath();
    ctx.arc(13, -2 + armSwing, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * 繪製動森圓潤頭部、五官大眼與編織遮陽草帽
   */
  drawHeadAndHat(ctx) {
    ctx.save();

    // 1. 圓潤 Q 版大頭（動森微縮模型頭身比）
    ctx.fillStyle = "#ffedd5"; // 溫暖健康膚色
    ctx.beginPath();
    ctx.arc(0, -17, 13, 0, Math.PI * 2);
    ctx.fill();

    // 2. 臉部五官（依朝向變更）
    if (this.facing !== "up") {
      // 可愛粉嫩腮紅（左頰與右頰）
      ctx.fillStyle = "rgba(251, 113, 133, 0.48)";
      if (this.facing === "down") {
        ctx.beginPath();
        ctx.arc(-8, -14, 3.5, 0, Math.PI * 2);
        ctx.arc(8, -14, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // 靈動大眼睛（具高光白點與圓潤瞳孔）
        this.drawAnimeEye(ctx, -5, -18);
        this.drawAnimeEye(ctx, 5, -18);

        // 微笑小嘴巴
        ctx.strokeStyle = "#9f1239";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, -13, 2.5, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
      } else if (this.facing === "left") {
        ctx.beginPath();
        ctx.arc(-7, -14, 3.5, 0, Math.PI * 2);
        ctx.fill();
        this.drawAnimeEye(ctx, -6, -18);
      } else if (this.facing === "right") {
        ctx.beginPath();
        ctx.arc(7, -14, 3.5, 0, Math.PI * 2);
        ctx.fill();
        this.drawAnimeEye(ctx, 6, -18);
      }
    }

    // 3. 栗子色可愛瀏海髮絲
    ctx.fillStyle = "#5c2e0b";
    if (this.facing === "up") {
      // 背面顯示整齊後腦勺頭髮
      ctx.beginPath();
      ctx.arc(0, -17, 13, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();
    } else {
      // 正面自然三段式瀏海
      ctx.beginPath();
      ctx.arc(-5, -23, 6, 0, Math.PI);
      ctx.arc(2, -24, 7, 0, Math.PI);
      ctx.arc(8, -23, 5, 0, Math.PI);
      ctx.fill();
    }

    // 4. 動森經典編織遮陽草帽
    // 帽子大圓帽簷（具備立體厚度與弧度）
    ctx.fillStyle = "#fef08a"; // 亮麥草黃
    ctx.beginPath();
    ctx.ellipse(0, -26, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ca8a04";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 帽身圓柱頂
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.roundRect(-10, -35, 20, 11, [6, 6, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = "#ca8a04";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 帽子墨綠色飾帶（緞帶結）
    ctx.fillStyle = "#047857";
    ctx.fillRect(-10, -28, 20, 3.5);

    ctx.restore();
  }

  /**
   * 繪製高質感動森大眼（雙層高光）
   */
  drawAnimeEye(ctx, x, y) {
    // 瞳孔主體（深栗墨黑）
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.ellipse(x, y, 2.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 主高光（右上圓點白光）
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x + 0.8, y - 1.2, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 次高光（左下微光點）
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(x - 0.7, y + 1.2, 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
}
