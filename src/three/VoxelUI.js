/**
 * 陽明里漫步 3D 街景版 - 介面與互動系統模組 (VoxelUI.js)
 * 1. 頂部「陽明里漫步 3D 街景版」與「圖鑑 X/30」
 * 2. 右上角「即時全域導覽小地圖 (Minimap)」：
 *    - 支援「一鍵放大/縮小 (按 Z 鍵)」切換大圖全景導覽與右上角小窗
 *    - 支援「小地圖內部平滑縮放 (100% ~ 250%)」與按住拖曳平移 (Pan)
 *    - 支援「一鍵收合/展開 (按 M 鍵)」
 *    - 30 處地標打點、名稱標籤與玩家即時呼吸紅點
 * 3. 底部「👇 用手指點一下地面，小人就會走過去」
 * 4. 靠近時彈出的「🔍🔍 調查：[地標名稱]」與「🔍💬 找里長聊天」
 * 5. 奶白色地標故事卡彈窗 (收錄到圖鑑/關閉)
 * 6. 圖鑑列表彈窗 (進度條、分區展開、未到訪/已到訪✓)
 * 7. 右下角「📍 入口」傳送按鈕
 */
import { LANDMARKS } from '../world/landmarks.js';

export class VoxelUI {
  constructor(game) {
    this.game = game;
    this.visitedSet = new Set();
    this.currentNearbyLandmark = null;
    this.isNearChief = false;

    // 小地圖狀態控制
    this.isMinimapCollapsed = true;
    this.isMinimapExpanded = false; // 大圖模式
    this.minimapZoomLevel = 1.0;
    this.minimapPanX = 0;
    this.minimapPanY = 0;
    this.isPanning = false;
    this.panStartX = 0;
    // 道路與指標牌顯示狀態
    this.isRoadsVisible = true;
    this.navigationVisible = false;
    try { this.navigationVisible = localStorage.getItem('yangming-navigation-visible') === 'true'; } catch (_) {}

    this.loadProgress();
    this.initDOM();
    this.initMinimap();
    this.bindEvents();
    this.bindMinimapInteractions();
    this.updateAlbumStats();
    document.getElementById('voxel-minimap-card').classList.add('collapsed');
    document.getElementById('btn-toggle-minimap').setAttribute('aria-expanded', 'false');
    this.setNavigationVisible(this.navigationVisible);
  }


  updateCornerNav(directions) {
    const hud = document.getElementById('corner-nav-hud');
    if (!hud) return;

    if (!this.navigationVisible || !this.isRoadsVisible || !directions) {
      hud.classList.add('hidden');
      return;
    }

    hud.classList.remove('hidden');
    const titleEl = document.getElementById('corner-title');
    if (titleEl) titleEl.textContent = '轉角路口：' + directions.title;

    const setDir = (id, val, prefix) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (val) {
        el.classList.remove('hidden');
        el.querySelector('.road-name').textContent = val;
      } else {
        el.classList.add('hidden');
      }
    };

