/**
 * 陽明里在地 NPC 系統（方案 A：精緻 Canvas 2D 向量渲染動森村民風格）
 * 包含：黃裕倉里長、巡守隊王大哥、生態導覽陳老師、文化大學學生
 */
export const NPCS = [
  {
    id: "npc_chief",
    name: "黃里長",
    role: "陽明里大家長",
    x: 350,
    y: 460,
    radius: 20,
    dir: "down",
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

export class NpcManager {
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
