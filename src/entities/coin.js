/**
 * 陽明里必經景點金幣收集系統
 * 管理 16 處必經景點與文創地標的動態旋轉金幣、碰撞收集、吸收動效與浮動文字
 */
import { LANDMARKS } from "../world/landmarks.js";

export class CoinManager {
  constructor(onCoinCollected = null) {
    this.onCoinCollected = onCoinCollected;
    this.totalCoins = LANDMARKS.length;

    // 從 LocalStorage 恢復已收集金幣
    this.savedCoins = new Set();
    try {
      const saved = localStorage.getItem("ym_collected_coins");
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) {
          arr.forEach(id => this.savedCoins.add(id));
        }
      }
    } catch (e) {
      console.warn("LocalStorage unavailable", e);
    }

    // 為 30 處地標各生成一枚金幣，精準置於建築正門前方
    this.coins = LANDMARKS.map((lm, idx) => {
      const spawnX = lm.x;
      const spawnY = lm.y + 26;
      const isAlreadyCollected = this.savedCoins.has(lm.id);
      return {
        id: lm.id,
        landmarkName: lm.name,
        x: spawnX,
        y: spawnY,
        collected: isAlreadyCollected,
        animTime: idx * 0.45,
        collecting: false,
        collectProgress: isAlreadyCollected ? 1.0 : 0,
        collectX: spawnX,
        collectY: spawnY,
        revealAlpha: 0.0,
        isNear: false,
        discovered: false
      };
    });

    this.collectedCount = this.coins.filter(c => c.collected).length;

    // 浮動分數動態粒子
    this.floatTexts = [];

    // 音訊控制器（Web Audio API 免外部資源）
    this.audioCtx = null;
  }

  /** 初始化 Web Audio API */
  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  /** 播放清脆動森風格金幣音效（B5 -> E6 雙音琶音） */
  playCoinSound() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(987.77, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1318.51, now + 0.08);
      gain2.gain.setValueAtTime(0.22, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.38);
    } catch (e) {
      // 容錯靜音
    }
  }

  /** 更新金幣狀態與碰撞（靠近區域才動態顯現，初始完全隱藏） */
  update(dt, playerX, playerY) {
    const REVEAL_DIST = 80;    // 靠近區域觸發顯現門檻（80 像素內浮現）
    const HIDE_DIST = 115;     // 遠離區域隱藏門檻
    const collectDistance = 34;

    for (const coin of this.coins) {
      coin.animTime += dt;

      if (!coin.collected && !coin.collecting) {
        const dist = Math.hypot(coin.x - playerX, coin.y - playerY);

        // 判定玩家是否靠近該景點區域
        if (dist <= REVEAL_DIST) {
          coin.isNear = true;
          coin.discovered = true;
        } else if (dist > HIDE_DIST) {
          coin.isNear = false;
        }

        // 動態過渡顯現透明度（平滑淡入淡出，達到「靠近區域才會出現」）
        if (coin.isNear) {
          coin.revealAlpha = Math.min(1.0, coin.revealAlpha + dt * 4.0);
        } else {
          coin.revealAlpha = Math.max(0.0, coin.revealAlpha - dt * 3.0);
        }

        // 僅在金幣已顯現且距離進入碰撞範圍時才可收集
        if (coin.revealAlpha > 0.25 && dist <= collectDistance) {
          this.collectCoin(coin);
        }
      }

      if (coin.collecting) {
        coin.collectProgress += dt * 2.2;
        coin.collectY -= dt * 45;
        if (coin.collectProgress >= 1.0) {
          coin.collecting = false;
          coin.collected = true;
        }
      }
    }

    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.life -= dt;
      ft.y -= dt * 32;
      ft.alpha = Math.max(0, ft.life / ft.maxLife);
      if (ft.life <= 0) {
        this.floatTexts.splice(i, 1);
      }
    }
  }

  /** 收集金幣 */
  collectCoin(coin) {
    coin.collecting = true;
    coin.collectProgress = 0;
    coin.collectX = coin.x;
    coin.collectY = coin.y;
    this.collectedCount++;

    this.savedCoins.add(coin.id);
    try {
      localStorage.setItem("ym_collected_coins", JSON.stringify(Array.from(this.savedCoins)));
    } catch (e) {
      console.warn("Failed to save collected coins", e);
    }

    this.playCoinSound();

    this.floatTexts.push({
      x: coin.x,
      y: coin.y - 18,
      text: "+1 金幣",
      life: 0.9,
      maxLife: 0.9,
      alpha: 1.0
    });

    if (this.onCoinCollected) {
      this.onCoinCollected(coin, this.collectedCount, this.totalCoins);
    }
  }

  /** 繪製金幣與粒子 */
  render(ctx) {
    ctx.save();

    for (const coin of this.coins) {
      if (coin.collected && !coin.collecting) continue;

      if (coin.collecting) {
        const alpha = Math.max(0, 1 - coin.collectProgress);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(coin.collectX, coin.collectY);
        
        const ringRadius = 14 + coin.collectProgress * 22;
        ctx.strokeStyle = "#ffd166";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        const scale = 1 + coin.collectProgress * 0.4;
        ctx.scale(scale, scale);
        this.drawCoinGraphic(ctx, 0, 0);
        ctx.restore();
      } else {
        // 未靠近時完全不渲染，避免一開始就被看見
        if (coin.revealAlpha <= 0.005) continue;

        const bobOffset = Math.sin(coin.animTime * 3.5) * 4;
        const spinRatio = Math.cos(coin.animTime * 4.2);
        const scaleX = Math.abs(spinRatio) * 0.75 + 0.25;

        // 隨著接近平滑展開縮放
        const revealScale = 0.35 + 0.65 * coin.revealAlpha;

        ctx.save();
        ctx.globalAlpha = coin.revealAlpha;
        ctx.translate(coin.x, coin.y + bobOffset);

        ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
        ctx.beginPath();
        const shadowScale = (1 - bobOffset * 0.04) * revealScale;
        ctx.ellipse(0, 14 - bobOffset, 12 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.scale(scaleX * revealScale, revealScale);
        this.drawCoinGraphic(ctx, 0, 0);

        // 初步浮現時之微弱金光環
        if (coin.revealAlpha < 0.9) {
          ctx.strokeStyle = `rgba(255, 235, 120, ${(1 - coin.revealAlpha) * 0.75})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 14 + (1 - coin.revealAlpha) * 10, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    for (const ft of this.floatTexts) {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
      ctx.lineWidth = 3;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = "#ffea79";
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
  }

  /** 繪製立體金幣圖形 */
  drawCoinGraphic(ctx, x, y) {
    const radius = 12;

    ctx.fillStyle = "rgba(255, 215, 0, 0.3)";
    ctx.beginPath();
    ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.arc(x, y + 1.2, radius, 0, Math.PI * 2);
    ctx.fill();

    const grad = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
    grad.addColorStop(0, "#fffbeb");
    grad.addColorStop(0.3, "#fde047");
    grad.addColorStop(0.7, "#eab308");
    grad.addColorStop(1, "#ca8a04");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#a16207";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.strokeStyle = "#fef08a";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, radius - 3.2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#a16207";
    ctx.fillRect(x - 1.5, y - 5, 3, 10);
    ctx.fillRect(x - 5, y - 1.5, 10, 3);
  }

  reset() {
    this.collectedCount = 0;
    for (const coin of this.coins) {
      coin.collected = false;
      coin.collecting = false;
      coin.collectProgress = 0;
      coin.revealAlpha = 0;
      coin.isNear = false;
      coin.discovered = false;
    }
    this.floatTexts = [];
  }
}
