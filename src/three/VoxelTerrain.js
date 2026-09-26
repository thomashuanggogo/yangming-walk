/**
 * 陽明里漫步 3D 方塊版 - 體素地形與自然景觀模組 (VoxelTerrain.js)
 * 打造台地草階、仰德大道與山仔后街區石板路、方塊樹木與花柱
 */
import * as THREE from '../../assets/three.module.js';

export class VoxelTerrain {
  constructor(scene) {
    this.scene = scene;
    this.clickableObjects = []; // 供 Raycaster 拾取的地面物件
    this.rippleRings = []; // 點擊漣漪特效
    this.materials = this.initMaterials();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.buildTerrain();
    this.buildRoads();
    this.buildNature();
    this.initRippleSystem();
  }

  initMaterials() {
    return {
      grassTop: new THREE.MeshLambertMaterial({ color: 0x6ca942 }),
      grassSide: new THREE.MeshLambertMaterial({ color: 0x5a8f35 }),
      grassHigh: new THREE.MeshLambertMaterial({ color: 0x78ba4c }),
      stoneRoad: new THREE.MeshLambertMaterial({ color: 0xb5b8b1 }),
      asphalt: new THREE.MeshLambertMaterial({ color: 0x55585a }),
      dirtPath: new THREE.MeshLambertMaterial({ color: 0xdfc08f }),
      woodTrunk: new THREE.MeshLambertMaterial({ color: 0x6e4726 }),
      leavesGreen: new THREE.MeshLambertMaterial({ color: 0x3d7e2f }),
      leavesLight: new THREE.MeshLambertMaterial({ color: 0x53993d }),
      leavesSakura: new THREE.MeshLambertMaterial({ color: 0xf49ac2 }),
      lampPost: new THREE.MeshLambertMaterial({ color: 0x2b2d42 }),
      lampBulb: new THREE.MeshBasicMaterial({ color: 0xffd166 }),
      // 花朵顏色
      flowerRed: new THREE.MeshLambertMaterial({ color: 0xe63946 }),
      flowerPink: new THREE.MeshLambertMaterial({ color: 0xf72585 }),
      flowerWhite: new THREE.MeshLambertMaterial({ color: 0xffffff }),
      flowerOrange: new THREE.MeshLambertMaterial({ color: 0xf77f00 }),
      flowerYellow: new THREE.MeshLambertMaterial({ color: 0xffbe0b })
    };
  }

