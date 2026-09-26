/**
 * 陽明里漫步 3D 方塊版 - 介面與互動系統模組 (VoxelUI.js)
 * 1:1 還原 5 張截圖中的：
 * 1. 頂部「陽明里漫步 3D 方塊版」與「圖鑑 X/30」
 * 2. 底部「👇 用手指點一下地面，小人就會走過去」
 * 3. 靠近時彈出的「🔍🔍 調查：[地標名稱]」與「🔍💬 找里長聊天」
 * 4. 奶白色地標故事卡彈窗 (收錄到圖鑑/關閉)
 * 5. 圖鑑列表彈窗 (進度條、分區展開、未到訪/已到訪✓)
 * 6. 右下角「📍 入口」傳送按鈕
 */
import { LANDMARKS } from '../world/landmarks.js';

export class VoxelUI {
  constructor(game) {
    this.game = game;
    this.visitedSet = new Set();
    this.currentNearbyLandmark = null;
    this.isNearChief = false;

    this.loadProgress();
    this.initDOM();
    this.bindEvents();
    this.updateAlbumStats();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('yangming_3d_visited');
      if (saved) {
        const arr = JSON.parse(saved);
        arr.forEach(id => this.visitedSet.add(id));
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
    // 建立 3D 方塊版專屬 UI 容器
    const container = document.createElement('div');
    container.id = 'voxel-ui-container';
    container.innerHTML = `
      <!-- 左上角遊戲標題 -->
      <div class="voxel-badge-title">
        <span class="brick-icon">🧱</span>
        <span class="title-text">陽明里漫步</span>
        <span class="sub-text">3D 方塊版</span>
      </div>

      <!-- 右上角圖鑑與視角按鈕群 -->
      <div class="voxel-album-top-group">
        <!-- 視角切換按鈕 -->
        <button id="btn-toggle-camera-view" class="voxel-btn-view" title="切換鏡頭視角 (按 V 鍵)">
          <span id="view-mode-icon" class="view-icon">📐</span>
          <span id="view-mode-name" class="view-label">斜視</span>
        </button>

        <div id="btn-album-circle" class="voxel-circle-stat" title="開啟圖鑑">
          <span class="stat-book-icon">📖</span>
          <span class="stat-title">圖鑑</span>
          <span id="album-counter" class="stat-count">${this.visitedSet.size}/30</span>
        </div>
        <button id="btn-open-album-card" class="voxel-btn-album">圖鑑</button>
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
        <span class="hand-icon">👇</span> 用手指點一下地面，小人就會走過去
      </div>

      <!-- 靠近互動大按鈕 (動態升起) -->
      <div id="voxel-interaction-dock" class="voxel-interaction-dock hidden">
        <button id="btn-trigger-action" class="voxel-action-btn">
          <span id="action-btn-icon" class="action-icon">🔍🔍</span>
          <span id="action-btn-text" class="action-text">調查：陽明山麥當勞</span>
        </button>
      </div>

      <!-- 地標故事卡彈窗 (還原截圖 2) -->
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
            <button id="btn-collect-landmark" class="voxel-btn-confirm">收錄到圖鑑</button>
            <button id="btn-close-story" class="voxel-btn-cancel">關閉</button>
          </div>
        </div>
      </div>

      <!-- 陽明里文史圖鑑彈窗 (還原截圖 1) -->
      <div id="modal-album" class="voxel-modal-backdrop hidden">
        <div class="voxel-album-card">
          <div class="voxel-album-header">
            <h2 class="voxel-album-title">📖 陽明里文史圖鑑</h2>
            <button id="btn-close-album" class="voxel-close-x">&times;</button>
          </div>
          
          <!-- 進度條 -->
          <div class="voxel-progress-bar-wrap">
            <div id="album-progress-bar" class="voxel-progress-bar" style="width: 0%;"></div>
          </div>
          <div id="album-progress-text" class="voxel-progress-text">已收錄 0 / 30 處地標</div>

          <!-- 分區列表容器 -->
          <div id="album-list-scroll" class="voxel-album-list-scroll">
            <!-- 動態注入分區與 30 處地標條目 -->
          </div>
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
            這座 3D 方塊世界收錄了全里 <strong>30 處精選核心地標</strong>！只要漫步走近建築物，點擊『調查』就能認識每處歷史故事並收錄進圖鑑。<br><br>
            快去探索吧，如果迷路了，隨時點擊右下角『📍 入口』我就在這裡等你！」
          </p>
          <div class="voxel-story-actions">
            <button id="btn-close-chief" class="voxel-btn-confirm">收到，出發探索！</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
  }

  bindEvents() {
    // 視角切換按鈕
    document.getElementById('btn-toggle-camera-view').addEventListener('click', () => {
      this.triggerViewModeCycle();
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
      if (this.currentNearbyLandmark) {
        this.collectLandmark(this.currentNearbyLandmark);
      }
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

    // 鍵盤 E / 空白鍵快速互動
    window.addEventListener('keydown', (e) => {
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        const dock = document.getElementById('voxel-interaction-dock');
        if (!dock.classList.contains('hidden')) {
          document.getElementById('btn-trigger-action').click();
        }
      }
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
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
    const modal = document.getElementById('modal-story');
    const tag = document.getElementById('story-tag');
    const title = document.getElementById('story-title');
    const desc = document.getElementById('story-desc');
    const imgWrap = document.getElementById('story-thumb-container');
    const img = document.getElementById('story-thumb-img');
    const btnCollect = document.getElementById('btn-collect-landmark');

    const cat = landmark.category || '文化巡禮';
    const dist = landmark.districtName || '山仔后生活核心';
    tag.innerText = `${cat}・${dist}`;
    title.innerText = `${landmark.code} ${landmark.name}`;
    desc.innerText = landmark.description;

    // 手繪插圖
    const iconPath = `assets/icons/site_${landmark.code}.png`;
    img.src = iconPath;
    img.onerror = () => { imgWrap.style.display = 'none'; };
    img.onload = () => { imgWrap.style.display = 'block'; };

    if (this.visitedSet.has(landmark.id)) {
      btnCollect.innerText = '✓ 已收錄到圖鑑';
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
    this.visitedSet.add(landmark.id);
    this.saveProgress();
    this.updateAlbumStats();

    const btnCollect = document.getElementById('btn-collect-landmark');
    btnCollect.innerText = '✓ 已成功收錄！';
    btnCollect.classList.add('collected');

    // 觸發音效或畫面光效
    setTimeout(() => {
      this.closeStoryModal();
    }, 400);
  }

  openChiefModal() {
    document.getElementById('modal-chief').classList.remove('hidden');
  }

  closeChiefModal() {
    document.getElementById('modal-chief').classList.add('hidden');
  }

  openAlbumModal() {
    this.renderAlbumList();
    document.getElementById('modal-album').classList.remove('hidden');
  }

  closeAlbumModal() {
    document.getElementById('modal-album').classList.add('hidden');
  }

  closeAllModals() {
    document.getElementById('modal-story').classList.add('hidden');
    document.getElementById('modal-album').classList.add('hidden');
    document.getElementById('modal-chief').classList.add('hidden');
  }

  updateAlbumStats() {
    const count = this.visitedSet.size;
    const total = 30;
    const pct = Math.round((count / total) * 100);

    const counter = document.getElementById('album-counter');
    if (counter) counter.innerText = `${count}/${total}`;

    const progBar = document.getElementById('album-progress-bar');
    if (progBar) progBar.style.width = `${pct}%`;

    const progText = document.getElementById('album-progress-text');
    if (progText) progText.innerText = `已收錄 ${count} / ${total} 處地標`;
  }

  renderAlbumList() {
    const listScroll = document.getElementById('album-list-scroll');
    if (!listScroll) return;

    listScroll.innerHTML = '';

    // 依分區分組
    const districts = [
      { key: 'central', title: '中央・山仔后生活核心' },
      { key: 'north', title: '北區・草山歷史官舍' },
      { key: 'east', title: '東區・美軍眷舍與文化聚落' },
      { key: 'west', title: '西區・文化大學學園' },
      { key: 'south', title: '南區・花卉試驗中心與愛富街區' }
    ];

    districts.forEach(dist => {
      const distLandmarks = LANDMARKS.filter(item => {
        if (dist.key === 'central') return item.district === 'central';
        if (dist.key === 'north') return item.district === 'north';
        if (dist.key === 'east') return item.district === 'east';
        if (dist.key === 'west') return item.district === 'west';
        if (dist.key === 'south') return item.district === 'south';
        return true;
      });

      if (distLandmarks.length === 0) return;

      const groupDiv = document.createElement('div');
      groupDiv.className = 'voxel-album-group';

      // 分區標題膠囊
      const titleDiv = document.createElement('div');
      titleDiv.className = 'voxel-album-dist-title';
      titleDiv.innerText = dist.title;
      groupDiv.appendChild(titleDiv);

      // 條目列表
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

        // 點擊項目時彈出詳細故事或快速前往
        itemRow.addEventListener('click', () => {
          this.closeAlbumModal();
          this.openStoryModal(item);
        });

        groupDiv.appendChild(itemRow);
      });

      listScroll.appendChild(groupDiv);
    });
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
