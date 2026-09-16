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

export class CuteHouseRenderer {
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