    setDir('corner-dir-front', directions.front, '⬆️ 前方：');
    setDir('corner-dir-left', directions.left, '⬅️ 左邊：');
    setDir('corner-dir-right', directions.right, '➡️ 右邊：');
    setDir('corner-dir-back', directions.back, '⬇️ 後方：');
  }

  isBlockingWorldInput() {
    return this.isMinimapExpanded || ['modal-story', 'modal-album', 'modal-chief']
      .some(id => !document.getElementById(id).classList.contains('hidden'));
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('yangming_3d_visited');
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) {
          const validIds = new Set(LANDMARKS.map(item => item.id));
          arr.forEach(id => { if (validIds.has(id)) this.visitedSet.add(id); });
        }
      }
    } catch (e) {
      console.warn('無法讀取 LocalStorage 進度:', e);
    }
  }

  saveProgress() {
    try {
      localStorage.setItem('yangming_3d_visited', JSON.stringify(Array.from(this.visitedSet)));
    } catch (e) {
      console.warn('無法儲存 LocalStorage 進度:', e);
    }
  }

  initDOM() {
    const container = document.createElement('div');
    container.id = 'voxel-ui-container';
    container.innerHTML = `
      <!-- 小地圖放大遮罩層 -->
      <div id="voxel-minimap-backdrop" class="voxel-minimap-backdrop hidden"></div>

      <!-- 左上角遊戲標題 -->
      
      <!-- 轉角路名指南 HUD (四向路牌指引) -->
      <div id="corner-nav-hud" class="corner-nav-hud hidden">
        <div class="corner-header">
          <span class="corner-pin">🧭</span>
          <span id="corner-title" class="corner-title">轉角指標牌</span>
        </div>
        <div class="corner-directions">
          <div id="corner-dir-front" class="corner-dir-item dir-front hidden">⬆️ 前方：<span class="road-name"></span></div>
          <div class="corner-dir-row">
            <div id="corner-dir-left" class="corner-dir-item dir-left hidden">⬅️ 左邊：<span class="road-name"></span></div>
            <div id="corner-dir-right" class="corner-dir-item dir-right hidden">➡️ 右邊：<span class="road-name"></span></div>
          </div>
          <div id="corner-dir-back" class="corner-dir-item dir-back hidden">⬇️ 後方：<span class="road-name"></span></div>
        </div>
      </div>

      <div class="voxel-badge-title">
        <span class="brick-icon">🧱</span>
        <span class="title-text">陽明里漫步</span>
        <span class="sub-text">3D 街景版</span>
      </div>

      <!-- 右上角按鈕群 (視角切換、小地圖開關、圖鑑進度) -->
      <div class="voxel-album-top-group">
        <!-- 視角切換按鈕 -->
        <button id="btn-toggle-camera-view" class="voxel-btn-view" title="切換鏡頭視角 (按 V 鍵)">
          <span id="view-mode-icon" class="view-icon">📐</span>
          <span id="view-mode-name" class="view-label">斜視</span>
        </button>

        <!-- 小地圖收合/展開開關 -->
        <button id="btn-toggle-minimap" class="voxel-btn-view" title="收合/展開小地圖 (按 M 鍵)">
          <span class="view-icon">🗺️</span>
          <span id="minimap-btn-label" class="view-label">地圖</span>
        </button>

        <!-- 道路與路標收合/展開開關 -->
        <button id="btn-toggle-roads" class="voxel-btn-view" title="顯示或收起路標與轉角提示 (按 R 鍵)" aria-pressed="false">
          <span id="roads-toggle-icon" class="view-icon">🛣️</span>
          <span id="roads-toggle-label" class="view-label">路標</span>
        </button>

        <!-- 圖鑑按鈕 -->
        <div id="btn-album-circle" class="voxel-circle-stat" title="開啟圖鑑">
          <span class="stat-book-icon">📖</span>
          <span class="stat-title">圖鑑</span>
          <span id="album-counter" class="stat-count">${this.visitedSet.size}/${LANDMARKS.length}</span>
        </div>
        <button id="btn-open-album-card" class="voxel-btn-album">圖鑑</button>
      </div>

      <!-- 右上角即時小地圖 (Minimap HUD) - 支援一鍵放大/縮小與多級縮放 -->
      <div id="voxel-minimap-card" class="voxel-minimap-card">
        <div class="minimap-header" id="minimap-header-bar">
          <div class="minimap-title-wrap">
            <span class="minimap-compass-icon">🧭</span>
            <span id="minimap-main-title" class="minimap-title">陽明山道路導覽</span>
            <span id="minimap-district-badge" class="minimap-district">中央・生活核心</span>
          </div>
          <div class="minimap-header-actions">
            <!-- 放大/還原按鈕 -->
            <button id="btn-minimap-expand" class="minimap-toggle-btn" title="放大/還原大地圖 (按 Z 鍵)">🔍</button>
            <!-- 收合/展開按鈕 -->
            <button id="btn-minimap-toggle-size" class="minimap-toggle-btn" title="收合/展開小地圖 (按 M 鍵)">➖</button>
          </div>
        </div>
        
        <div id="minimap-content" class="minimap-content">
          <!-- 縮放工具列 (放大/縮小/還原) -->
          <div class="minimap-zoom-toolbar">
            <button id="btn-minimap-zoom-in" class="zoom-btn" title="放大看細節 (+)">➕</button>
            <button id="btn-minimap-zoom-out" class="zoom-btn" title="縮小遠觀 (-)">➖</button>
            <button id="btn-minimap-zoom-reset" class="zoom-btn" title="重設縮放 (100%)">1:1</button>
            <span id="minimap-zoom-text" class="zoom-text">100%</span>
            <span class="zoom-drag-hint">可滾輪縮放 / 拖曳平移</span>
          </div>

          <div class="minimap-map-container" id="minimap-container">
            <!-- 可平移與縮放的層級 -->
            <div id="minimap-transform-layer" class="minimap-transform-layer">
              <img src="" class="minimap-img" alt="陽明里實際道路圖" draggable="false" />
              <!-- 30 個地標小標籤層 -->
              <div id="minimap-landmarks-layer" class="minimap-landmarks-layer"></div>
              <!-- 玩家即時呼吸紅點與面朝方向箭頭 -->
              <div id="minimap-player-dot" class="minimap-player-dot" style="left: 50%; top: 50%;">
                <div class="dot-pulse"></div>
                <div class="dot-core"></div>
                <div id="minimap-player-arrow" class="minimap-player-arrow"></div>
              </div>
            </div>
          </div>

          <div class="minimap-footer">
            <span id="minimap-coords" class="minimap-coords">坐標: (300, 445)</span>
            <span class="minimap-shortcut">按 Z 放大 · 按 M 收合</span>
          </div>
        </div>
      </div>

      <!-- 視角切換浮動 Toast 提示 -->
      <div id="voxel-toast" class="voxel-toast-msg hidden"></div>

      <!-- 右下角快速回到入口鈕 -->
      <button id="btn-goto-entrance" class="voxel-btn-entrance" title="回到起點入口">
        <span class="pin-icon">📍</span>
        <span class="pin-label">入口</span>
      </button>

      <!-- 底部提示黑底膠囊 -->
      <div class="voxel-bottom-hint">
        <span class="hand-icon">👇</span> 用手指或滑鼠點一下地面，小人就會走過去
      </div>

      <!-- 靠近互動大按鈕 (動態升起) -->
      <div id="voxel-interaction-dock" class="voxel-interaction-dock hidden">
        <button id="btn-trigger-action" class="voxel-action-btn">
          <span id="action-btn-icon" class="action-icon">🔍🔍</span>
          <span id="action-btn-text" class="action-text">調查：陽明山麥當勞</span>
        </button>
      </div>

      <!-- 地標故事卡彈窗 -->
      <div id="modal-story" class="voxel-modal-backdrop hidden">
        <div class="voxel-story-card">
          <div id="story-tag" class="voxel-story-tag">生活餐飲・中央・山仔后生活核心</div>
          <h2 id="story-title" class="voxel-story-title">02 陽明山麥當勞</h2>
          <div id="story-thumb-container" class="voxel-story-thumb-wrap">
            <img id="story-thumb-img" src="" alt="地標照片" class="voxel-story-thumb" />
          </div>
          <p id="story-desc" class="voxel-story-desc">
            陪伴文化大學師生與遊客近 37 年的經典地標，是無數人上山約見面集合、吃早餐吹冷氣與等公車的共同青春回憶。
          </p>
          <div class="voxel-story-actions">
            <button id="btn-visit-landmark" class="voxel-btn-confirm">前往這裡</button>
          <button id="btn-collect-landmark" class="voxel-btn-confirm">收錄到圖鑑</button>
            <button id="btn-close-story" class="voxel-btn-cancel">關閉</button>
          </div>
        </div>
      </div>

      <!-- 陽明里文史圖鑑彈窗 -->
      <div id="modal-album" class="voxel-modal-backdrop hidden">
        <div class="voxel-album-card">
          <div class="voxel-album-header">
            <h2 class="voxel-album-title">📖 陽明里文史圖鑑</h2>
            <button id="btn-export-atlas" class="atlas-export-button">匯出圖鑑</button>
            <button id="btn-close-album" class="voxel-close-x">&times;</button>
          </div>
          
          <!-- 進度條 -->
          <div class="voxel-progress-bar-wrap">
            <div id="album-progress-bar" class="voxel-progress-bar" style="width: 0%;"></div>
          </div>
          <div id="album-progress-text" class="voxel-progress-text">已收錄 0 / ${LANDMARKS.length} 處地標</div>

          <!-- 分區列表容器 -->
          <div class="album-tools"><input id="landmark-search" type="search" placeholder="搜尋地標名稱或編號" aria-label="搜尋地標"><select id="landmark-region" aria-label="地標區域"><option value="all">全部區域</option><option value="yangmingshan">陽明山公園區</option></select><label><input id="only-unvisited" type="checkbox"> 只看未收錄</label></div>
          <div id="album-list-scroll" class="voxel-album-list-scroll"></div>
        </div>
      </div>

      <!-- 里長對話彈窗 -->
      <div id="modal-chief" class="voxel-modal-backdrop hidden">
        <div class="voxel-story-card chief-card">
          <div class="voxel-story-tag chief-tag">里長辦公室・山仔后熱情導覽</div>
          <h2 class="voxel-story-title">里長 黃裕倉</h2>
          <p class="voxel-story-desc">
            「哈囉！歡迎來到美麗的山仔后陽明里！<br><br>
            我們陽明里擁有全台灣最珍貴的美軍眷舍歷史群、文化大學周邊特色商圈，以及美麗的花卉自然綠地。<br><br>
            這座 3D 方塊世界收錄了陽明里及周邊 <strong>${LANDMARKS.length} 處精選核心地標</strong>！只要漫步走近建築物，點擊『調查』就能認識每處歷史故事並收錄進圖鑑。<br><br>
            右上角的小地圖可以按 <strong>🔍 放大鍵</strong> 或 <strong>Z 鍵</strong> 放大看大圖細節，如果迷路了，點擊右下角『📍 入口』我就在這裡等你！」
          </p>
          <div class="voxel-story-actions">
            <button id="btn-close-chief" class="voxel-btn-confirm">收到，出發探索！</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    const credit = document.createElement('a');
    credit.className = 'road-attribution';
    credit.href = 'https://www.openstreetmap.org/copyright';
    credit.target = '_blank'; credit.rel = 'noopener';
    credit.textContent = '© OpenStreetMap contributors';
    document.body.appendChild(credit);
    container.querySelector('.minimap-img').src = this.game.roadNetwork.minimapImage();
    const closeNav = document.createElement('button');
    closeNav.className = 'close-navigation';
    closeNav.textContent = '×';
    closeNav.setAttribute('aria-label', '收起轉角提示與路標');
    closeNav.addEventListener('click', () => this.setNavigationVisible(false));
    document.getElementById('corner-nav-hud').appendChild(closeNav);
  }

  initMinimap() {
    const layer = document.getElementById('minimap-landmarks-layer');
    if (!layer) return;
    layer.innerHTML = '';

    LANDMARKS.forEach(lm => {
      const dotWrap = document.createElement('div');
      dotWrap.className = `minimap-lm-dot-wrap ${this.visitedSet.has(lm.id) ? 'visited' : ''}`;
      dotWrap.tabIndex = 0;
      dotWrap.setAttribute('role', 'button');
      dotWrap.setAttribute('aria-label', lm.code + ' ' + lm.name);
      dotWrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.openStoryModal(lm); } });
      dotWrap.id = `minimap-dot-${lm.id}`;
      const place = this.game.roadNetwork.placements.get(lm.id);
      const map = this.game.roadNetwork.worldToMap(place.x, place.z);
      dotWrap.style.left = `${(map.x / 1024) * 100}%`;
      dotWrap.style.top = `${(map.y / 1024) * 100}%`;

      dotWrap.innerHTML = `
        <div class="lm-dot-circle"></div>
        <div class="lm-dot-label">${lm.code} ${lm.name}</div>
      `;

      dotWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.mapDragged) this.openStoryModal(lm);
      });

      layer.appendChild(dotWrap);
    });
  }

  bindEvents() {
    document.getElementById('btn-export-atlas').addEventListener('click', () => this.exportAtlas());
    document.getElementById('landmark-search').addEventListener('input', () => this.renderAlbumList());
    document.getElementById('landmark-region').addEventListener('change', () => this.renderAlbumList());
    document.getElementById('only-unvisited').addEventListener('change', () => this.renderAlbumList());
    // 視角切換按鈕
    document.getElementById('btn-toggle-camera-view').addEventListener('click', () => {
      this.triggerViewModeCycle();
    });

    // 小地圖收合/展開事件
    const toggleMinimapCollapse = () => {
      // 若處於大圖放大狀態，先縮回小圖
      if (this.isMinimapExpanded) {
        this.setExpandMinimap(false);
      }

      this.isMinimapCollapsed = !this.isMinimapCollapsed;
      document.getElementById('btn-toggle-minimap').setAttribute('aria-expanded', String(!this.isMinimapCollapsed));
      const card = document.getElementById('voxel-minimap-card');
      const toggleBtn = document.getElementById('btn-minimap-toggle-size');
      const label = document.getElementById('minimap-btn-label');
      if (this.isMinimapCollapsed) {
        card.classList.add('collapsed');
        if (toggleBtn) toggleBtn.innerText = '➕';
        if (label) label.innerText = '地圖';
        this.showToast('小地圖已收合 (按 M 可展開)');
      } else {
        card.classList.remove('collapsed');
        if (toggleBtn) toggleBtn.innerText = '➖';
        if (label) label.innerText = '地圖';
      }
    };

    document.getElementById('btn-toggle-minimap').addEventListener('click', toggleMinimapCollapse);
    document.getElementById('btn-minimap-toggle-size').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMinimapCollapse();
    });

    // 點擊放大按鈕
    document.getElementById('btn-minimap-expand').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleExpandMinimap();
    });

    // 點擊大圖背景遮罩關閉放大模式
    document.getElementById('voxel-minimap-backdrop').addEventListener('click', () => {
      this.setExpandMinimap(false);
    });

    // 標題欄點擊收合 (若非點擊按鈕)
    document.getElementById('minimap-header-bar').addEventListener('click', (e) => {
      if (e.target.id !== 'btn-minimap-toggle-size' && e.target.id !== 'btn-minimap-expand') {
        if (!this.isMinimapExpanded) {
          toggleMinimapCollapse();
        }
      }
    });

    // 圖鑑開關
    document.getElementById('btn-album-circle').addEventListener('click', () => this.openAlbumModal());
    document.getElementById('btn-open-album-card').addEventListener('click', () => this.openAlbumModal());
    document.getElementById('btn-close-album').addEventListener('click', () => this.closeAlbumModal());

    // 回到入口按鈕
    document.getElementById('btn-goto-entrance').addEventListener('click', () => {
      this.game.teleportToEntrance();
    });

    // 調查 / 聊天大按鈕
    document.getElementById('btn-trigger-action').addEventListener('click', () => {
      if (this.isNearChief) {
        this.openChiefModal();
      } else if (this.currentNearbyLandmark) {
        this.openStoryModal(this.currentNearbyLandmark);
      }
    });

    // 地標故事卡關閉與收錄
    document.getElementById('btn-close-story').addEventListener('click', () => this.closeStoryModal());
    document.getElementById('btn-collect-landmark').addEventListener('click', () => {
      if (this.activeStoryLandmark) {
        this.collectLandmark(this.activeStoryLandmark);
      }
    });

    document.getElementById('btn-visit-landmark').addEventListener('click', () => {
      if (!this.activeStoryLandmark) return;
      this.game.teleportToLandmark(this.activeStoryLandmark);
      this.closeAllModals();
    });

    // 里長對話關閉
    document.getElementById('btn-close-chief').addEventListener('click', () => this.closeChiefModal());

    // 點擊背景遮罩關閉彈窗
    ['modal-story', 'modal-album', 'modal-chief'].forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          el.classList.add('hidden');
        }
      });
    });

    // 鍵盤快速鍵
    window.addEventListener('keydown', (e) => {
      if (e.repeat || e.target?.closest('input, textarea, select, [contenteditable]')) return;
      if (this.isMinimapExpanded && e.key.toLowerCase() === 'z') {
        this.setExpandMinimap(false);
        return;
      }
      if (e.key !== 'Escape' && this.isBlockingWorldInput()) return;
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        const dock = document.getElementById('voxel-interaction-dock');
        if (!dock.classList.contains('hidden')) {
          document.getElementById('btn-trigger-action').click();
        }
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleMinimapCollapse();
      }
      if (e.key === 'z' || e.key === 'Z') {
        this.toggleExpandMinimap();
      }
      if (e.key === 'r' || e.key === 'R') {
        this.setNavigationVisible(!this.navigationVisible);
      }
      if (e.key === 'Escape') {
        if (this.isMinimapExpanded) {
          this.setExpandMinimap(false);
        } else {
          this.closeAllModals();
        }
      }
    });

    // 道路收合/展開按鈕
    const roadsBtn = document.getElementById('btn-toggle-roads');
    if (roadsBtn) {
      roadsBtn.addEventListener('click', () => {
        this.setNavigationVisible(!this.navigationVisible);
      });
    }
  }

  setNavigationVisible(visible) {
    this.navigationVisible = visible;
    if (this.game.signposts) this.game.signposts.group.visible = visible;
    const button = document.getElementById('btn-toggle-roads');
    button.setAttribute('aria-pressed', String(visible));
    button.classList.toggle('navigation-active', visible);
    document.getElementById('roads-toggle-label').textContent = visible ? '收路標' : '路標';
    if (!visible) document.getElementById('corner-nav-hud').classList.add('hidden');
    try { localStorage.setItem('yangming-navigation-visible', String(visible)); } catch (_) {}
  }

  async exportAtlas() {
    const button = document.getElementById('btn-export-atlas');
    button.disabled = true;
    button.textContent = '準備中…';
    try {
      if (!window.YANGMING_ATLAS_HTML) await new Promise((resolve,reject) => {
        const script=document.createElement('script');
        script.src='assets/atlas-export.js?v=20260927';
        script.onload=resolve;
        script.onerror=()=>{script.remove();reject(new Error('Atlas load failed'));};
        document.head.appendChild(script);
      });
      const html=window.YANGMING_ATLAS_HTML.replace('/* VISITED_SNAPSHOT */ []',JSON.stringify([...this.visitedSet]));
      const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
      const link=document.createElement('a');link.href=url;link.download='我的陽明山散步圖鑑.html';
      document.body.appendChild(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),60000);
      this.showToast('圖鑑已匯出，含圖片、介紹與目前收錄紀錄。');
    } catch (error) {
      this.showToast('圖鑑暫時無法匯出，請確認圖鑑檔案完整後再試。');
    } finally {
      button.disabled=false;button.textContent='匯出圖鑑';
    }
  }

  setRoadsVisible(visible) {
    this.isRoadsVisible = visible;
    const btn = document.getElementById('btn-toggle-roads');
    const icon = document.getElementById('roads-toggle-icon');
    const label = document.getElementById('roads-toggle-label');
    const hud = document.getElementById('corner-nav-hud');

    if (visible) {
      if (btn) btn.classList.remove('roads-hidden');
      if (icon) icon.textContent = '🛣️';
      if (label) label.textContent = '道路';
      this.showToast('🛣️ 已開啟地面道路與轉角指標牌！');
    } else {
      if (btn) btn.classList.add('roads-hidden');
      if (icon) icon.textContent = '🌱';
      if (label) label.textContent = '綠地';
      if (hud) hud.classList.add('hidden');
      this.showToast('🌱 已收起地面道路與指標牌，開啟純淨綠地模式！');
    }
  }

  /**
   * 小地圖放大/縮小與拖曳平移事件
   */
  bindMinimapInteractions() {
    const btnIn = document.getElementById('btn-minimap-zoom-in');
    const btnOut = document.getElementById('btn-minimap-zoom-out');
    const btnReset = document.getElementById('btn-minimap-zoom-reset');
    const container = document.getElementById('minimap-container');

    btnIn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.changeMinimapZoom(0.25);
    });

    btnOut.addEventListener('click', (e) => {
      e.stopPropagation();
      this.changeMinimapZoom(-0.25);
    });

    btnReset.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetMinimapZoom();
    });

    // 支援在小地圖區域使用滑鼠滾輪縮放
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      this.changeMinimapZoom(delta);
    }, { passive: false });

    container.style.touchAction = 'none';
    container.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      this.isPanning = true;
      this.mapDragged = false;
      this.mapPointerStart = [e.clientX, e.clientY];
      this.panStartX = e.clientX - this.minimapPanX;
      this.panStartY = e.clientY - this.minimapPanY;
    });
    window.addEventListener('pointermove', e => {
      if (!this.isPanning) return;
      if (Math.hypot(e.clientX-this.mapPointerStart[0],e.clientY-this.mapPointerStart[1]) > 6) this.mapDragged = true;
      if (!this.mapDragged) return;
      this.minimapPanX = e.clientX - this.panStartX;
      this.minimapPanY = e.clientY - this.panStartY;
      this.applyMinimapTransform();
    });
    const stopPan = () => { this.isPanning = false; };
    window.addEventListener('pointerup', stopPan);
    window.addEventListener('pointercancel', stopPan);
  }

  /**
   * 切換小地圖全景放大模式
   */
  toggleExpandMinimap() {
    this.setExpandMinimap(!this.isMinimapExpanded);
  }

  setExpandMinimap(expanded) {
    this.isMinimapExpanded = expanded;
    if (expanded) this.game.resetInput();
    const card = document.getElementById('voxel-minimap-card');
    const backdrop = document.getElementById('voxel-minimap-backdrop');
    const expandBtn = document.getElementById('btn-minimap-expand');

    if (this.isMinimapExpanded) {
      // 確保不是收合狀態
      if (this.isMinimapCollapsed) {
        this.isMinimapCollapsed = false;
        card.classList.remove('collapsed');
        document.getElementById('btn-minimap-toggle-size').innerText = '➖';
        document.getElementById('minimap-btn-label').innerText = '地圖';
      }

      document.getElementById('btn-toggle-minimap').setAttribute('aria-expanded', 'true');
      card.classList.add('expanded');
      backdrop.classList.remove('hidden');
      expandBtn.innerText = '🗗';
      expandBtn.title = '縮回小窗 (按 Z 鍵)';
      this.showToast('已開啟全景大地圖 (按 Z 可縮回小窗)');
    } else {
      card.classList.remove('expanded');
      backdrop.classList.add('hidden');
      expandBtn.innerText = '🔍';
      expandBtn.title = '放大全景地圖 (按 Z 鍵)';
    }

    // 放大或縮回時重設平移
    this.resetMinimapZoom();
  }

  changeMinimapZoom(delta) {
    let nextZoom = Math.round((this.minimapZoomLevel + delta) * 100) / 100;
    nextZoom = Math.max(0.85, Math.min(6, nextZoom));
    this.minimapZoomLevel = nextZoom;
    this.applyMinimapTransform();
  }

  resetMinimapZoom() {
    this.minimapZoomLevel = 1.0;
    this.minimapPanX = 0;
    this.minimapPanY = 0;
    this.applyMinimapTransform();
  }

  applyMinimapTransform() {
    const limit = document.getElementById('minimap-container').clientWidth * Math.max(0, this.minimapZoomLevel - 1) / 2;
    this.minimapPanX = Math.max(-limit, Math.min(limit, this.minimapPanX));
    this.minimapPanY = Math.max(-limit, Math.min(limit, this.minimapPanY));
    const layer = document.getElementById('minimap-transform-layer');
    const zoomText = document.getElementById('minimap-zoom-text');
    if (layer) {
      layer.style.transform = `translate(${this.minimapPanX}px, ${this.minimapPanY}px) scale(${this.minimapZoomLevel})`;
    }
    if (zoomText) {
      zoomText.innerText = `${Math.round(this.minimapZoomLevel * 100)}%`;
    }
  }

  /**
   * 即時更新小地圖上的玩家紅點與方位文字、臉朝向箭頭 (每一幀由 VoxelGame 調用)
   */
  update(playerPos, playerYaw) {
    if (!playerPos) return;

    // 將 3D 空間坐標轉換為 2D 水彩地圖坐標
    const map = this.game.roadNetwork.worldToMap(playerPos.x, playerPos.z);
    const p2dX = map.x;
    const p2dY = map.y;

    const leftPct = Math.max(0, Math.min(100, (p2dX / 1024) * 100));
    const topPct = Math.max(0, Math.min(100, (p2dY / 1024) * 100));

    // 更新紅點位置
    const dot = document.getElementById('minimap-player-dot');
    if (dot) {
      dot.style.left = `${leftPct.toFixed(2)}%`;
      dot.style.top = `${topPct.toFixed(2)}%`;
    }

    // 更新面朝方向箭頭 (deg: 0deg 為向北/向上)
    const arrow = document.getElementById('minimap-player-arrow');
    if (arrow && typeof playerYaw === 'number') {
      const deg = 180 - (playerYaw * 180 / Math.PI);
      arrow.style.transform = `translate(-50%, -100%) rotate(${deg.toFixed(1)}deg)`;
    }

    // 更新坐標文字
    const coordsEl = document.getElementById('minimap-coords');
    if (coordsEl) {
      coordsEl.innerText = '北 ↑ · 實際道路';
    }

    // 自動判斷當前五大生活分區
    const badge = document.getElementById('minimap-district-badge');
    if (badge) {
      const districtName = '陽明里・陽明山';
      badge.innerText = districtName;
    }
  }

  setProximityStatus(landmark, nearChief) {
    this.currentNearbyLandmark = landmark;
    this.isNearChief = nearChief;

    const dock = document.getElementById('voxel-interaction-dock');
    const icon = document.getElementById('action-btn-icon');
    const text = document.getElementById('action-btn-text');

    if (nearChief) {
      icon.innerHTML = '🔍💬';
      text.innerText = '找里長聊天';
      dock.classList.remove('hidden');
    } else if (landmark) {
      icon.innerHTML = '🔍🔍';
      text.innerText = `調查：${landmark.name}`;
      dock.classList.remove('hidden');
    } else {
      dock.classList.add('hidden');
    }
  }

  openStoryModal(landmark) {
    this.activeStoryLandmark = landmark;
    this.game.resetInput();
    const modal = document.getElementById('modal-story');
    const tag = document.getElementById('story-tag');
    const title = document.getElementById('story-title');
    const desc = document.getElementById('story-desc');
    const img = document.getElementById('story-thumb-img');
    const btnCollect = document.getElementById('btn-collect-landmark');

    tag.innerText = `${landmark.category} · ${landmark.districtName}`;
    title.innerText = `${landmark.code} ${landmark.name}`;
    desc.innerText = landmark.description;

    img.src = `./assets/icons/${landmark.id}.png`;
    img.onerror = () => {
      img.src = './assets/map_clean_reference.jpg';
    };

    if (this.visitedSet.has(landmark.id)) {
      btnCollect.innerText = '已在圖鑑中 ✓';
      btnCollect.classList.add('collected');
    } else {
      btnCollect.innerText = '收錄到圖鑑';
      btnCollect.classList.remove('collected');
    }

    modal.classList.remove('hidden');
  }

  closeStoryModal() {
    document.getElementById('modal-story').classList.add('hidden');
  }

  collectLandmark(landmark) {
    if (!this.visitedSet.has(landmark.id)) {
      this.visitedSet.add(landmark.id);
      this.saveProgress();
      this.updateAlbumStats();

      // 小地圖標記打勾
      const dotWrap = document.getElementById(`minimap-dot-${landmark.id}`);
      if (dotWrap) dotWrap.classList.add('visited');

      this.showToast(`✨ 成功收錄「${landmark.name}」到圖鑑！`);
    }
    this.closeStoryModal();
  }

  openChiefModal() {
    this.game.resetInput();
    document.getElementById('modal-chief').classList.remove('hidden');
  }

  closeChiefModal() {
    document.getElementById('modal-chief').classList.add('hidden');
  }

  openAlbumModal() {
    this.game.resetInput();
    this.renderAlbumList();
    document.getElementById('modal-album').classList.remove('hidden');
  }

  closeAlbumModal() {
    document.getElementById('modal-album').classList.add('hidden');
  }

  closeAllModals() {
    ['modal-story', 'modal-album', 'modal-chief'].forEach(id => {
      document.getElementById(id).classList.add('hidden');
    });
    this.setExpandMinimap(false);
  }

  updateAlbumStats() {
    const total = LANDMARKS.length;
    const count = this.visitedSet.size;
    const countEl = document.getElementById('album-counter');
    if (countEl) countEl.innerText = `${count}/${total}`;

    const progBar = document.getElementById('album-progress-bar');
    if (progBar) progBar.style.width = `${(count / total) * 100}%`;

    const progText = document.getElementById('album-progress-text');
    if (progText) progText.innerText = `已收錄 ${count} / ${total} 處地標 (${Math.round((count / total) * 100)}%)`;
  }

  renderAlbumList() {
    const listScroll = document.getElementById('album-list-scroll');
    if (!listScroll) return;
    listScroll.innerHTML = '';

    const districts = [
      { key: 'central', title: '【中央】山仔后生活核心 (6處)' },
      { key: 'north', title: '【北區】草山歷史官舍 (7處)' },
      { key: 'west', title: '【西區】華岡美軍生活圈 (8處)' },
      { key: 'east', title: '【東區】建業學園與生態 (4處)' },
      { key: 'south', title: '【南區】花卉信仰與門戶 (5處)' }
    ];

    for (const lm of LANDMARKS) {
      if (!districts.some(d => d.key === lm.district)) districts.push({key:lm.district, title:lm.districtName + ' (0處)'});
    }
    districts.forEach(dist => {
      const query = document.getElementById('landmark-search').value.trim().toLocaleLowerCase();
      const unvisited = document.getElementById('only-unvisited').checked;
      const region = document.getElementById('landmark-region').value;
      const distLandmarks = LANDMARKS.filter(lm => lm.district === dist.key && (region === 'all' || lm.district === region) && (!unvisited || !this.visitedSet.has(lm.id)) && (lm.name + lm.code).toLocaleLowerCase().includes(query));
      if (distLandmarks.length === 0) return;

      const groupDiv = document.createElement('div');
      groupDiv.className = 'voxel-album-group';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'voxel-album-dist-title';
      titleDiv.innerText = dist.title.replace(/\(\d+處\)/, `(${distLandmarks.length}處)`);
      groupDiv.appendChild(titleDiv);

      distLandmarks.forEach(item => {
        const isVisited = this.visitedSet.has(item.id);
        const itemRow = document.createElement('div');
        itemRow.className = `voxel-album-item ${isVisited ? 'visited' : 'unvisited'}`;
        itemRow.innerHTML = `
          <div class="item-left">
            <span class="item-code-badge ${isVisited ? 'code-visited' : 'code-unvisited'}">${item.code}</span>
            <span class="item-name">${item.name}</span>
          </div>
          <div class="item-status">
            ${isVisited ? '<span class="status-checked">✓</span>' : '<span class="status-pending">未到訪</span>'}
          </div>
        `;

        itemRow.addEventListener('click', () => {
          this.closeAlbumModal();
          this.openStoryModal(item);
        });

        groupDiv.appendChild(itemRow);
      });

      listScroll.appendChild(groupDiv);
    });
    if (!listScroll.children.length) listScroll.textContent = '找不到符合的地標，試試其他名稱或取消篩選。';
  }

  triggerViewModeCycle() {
    const nextMode = this.game.cycleViewMode();
    const iconEl = document.getElementById('view-mode-icon');
    const labelEl = document.getElementById('view-mode-name');
    if (iconEl) iconEl.innerText = nextMode.icon;
    if (labelEl) labelEl.innerText = nextMode.shortName;

    this.showToast(`已切換視角：${nextMode.name}`);
  }

  showToast(msg) {
    const toast = document.getElementById('voxel-toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.remove('hidden');

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 1500);
  }
}