  buildTerrain() {
    // 總基地大地板 (以 0,0 為山仔后核心，範圍大約 280 x 280)
    const baseGeo = new THREE.BoxGeometry(260, 2, 260);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.grassTop);
    baseMesh.position.y = -1;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);
    this.clickableObjects.push(baseMesh);

    // 梯田高低起伏方塊 (階梯等高線台地，符合陽明山地形)
    const terraces = [
      // 北側較高台地 (草山官舍/美軍宿舍F區)
      { x: 0, z: -80, w: 180, d: 70, h: 1.2 },
      { x: -20, z: -95, w: 120, d: 45, h: 2.4 },
      // 東側小丘陵 (美軍宿舍C區/亞尼克方向)
      { x: 75, z: -10, w: 85, d: 110, h: 1.2 },
      { x: 90, z: -20, w: 50, d: 70, h: 2.4 },
      // 西側往文大下坡段
      { x: -80, z: 20, w: 75, d: 100, h: -0.6 },
      // 南側花卉試驗中心與愛富二街台地
      { x: 10, z: 75, w: 160, d: 80, h: 1.0 },
      { x: 30, z: 90, w: 100, d: 50, h: 2.0 }
    ];

    terraces.forEach(t => {
      const geo = new THREE.BoxGeometry(t.w, Math.abs(t.h) + 2, t.d);
      const mat = t.h > 1.5 ? this.materials.grassHigh : this.materials.grassTop;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(t.x, t.h / 2, t.z);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      this.group.add(mesh);
      this.clickableObjects.push(mesh);
    });

    // 散佈多組微幅起伏草階
    const steps = [
      { x: -35, z: -40, w: 16, d: 14, h: 0.8 },
      { x: -50, z: -35, w: 14, d: 12, h: 1.6 },
      { x: 40, z: -45, w: 20, d: 18, h: 0.8 },
      { x: 55, z: 30, w: 24, d: 20, h: 0.8 },
      { x: -45, z: 50, w: 20, d: 20, h: 0.8 },
      { x: -10, z: -20, w: 14, d: 14, h: 0.6 }
    ];
    steps.forEach(s => {
      const geo = new THREE.BoxGeometry(s.w, s.h, s.d);
      const mesh = new THREE.Mesh(geo, this.materials.grassTop);
      mesh.position.set(s.x, s.h / 2, s.z);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      this.group.add(mesh);
      this.clickableObjects.push(mesh);
    });
  }

  buildRoads() {
    // 仰德大道 / 格致路 (南北走向主幹道)
    const mainRoadGeo = new THREE.BoxGeometry(10, 0.08, 250);
    const mainRoad = new THREE.Mesh(mainRoadGeo, this.materials.asphalt);
    mainRoad.position.set(0, 0.04, 0);
    mainRoad.receiveShadow = true;
    this.group.add(mainRoad);
    this.clickableObjects.push(mainRoad);

    // 主幹道黃色分向線 (方塊虛線)
    for (let z = -120; z <= 120; z += 10) {
      const lineGeo = new THREE.BoxGeometry(0.5, 0.1, 4);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(0, 0.09, z);
      this.group.add(line);
    }

    // 東西向光華路 / 愛富一街 (美軍宿舍主要橫向幹道)
    const crossRoadGeo = new THREE.BoxGeometry(220, 0.08, 8);
    const crossRoad = new THREE.Mesh(crossRoadGeo, this.materials.asphalt);
    crossRoad.position.set(0, 0.04, -30);
    crossRoad.receiveShadow = true;
    this.group.add(crossRoad);
    this.clickableObjects.push(crossRoad);

    // 麥當勞門前與山仔后生活核心行人石板廣場 (灰色方塊步道)
    const plazaGeo = new THREE.BoxGeometry(32, 0.09, 36);
    const plaza = new THREE.Mesh(plazaGeo, this.materials.stoneRoad);
    plaza.position.set(-6, 0.05, 5);
    plaza.receiveShadow = true;
    this.group.add(plaza);
    this.clickableObjects.push(plaza);

    // 文化大學方向步道 (西側)
    const pccuPathGeo = new THREE.BoxGeometry(80, 0.08, 6);
    const pccuPath = new THREE.Mesh(pccuPathGeo, this.materials.stoneRoad);
    pccuPath.position.set(-50, 0.04, 25);
    pccuPath.receiveShadow = true;
    this.group.add(pccuPath);
    this.clickableObjects.push(pccuPath);

    // 美軍宿舍區林蔭石板小徑 (蜿蜒木道與碎石路)
    const subPaths = [
      { x: 45, z: -55, w: 6, d: 60, mat: this.materials.stoneRoad },
      { x: 70, z: -30, w: 50, d: 5, mat: this.materials.dirtPath },
      { x: -50, z: -60, w: 6, d: 50, mat: this.materials.dirtPath },
      { x: 15, z: 50, w: 5, d: 60, mat: this.materials.stoneRoad }
    ];
    subPaths.forEach(p => {
      const geo = new THREE.BoxGeometry(p.w, 0.08, p.d);
      const mesh = new THREE.Mesh(geo, p.mat);
      mesh.position.set(p.x, 0.04, p.z);
      mesh.receiveShadow = true;
      this.group.add(mesh);
      this.clickableObjects.push(mesh);
    });
  }

  buildNature() {
    // 1. 方塊樹木配置 (櫻花樹、黑松、闊葉樹)
    const treePositions = [
      // 麥當勞與派出所周邊
      { x: -16, z: 18, type: 'oak' },
      { x: -14, z: -8, type: 'sakura' },
      { x: 12, z: 12, type: 'oak' },
      { x: 14, z: -10, type: 'sakura' },
      // 山仔后公園周邊林蔭
      { x: -28, z: -32, type: 'oak' },
      { x: -35, z: -25, type: 'oak' },
      { x: -22, z: -40, type: 'sakura' },
      // 北區美軍宿舍群林道
      { x: -25, z: -70, type: 'oak' },
      { x: -15, z: -85, type: 'sakura' },
      { x: 20, z: -75, type: 'sakura' },
      { x: 35, z: -85, type: 'oak' },
      { x: -55, z: -80, type: 'oak' },
      // 東區美軍宿舍群 (亞尼克 / 想陽明山)
      { x: 45, z: -15, type: 'sakura' },
      { x: 60, z: -45, type: 'oak' },
      { x: 75, z: -60, type: 'sakura' },
      { x: 85, z: -10, type: 'oak' },
      { x: 55, z: 15, type: 'oak' },
      // 南區花卉試驗中心周邊 (密集櫻花樹與花樹)
      { x: -10, z: 65, type: 'sakura' },
      { x: -25, z: 75, type: 'sakura' },
      { x: 25, z: 70, type: 'sakura' },
      { x: 40, z: 85, type: 'oak' },
      { x: 10, z: 95, type: 'sakura' },
      // 西區文大邊坡
      { x: -65, z: 10, type: 'oak' },
      { x: -80, z: 35, type: 'oak' },
      { x: -45, z: 40, type: 'sakura' }
    ];

    treePositions.forEach(t => {
      this.createVoxelTree(t.x, t.z, t.type);
    });

    // 2. 散落於草地上的彩色小花方塊柱 (如截圖 4 所示)
    const flowerMats = [
      this.materials.flowerRed,
      this.materials.flowerPink,
      this.materials.flowerWhite,
      this.materials.flowerOrange,
      this.materials.flowerYellow
    ];

    const flowerPositions = [
      { x: -12, z: 8 }, { x: -8, z: 22 }, { x: 8, z: 6 }, { x: 10, z: 25 },
      { x: -20, z: -18 }, { x: -25, z: -14 }, { x: 18, z: -20 }, { x: 25, z: -35 },
      { x: -30, z: 30 }, { x: -35, z: 15 }, { x: 35, z: -15 }, { x: 45, z: 10 },
      { x: -6, z: 45 }, { x: 12, z: 55 }, { x: -18, z: 60 }, { x: 22, z: 75 },
      { x: -50, z: -45 }, { x: 60, z: -70 }, { x: 70, z: 10 }, { x: -70, z: 20 }
    ];

    flowerPositions.forEach((pos, idx) => {
      const fGeo = new THREE.BoxGeometry(0.3, 0.7, 0.3);
      const fMat = flowerMats[idx % flowerMats.length];
      const flower = new THREE.Mesh(fGeo, fMat);
      flower.position.set(pos.x, 0.35, pos.z);
      flower.castShadow = true;
      this.group.add(flower);
    });

    // 3. 復古路燈 (沿幹道豎立)
    const lampPositions = [
      { x: -6, z: -15 }, { x: 6, z: -15 },
      { x: -6, z: 15 }, { x: 6, z: 15 },
      { x: -6, z: 40 }, { x: 6, z: 40 },
      { x: -6, z: -45 }, { x: 6, z: -45 },
      { x: 35, z: -34 }, { x: 65, z: -34 },
      { x: -35, z: -34 }, { x: -65, z: -34 }
    ];
    lampPositions.forEach(p => {
      this.createStreetLamp(p.x, p.z);
    });
  }

  createVoxelTree(x, z, type = 'oak') {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);

    // 樹幹 (Trunk)
    const trunkH = 2.5 + Math.random() * 0.8;
    const trunkGeo = new THREE.BoxGeometry(0.65, trunkH, 0.65);
    const trunkMesh = new THREE.Mesh(trunkGeo, this.materials.woodTrunk);
    trunkMesh.position.y = trunkH / 2;
    trunkMesh.castShadow = true;
    trunkGroup.add(trunkMesh);

    // 樹冠 (Leaves) - 階層方塊
    const leafMat = type === 'sakura' ? this.materials.leavesSakura : this.materials.leavesGreen;
    
    // 下層大方塊
    const bottomGeo = new THREE.BoxGeometry(2.6, 1.4, 2.6);
    const bottomLeaves = new THREE.Mesh(bottomGeo, leafMat);
    bottomLeaves.position.y = trunkH + 0.6;
    bottomLeaves.castShadow = true;
    bottomLeaves.receiveShadow = true;
    treeGroup.add(bottomLeaves);

    // 上層較小方塊
    const topGeo = new THREE.BoxGeometry(1.6, 1.2, 1.6);
    const topLeaves = new THREE.Mesh(topGeo, leafMat);
    topLeaves.position.y = trunkH + 1.8;
    topLeaves.castShadow = true;
    topLeaves.receiveShadow = true;
    treeGroup.add(topLeaves);

    this.group.add(treeGroup);
  }

  createStreetLamp(x, z) {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(x, 0, z);

    // 燈柱
    const postGeo = new THREE.BoxGeometry(0.2, 3.2, 0.2);
    const post = new THREE.Mesh(postGeo, this.materials.lampPost);
    post.position.y = 1.6;
    post.castShadow = true;
    lampGroup.add(post);

    // 橫臂
    const armGeo = new THREE.BoxGeometry(0.6, 0.15, 0.15);
    const arm = new THREE.Mesh(armGeo, this.materials.lampPost);
    arm.position.set(0.2, 3.1, 0);
    lampGroup.add(arm);

    // 暖黃發光燈罩
    const bulbGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const bulb = new THREE.Mesh(bulbGeo, this.materials.lampBulb);
    bulb.position.set(0.4, 2.85, 0);
    lampGroup.add(bulb);

    this.group.add(lampGroup);
  }

  initRippleSystem() {
    // 漣漪池，重複使用
    this.maxRipples = 5;
    for (let i = 0; i < this.maxRipples; i++) {
      const ringGeo = new THREE.RingGeometry(0.2, 0.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x2a9d8f,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05;
      ring.visible = false;
      this.scene.add(ring);
      this.rippleRings.push({ mesh: ring, time: 0, active: false });
    }
  }

  spawnRipple(x, z) {
    const item = this.rippleRings.find(r => !r.active) || this.rippleRings[0];
    item.active = true;
    item.time = 0;
    item.mesh.position.set(x, 0.08, z);
    item.mesh.scale.set(1, 1, 1);
    item.mesh.material.opacity = 0.85;
    item.mesh.visible = true;
  }

  update(delta) {
    // 更新漣漪擴散動畫
    this.rippleRings.forEach(r => {
      if (r.active) {
        r.time += delta * 2.2;
        const scale = 1 + r.time * 2.8;
        r.mesh.scale.set(scale, scale, 1);
        r.mesh.material.opacity = Math.max(0, 0.85 - r.time);
        if (r.time >= 0.85) {
          r.active = false;
          r.mesh.visible = false;
        }
      }
    });
  }
}
