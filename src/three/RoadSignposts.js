import * as THREE from '../../assets/three.module.js';

/**
 * 陽明里轉角路名指標牌系統 (Road Intersection Signpost & Wayfinding System)
 * 在陽明山與文化大學所有關鍵路口與轉角路肩上設立 3D 立體指標牌，
 * 並即時計算玩家當前面朝方向的前、後、左、右道路名稱，提供極致沉浸的街景導航！
 */
export class RoadSignposts {
  constructor(scene, roadNetwork) {
    this.scene = scene;
    this.roadNetwork = roadNetwork;
    this.group = new THREE.Group();
    this.group.name = 'road-signposts';
    this.scene.add(this.group);

    this.signposts = [];
    this.activeCorner = null;
    this.initCorners();
  }

  initCorners() {
    const rawNodes = new Map();
    const roads = this.roadNetwork.data.roads;

    roads.forEach(r => {
      if (!r.name) return;
      for (let i = 0; i < r.points.length; i++) {
        const p = r.points[i];
        // 以 4.0m 聚合相鄰交會節點
        const key = Math.round(p[0] / 4.0) * 4.0 + ',' + Math.round(p[1] / 4.0) * 4.0;
        if (!rawNodes.has(key)) {
          rawNodes.set(key, { x: p[0], z: p[1], branches: [] });
        }
        const node = rawNodes.get(key);

        if (i > 0) {
          const prev = r.points[i - 1];
          const dx = prev[0] - p[0], dz = prev[1] - p[1];
          const len = Math.hypot(dx, dz);
          if (len > 0.5) {
            const ang = Math.atan2(dz, dx);
            if (!node.branches.some(b => b.name === r.name && Math.abs(b.ang - ang) < 0.4)) {
              node.branches.push({ name: r.name, dx: dx / len, dz: dz / len, ang });
            }
          }
        }
        if (i < r.points.length - 1) {
          const next = r.points[i + 1];
          const dx = next[0] - p[0], dz = next[1] - p[1];
          const len = Math.hypot(dx, dz);
          if (len > 0.5) {
            const ang = Math.atan2(dz, dx);
            if (!node.branches.some(b => b.name === r.name && Math.abs(b.ang - ang) < 0.4)) {
              node.branches.push({ name: r.name, dx: dx / len, dz: dz / len, ang });
            }
          }
        }
      }
    });

    // 篩選出多向交會或主要轉角
    const validCorners = [];
    rawNodes.forEach(val => {
      const uniqueNames = Array.from(new Set(val.branches.map(b => b.name)));
      if (uniqueNames.length >= 2 || val.branches.length >= 3) {
        // 將指標牌位置稍微偏離路中心 1.8m，立在路肩草皮上，避免立在馬路正中央
        const normalX = val.branches[0] ? -val.branches[0].dz : 1;
        const normalZ = val.branches[0] ? val.branches[0].dx : 0;
        const signX = val.x + normalX * 1.8;
        const signZ = val.z + normalZ * 1.8;

        validCorners.push({
          x: signX,
          z: signZ,
          roadX: val.x,
          roadZ: val.z,
          title: uniqueNames.join(' × '),
          branches: val.branches
        });
      }
    });

    // 建立 3D 指標牌模型
    validCorners.forEach((corner, idx) => {
      const postMesh = this.createSignpostMesh(corner, idx);
      this.group.add(postMesh);
      this.signposts.push({ ...corner, mesh: postMesh });
    });
  }

  createSignpostMesh(corner, idx) {
    const postGroup = new THREE.Group();
    postGroup.position.set(corner.x, 0, corner.z);

    // 1. 金屬深灰/墨綠色路牌立柱 (Post)
    const postGeom = new THREE.CylinderGeometry(0.06, 0.08, 2.8, 12);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.4, metalness: 0.6 });
    const postMesh = new THREE.Mesh(postGeom, postMat);
    postMesh.position.y = 1.4;
    postMesh.castShadow = true;
    postGroup.add(postMesh);

    // 圓形基座法蘭盤
    const baseGeom = new THREE.CylinderGeometry(0.2, 0.22, 0.1, 12);
    const baseMesh = new THREE.Mesh(baseGeom, postMat);
    baseMesh.position.y = 0.05;
    postGroup.add(baseMesh);

    // 2. 指向各相交道路的方向箭頭牌面 (Directional Arrow Plaques)
    corner.branches.slice(0, 4).forEach((b, bIdx) => {
      const plaqueY = 2.1 + bIdx * 0.25;
      const plaqueGroup = new THREE.Group();
      plaqueGroup.position.y = plaqueY;
      plaqueGroup.rotation.y = -b.ang + Math.PI / 2;

      // 台灣公路標準綠底白字/藍底白字路牌材質 (動態 Canvas 貼圖)
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      // 綠色底板 + 白色邊框
      ctx.fillStyle = bIdx % 2 === 0 ? '#1b5e20' : '#0d47a1'; // 綠色/藍色牌面
      ctx.fillRect(0, 0, 256, 64);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(4, 4, 248, 56);

      // 白色中文路名與方向指標
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Microsoft JhengHei", "PingFang TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const shortName = b.name.length > 7 ? b.name.slice(0, 6) + '..' : b.name;
      ctx.fillText(`➔ ${shortName}`, 128, 34);

      const texture = new THREE.CanvasTexture(canvas);
      const plaqueMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const plaqueGeom = new THREE.PlaneGeometry(1.1, 0.28);
      const pMesh = new THREE.Mesh(plaqueGeom, plaqueMat);
      pMesh.position.z = 0.55; // 稍微向箭頭前方突出
      plaqueGroup.add(pMesh);

      postGroup.add(plaqueGroup);
    });

    return postGroup;
  }

  /**
   * 每幀更新：偵測玩家距離與相對方位，回傳前、後、左、右道路提示
   * @param {THREE.Vector3} playerPos 玩家當前世界坐標
   * @param {number} playerYaw 玩家當前旋轉角 (弧度)
   */
  update(playerPos, playerYaw) {
    let nearest = null;
    let minDist = Infinity;

    for (const post of this.signposts) {
      const d = Math.hypot(playerPos.x - post.x, playerPos.z - post.z);
      if (d < minDist) {
        minDist = d;
        nearest = post;
      }
    }

    // 當距離轉角指標牌小於 14 公尺時啟動導航指示
    if (nearest && minDist < 14.0) {
      // 計算各分支相對於玩家朝向的方位角
      // playerYaw: 0 表示面向南 (+Z), Math.PI/2 表示面向西 (-X), etc.
      const directions = {
        title: nearest.title,
        distance: minDist,
        front: null,
        back: null,
        left: null,
        right: null
      };

      nearest.branches.forEach(b => {
        // branch 朝向向量角度 (在 X-Z 平面中，相對於玩家坐標系的局部角度)
        const branchWorldAng = Math.atan2(b.dz, b.dx);
        let relAng = branchWorldAng - playerYaw;
        // 正規化到 [-PI, PI]
        while (relAng > Math.PI) relAng -= Math.PI * 2;
        while (relAng < -Math.PI) relAng += Math.PI * 2;

        const deg = relAng * (180 / Math.PI);

        if (deg >= -45 && deg <= 45) {
          if (!directions.front) directions.front = b.name;
        } else if (deg > 45 && deg < 135) {
          if (!directions.right) directions.right = b.name;
        } else if (deg < -45 && deg > -135) {
          if (!directions.left) directions.left = b.name;
        } else {
          if (!directions.back) directions.back = b.name;
        }
      });

      this.activeCorner = directions;
      return directions;
    }

    this.activeCorner = null;
    return null;
  }
}
