const fs = require('fs');
const path = require('path');

// 讀取 landmarks.js
const landmarksRaw = fs.readFileSync(path.join(__dirname, 'src/world/landmarks.js'), 'utf-8');
// 去除 export const LANDMARKS = ... 改為 const LANDMARKS = ...
const landmarksCode = landmarksRaw.replace(/export\s+const\s+LANDMARKS/, 'const LANDMARKS');

// 讀取各個 3D 模組並去除 import / export
function cleanModule(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  // 移除 import 語句
  content = content.replace(/^import\s+.*?;\s*$/gm, '');
  // 將 export class 改為 class
  content = content.replace(/export\s+class\s+/g, 'class ');
  // 將 export const 改為 const
  content = content.replace(/export\s+const\s+/g, 'const ');
  return content;
}

const charCode = cleanModule(path.join(__dirname, 'src/three/VoxelCharacter.js'));
const terrainCode = cleanModule(path.join(__dirname, 'src/three/VoxelTerrain.js'));
const buildingsCode = cleanModule(path.join(__dirname, 'src/three/VoxelBuildings.js'));
const uiCode = cleanModule(path.join(__dirname, 'src/three/VoxelUI.js'));
const gameCode = cleanModule(path.join(__dirname, 'src/three/VoxelGame.js'));
const mainCode = cleanModule(path.join(__dirname, 'src/main_3d.js'));

const bundled = `/**
 * 陽明里漫步 3D 方塊版 - 獨立執行套裝檔 (bundle_3d.js)
 * 支援本機 file:// 雙擊直接開啟，免伺服器、無 CORS 限制！
 */
(function() {
  const THREE = window.THREE;
  if (!THREE) {
    console.error("Three.js 核心庫尚未就緒！");
    return;
  }

  // 1. 地標資料庫
  ${landmarksCode}

  // 2. 體素角色系統
  ${charCode}

  // 3. 體素地形與自然景觀
  ${terrainCode}

  // 4. 體素建築與 30 處地標
  ${buildingsCode}

  // 5. 互動介面與圖鑑系統
  ${uiCode}

  // 6. 3D 遊戲引擎核心
  ${gameCode}

  // 7. 啟動入口
  ${mainCode}
})();
`;

fs.writeFileSync(path.join(__dirname, 'bundle_3d.js'), bundled, 'utf-8');
console.log('成功生成 bundle_3d.js！大小：', (bundled.length / 1024).toFixed(2), 'KB');
