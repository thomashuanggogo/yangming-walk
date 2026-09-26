/**
 * 陽明里漫步 3D 方塊版 - 遊戲進入點 (main_3d.js)
 * 初始化 Three.js 遊戲引擎與視窗自適應監聽
 */
import { VoxelGame } from './three/VoxelGame.js';

function init3DGame() {
  const canvas = document.getElementById('game-canvas-3d');
  if (!canvas) {
    console.error('找不到 3D 遊戲畫布 (game-canvas-3d)！');
    return;
  }

  // 建立 3D 遊戲引擎實例
  const game = new VoxelGame(canvas);
  window.voxelGame = game;

  // 視窗自適應縮放
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    game.resize(width, height);
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 100);
  });

  handleResize();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init3DGame);
} else {
  init3DGame();
}
