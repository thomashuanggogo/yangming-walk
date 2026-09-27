/**
 * 陽明里漫步 3D 方塊版 - 遊戲主核心 (VoxelGame.js)
 * 整合 Three.js 渲染管線、角色跟隨鏡頭、點擊尋路、鍵盤控制與地標距離感測
 */
import * as THREE from '../../assets/three.module.js';
import { VoxelCharacter } from './VoxelCharacter.js';
import { VoxelTerrain } from './VoxelTerrain.js';
import { VoxelBuildings } from './VoxelBuildings.js';
import { RoadSignposts } from './RoadSignposts.js';
import { VoxelUI } from './VoxelUI.js';
import { RoadNetwork } from './RoadNetwork.js';

export class VoxelGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();

    // 鍵盤狀態
    this.keys = { forward: false, backward: false, left: false, right: false };

    // 視角模式配置 (斜俯視 45°、沉浸平視、上空俯視)
    this.viewModes = [
      {
        id: 'iso',
        name: '45° 斜俯視',
        shortName: '斜視',
        icon: '📐',
        pitch: 0.82,     // 約 47 度俯角
        distance: 24,    // 舒適視距
        lookAtOffsetY: 1.2
      },
      {
        id: 'eye',
        name: '沉浸平視',
        shortName: '平視',
        icon: '👀',
        pitch: 1.35,     // 約 77 度，平視街道與門面
        distance: 7.5,   // 近身視距
        lookAtOffsetY: 1.6
      },
      {
        id: 'top',
        name: '上空俯視',
        shortName: '俯視',
        icon: '🦅',
        pitch: 0.15,     // 約 8 度，高空垂直俯視
        distance: 38,    // 沙盤高空
        lookAtOffsetY: 0
      }
    ];
    this.currentViewIndex = 0;

    // 球面相機參數 (支援滑鼠 360 度水平旋轉、垂直俯仰、滾輪縮放)
    const initialMode = this.viewModes[0];
    this.cameraYaw = 0;
    this.cameraPitch = initialMode.pitch;
    this.cameraDistance = initialMode.distance;
    this.targetPitch = initialMode.pitch;
    this.targetDistance = initialMode.distance;
    this.currentLookAtY = initialMode.lookAtOffsetY;
    this.cameraTarget = new THREE.Vector3();
    this.roadsVisible = true;

    this.initScene();
    this.initLights();
    this.initWorld();
    this.initControls();

    // 初始鏡頭精準就位對準主角小人
    this.cameraTarget.copy(this.player.group.position);
    const initDist = this.cameraDistance;
    const initPitch = this.cameraPitch;
    const initYaw = this.cameraYaw;
    this.camera.position.set(
      this.cameraTarget.x + initDist * Math.sin(initPitch) * Math.sin(initYaw),
      this.cameraTarget.y + initDist * Math.cos(initPitch),
      this.cameraTarget.z + initDist * Math.sin(initPitch) * Math.cos(initYaw)
    );
    this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y + this.currentLookAtY, this.cameraTarget.z);

    this.ui = new VoxelUI(this);
    const requestedCode = new URLSearchParams(window.location.search).get('landmark');
    const requestedPlace = this.buildings.landmarksWith3D.find(item => item.data.code === requestedCode);
    if (requestedPlace) this.teleportToLandmark(requestedPlace.data);

    // 啟動主迴圈
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initScene() {
    this.scene = new THREE.Scene();
    // 溫暖明亮的陽明山天藍色背景與遠景柔霧 (近處無霧干擾)
    this.scene.background = new THREE.Color(0xa7d8ff);
    this.scene.fog = new THREE.Fog(0xa7d8ff, 60, 180);

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
    // 溫暖明亮的環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambientLight);

    // 陽明山天際半球光 (天頂天空藍 + 地面反光草綠)
    const hemiLight = new THREE.HemisphereLight(0xe8f4f8, 0x8cb369, 0.25);
    this.scene.add(hemiLight);

    // 太陽斜射明亮暖光
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 0.55);
    this.sunLight.position.set(35, 50, 30);
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
    this.roadNetwork = new RoadNetwork();
    this.terrain = new VoxelTerrain(this.scene, this.roadNetwork, this.renderer.capabilities.maxTextureSize);

    // 2. 30 處地標與特色體素建築 (麥當勞、派出所、7-11、美軍宿舍群等)
    this.buildings = new VoxelBuildings(this.scene, this.roadNetwork);
    this.signposts = new RoadSignposts(this.scene, this.roadNetwork);
    this.entrance = this.roadNetwork.placements.get('site_01').entrance;

    // 3. 玩家主角方塊小人 (青綠色上衣、深藍長褲，還原截圖 4)
    this.player = new VoxelCharacter({
      shirtColor: 0x2a9d8f,
      pantsColor: 0x264653,
      isNpc: false
    });
    // 起點位置：開闊草地前庭，視野通透 (如截圖 4 與 5)
    this.player.group.position.set(this.entrance[0], 0, this.entrance[1]);
    this.scene.add(this.player.group);

    // 4. 里長 NPC (棕色外套、深色長褲，站在主角身邊歡迎玩家，還原截圖 5)
    this.chiefNpc = new VoxelCharacter({
      shirtColor: 0x6b4226,
      pantsColor: 0x333333,
      isNpc: true,
      name: '里長 黃裕倉'
    });
    this.chiefNpc.group.position.set(this.entrance[0] + 2.5, 0, this.entrance[1] + 1.5);
    this.chiefNpc.group.rotation.y = -Math.PI / 3;
    this.scene.add(this.chiefNpc.group);
  }

  resetInput() {
    Object.keys(this.keys).forEach(key => { this.keys[key] = false; });
    this.player.stop();
    if (this.cancelPointer) this.cancelPointer();
  }

  initControls() {
    // 鍵盤移動監聽
    window.addEventListener('keydown', (e) => {
      if (e.target?.closest('input, textarea, select, [contenteditable]') || this.ui?.isBlockingWorldInput()) return;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) e.preventDefault();
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
          if (!e.repeat) this.ui.triggerViewModeCycle();
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

    // === 滑鼠與觸控統一互動 (按住拖曳旋轉視野 / 輕點地面尋路漫步) ===
    let isPointerDown = false;
    let hasDragged = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let startTime = 0;
    let pointerButton = 0;
    let activePointerId = null;
    this.cancelPointer = () => { isPointerDown = false; activePointerId = null; };
    window.addEventListener('blur', () => this.resetInput());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.resetInput();
    });
    window.addEventListener('pointercancel', () => this.resetInput());

    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeHit = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const doTapMove = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, this.camera);
      if (raycaster.ray.intersectPlane(groundPlane, planeHit)) {
        const hitX = THREE.MathUtils.clamp(planeHit.x, -this.roadNetwork.halfSize + 2, this.roadNetwork.halfSize - 2);
        const hitZ = THREE.MathUtils.clamp(planeHit.z, -this.roadNetwork.halfSize + 2, this.roadNetwork.halfSize - 2);
        this.player.moveTo(hitX, hitZ);
        this.terrain.spawnRipple(hitX, hitZ);
      }
    };

    window.addEventListener('pointerdown', (e) => {
      if (e.target !== this.canvas || this.ui?.isBlockingWorldInput() || activePointerId !== null) return;
      activePointerId = e.pointerId;
      // 點在 UI 卡片或按鈕上不啟動拖曳或尋路
      if (e.target && e.target.closest('button, .voxel-action-btn, .voxel-story-card, .voxel-album-card, .voxel-circle-stat, .voxel-btn-view, .voxel-badge-title')) {
        return;
      }

      isPointerDown = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      startTime = Date.now();
      pointerButton = e.button;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isPointerDown || e.pointerId !== activePointerId) return;

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      const totalDist = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (totalDist > 5) {
        hasDragged = true;
      }

      if (hasDragged) {
        // 水平 360 度旋轉 (Yaw)
        this.cameraYaw -= deltaX * 0.007;
        // 垂直俯仰 (Pitch) - 限制在 0.12 (俯視) 到 1.45 (接近水平) 之間
        this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch + deltaY * 0.006, 0.12, 1.45);
        this.targetPitch = this.cameraPitch;
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (!isPointerDown || e.pointerId !== activePointerId) return;
      isPointerDown = false;
      activePointerId = null;
      if (this.ui?.isBlockingWorldInput()) return;

      const totalDist = Math.hypot(e.clientX - startX, e.clientY - startY);
      const duration = Date.now() - startTime;

      // 若未拖曳（位移 < 8px 且時間在 600ms 內），且按的是左鍵或手指輕點，觸發點擊地面漫步！
      if (!hasDragged && totalDist < 8 && duration < 600 && pointerButton === 0) {
        doTapMove(e.clientX, e.clientY);
      }
    });

    // 支援滑鼠滾輪縮放視野 (Zoom In / Zoom Out)
    this.canvas.addEventListener('wheel', (e) => {
      if (this.ui?.isBlockingWorldInput()) return;
      this.targetDistance = THREE.MathUtils.clamp(this.targetDistance + e.deltaY * 0.025, 4.5, 60);
    }, { passive: true });

    // 防止右鍵選單彈出干擾旋轉
    window.addEventListener('contextmenu', (e) => {
      if (!e.target.closest('input, textarea')) {
        e.preventDefault();
      }
    });
  }

  teleportToEntrance() {
    this.resetInput();
    // 快速傳送回起點入口
    this.player.stop();
    this.player.group.position.set(this.entrance[0], 0, this.entrance[1]);
    this.player.group.rotation.y = 0;
    this.cameraTarget.copy(this.player.group.position);
    this.cameraYaw = 0;
    this.terrain.spawnRipple(this.entrance[0], this.entrance[1]);
    const mode = this.getCurrentViewMode();
    this.targetDistance = mode.distance;
    this.targetPitch = mode.pitch;
  }

  teleportToLandmark(landmark) {
    const item = this.buildings.landmarksWith3D.find(l => l.data.id === landmark.id);
    if (item) {
      this.player.stop();
      this.resetInput();
      this.player.group.position.set(item.entrance[0], 0, item.entrance[1]);
      this.cameraTarget.copy(this.player.group.position);
      this.player.group.rotation.y = item.yaw + Math.PI;
      if (landmark.district === 'yangmingshan') {
        this.cameraYaw = item.yaw;
        this.targetDistance = landmark.code === '60' ? 58 : 40;
        this.targetPitch = .85;
      }
      this.terrain.spawnRipple(item.entrance[0], item.entrance[1]);
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
      const limit = this.roadNetwork.halfSize - 2;
      this.player.group.position.x = THREE.MathUtils.clamp(this.player.group.position.x, -limit, limit);
      this.player.group.position.z = THREE.MathUtils.clamp(this.player.group.position.z, -limit, limit);

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
    this.targetPitch = currentMode.pitch;
    this.targetDistance = currentMode.distance;
    return currentMode;
  }

  getCurrentViewMode() {
    return this.viewModes[this.currentViewIndex];
  }

  toggleRoads() {
    this.roadsVisible = !this.roadsVisible;
    if (this.terrain && this.terrain.roadsMesh) {
      this.terrain.roadsMesh.visible = this.roadsVisible;
    }
    if (this.signposts && this.signposts.group) {
      this.signposts.group.visible = this.roadsVisible;
    }
    if (this.ui) {
      this.ui.setRoadsVisible(this.roadsVisible);
    }
    return this.roadsVisible;
  }

  updateCamera() {
    // 平滑鏡頭目標跟隨主角
    const playerPos = this.player.group.position;
    this.cameraTarget.lerp(playerPos, 0.08);

    // 平滑過渡距離、俯仰角與 LookAt 高度
    this.cameraDistance = THREE.MathUtils.lerp(this.cameraDistance, this.targetDistance, 0.08);
    this.cameraPitch = THREE.MathUtils.lerp(this.cameraPitch, this.targetPitch, 0.08);
    const curMode = this.viewModes[this.currentViewIndex];
    this.currentLookAtY = THREE.MathUtils.lerp(this.currentLookAtY, curMode.lookAtOffsetY, 0.08);

    // 球面座標換算相機相對位置 (支援 360 度任意旋轉、俯仰、拉近拉遠)
    const dist = this.cameraDistance;
    const pitch = this.cameraPitch;
    const yaw = this.cameraYaw;

    const offsetX = dist * Math.sin(pitch) * Math.sin(yaw);
    const offsetY = dist * Math.cos(pitch);
    const offsetZ = dist * Math.sin(pitch) * Math.cos(yaw);

    const targetCameraPos = new THREE.Vector3(
      this.cameraTarget.x + offsetX,
      this.cameraTarget.y + offsetY,
      this.cameraTarget.z + offsetZ
    );

    this.camera.position.lerp(targetCameraPos, 0.1);
    this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y + this.currentLookAtY, this.cameraTarget.z);

    // 陽光平行跟隨主角，維持細緻陰影
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
    if (this.ui?.isBlockingWorldInput()) this.resetInput();
    else this.handleKeyboardMove(delta);

    // 角色動畫更新
    this.player.update(delta);
    this.chiefNpc.update(delta);

    // 地景與建築更新 (漣漪淡出、引導晶石浮動)
    this.terrain.update(delta);
    this.buildings.update(delta, time);
    if (this.signposts && this.ui) {
      const cornerNav = this.signposts.update(this.player.group.position, this.player.group.rotation.y);
      this.ui.updateCornerNav(cornerNav);
    }

    // 距離感測
    this.updateProximity();

    // 鏡頭跟隨
    this.updateCamera();

    // 即時更新 UI 小地圖位置與玩家朝向
    if (this.ui && this.ui.update) {
      this.ui.update(this.player.group.position, this.player.group.rotation.y);
    }

    // 渲染場景
    this.renderer.render(this.scene, this.camera);
  }
}
