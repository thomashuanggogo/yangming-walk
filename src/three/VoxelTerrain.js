/**
 * 陽明里漫步 3D 方塊版 - 體素地形與自然景觀模組 (VoxelTerrain.js)
 * 打造台地草階、仰德大道與山仔后街區石板路、方塊樹木與花柱
 */
import * as THREE from '../../assets/three.module.js';

export class VoxelTerrain {
  constructor(scene, roadNetwork, maxTextureSize) {
    this.roadNetwork = roadNetwork;
    this.maxTextureSize = maxTextureSize;
    this.scene = scene;
    this.clickableObjects = []; // 供 Raycaster 拾取的地面物件
    this.rippleRings = []; // 點擊漣漪特效
    this.materials = this.initMaterials();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.buildTerrain();
    this.buildRoads();
    this.buildNorthernParks();
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
    // 總基地大地板 (以 0,0 為山仔后核心，範圍 280 x 280，完全平坦，y=0 為地面基準)
    const baseGeo = new THREE.BoxGeometry(this.roadNetwork.size, 1, this.roadNetwork.size);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.grassTop);
    baseMesh.position.y = -0.5;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);
    this.clickableObjects.push(baseMesh);


  }

  buildRoads() {
    this.roadsMesh = this.roadNetwork.createSurface(this.maxTextureSize);
    this.group.add(this.roadsMesh);
    this.clickableObjects.push(this.roadsMesh);
  }

  buildNature() {
    // Decorative trees are not map data. Keep them off roads and landmark plots.
    let seed = 9256;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const places = this.roadNetwork.data.placements;
    let count = 0;
    for (let i = 0; i < 1600 && count < 140; i++) {
      const x = (random() - .5) * this.roadNetwork.size;
      const z = (random() - .5) * this.roadNetwork.size;
      if (!this.roadNetwork.contains(x, z)) continue;
      if (this.roadNetwork.nearest(x, z).clearance < 5) continue;
      if (places.some(p => Math.hypot(x-p.x,z-p.z) < p.radius+6)) continue;
      this.createVoxelTree(x,z,count % 7 === 0 ? 'sakura' : 'oak');
      count++;
    }
  }

  buildNorthernParks() {
    const data = this.roadNetwork.data;
    const polygonMesh = (polygon,color,height) => {
      const shape=new THREE.Shape(polygon.outer.map(([x,z])=>new THREE.Vector2(x,-z)));
      shape.holes=(polygon.holes||[]).map(r=>new THREE.Path(r.map(([x,z])=>new THREE.Vector2(x,-z))));
      const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshLambertMaterial({color}));
      mesh.rotation.x=-Math.PI/2;mesh.position.y=height;mesh.receiveShadow=true;this.group.add(mesh);
    };
    for(const park of data.parks||[]) polygonMesh(park,0x8cac6b,.014);
    for(const water of data.waters||[]) polygonMesh(water,0x6aadb7,.026);
    const inside=(x,z,ring)=>{
      let hit=false;
      for(let i=0,j=ring.length-1;i<ring.length;j=i++) {
        const a=ring[i],b=ring[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])hit=!hit;
      }
      return hit;
    };
    // Decorative planting follows mapped park outlines; avoid paths and miniature plots.
    let seed=6701;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    for(const park of data.parks||[]) {
      const xs=park.outer.map(p=>p[0]),zs=park.outer.map(p=>p[1]);
      const minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs);
      let planted=0;
      for(let i=0;i<600&&planted<45;i++) {
        const x=minX+rand()*(maxX-minX),z=minZ+rand()*(maxZ-minZ);
        if(!inside(x,z,park.outer)||this.roadNetwork.nearest(x,z).clearance<3)continue;
        if(data.placements.some(p=>Math.hypot(x-p.x,z-p.z)<p.radius+4))continue;
        if((data.waters||[]).some(w=>inside(x,z,w.outer)))continue;
        this.createVoxelTree(x,z,planted++%3===0?'sakura':'oak');
      }
    }
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
    treeGroup.add(trunkMesh);

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
    item.mesh.position.set(x, 0.14, z);
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
