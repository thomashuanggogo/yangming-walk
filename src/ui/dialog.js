import { CuteHouseRenderer } from "../world/cute_houses.js";
import { LANDMARKS } from "../world/landmarks.js";
import { NpcManager } from "../entities/npc.js";

/**
 * UI 與文化導覽卡片管理器
 * 負責彈窗對話、文化知識卡片、榮譽里民證書與社群分享
 */
export class UIManager {
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
