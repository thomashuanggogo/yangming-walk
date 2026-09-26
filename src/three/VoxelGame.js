/**
 * 陽明里漫步 3D 方塊版 - 遊戲主核心 (VoxelGame.js)
 * 整合 Three.js 渲染管線、角色跟隨鏡頭、點擊尋路、鍵盤控制與地標距離感測
 */
import * as THREE from '../../assets/three.module.js';
import { VoxelCharacter } from './VoxelCharacter.js';
import { VoxelTerrain } from './VoxelTerrain.js';
import { VoxelBuildings } from './VoxelBuildings.js';
import { VoxelUI } from './VoxelUI.js';

export class VoxelGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();

    // 鍵盤狀態
    this.keys = { forward: false, backward: false, left: false, right: false };

    // 視角模式定義 (斜俯視 45°、沉浸平視、上空俯視)
    this.viewModes = [
      {
        id: 'iso',
        name: '45° 斜俯視',
        shortName: '斜視',
        icon: '📐',
        offset: new THREE.Vector3(0, 11, 13),
        lookAtOffsetY: 1.2
      },
      {
        id: 'eye',
        name: '沉浸平視',
        shortName: '平視',
        icon: '👀',
        offset: new THREE.Vector3(0, 2.5, 5.0),
        lookAtOffsetY: 1.6
      },
      {
        id: 'top',
        name: '上空俯視',
        shortName: '俯視',
        icon: '🦅',
        offset: new THREE.Vector3(0, 36, 4),
        lookAtOffsetY: 0
      }
    ];
    this.currentViewIndex = 0;
    this.targetOffset = this.viewModes[0].offset.clone();
    this.cameraOffset = this.targetOffset.clone();
    this.currentLookAtY = this.viewModes[0].lookAtOffsetY;
    this.cameraTarget = new THREE.Vector3();
    this.cameraYaw = 0; // 水平視角偏角

    this.initScene();
    this.initLights();
    this.initWorld();
    this.initControls();
    this.initRaycaster();

    // 初始鏡頭立刻精準對準主角小人
    this.cameraTarget.copy(this.player.group.position);
    this.camera.position.copy(this.cameraTarget).add(this.cameraOffset);
    this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y + this.currentLookAtY, this.cameraTarget.z);

    this.ui = new VoxelUI(this);

    // 啟動主迴圈
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initScene() {
    this.scene = new THREE.Scene();
    // 溫暖明亮的陽明山天藍色背景與遠景柔霧 (近處無霧干擾)
    this.scene.background = new THREE.Color(0xa7d8ff);
    this.scene.fog = new THREE.Fog(0xa7d8ff, 35, 120);

    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    // 視角 45 度俯角，如截圖
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  initLights() {
    // 柔和自然環境光 (避免過曝死白)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(ambientLight);

    // 太陽斜射光
    this.sunLight = new THREE.DirectionalLight(0xfff8eb, 0.65);
    this.sunLight.position.set(30, 45, 25);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 5;
    this.sunLight.shadow.camera.far = 120;
    this.sunLight.shadow.camera.left = -40;
    this.sunLight.shadow.camera.right = 40;
    this.sunLight.shadow.camera.top = 40;
    this.sunLight.shadow.camera.bottom = -40;
    this.sunLight.shadow.bias = -0.001;
    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);
  }

  initWorld() {
    // 1. 地形、步道與自然景觀
    this.terrain = new VoxelTerrain(this.scene);

    // 2. 30 處地標與特色體素建築 (麥當勞、派出所、7-11、美軍宿舍群等)
    this.buildings = new VoxelBuildings(this.scene);

    // 3. 玩家主角方塊小人 (青綠色上衣、深藍長褲，還原截圖 4)
    this.player = new VoxelCharacter({
      shirtColor: 0x2a9d8f,
      pantsColor: 0x264653,
      isNpc: false
    });
    // 起點位置：開闊草地前庭，視野通透 (如截圖 4 與 5)
    this.player.group.position.set(-8, 0, 15);
    this.scene.add(this.player.group);

    // 4. 里長 NPC (棕色外套、深色長褲，站在主角身邊歡迎玩家，還原截圖 5)
    this.chiefNpc = new VoxelCharacter({
      shirtColor: 0x6b4226,
      pantsColor: 0x333333,
      isNpc: true,
      name: '里長 黃裕倉'
    });
    this.chiefNpc.group.position.set(-5.5, 0, 14.2);
    this.chiefNpc.group.rotation.y = -Math.PI / 3;
    this.scene.add(this.chiefNpc.group);
  }

  initControls() {
    // 鍵盤移動監聽
    window.addEventListener('keydown', (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.forward = true;
          break;
        case 's':
        case 'arrowdown':
          this.keys.backward = true;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = true;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = true;
          break;
        case 'v':
        case 'c':
          this.ui.triggerViewModeCycle();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.forward = false;
          break;
        case 's':
        case 'arrowdown':
          this.keys.backward = false;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = false;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = false;
          break;
      }
    });

    // 拖曳旋轉視野 (滑鼠右鍵或手機單指橫向拖曳)
    let isDragging = false;
    let lastX = 0;

    const onPointerDown = (e) => {
      if (e.button === 2 || e.touches) {
        isDragging = true;
        lastX = e.clientX || (e.touches && e.touches[0].clientX);
      }
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const currentX = e.clientX || (e.touches && e.touches[0].clientX);
      const deltaX = currentX - lastX;
      lastX = currentX;
      this.cameraYaw -= deltaX * 0.006;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    this.canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  initRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    // 點擊地面移動 (Tap to move - 還原提示「用手指點一下地面，小人就會走過去」)
    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    const handlePointerTap = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects(this.terrain.clickableObjects, true);

      if (intersects.length > 0) {
        const hitPoint = intersects[0].point;
        // 小人走向點擊位置
        this.player.moveTo(hitPoint.x, hitPoint.z);
        // 地面擴散光圈漣漪
        this.terrain.spawnRipple(hitPoint.x, hitPoint.z);
      }
    };

    // 滑鼠點擊
    this.canvas.addEventListener('click', (e) => {
      if (e.button === 0) {
        handlePointerTap(e.clientX, e.clientY);
      }
    });

    // 觸控點擊 (過濾長按拖曳，保留輕點)
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartTime = Date.now();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const duration = Date.now() - touchStartTime;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const dist = Math.hypot(dx, dy);

        // 若短時間且位移極小，視為點擊地面尋路
        if (duration < 300 && dist < 15) {
          handlePointerTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      }
    });
  }

  teleportToEntrance() {
    // 快速傳送回起點入口
    this.player.stop();
    this.player.group.position.set(-8, 0, 15);
    this.player.group.rotation.y = 0;
    this.cameraYaw = 0;
    this.terrain.spawnRipple(-8, 15);
  }

  teleportToLandmark(landmark) {
    const item = this.buildings.landmarksWith3D.find(l => l.data.id === landmark.id);
    if (item) {
      this.player.stop();
      this.player.group.position.set(item.worldX, 0, item.worldZ + 4);
      this.player.group.rotation.y = Math.PI;
      this.terrain.spawnRipple(item.worldX, item.worldZ + 4);
    }
  }

  handleKeyboardMove(delta) {
    const moveDir = new THREE.Vector3();

    // 根據相機目前旋轉視角計算前後左右方向
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);

    if (this.keys.forward) moveDir.add(forward);
    if (this.keys.backward) moveDir.sub(forward);
    if (this.keys.left) moveDir.sub(right);
    if (this.keys.right) moveDir.add(right);

    if (moveDir.lengthSq() > 0.001) {
      moveDir.normalize();
      this.player.stop(); // 停止點擊尋路，改由鍵盤接手
      this.player.isMoving = true;

      const moveStep = this.player.speed * delta;
      this.player.group.position.addScaledVector(moveDir, moveStep);

      // 面向移動方向
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let diff = targetAngle - this.player.group.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.player.group.rotation.y += diff * Math.min(1, delta * 15);
    } else if (!this.player.targetPos) {
      this.player.isMoving = false;
    }
  }

  updateProximity() {
    const playerPos = this.player.group.position;

    // 1. 檢測與里長 NPC 的距離
    const chiefDist = playerPos.distanceTo(this.chiefNpc.group.position);
    const nearChief = chiefDist < 4.2;

    // 2. 檢測與 30 處地標的距離
    let nearestLandmark = null;
    let minDistance = 9.0; // 感測閾值

    for (const item of this.buildings.landmarksWith3D) {
      const dist = playerPos.distanceTo(item.position);
      if (dist < minDistance) {
        minDistance = dist;
        nearestLandmark = item.data;
      }
    }

    // 更新 UI 浮動互動按鈕 (調查 / 聊天)
    this.ui.setProximityStatus(nearestLandmark, nearChief);
  }

  cycleViewMode() {
    this.currentViewIndex = (this.currentViewIndex + 1) % this.viewModes.length;
    const currentMode = this.viewModes[this.currentViewIndex];
    this.targetOffset.copy(currentMode.offset);
    return currentMode;
  }

  getCurrentViewMode() {
    return this.viewModes[this.currentViewIndex];
  }

  updateCamera() {
    // 平滑鏡頭越肩跟隨主角
    const playerPos = this.player.group.position;
    this.cameraTarget.lerp(playerPos, 0.08);

    // 平滑過渡視角 Offset 與 LookAt 高度
    const curMode = this.viewModes[this.currentViewIndex];
    this.cameraOffset.lerp(this.targetOffset, 0.08);
    this.currentLookAtY = THREE.MathUtils.lerp(this.currentLookAtY, curMode.lookAtOffsetY, 0.08);

    // 根據視角偏角計算鏡頭 offset
    const rotatedOffset = this.cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
    const targetCameraPos = this.cameraTarget.clone().add(rotatedOffset);

    this.camera.position.lerp(targetCameraPos, 0.08);
    this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y + this.currentLookAtY, this.cameraTarget.z);

    // 讓陽光平行跟隨主角，保證陰影精緻細膩
    this.sunLight.position.set(playerPos.x + 30, 45, playerPos.z + 25);
    this.sunLight.target.position.copy(playerPos);
    this.sunLight.target.updateMatrixWorld();
  }

  resize(width, height) {
    if (this.camera && this.renderer) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    // 鍵盤移動
    this.handleKeyboardMove(delta);

    // 角色動畫更新
    this.player.update(delta);
    this.chiefNpc.update(delta);

    // 地景與建築更新 (漣漪淡出、引導晶石浮動)
    this.terrain.update(delta);
    this.buildings.update(delta, time);

    // 距離感測
    this.updateProximity();

    // 鏡頭跟隨
    this.updateCamera();

    // 渲染場景
    this.renderer.render(this.scene, this.camera);
  }
}
