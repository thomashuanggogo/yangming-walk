/**
 * 陽明里「積木樹（Block Trees）」渲染模組
 * 採用標準 2D 正交俯視、立體幾何方塊（Lego / Voxel Toy Style）層疊結構
 */

function drawSingleBlock(ctx, x, y, w, h, topColor, frontColor, shadowColor) {
  // 底部陰影厚度面
  ctx.fillStyle = shadowColor;
  ctx.fillRect(x - w / 2, y - h / 2 + 3, w, h);

  // 正面主色面
  ctx.fillStyle = frontColor;
  ctx.fillRect(x - w / 2, y - h / 2, w, h - 2);

  // 頂部受光面
  ctx.fillStyle = topColor;
  ctx.fillRect(x - w / 2, y - h / 2, w, 3);

  // 外框邊緣線
  ctx.strokeStyle = shadowColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);
}

function drawBlockTrunk(ctx, x, y, w = 10, h = 18) {
  // 左側受光暖木色
  ctx.fillStyle = "#8d6e63";
  ctx.fillRect(x - w / 2, y - h, w / 2, h);
  // 右側背光深木色
  ctx.fillStyle = "#5d4037";
  ctx.fillRect(x, y - h, w / 2, h);
  ctx.strokeStyle = "#3e2723";
  ctx.lineWidth = 1;
  ctx.strokeRect(x - w / 2, y - h, w, h);
}

export class BlockTreeRenderer {
  /**
   * 百年樟樹積木（雙層寬版階梯立方塊，茂密大方塊積木）
   */
  static drawCamphor(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
    ctx.fillRect(x - 22, y - 2, 44, 8);

    drawBlockTrunk(ctx, x, y, 12, 18);

    // 下層大積木樹冠
    drawSingleBlock(ctx, x, y - 22, 42, 16, "#74c67a", "#379634", "#1b5e20");
    // 上層中積木樹冠
    drawSingleBlock(ctx, x, y - 34, 28, 14, "#99d98c", "#52b788", "#2d6a4f");
    // 頂部小積木顆粒
    drawSingleBlock(ctx, x, y - 43, 14, 8, "#d8f3dc", "#74c67a", "#379634");
    ctx.restore();
  }

  /**
   * 老楓香積木（三層階梯金字塔漸縮方塊）
   */
  static drawMaple(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
    ctx.fillRect(x - 18, y - 2, 36, 7);

    drawBlockTrunk(ctx, x, y, 10, 20);

    // 第一層底座方塊
    drawSingleBlock(ctx, x, y - 24, 34, 14, "#99d98c", "#52b788", "#1b4332");
    // 第二層中層方塊
    drawSingleBlock(ctx, x, y - 35, 24, 13, "#b7e4c7", "#74c67a", "#2d6a4f");
    // 第三層金字塔尖方塊
    drawSingleBlock(ctx, x, y - 46, 14, 12, "#d8f3dc", "#99d98c", "#40916c");
    ctx.restore();
  }

  /**
   * 櫻花積木（粉白雙色浪漫層疊方塊）
   */
  static drawCherry(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
    ctx.fillRect(x - 16, y - 2, 32, 6);

    drawBlockTrunk(ctx, x, y, 8, 16);

    // 下層粉紅積木方塊
    drawSingleBlock(ctx, x, y - 20, 32, 14, "#ffccd5", "#ffb4a2", "#c9184a");
    // 上層乳白積木方塊
    drawSingleBlock(ctx, x, y - 30, 22, 12, "#fff0f3", "#ffccd5", "#ff758f");
    // 頂部小粉花積木顆粒
    drawSingleBlock(ctx, x, y - 38, 10, 7, "#ffffff", "#fff0f3", "#ffb3c1");
    ctx.restore();
  }

  /**
   * 街角矮灌木（圓角單層微型小方塊積木）
   */
  static drawBush(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(x - 10, y - 1, 20, 5);

    drawSingleBlock(ctx, x, y - 7, 20, 14, "#b7e4c7", "#52b788", "#1b4332");
    ctx.restore();
  }
}
