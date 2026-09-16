(() => {
"use strict";

// --- START: src/world/cute_houses.js ---
/**
 * 陽明里全域 30 處官方地標「精緻 Q 版 2D 手繪建物」向量渲染庫
 * 童趣動森玩具風格，支援主地圖動態微動畫與文化彈窗高解析特寫
 */

function drawRoundRect(ctx, x, y, w, h, r, fill, stroke, strokeWidth = 1.5) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

function drawCuteChimneyWithSmoke(ctx, cx, cy, time) {
  // 紅磚煙囪
  ctx.fillStyle = "#b94a34";
  ctx.fillRect(cx - 4, cy - 14, 8, 14);
  ctx.strokeStyle = "#5a1a0f";
  ctx.lineWidth = 1;
  ctx.strokeRect(cx - 4, cy - 14, 8, 14);
  ctx.fillStyle = "#5a1a0f";
  ctx.fillRect(cx - 6, cy - 16, 12, 3);

  // 裊裊白煙
  for (let i = 0; i < 3; i++) {
    const progress = ((time * 0.7 + i * 0.33) % 1);
    const smokeY = cy - 18 - progress * 22;
    const smokeX = cx + Math.sin(time * 2 + i) * 3 + progress * 3;
    const smokeR = 2.5 + progress * 3.5;
    const alpha = (1 - progress) * 0.6;

    ctx.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
    ctx.beginPath();
    ctx.arc(smokeX, smokeY, smokeR, 0, Math.PI * 2);
    ctx.fill();
  }
}

class CuteHouseRenderer {
  /**
   * 繪製指定編號之可愛 2D 小房子
   * @param {CanvasRenderingContext2D} ctx 
   * @param {string} code "01" 至 "30"
   * @param {number} x 中心點 X
   * @param {number} y 底部中心點 Y
   * @param {number} time 動態時間
   * @param {boolean} isPreview 是否為彈窗大圖預覽
   */
  static draw(ctx, code, x, y, time = 0, isPreview = false) {
    ctx.save();
    ctx.translate(x, y);

    const scale = isPreview ? 1.6 : 1.0;
    ctx.scale(scale, scale);

    // 腳底柔和立體陰影
    ctx.fillStyle = "rgba(15, 23, 42, 0.22)";
    ctx.beginPath();
    ctx.ellipse(0, 4, 38, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    switch (code) {
      case "01": // 山仔后派出所
        drawRoundRect(ctx, -28, -32, 56, 32, 3, "#1e3a8a", "#0f172a", 2);
        drawRoundRect(ctx, -32, -38, 64, 8, 3, "#3b82f6", "#1e3a8a", 1.5);
        // 紅色警燈（微亮呼吸動效）
        const lightPulse = Math.sin(time * 6) * 0.3 + 0.7;
        ctx.fillStyle = "rgba(239, 68, 68, " + lightPulse + ")";
        ctx.beginPath();
        ctx.arc(0, -42, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // 警徽大門
        ctx.fillStyle = "#facc15";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("警", 0, -14);
        drawRoundRect(ctx, -8, -8, 16, 10, 1, "#64748b", "#0f172a", 1);
        break;

      case "02": // 陽明山麥當勞
        drawRoundRect(ctx, -28, -30, 56, 30, 3, "#b91c1c", "#7f1d1d", 2);
        // 紅磚瓦斜頂
        ctx.fillStyle = "#991b1b";
        ctx.beginPath();
        ctx.moveTo(-34, -28);
        ctx.lineTo(0, -46);
        ctx.lineTo(34, -28);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#450a0a";
        ctx.lineWidth = 2;
        ctx.stroke();
        // 金色 M 招牌
        ctx.fillStyle = "#facc15";
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("M", 0, -22);
        // 大門
        drawRoundRect(ctx, -8, -12, 16, 14, 2, "#fef08a", "#854d0e", 1);
        break;

      case "03": // 7-ELEVEN 草山門市
        drawRoundRect(ctx, -26, -28, 52, 28, 2, "#ffffff", "#cbd5e1", 2);
        // 經典三色條紋
        ctx.fillStyle = "#ea580c"; ctx.fillRect(-26, -34, 52, 3);
        ctx.fillStyle = "#16a34a"; ctx.fillRect(-26, -31, 52, 3);
        ctx.fillStyle = "#dc2626"; ctx.fillRect(-26, -28, 52, 2);
        // 7 標誌
        ctx.fillStyle = "#ea580c";
        ctx.font = "900 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("7", 0, -12);
        drawRoundRect(ctx, -6, -8, 12, 10, 1, "#38bdf8", "#0284c7", 1);
        break;

      case "04": // 山仔后公園（休閒八角涼亭與綠樹）
        ctx.fillStyle = "#15803d";
        ctx.beginPath();
        ctx.arc(-14, -24, 14, 0, Math.PI * 2);
        ctx.arc(14, -22, 12, 0, Math.PI * 2);
        ctx.fill();
        // 涼亭頂
        ctx.fillStyle = "#b45309";
        ctx.beginPath();
        ctx.moveTo(-18, -16);
        ctx.lineTo(0, -32);
        ctx.lineTo(18, -16);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // 亭柱與石桌
        ctx.fillStyle = "#78350f";
        ctx.fillRect(-12, -16, 3, 16);
        ctx.fillRect(9, -16, 3, 16);
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(-6, -8, 12, 8);
        break;

      case "05": // 陽明里辦公處（區民活動中心）
        drawRoundRect(ctx, -32, -32, 64, 32, 3, "#f97316", "#c2410c", 2);
        drawRoundRect(ctx, -36, -38, 72, 8, 2, "#ea580c", "#9a3412", 1.5);
        // 大門與布告欄
        drawRoundRect(ctx, -10, -14, 20, 16, 2, "#ffedd5", "#ea580c", 1.2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("陽明里", 0, -22);
        break;

      case "06": // 台灣中油陽明山加油站
        // 藍白紅雨遮天棚
        drawRoundRect(ctx, -32, -36, 64, 10, 2, "#0284c7", "#0369a1", 2);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-32, -28, 64, 3);
        // 立柱
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(-22, -25, 5, 25);
        ctx.fillRect(17, -25, 5, 25);
        // 加油機
        drawRoundRect(ctx, -8, -16, 16, 16, 2, "#ef4444", "#b91c1c", 1.5);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("油", 0, -6);
        break;

      case "07": // 豆留森林 CAMA（昭和日式竹林老舍）
        ctx.fillStyle = "#15803d";
        ctx.fillRect(-28, -42, 3, 40);
        ctx.fillRect(-34, -38, 3, 36);
        drawRoundRect(ctx, -24, -28, 48, 28, 2, "#451a03", "#271001", 2);
        ctx.fillStyle = "#334155";
        ctx.beginPath();
        ctx.moveTo(-30, -26);
        ctx.lineTo(0, -42);
        ctx.lineTo(30, -26);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("CAMA", 0, -12);
        break;

      case "08": // 白房子 Yang Ming Cafe
        drawCuteChimneyWithSmoke(ctx, 16, -34, time);
        drawRoundRect(ctx, -26, -30, 52, 30, 2, "#ffffff", "#cbd5e1", 2);
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.moveTo(-32, -28);
        ctx.lineTo(0, -44);
        ctx.lineTo(32, -28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(-18, -20, 10, 10);
        ctx.fillRect(8, -20, 10, 10);
        drawRoundRect(ctx, -5, -12, 10, 14, 1, "#475569", null);
        break;

      case "09": // 彩虹谷故事館（文史木屋）
        drawRoundRect(ctx, -24, -28, 48, 28, 2, "#78350f", "#451a03", 2);
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(-28, -26);
        ctx.lineTo(0, -40);
        ctx.lineTo(28, -26);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#ef4444"; ctx.fillRect(-12, -22, 6, 3);
        ctx.fillStyle = "#3b82f6"; ctx.fillRect(-6, -22, 6, 3);
        ctx.fillStyle = "#22c55e"; ctx.fillRect(0, -22, 6, 3);
        ctx.fillStyle = "#eab308"; ctx.fillRect(6, -22, 6, 3);
        drawRoundRect(ctx, -6, -12, 12, 14, 1, "#fde68a", "#b45309", 1);
        break;

      case "10": // 美軍宿舍群 C 區（經典雙拼壁爐木屋）
        drawCuteChimneyWithSmoke(ctx, -14, -36, time);
        drawRoundRect(ctx, -32, -30, 64, 30, 2, "#fffbeb", "#d97706", 2);
        ctx.fillStyle = "#b45309";
        ctx.beginPath();
        ctx.moveTo(-38, -28);
        ctx.lineTo(0, -44);
        ctx.lineTo(38, -28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        drawRoundRect(ctx, -18, -12, 10, 14, 1, "#78350f", null);
        drawRoundRect(ctx, 8, -12, 10, 14, 1, "#78350f", null);
        break;

      case "11": // 雀客藏居陽明山溫泉飯店
        drawRoundRect(ctx, -34, -34, 68, 34, 3, "#334155", "#1e293b", 2);
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.moveTo(-40, -32);
        ctx.lineTo(0, -50);
        ctx.lineTo(40, -32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        for (let w = 0; w < 2; w++) {
          const wp = (time * 0.6 + w * 0.5) % 1;
          ctx.fillStyle = "rgba(255, 255, 255, " + (1 - wp) * 0.7 + ")";
          ctx.beginPath();
          ctx.arc(20 + Math.sin(time * 3 + w) * 2, -36 - wp * 14, 3 + wp * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("HOTEL", 0, -18);
        break;

      case "12": // 陽明山錫安堂（石造禮拜堂與尖頂十字架）
        drawRoundRect(ctx, -24, -34, 48, 34, 2, "#e2e8f0", "#94a3b8", 2);
        ctx.fillStyle = "#475569";
        ctx.beginPath();
        ctx.moveTo(-28, -32);
        ctx.lineTo(0, -54);
        ctx.lineTo(28, -32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(-2, -66, 4, 14);
        ctx.fillRect(-6, -62, 12, 3);
        drawRoundRect(ctx, -6, -24, 12, 16, 6, "#38bdf8", "#0284c7", 1);
        break;

      case "13": // 草山御賓館（國定古蹟日式和洋館）
        drawRoundRect(ctx, -32, -30, 64, 30, 2, "#451a03", "#291001", 2);
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.moveTo(-38, -28);
        ctx.lineTo(-14, -46);
        ctx.lineTo(14, -46);
        ctx.lineTo(38, -28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fef3c7";
        ctx.fillRect(-22, -20, 12, 10);
        ctx.fillRect(10, -20, 12, 10);
        break;

      case "14": // 中國文化大學（大恩館傳統宮殿重簷歇山頂）
        drawRoundRect(ctx, -36, -34, 72, 34, 3, "#7f1d1d", "#450a0a", 2);
        ctx.fillStyle = "#ea580c";
        ctx.beginPath();
        ctx.moveTo(-42, -26);
        ctx.lineTo(0, -38);
        ctx.lineTo(42, -26);
        ctx.stroke();
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(-38, -34);
        ctx.lineTo(0, -52);
        ctx.lineTo(38, -34);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#991b1b";
        ctx.fillRect(-24, -20, 5, 20);
        ctx.fillRect(-8, -20, 5, 20);
        ctx.fillRect(8, -20, 5, 20);
        ctx.fillRect(24, -20, 5, 20);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px serif";
        ctx.textAlign = "center";
        ctx.fillText("文化大學", 0, -12);
        break;

      case "15": // 亞尼克夢想村（美式派塔甜點老屋）
        drawRoundRect(ctx, -26, -28, 52, 28, 2, "#fff7ed", "#fdba74", 2);
        ctx.fillStyle = "#ea580c";
        ctx.beginPath();
        ctx.moveTo(-30, -26);
        ctx.lineTo(0, -42);
        ctx.lineTo(30, -26);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.arc(0, -14, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("派", 0, -11);
        break;

      case "16": // The Cafe By 想 陽明山
        drawCuteChimneyWithSmoke(ctx, 14, -32, time);
        drawRoundRect(ctx, -28, -28, 56, 28, 2, "#fef08a", "#ca8a04", 2);
        ctx.fillStyle = "#475569";
        ctx.beginPath();
        ctx.moveTo(-32, -26);
        ctx.lineTo(0, -42);
        ctx.lineTo(32, -26);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#0284c7";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("想·陽明", 0, -12);
        break;

      case "17": // 陽明山星巴克草山門市（純白木造眷舍、綠色美人魚標牌）
        drawCuteChimneyWithSmoke(ctx, -14, -32, time);
        drawRoundRect(ctx, -28, -28, 56, 28, 2, "#ffffff", "#cbd5e1", 2);
        ctx.fillStyle = "#334155";
        ctx.beginPath();
        ctx.moveTo(-32, -26);
        ctx.lineTo(0, -42);
        ctx.lineTo(32, -26);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#00704a";
        ctx.beginPath();
        ctx.arc(0, -14, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("S", 0, -11);
        break;

      case "18": // 美軍俱樂部 BRICK YARD 33 1/3（露天泳池與紅磚俱樂部）
        drawRoundRect(ctx, 22, -14, 18, 16, 3, "#38bdf8", "#0284c7", 1.5);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(25, -10, 10, 2);
        drawCuteChimneyWithSmoke(ctx, -14, -36, time);
        drawRoundRect(ctx, -28, -32, 48, 32, 2, "#b91c1c", "#7f1d1d", 2);
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.moveTo(-32, -30);
        ctx.lineTo(-4, -48);
        ctx.lineTo(24, -30);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(-4, -14, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(-4, -14, 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "19": // 陽明山美國渡假村（獨棟鄉村別墅木屋）
        drawCuteChimneyWithSmoke(ctx, 16, -34, time);
        drawRoundRect(ctx, -28, -30, 56, 30, 2, "#fde68a", "#d97706", 2);
        ctx.fillStyle = "#b45309";
        ctx.beginPath();
        ctx.moveTo(-34, -28);
        ctx.lineTo(0, -46);
        ctx.lineTo(34, -28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        drawRoundRect(ctx, -8, -12, 16, 14, 2, "#fffbeb", "#92400e", 1);
        break;

      case "20": // 臺北市立陽明教養院
        drawRoundRect(ctx, -32, -30, 64, 30, 3, "#fef08a", "#eab308", 2);
        drawRoundRect(ctx, -36, -36, 72, 8, 2, "#f59e0b", "#b45309", 1.5);
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(0, -18, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("陽明教養", 0, -8);
        break;

      case "21": // 屋頂上餐廳 The Top（峇里島梯田洋傘觀景台）
        drawRoundRect(ctx, -32, -18, 64, 18, 2, "#78350f", "#451a03", 1.5);
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.arc(-12, -26, 10, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = "#64748b";
        ctx.stroke();
        ctx.fillRect(-13, -26, 2, 14);
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.arc(14, -24, 9, Math.PI, 0);
        ctx.fill();
        ctx.stroke();
        ctx.fillRect(13, -24, 2, 14);
        const sunsetGlow = Math.sin(time * 3) * 0.2 + 0.8;
        ctx.fillStyle = "rgba(249, 115, 22, " + sunsetGlow + ")";
        ctx.beginPath();
        ctx.arc(0, -32, 6, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "22": // 華岡藝校（藝術展演紅磚大樓）
        drawRoundRect(ctx, -32, -34, 64, 34, 3, "#831843", "#500724", 2);
        drawRoundRect(ctx, -36, -40, 72, 8, 2, "#be185d", "#831843", 1.5);
        ctx.fillStyle = "#fbcfe8";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("藝", 0, -16);
        drawRoundRect(ctx, -10, -10, 20, 12, 1, "#fdf2f8", "#9d174d", 1);
        break;

      case "23": // 台北歐洲學校陽明校區
        drawRoundRect(ctx, -32, -32, 64, 32, 2, "#f8fafc", "#94a3b8", 2);
        ctx.fillStyle = "#1d4ed8";
        ctx.beginPath();
        ctx.moveTo(-36, -30);
        ctx.lineTo(0, -46);
        ctx.lineTo(36, -30);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#93c5fd";
        ctx.fillRect(-20, -20, 10, 12);
        ctx.fillRect(10, -20, 10, 12);
        ctx.fillStyle = "#1e3a8a";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TES", 0, -10);
        break;

      case "24": // 草山猛禽中心（自然原木展館、老鷹徽章）
        drawRoundRect(ctx, -28, -30, 56, 30, 2, "#713f12", "#422006", 2);
        ctx.fillStyle = "#15803d";
        ctx.beginPath();
        ctx.moveTo(-32, -28);
        ctx.lineTo(0, -44);
        ctx.lineTo(32, -28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#facc15";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("鷹", 0, -14);
        break;

      case "25": // YMS onefifteen 初衣食午（歷史洋房美學選品店）
        drawCuteChimneyWithSmoke(ctx, 16, -34, time);
        drawRoundRect(ctx, -28, -30, 56, 30, 2, "#fff1f2", "#fecdd3", 2);
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.moveTo(-32, -28);
        ctx.lineTo(0, -44);
        ctx.lineTo(32, -28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#e0f2fe";
        ctx.fillRect(-18, -20, 36, 12);
        ctx.strokeStyle = "#0284c7";
        ctx.strokeRect(-18, -20, 36, 12);
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("115", 0, -11);
        break;

      case "26": // 花卉試驗中心（茶花溫室與綠意花拱門）
        ctx.fillStyle = "#e0f2fe";
        ctx.beginPath();
        ctx.arc(0, -22, 22, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = "#0284c7";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-16, -22); ctx.lineTo(-16, -38);
        ctx.moveTo(0, -22); ctx.lineTo(0, -44);
        ctx.moveTo(16, -22); ctx.lineTo(16, -38);
        ctx.stroke();
        ctx.fillStyle = "#be123c";
        ctx.beginPath();
        ctx.arc(-22, -10, 7, 0, Math.PI * 2);
        ctx.arc(22, -10, 7, 0, Math.PI * 2);
        ctx.fill();
        drawRoundRect(ctx, -10, -16, 20, 18, 2, "#15803d", "#14532d", 1.5);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("花卉", 0, -5);
        break;

      case "27": // 陽明福德宮（百年土地公廟、金黃燕尾脊）
        drawRoundRect(ctx, -26, -26, 52, 26, 2, "#b91c1c", "#7f1d1d", 2);
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(-36, -34);
        ctx.quadraticCurveTo(-14, -28, 0, -44);
        ctx.quadraticCurveTo(14, -28, 36, -34);
        ctx.lineTo(28, -24);
        ctx.lineTo(-28, -24);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#facc15";
        ctx.fillRect(-6, -6, 12, 6);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px serif";
        ctx.textAlign = "center";
        ctx.fillText("廟", 0, -12);
        break;

      case "28": // 臺北市立格致國民中學（格致大樓與操場鐘樓）
        drawRoundRect(ctx, -32, -32, 64, 32, 2, "#e0e7ff", "#6366f1", 2);
        ctx.fillStyle = "#4f46e5";
        ctx.fillRect(-6, -46, 12, 16);
        ctx.beginPath();
        ctx.moveTo(-10, -46);
        ctx.lineTo(0, -60);
        ctx.lineTo(10, -46);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#312e81";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("格致國中", 0, -14);
        drawRoundRect(ctx, -10, -8, 20, 10, 1, "#6366f1", null);
        break;

      case "29": // 納美花園 Navi Garden（歐式莊園與休閒木屋）
        drawCuteChimneyWithSmoke(ctx, 16, -32, time);
        drawRoundRect(ctx, -30, -28, 60, 28, 3, "#ecfdf5", "#a7f3d0", 2);
        ctx.fillStyle = "#047857";
        ctx.beginPath();
        ctx.moveTo(-36, -26);
        ctx.lineTo(0, -44);
        ctx.lineTo(36, -26);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(-16, -6, 5, 0, Math.PI * 2);
        ctx.arc(16, -6, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#065f46";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("納美花園", 0, -11);
        break;

      case "30": // 下竹林福德宮（南端古樸石造福德祠）
        drawRoundRect(ctx, -22, -24, 44, 24, 2, "#991b1b", "#7f1d1d", 2);
        ctx.fillStyle = "#d97706";
        ctx.beginPath();
        ctx.moveTo(-28, -28);
        ctx.lineTo(0, -40);
        ctx.lineTo(28, -28);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#92400e";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(-12, -26, 4, 0, Math.PI * 2);
        ctx.arc(12, -26, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fef08a";
        ctx.font = "bold 10px serif";
        ctx.textAlign = "center";
        ctx.fillText("福", 0, -10);
        break;

      default:
        drawRoundRect(ctx, -24, -26, 48, 26, 2, "#22c55e", "#15803d", 2);
        break;
    }

    ctx.restore();
  }
}

// --- END: src/world/cute_houses.js ---

// --- START: src/world/landmarks.js ---
/**
 * 台北市士林區陽明里 官方全域 30 處核心地標空間資料庫
 * 精準錨定於 1024 x 1024 純手繪水彩繪本全景地圖各建築物正門
 * 功能導向模式：單純描述「這個地方是幹嘛的」、功能與遊憩體驗，無生硬特色標籤
 */
const LANDMARKS = [
  {
    "id": "site_01",
    "code": "01",
    "name": "山仔后派出所",
    "category": "公共安全",
    "plusCode": "4GPW+WG",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 310,
    "y": 405,
    "radius": 40,
    "title": "01 山仔后派出所",
    "description": "山仔后交通與生活樞紐的治安守護站，提供登山旅客急難救助、問路指引與居民在地警政服務的安全據點。",
    "geoLat": 25.13725,
    "geoLon": 121.54625
  },
  {
    "id": "site_02",
    "code": "02",
    "name": "陽明山麥當勞",
    "category": "生活餐飲",
    "plusCode": "4GPW+RC",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 300,
    "y": 445,
    "radius": 40,
    "title": "02 陽明山麥當勞",
    "description": "陪伴文化大學師生與遊客近 37 年的經典地標，是無數人上山約見面集合、吃早餐吹冷氣與等公車的共同青春回憶。",
    "geoLat": 25.137,
    "geoLon": 121.546
  },
  {
    "id": "site_03",
    "code": "03",
    "name": "7-ELEVEN 陽明山門市",
    "category": "生活機能",
    "plusCode": "4GPW+QH",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 410,
    "y": 425,
    "radius": 40,
    "title": "03 7-ELEVEN 陽明山門市",
    "description": "山仔后最熱鬧的 24 小時生活補給站，無論是上山賞花、爬山健行或文大學生深夜消夜，都能隨時採買熱食、零食與日常用品。",
    "geoLat": 25.13687,
    "geoLon": 121.54638
  },
  {
    "id": "site_04",
    "code": "04",
    "name": "山仔后公園",
    "category": "公共綠地",
    "plusCode": "4GPW+V7",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 230,
    "y": 315,
    "radius": 40,
    "title": "04 山仔后公園",
    "description": "隱身在熱鬧街道旁的社區小綠洲，設有林蔭涼亭與長椅，供附近居民晨昏散步、鄰里聊天歇腳與親子戶外活動。",
    "geoLat": 25.13712,
    "geoLon": 121.54563
  },
  {
    "id": "site_05",
    "code": "05",
    "name": "陽明里辦公處 (區民活動中心)",
    "category": "社區服務",
    "plusCode": "4GPW+5W",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 315,
    "y": 295,
    "radius": 40,
    "title": "05 陽明里辦公處 (區民活動中心)",
    "description": "陽明里的在地生活與行政核心，舉辦長青講座、里民聚會與各項公共活動，也是走訪完全里 30 處地標領取榮譽里民證的地方。",
    "geoLat": 25.13537,
    "geoLon": 121.54725
  },
  {
    "id": "site_06",
    "code": "06",
    "name": "台灣中油陽明山加油站",
    "category": "交通補給",
    "plusCode": "4GPW+68",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 328,
    "y": 500,
    "radius": 40,
    "title": "06 台灣中油陽明山加油站",
    "description": "陽明山上極少數的加油補給站，開車或騎車上山賞花、追雪、前往擎天崗或竹子湖前，必定停靠把油箱加滿的地方。",
    "geoLat": 25.1355,
    "geoLon": 121.54575
  },
  {
    "id": "site_07",
    "code": "07",
    "name": "豆留森林 (CAMA)",
    "category": "文化餐飲",
    "plusCode": "4GQW+7M",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 376,
    "y": 168,
    "radius": 40,
    "title": "07 豆留森林 (CAMA)",
    "description": "結合昭和日式老官舍與六百坪幽靜竹林的景觀咖啡旗艦店，讓人置身和風庭院中享用精品手沖咖啡、烘豆體驗與早午餐。",
    "geoLat": 25.13812,
    "geoLon": 121.54663
  },
  {
    "id": "site_08",
    "code": "08",
    "name": "白房子 Yang Ming Cafe",
    "category": "歷史餐飲",
    "plusCode": "4GQW+2C",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 265,
    "y": 188,
    "radius": 40,
    "title": "08 白房子 Yang Ming Cafe",
    "description": "美軍眷舍老洋房改建的純白歐風咖啡館，提供精緻排餐、現烤手工麵包與手沖咖啡，適合朋友聚會、約會與享受悠閒午後。",
    "geoLat": 25.1375,
    "geoLon": 121.546
  },
  {
    "id": "site_09",
    "code": "09",
    "name": "彩虹谷故事館 (F206)",
    "category": "文史故事",
    "plusCode": "4GQW+45",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 135,
    "y": 265,
    "radius": 40,
    "title": "09 彩虹谷故事館 (F206)",
    "description": "原汁原味保留 1950 年代美軍眷舍原貌的文史老屋，推廣冷戰美軍生活記憶、老屋修復故事，並能在此欣賞陽明山世界級的壯觀彩虹景觀。",
    "geoLat": 25.13775,
    "geoLon": 121.54538
  },
  {
    "id": "site_10",
    "code": "10",
    "name": "美軍宿舍群 (C 區建業路段)",
    "category": "文創聚落",
    "plusCode": "4GPX+RH",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 205,
    "y": 135,
    "radius": 40,
    "title": "10 美軍宿舍群 (C 區建業路段)",
    "description": "全台保存最完整的美式冷戰官兵聚落，兩側有著大煙囪、寬廣草坪與美式平房，是散步拍照、感受美式鄉村街區氛圍的文創漫遊區。",
    "geoLat": 25.137,
    "geoLon": 121.54888
  },
  {
    "id": "site_11",
    "code": "11",
    "name": "雀客藏居陽明山溫泉飯店",
    "category": "溫泉名宿",
    "plusCode": "5G2W+27",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 500,
    "y": 145,
    "radius": 40,
    "title": "11 雀客藏居陽明山溫泉飯店",
    "description": "草山知名的山中溫泉渡假飯店，提供天然純淨的白磺溫泉泡湯、山景客房與中西式美饌，供旅客遠離塵囂放鬆身心。",
    "geoLat": 25.15,
    "geoLon": 121.54563
  },
  {
    "id": "site_12",
    "code": "12",
    "name": "陽明山錫安堂",
    "category": "宗教聖所",
    "plusCode": "4GXX+QV",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 620,
    "y": 195,
    "radius": 40,
    "title": "12 陽明山錫安堂",
    "description": "隱身在山林綠意中的寧靜純白教堂，為在地居民與大學生提供主日崇拜、心靈團契與安靜沉澱心靈的信仰避風港。",
    "geoLat": 25.14937,
    "geoLon": 121.54962
  },
  {
    "id": "site_13",
    "code": "13",
    "name": "草山御賓館 (國定古蹟)",
    "category": "國定古蹟",
    "plusCode": "5H22+99",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 375,
    "y": 75,
    "radius": 40,
    "title": "13 草山御賓館 (國定古蹟)",
    "description": "日治時期為接待裕仁皇太子所建的和洋風官邸，後為孫科院長寓所，是陽明山唯一的國定古蹟，讓人近距離見證草山近百年政局文史風雲。",
    "geoLat": 25.15087,
    "geoLon": 121.55088
  },
  {
    "id": "site_14",
    "code": "14",
    "name": "中國文化大學",
    "category": "大專學園",
    "plusCode": "4GPQ+JP",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 100,
    "y": 345,
    "radius": 40,
    "title": "14 中國文化大學",
    "description": "座落在海拔 400 公尺華岡之巔的高等學府，擁有全台最雄偉的中國宮殿式校舍群，也是情侶與遊客看夜景、俯瞰整個大台北盆地景緻的勝地。",
    "geoLat": 25.1365,
    "geoLon": 121.53925
  },
  {
    "id": "site_15",
    "code": "15",
    "name": "亞尼克夢想村",
    "category": "美式甜點",
    "plusCode": "4GPV+JF",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 105,
    "y": 420,
    "radius": 40,
    "title": "15 亞尼克夢想村",
    "description": "由美軍老眷舍改造的超人氣美式烘焙甜點坊，專賣各式招牌現烤派塔、生乳捲與野餐點心，能坐在戶外庭院大樹下享受美式鄉村午茶。",
    "geoLat": 25.1365,
    "geoLon": 121.54363
  },
  {
    "id": "site_16",
    "code": "16",
    "name": "The Cafe By 想 陽明山",
    "category": "文化餐飲",
    "plusCode": "4GPV+FV",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 105,
    "y": 560,
    "radius": 40,
    "title": "16 The Cafe By 想 陽明山",
    "description": "群山環抱中的亮黃色歐風木屋景觀餐廳，擁有落羽松庭園與水池造景，提供義大利麵、早午餐與鬆餅，是拍照打卡與放鬆聚餐的好去處。",
    "geoLat": 25.13612,
    "geoLon": 121.54462
  },
  {
    "id": "site_17",
    "code": "17",
    "name": "陽明山星巴克 (草山門市)",
    "category": "文創名店",
    "plusCode": "4GPV+F5",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 215,
    "y": 515,
    "radius": 40,
    "title": "17 陽明山星巴克 (草山門市)",
    "description": "改建自美軍眷舍的純白木屋咖啡館，完整保留復古紅磚大壁爐與戶外草地櫻花樹，讓人坐在老房子裡喝咖啡、感受美式度假風情。",
    "geoLat": 25.13612,
    "geoLon": 121.54288
  },
  {
    "id": "site_18",
    "code": "18",
    "name": "美軍俱樂部 (BRICK YARD)",
    "category": "歷史餐飲",
    "plusCode": "4GPV+69",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 350,
    "y": 600,
    "radius": 40,
    "title": "18 美軍俱樂部 (BRICK YARD)",
    "description": "原美軍聯誼俱樂部改建的千坪文創休閒聚落，結合美式炭烤餐廳、戶外露天泳池水景與數千張珍貴黑膠唱片展覽，重現冷戰黃金年代。",
    "geoLat": 25.1355,
    "geoLon": 121.54338
  },
  {
    "id": "site_19",
    "code": "19",
    "name": "陽明山美國渡假村",
    "category": "美式別墅",
    "plusCode": "4GPR+CM",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 175,
    "y": 620,
    "radius": 40,
    "title": "19 陽明山美國渡假村",
    "description": "保留高階軍官眷舍規格的獨棟包棟式渡假園區，擁有獨立大院子、綠意草坪、戶外鞦韆與烤肉設備，適合親友家庭體驗道地美式郊區生活。",
    "geoLat": 25.136,
    "geoLon": 121.54163
  },
  {
    "id": "site_20",
    "code": "20",
    "name": "臺北市立陽明教養院",
    "category": "社福公義",
    "plusCode": "4GPR+53",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 80,
    "y": 705,
    "radius": 40,
    "title": "20 臺北市立陽明教養院",
    "description": "深耕山林間的公立身心障礙全人照護家園，提供中重度心智障礙學員溫暖專業的生活照料、技能陶冶與社區關懷服務。",
    "geoLat": 25.13537,
    "geoLon": 121.54013
  },
  {
    "id": "site_21",
    "code": "21",
    "name": "屋頂上餐廳 (The Top)",
    "category": "夜景地標",
    "plusCode": "4GMQ+VM",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 125,
    "y": 825,
    "radius": 40,
    "title": "21 屋頂上餐廳 (The Top)",
    "description": "依山壁而建的梯田式南洋峇里島風觀景餐廳，設有發呆亭與無邊際水池，是全台北最具指標性的百萬夜景約會與跨年勝地。",
    "geoLat": 25.13462,
    "geoLon": 121.53913
  },
  {
    "id": "site_22",
    "code": "22",
    "name": "華岡藝校",
    "category": "藝術學園",
    "plusCode": "4GPX+RH",
    "district": "east",
    "districtName": "東區・建業學園與生態",
    "x": 555,
    "y": 285,
    "radius": 40,
    "title": "22 華岡藝校",
    "description": "台灣歷史悠久的表演藝術名校，培養無數知名歌手、演員與舞者，走在校門周邊常能聽見學子練琴、排戲與練習歌唱的藝術氛圍。",
    "geoLat": 25.137,
    "geoLon": 121.54888
  },
  {
    "id": "site_23",
    "code": "23",
    "name": "台北歐洲學校 (陽明校區)",
    "category": "國際教育",
    "plusCode": "4GPX+MJ",
    "district": "east",
    "districtName": "東區・建業學園與生態",
    "x": 590,
    "y": 360,
    "radius": 40,
    "title": "23 台北歐洲學校 (陽明校區)",
    "description": "匯聚英、法、德跨國教育的小學部校區，美麗的歐風紅瓦斜頂校舍融入草山大自然，為駐台外籍人士與各國學子打造國際化的學習環境。",
    "geoLat": 25.13662,
    "geoLon": 121.549
  },
  {
    "id": "site_24",
    "code": "24",
    "name": "草山猛禽中心",
    "category": "自然生態",
    "plusCode": "4GPX+PJ",
    "district": "east",
    "districtName": "東區・建業學園與生態",
    "x": 585,
    "y": 495,
    "radius": 40,
    "title": "24 草山猛禽中心",
    "description": "推廣台灣猛禽保育與救傷的自然教育中心，能認識大冠鷲、鳳頭蒼鷹等在陽明山盤旋的空中霸主，並提供生態講座與望遠鏡觀鳥體驗。",
    "geoLat": 25.13675,
    "geoLon": 121.549
  },
  {
    "id": "site_25",
    "code": "25",
    "name": "YMS onefifteen 初衣食午",
    "category": "時尚選品",
    "plusCode": "4GPX+77",
    "district": "east",
    "districtName": "東區・建業學園與生態",
    "x": 565,
    "y": 615,
    "radius": 40,
    "title": "25 YMS onefifteen 初衣食午",
    "description": "讓都市人上山放慢步調、結合美食、藝術、住宿與自然美學的高檔美軍宿舍改建聚落。",
    "geoLat": 25.13562,
    "geoLon": 121.54813
  },
  {
    "id": "site_26",
    "code": "26",
    "name": "花卉試驗中心",
    "category": "自然生態",
    "plusCode": "4GPW+33",
    "district": "south",
    "districtName": "南區・花卉信仰與門戶",
    "x": 225,
    "y": 755,
    "radius": 40,
    "title": "26 花卉試驗中心",
    "description": "台北市免門票的公立植物公園，佔地廣大且四季百花盛開，擁有全台聞名的百年茶花林步道與櫻花大道，是散步健行與婚紗拍攝的賞花勝地。",
    "geoLat": 25.13512,
    "geoLon": 121.54513
  },
  {
    "id": "site_27",
    "code": "27",
    "name": "陽明福德宮",
    "category": "民間信仰",
    "plusCode": "4GPW+26",
    "district": "south",
    "districtName": "南區・花卉信仰與門戶",
    "x": 345,
    "y": 725,
    "radius": 40,
    "title": "27 陽明福德宮",
    "description": "花卉試驗中心對面的百年土地公廟，是在地里民出入保平安、農作生意興隆的精神寄託，登山客與過路人也常在此停步參拜祈福。",
    "geoLat": 25.135,
    "geoLon": 121.5455
  },
  {
    "id": "site_28",
    "code": "28",
    "name": "臺北市立格致國民中學",
    "category": "初級教育",
    "plusCode": "4GJW+WW",
    "district": "south",
    "districtName": "南區・花卉信仰與門戶",
    "x": 350,
    "y": 860,
    "radius": 40,
    "title": "28 臺北市立格致國民中學",
    "description": "隱身在山林綠蔭間的森林生態國中，校園擁有極高的綠覆率與遠眺台北視野，為山仔后在地子弟提供自然健康的求學成長環境。",
    "geoLat": 25.13225,
    "geoLon": 121.54725
  },
  {
    "id": "site_29",
    "code": "29",
    "name": "納美花園 (Navi Garden)",
    "category": "休閒莊園",
    "plusCode": "4GQ2+3M",
    "district": "south",
    "districtName": "南區・花卉信仰與門戶",
    "x": 530,
    "y": 760,
    "radius": 40,
    "title": "29 納美花園 (Navi Garden)",
    "description": "佔地六千坪的世外桃源休閒莊園，擁有遼闊的碧綠大草皮、生態池塘與林蔭落葉步道，專門提供浪漫的戶外森林系婚禮、草地野餐與聚會空間。",
    "geoLat": 25.1385,
    "geoLon": 121.554
  },
  {
    "id": "site_30",
    "code": "30",
    "name": "下竹林福德宮",
    "category": "民間信仰",
    "plusCode": "4GJW+7F",
    "district": "south",
    "districtName": "南區・花卉信仰與門戶",
    "x": 560,
    "y": 890,
    "radius": 40,
    "title": "30 下竹林福德宮",
    "description": "由市區沿仰德大道進入陽明山的第一道守護小廟，石造古祠隱身於幽靜竹林與老樹旁，百年來默默守護每位登山健行者與歸鄉居民。",
    "geoLat": 25.13062,
    "geoLon": 121.54613
  }
];

// --- END: src/world/landmarks.js ---

// --- START: src/entities/npc.js ---
/**
 * 陽明里在地 NPC 系統（方案 A：精緻 Canvas 2D 向量渲染動森村民風格）
 * 包含：黃裕倉里長、巡守隊王大哥、生態導覽陳老師、文化大學學生
 */
const NPCS = [
  {
    id: "npc_chief",
    name: "黃里長",
    role: "陽明里大家長",
    x: 360,
    y: 945,
    radius: 20,
    dir: "left",
    color: "#1e3a8a",
    symbol: "👨‍💼",
    dialogue: "歡迎來到陽明里！山仔后這裡空氣好、文史豐富。走訪全里 30 處特色地標並收集金幣，就能獲得陽明里榮譽文史漫遊者認證喔！",
    trivia: "陽明里辦公處位於菁山路 34 巷 1 號，隨時歡迎里民與遊客前來交流歇腳。",
    dialog: [
      "歡迎來到陽明里！山仔后這裡空氣好、文史豐富。",
      "我們全里分為中央山仔后、北區草山、西區美軍、東區建業與南區花卉五大生活圈。",
      "走訪全里 30 處特色地標並收集金幣，就能獲得榮譽里民證喔！"
    ]
  }
];

class NpcManager {
  constructor() {
    this.npcs = NPCS;
    this.animTimer = 0;
  }

  render(ctx) {
    this.animTimer += 0.016;
    this.npcs.forEach((npc, idx) => {
      ctx.save();
      const bob = Math.sin(this.animTimer * 2.5 + idx * 1.5) * 1.2;
      ctx.translate(npc.x, npc.y + bob);

      // 腳底投影
      ctx.fillStyle = "rgba(15, 23, 42, 0.26)";
      ctx.beginPath();
      ctx.ellipse(0, 16 - bob, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      if (npc.id === "npc_chief") {
        this.drawChief(ctx);
      } else if (npc.id === "npc_volunteer") {
        this.drawVolunteer(ctx);
      } else if (npc.id === "npc_teacher") {
        this.drawTeacher(ctx);
      } else if (npc.id === "npc_student") {
        this.drawStudent(ctx);
      } else {
        this.drawDefaultNpc(ctx, npc);
      }

      this.drawNameTag(ctx, npc);
      ctx.restore();
    });
  }

  drawChief(ctx) {
    NpcManager.drawChiefStatic(ctx);
  }

  static drawChiefStatic(ctx) {
    // 雙腿皮鞋
    ctx.fillStyle = "#334155";
    ctx.fillRect(-7, 8, 5, 8);
    ctx.fillRect(2, 8, 5, 8);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-8, 14, 7, 3.5);
    ctx.fillRect(1, 14, 7, 3.5);

    // 白襯衫與深藍里長背心
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-10, -8, 20, 16);
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.roundRect(-12, -9, 24, 18, 4);
    ctx.fill();

    // 門襟與識別證
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(-1.5, -9, 3, 18);
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(-9, -4, 6, 8);
    ctx.fillStyle = "#b45309";
    ctx.fillRect(-8, -2, 4, 4);

    // 親切臉蛋
    ctx.fillStyle = "#ffedd5";
    ctx.beginPath();
    ctx.arc(0, -17, 13, 0, Math.PI * 2);
    ctx.fill();

    // 腮紅
    ctx.fillStyle = "rgba(251, 113, 133, 0.4)";
    ctx.beginPath();
    ctx.arc(-8, -14, 3, 0, Math.PI * 2);
    ctx.arc(8, -14, 3, 0, Math.PI * 2);
    ctx.fill();

    // 笑瞇瞇雙眼
    ctx.strokeStyle = "#1e1b4b";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(-5, -17, 2.5, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(5, -17, 2.5, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    // 微笑嘴
    ctx.strokeStyle = "#9f1239";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -12, 3.2, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // 灰白短髮
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.arc(0, -20, 13, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-3, -25, 7, 0, Math.PI);
    ctx.arc(5, -24, 6, 0, Math.PI);
    ctx.fill();
  }

  drawVolunteer(ctx) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-7, 8, 5, 9);
    ctx.fillRect(2, 8, 5, 9);

    // 螢光黃巡邏背心
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.roundRect(-12, -9, 24, 18, 4);
    ctx.fill();

    // 反光條紋
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-12, -4, 24, 2.5);
    ctx.fillRect(-12, 2, 24, 2.5);

    // 紅色指揮棒
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(12, -6, 3, 14);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(12, 5, 3, 4);

    // 臉蛋
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.arc(0, -17, 12, 0, Math.PI * 2);
    ctx.fill();

    // 雙眼
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-5, -18, 2.5, 3.5);
    ctx.fillRect(3, -18, 2.5, 3.5);

    // 便帽與徽章
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.roundRect(-11, -30, 22, 10, [5, 5, 0, 0]);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-13, -22, 26, 3);
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(-2, -28, 4, 4);
  }

  drawTeacher(ctx) {
    ctx.fillStyle = "#78716c";
    ctx.fillRect(-7, 8, 5, 8);
    ctx.fillRect(2, 8, 5, 8);

    // 探險背心
    ctx.fillStyle = "#3f6212";
    ctx.beginPath();
    ctx.roundRect(-12, -9, 24, 18, 4);
    ctx.fill();

    // 望遠鏡
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-5, -3, 4, 7);
    ctx.fillRect(1, -3, 4, 7);

    // 臉蛋
    ctx.fillStyle = "#ffedd5";
    ctx.beginPath();
    ctx.arc(0, -17, 12.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.arc(-5, -17, 1.8, 0, Math.PI * 2);
    ctx.arc(5, -17, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 探險大遮陽帽
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.ellipse(0, -25, 17, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.roundRect(-9, -33, 18, 9, [4, 4, 0, 0]);
    ctx.fill();
  }

  drawStudent(ctx) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-7, 8, 5, 8);
    ctx.fillRect(2, 8, 5, 8);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-8, 14, 7, 3);
    ctx.fillRect(1, 14, 7, 3);

    // 酒紅連帽衫
    ctx.fillStyle = "#991b1b";
    ctx.beginPath();
    ctx.roundRect(-12, -9, 24, 18, 5);
    ctx.fill();

    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(-8, 0, 16, 7);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 7px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CCU", 0, -2);

    ctx.fillStyle = "#ffedd5";
    ctx.beginPath();
    ctx.arc(0, -17, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(-5, -18, 2.5, 3.5);
    ctx.fillRect(3, -18, 2.5, 3.5);

    ctx.fillStyle = "#3e2723";
    ctx.beginPath();
    ctx.arc(0, -21, 12.5, Math.PI * 0.85, Math.PI * 2.15);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-4, -25, 6, 0, Math.PI);
    ctx.arc(3, -25, 7, 0, Math.PI);
    ctx.fill();
  }

  drawDefaultNpc(ctx, npc) {
    ctx.fillStyle = npc.color || "#475569";
    ctx.fillRect(-11, -8, 22, 17);
    ctx.fillStyle = "#ffedd5";
    ctx.beginPath();
    ctx.arc(0, -17, 11, 0, Math.PI * 2);
    ctx.fill();
  }

  drawNameTag(ctx, npc) {
    ctx.save();
    const label = npc.name;
    ctx.font = "bold 11px sans-serif";
    const textWidth = ctx.measureText(label).width;
    const tagWidth = textWidth + 14;
    const tagHeight = 18;
    const tagY = -42;

    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.beginPath();
    ctx.roundRect(-tagWidth / 2, tagY, tagWidth, tagHeight, 9);
    ctx.fill();

    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 0, tagY + tagHeight / 2);
    ctx.restore();
  }

  getNearbyNpc(x, y, range = 38) {
    for (const npc of this.npcs) {
      const dist = Math.hypot(npc.x - x, npc.y - y);
      if (dist <= range + npc.radius) {
        return npc;
      } 
    }
    return null;
  }
}

// --- END: src/entities/npc.js ---

// --- START: src/entities/coin.js ---
/**
 * 陽明里必經景點金幣收集系統
 * 管理 16 處必經景點與文創地標的動態旋轉金幣、碰撞收集、吸收動效與浮動文字
 */


class CoinManager {
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

// --- END: src/entities/coin.js ---

// --- START: src/entities/player.js ---
/**
 * 玩家實體類別（方案 A：精緻 Canvas 2D 向量渲染動森 Q 版主角）
 * 具備圓潤臉蛋、腮紅、高光大眼、草帽、背包、4 方向朝向與靈動走動跳步動畫
 */
class Player {
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

// --- END: src/entities/player.js ---

// --- START: src/engine/camera.js ---
/**
 * 直立式自適應 2D 攝影機系統
 * 負責世界座標與螢幕座標轉換、視角平滑跟隨玩家與地圖邊界限制
 */
class Camera {
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

// --- END: src/engine/camera.js ---

// --- START: src/engine/input.js ---
/**
 * 跨平台輸入管理器（電腦鍵盤 + 手機虛擬手把 + 地圖單指點擊導航）
 */
class InputManager {
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

// --- END: src/engine/input.js ---

// --- START: src/world/map.js ---
/**
 * 陽明里 1024 x 1024 純手繪水彩繪本風格地圖引擎
 * 採用使用者認可之吉卜力/動森風格全景手繪插畫作為真實底圖
 * 零程式畫路、零生硬線條，30 處地標精確錨定於各建築門前
 */


class YangmingMap {
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

// --- END: src/world/map.js ---

// --- START: src/ui/dialog.js ---




/**
 * UI 與文化導覽卡片管理器
 * 負責彈窗對話、文化知識卡片、榮譽里民證書與社群分享
 */
class UIManager {
  constructor() {
    // 綁定 DOM 元素
    this.dialogModal = document.getElementById("dialog-modal");
    this.dialogTag = document.getElementById("dialog-tag");
    this.dialogTitle = document.getElementById("dialog-title");
    this.dialogVisual = document.getElementById("dialog-visual");
    this.dialogDesc = document.getElementById("dialog-description");
    this.btnDialogClose = document.getElementById("btn-dialog-close");
    this.btnDialogConfirm = document.getElementById("btn-dialog-confirm");

    this.proximityPrompt = document.getElementById("proximity-prompt");
    this.toastMessage = document.getElementById("toast-message");
    this.questProgress = document.getElementById("quest-progress");
    this.coinCount = document.getElementById("coin-count");

    this.certModal = document.getElementById("certificate-modal");
    this.btnCertClose = document.getElementById("btn-cert-close");
    this.btnCertCopy = document.getElementById("btn-cert-copy");

    // 文史圖鑑冊 DOM 元素
    this.btnOpenAlbum = document.getElementById("btn-open-album");
    this.albumModal = document.getElementById("album-modal");
    this.btnAlbumClose = document.getElementById("btn-album-close");
    this.btnAlbumConfirm = document.getElementById("btn-album-confirm");
    this.albumGrid = document.getElementById("album-grid");
    this.albumProgressBar = document.getElementById("album-progress-bar");
    this.albumProgressText = document.getElementById("album-progress-text");
    this.albumClearanceStamp = document.getElementById("album-clearance-stamp");
    this.albumTabs = document.querySelectorAll(".album-tab");

    this.activeFilter = "all";
    this.visitedSet = new Set();

    this.isDialogOpen = false;
    this.visitedCount = 0;
    this.totalLandmarks = 30;
    this.animFrameId = null;

    this.initEventListeners();
  }

  initEventListeners() {
    // 關閉一般導覽卡片
    if (this.btnDialogClose) {
      this.btnDialogClose.addEventListener("click", () => this.closeDialog());
    }
    if (this.btnDialogConfirm) {
      this.btnDialogConfirm.addEventListener("click", () => this.closeDialog());
    }

    // 關閉證書
    if (this.btnCertClose) {
      this.btnCertClose.addEventListener("click", () => {
        this.certModal.classList.add("hidden");
        this.isDialogOpen = false;
      });
    }

    // 一鍵複製連結（便於里民轉發至 LINE 群組）
    if (this.btnCertCopy) {
      this.btnCertCopy.addEventListener("click", () => {
        this.copyShareLink();
      });
    }

    // 開啟與關閉文史圖鑑
    if (this.btnOpenAlbum) {
      this.btnOpenAlbum.addEventListener("click", () => this.openAlbum());
    }
    if (this.btnAlbumClose) {
      this.btnAlbumClose.addEventListener("click", () => this.closeAlbum());
    }
    if (this.btnAlbumConfirm) {
      this.btnAlbumConfirm.addEventListener("click", () => this.closeAlbum());
    }

    // 分區標籤切換
    if (this.albumTabs && this.albumTabs.length > 0) {
      this.albumTabs.forEach(tab => {
        tab.addEventListener("click", () => {
          this.albumTabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          this.activeFilter = tab.dataset.filter || "all";
          this.renderAlbum();
        });
      });
    }
  }

  /**
   * 設定世界地圖影像資產（用於裁切景點實景）
   */
  setMapImage(img) {
    this.mapImage = img;
  }

  /**
   * 顯示地標文化導覽卡片
   */
  showLandmarkDialog(landmark, isNewDiscovery = false) {
    const codeBadge = landmark.code ? `[${landmark.code}] ` : "";
    this.dialogTag.textContent = `${landmark.category || "文化地標"} · ${landmark.districtName || ""}`;
    this.dialogTag.style.backgroundColor = landmark.category === "古蹟" ? "#b94a34" : (landmark.category === "歷史建築" ? "#9c6644" : "#2a9d8f");
    this.dialogTitle.textContent = `${codeBadge}${landmark.name}`;

    // 清空並展示設計師高畫質水彩手繪特寫圖
    this.dialogVisual.innerHTML = "";
    const imgContainer = document.createElement("div");
    imgContainer.style.width = "100%";
    imgContainer.style.minHeight = "200px";
    imgContainer.style.display = "flex";
    imgContainer.style.alignItems = "center";
    imgContainer.style.justifyContent = "center";
    imgContainer.style.background = "radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%)";
    imgContainer.style.borderRadius = "10px";
    imgContainer.style.overflow = "hidden";
    imgContainer.style.position = "relative";
    imgContainer.style.border = "1px solid rgba(0, 0, 0, 0.08)";

    const img = document.createElement("img");
    img.src = `./assets/icons/${landmark.id}.png`;
    img.alt = landmark.name;
    img.style.maxHeight = "190px";
    img.style.maxWidth = "96%";
    img.style.objectFit = "contain";
    img.style.filter = "drop-shadow(0 6px 14px rgba(15, 23, 42, 0.16))";

    // 若圖片未載入則平滑降級為向量繪圖
    img.onerror = () => {
      imgContainer.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 360;
      canvas.height = 180;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      const ctx = canvas.getContext("2d");
      CuteHouseRenderer.draw(ctx, landmark.code, 180, 142, 0, true);
      imgContainer.appendChild(canvas);
    };

    imgContainer.appendChild(img);
    this.dialogVisual.appendChild(imgContainer);

    this.dialogDesc.innerHTML = `
      <p style="font-size: 0.96rem; line-height: 1.75; color: #1e293b; margin: 0; padding: 4px 0;">${landmark.description}</p>
    `;

    this.dialogModal.classList.remove("hidden");
    this.isDialogOpen = true;

    if (isNewDiscovery) {
      this.showToast(`成功走訪：${landmark.code} ${landmark.name}！`);
    }
  }

  /**
   * 顯示在地人物對話卡片（黃里長）
   */
  showNpcDialog(npc) {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    this.dialogTag.textContent = npc.role || "陽明里大家長";
    this.dialogTag.style.backgroundColor = npc.color || "#1e3a8a";
    this.dialogTitle.textContent = npc.name || "黃里長";

    // 繪製黃里長專屬精緻卡通頭像
    this.dialogVisual.innerHTML = "";
    this.dialogVisual.style.backgroundColor = "#eff6ff";
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 100;
    canvas.style.width = "160px";
    canvas.style.height = "100px";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    const ctx = canvas.getContext("2d");
    ctx.translate(80, 68);
    ctx.scale(1.8, 1.8);
    NpcManager.drawChiefStatic(ctx);
    this.dialogVisual.appendChild(canvas);

    const speech = npc.dialogue || (Array.isArray(npc.dialog) ? npc.dialog[0] : npc.dialog) || "歡迎來到陽明里！";
    const tipText = npc.trivia || "陽明里辦公處位於菁山路 34 巷 1 號，隨時歡迎里民與遊客前來交流歇腳。";

    this.dialogDesc.innerHTML = `
      <div style="background: #ffffff; border: 1.5px solid #bfdbfe; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <p style="font-size: 1.05rem; color: #1e3a8a; line-height: 1.7; font-weight: bold; margin: 0;">「${speech}」</p>
      </div>
      <div style="background-color: #f1f5f9; border-left: 3px solid #1e3a8a; padding: 8px 12px; font-size: 0.85rem; color: #475569; border-radius: 4px;">
        <strong>里長的話：</strong>${tipText}
      </div>
    `;

    this.dialogModal.classList.remove("hidden");
    this.isDialogOpen = true;
  }

  /**
   * 關閉當前對話彈窗
   */
  closeDialog() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.dialogModal.classList.add("hidden");
    this.isDialogOpen = false;
  }

  /**
   * 更新任務探索進度條
   */
  updateProgress(count, total = 30) {
    this.visitedCount = count;
    this.totalLandmarks = total;
    if (this.questProgress) {
      this.questProgress.textContent = `${count} / ${total}`;
    }

    // 當全部集滿 30 個地標，主動觸發榮譽里民證
    if (count >= total) {
      setTimeout(() => {
        this.showCertificate();
      }, 600);
    }
  }

  /**
   * 更新金幣收集數量
   */
  updateCoinCount(count, total = 30) {
    if (this.coinCount) {
      this.coinCount.textContent = `${count} / ${total}`;
    }
  }

  /**
   * 顯示浮動互動提示泡泡
   */
  showProximity(text = "點擊或按 A 互動") {
    if (this.isDialogOpen) {
      this.hideProximity();
      return;
    }
    if (this.proximityPrompt) {
      const bubbleText = this.proximityPrompt.querySelector(".bubble-text");
      if (bubbleText) bubbleText.textContent = text;
      this.proximityPrompt.classList.remove("hidden");
    }
  }

  /**
   * 隱藏浮動互動提示泡泡
   */
  hideProximity() {
    if (this.proximityPrompt) {
      this.proximityPrompt.classList.add("hidden");
    }
  }

  /**
   * 彈出榮譽里民認證卡片
   */
  showCertificate() {
    if (this.certModal) {
      this.certModal.classList.remove("hidden");
      this.isDialogOpen = true;
    }
  }

  /**
   * 顯示 Toast 提示訊息
   */
  showToast(message) {
    if (!this.toastMessage) return;
    this.toastMessage.textContent = message;
    this.toastMessage.classList.remove("hidden");

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage.classList.add("hidden");
    }, 2400);
  }

  /**
   * 複製當前網頁網址至剪貼簿
   */
  copyShareLink() {
    const url = window.location.href;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast("已成功複製遊戲連結！快發到 LINE 群組邀請鄰居遊玩");
      }).catch(() => {
        this.showToast("連結複製完成！");
      });
    } else {
      // 降級容錯處理
      const dummyInput = document.createElement("input");
      dummyInput.value = url;
      document.body.appendChild(dummyInput);
      dummyInput.select();
      document.execCommand("copy");
      document.body.removeChild(dummyInput);
      this.showToast("已複製遊戲連結至剪貼簿！");
    }
  }

  /**
   * 同步已走訪地標集合並更新進度
   */
  setVisitedLandmarks(visitedSet) {
    this.visitedSet = visitedSet;
    this.updateProgress(visitedSet.size, this.totalLandmarks);
  }

  /**
   * 開啟手繪水彩文史圖鑑冊
   */
  openAlbum() {
    this.hideProximity();
    this.renderAlbum();
    if (this.albumModal) {
      this.albumModal.classList.remove("hidden");
      this.isDialogOpen = true;
    }
  }

  /**
   * 關閉文史圖鑑冊
   */
  closeAlbum() {
    if (this.albumModal) {
      this.albumModal.classList.add("hidden");
      this.isDialogOpen = false;
    }
  }

  /**
   * 渲染文史圖鑑內容卡片
   */
  renderAlbum() {
    if (!this.albumGrid) return;
    this.albumGrid.innerHTML = "";

    const visitedCount = this.visitedSet.size;
    const total = LANDMARKS.length;
    const pct = Math.round((visitedCount / total) * 100);

    if (this.albumProgressBar) {
      this.albumProgressBar.style.width = `${pct}%`;
    }
    if (this.albumProgressText) {
      this.albumProgressText.textContent = `已收錄 ${visitedCount} / ${total} 處地標 (${pct}%)`;
    }
    if (this.albumClearanceStamp) {
      if (visitedCount >= total) {
        this.albumClearanceStamp.classList.remove("hidden");
      } else {
        this.albumClearanceStamp.classList.add("hidden");
      }
    }

    // 依據當前選取分區進行篩選
    const filteredLandmarks = LANDMARKS.filter(lm => {
      if (this.activeFilter === "all") return true;
      return lm.district === this.activeFilter;
    });

    filteredLandmarks.forEach(lm => {
      const isUnlocked = this.visitedSet.has(lm.id);
      const card = document.createElement("div");
      card.className = `album-item ${isUnlocked ? "unlocked" : "locked"}`;

      if (isUnlocked) {
        card.innerHTML = `
          <div class="album-icon-wrap">
            <img class="album-icon-img" src="./assets/icons/${lm.id}.png" alt="${lm.name}" loading="lazy" onerror="this.src='./assets/icons/site_01.png'">
          </div>
          <div class="album-item-code">${lm.code}・${lm.category}</div>
          <div class="album-item-name">${lm.name}</div>
          <div class="album-item-district">${lm.districtName.split("・")[1] || lm.districtName}</div>
          <div class="album-item-signature" title="${lm.description}">${lm.description.slice(0, 24) + '...'}</div>
        `;
        card.addEventListener("click", () => {
          this.closeAlbum();
          this.showLandmarkDialog(lm, false);
        });
      } else {
        card.innerHTML = `
          <div class="album-icon-wrap">
            <img class="album-icon-img" src="./assets/icons/${lm.id}.png" alt="${lm.name}" loading="lazy" onerror="this.src='./assets/icons/site_01.png'">
            <span class="album-lock-badge">未探索</span>
          </div>
          <div class="album-item-code">${lm.code}・${lm.districtName.split("・")[0]}</div>
          <div class="album-item-name">？？？？</div>
          <div class="album-item-district">${lm.districtName}</div>
          <div class="album-item-signature">漫步靠近此處即可點亮收錄</div>
        `;
        card.addEventListener("click", () => {
          this.showToast(`【${lm.code} 號地標】尚未探索，請在地圖尋找建築！`);
        });
      }

      this.albumGrid.appendChild(card);
    });
  }
}

// --- END: src/ui/dialog.js ---

// --- START: src/engine/game.js ---
/**
 * 陽明里 2D 遊戲核心驅動引擎
 * 管理遊戲主迴圈、相機跟隨、實體更新、接近偵測與互動觸發
 */









class GameEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");

    // 初始化世界地圖
    this.map = new YangmingMap();

    // 玩家初始起點（位於地圖最底部的仰德大道上山入口，面對黃里長迎賓）
    this.player = new Player(310, 950);
    this.player.facing = "up";

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

// --- END: src/engine/game.js ---

// --- START: src/main.js ---
/**
 * 遊戲主程式入口（main.js）
 * 處理高解析度螢幕自適應、視窗縮放與遊戲引擎啟動
 */


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
  window.game = game;

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


// --- END: src/main.js ---

})();
