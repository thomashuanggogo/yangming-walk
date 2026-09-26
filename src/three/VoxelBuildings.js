/**
 * 陽明里漫步 3D 方塊版 - 體素建築與 30 處地標模組 (VoxelBuildings.js)
 * 1:1 還原截圖中的陽明山麥當勞巨型「M」字招牌、派出所、7-11、美軍宿舍群等 30 處特色體素建築
 */
import * as THREE from '../../assets/three.module.js';
import { LANDMARKS } from '../world/landmarks.js';

export class VoxelBuildings {
  constructor(scene) {
    this.scene = scene;
    this.landmarks = LANDMARKS;
    this.landmarksWith3D = []; // 包含 3D 座標與 Mesh 的地標陣列
    this.materials = this.initMaterials();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.scaleFactor = 0.28;
    this.originX = 320;
    this.originY = 440;

    this.buildAllLandmarks();
  }

  initMaterials() {
    return {
      // 麥當勞專用材質
      mcDonaldsRed: new THREE.MeshLambertMaterial({ color: 0xa8201a }),
      mcDonaldsYellow: new THREE.MeshLambertMaterial({ color: 0xf4a261 }),
      mcDonaldsGold: new THREE.MeshLambertMaterial({ color: 0xe9c46a }),
      mcSignPole: new THREE.MeshLambertMaterial({ color: 0x58311d }),
      // 派出所藍白
      policeBlue: new THREE.MeshLambertMaterial({ color: 0x1d3557 }),
      policeWhite: new THREE.MeshLambertMaterial({ color: 0xf1faee }),
      policeRedLight: new THREE.MeshBasicMaterial({ color: 0xe63946 }),
      policeBlueLight: new THREE.MeshBasicMaterial({ color: 0x457b9d }),
      // 7-11
      sevenGreen: new THREE.MeshLambertMaterial({ color: 0x008037 }),
      sevenOrange: new THREE.MeshLambertMaterial({ color: 0xeb6909 }),
      sevenRed: new THREE.MeshLambertMaterial({ color: 0xed1c24 }),
      // 美軍宿舍
      usBrickWall: new THREE.MeshLambertMaterial({ color: 0x9c4132 }),
      usWhiteWall: new THREE.MeshLambertMaterial({ color: 0xede0d4 }),
      usWoodRoof: new THREE.MeshLambertMaterial({ color: 0x7f4f24 }),
      usDarkRoof: new THREE.MeshLambertMaterial({ color: 0x4a4e69 }),
      usChimney: new THREE.MeshLambertMaterial({ color: 0xddb892 }),
      // 公共園區與通用
      concrete: new THREE.MeshLambertMaterial({ color: 0x9a8c98 }),
      glassWindow: new THREE.MeshLambertMaterial({ color: 0xa0c4e2, transparent: true, opacity: 0.85 }),
      woodBench: new THREE.MeshLambertMaterial({ color: 0x8b5e3c }),
      // 地標引導晶石
      beaconGem: new THREE.MeshBasicMaterial({ color: 0xffb703 }),
      beaconRing: new THREE.MeshBasicMaterial({ color: 0x2a9d8f, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    };
  }

  buildAllLandmarks() {
    this.landmarks.forEach((data) => {
      // 轉換 2D (x, y) 座標至 3D 空間 (X, Z)
      const worldX = (data.x - this.originX) * this.scaleFactor;
      const worldZ = (data.y - this.originY) * this.scaleFactor;

      const landmarkObj = {
        data: data,
        worldX: worldX,
        worldZ: worldZ,
        position: new THREE.Vector3(worldX, 0, worldZ),
        radius: 7.5, // 靠近感測半徑
        beaconMesh: null,
        ringMesh: null
      };

      // 依地標代號建立專屬 3D 建築或地景模型
      const buildingGroup = this.createLandmarkStructure(data.code, worldX, worldZ, data.name);
      this.group.add(buildingGroup);

      // 地面光圈與微光標記 (浮動晶石)
      const marker = this.createLandmarkMarker(worldX, worldZ);
      landmarkObj.beaconMesh = marker.beacon;
      landmarkObj.ringMesh = marker.ring;
      this.group.add(marker.group);

      this.landmarksWith3D.push(landmarkObj);
    });
  }

  createLandmarkStructure(code, x, z, name) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    switch (code) {
      case '02': // 陽明山麥當勞 (完全還原截圖 3)
        this.buildMcDonalds(group);
        break;
      case '01': // 山仔后派出所
        this.buildPoliceStation(group);
        break;
      case '03': // 7-ELEVEN 陽明山門市
        this.buildConvenienceStore(group);
        break;
      case '04': // 山仔后公園
        this.buildParkGazebo(group);
        break;
      case '05': // 陽明里辦公處
        this.buildCommunityCenter(group);
        break;
      case '06': // 台灣中油加油站
        this.buildGasStation(group);
        break;
      case '07': // 豆留森林 CAMA
      case '08': // 白房子
      case '09': // 彩虹谷
      case '14': // 亞尼克夢想村
      case '16': // 想 陽明山
      case '19': // 美軍俱樂部
        // 經典美軍眷舍平房 (斜屋頂、白煙囪、木框)
        this.buildUSMilitaryHouse(group, code);
        break;
      case '25': // 文化大學大孝館 / 體育館
      case '26': // 文化大學大恩館
        this.buildPCCUHall(group);
        break;
      case '28': // 花卉試驗中心
        this.buildFlowerCenter(group);
        break;
      default:
        // 通用文史風格式平房
        this.buildHistoricCottage(group, code);
        break;
    }

    return group;
  }

  /**
   * 02 陽明山麥當勞 (高度還原截圖 3)
   */
  buildMcDonalds(group) {
    // 建築主體 (紅色磚牆)
    const wallGeo = new THREE.BoxGeometry(9, 4.5, 7);
    const wall = new THREE.Mesh(wallGeo, this.materials.mcDonaldsRed);
    wall.position.set(0, 2.25, 0);
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);

    // 金黃色屋頂
    const roofGeo = new THREE.BoxGeometry(9.6, 0.8, 7.6);
    const roof = new THREE.Mesh(roofGeo, this.materials.mcDonaldsYellow);
    roof.position.set(0, 4.65, 0);
    roof.castShadow = true;
    group.add(roof);

    // 落地窗
    const winGeo = new THREE.BoxGeometry(2.4, 1.8, 0.2);
    const win1 = new THREE.Mesh(winGeo, this.materials.glassWindow);
    win1.position.set(-2, 2.2, 3.55);
    group.add(win1);
    const win2 = new THREE.Mesh(winGeo, this.materials.glassWindow);
    win2.position.set(2, 2.2, 3.55);
    group.add(win2);

    // 玻璃大門
    const doorGeo = new THREE.BoxGeometry(1.4, 2.4, 0.2);
    const door = new THREE.Mesh(doorGeo, this.materials.glassWindow);
    door.position.set(0, 1.2, 3.55);
    group.add(door);

    // === 經典立牌大招牌 (雙木樁 + 紅底板 + 黃色方塊大「M」字) ===
    const signGroup = new THREE.Group();
    signGroup.position.set(6.2, 0, 1.5);

    // 左右兩根木柱 (Sign Poles)
    const poleGeo = new THREE.BoxGeometry(0.35, 5.5, 0.35);
    const poleL = new THREE.Mesh(poleGeo, this.materials.mcSignPole);
    poleL.position.set(-1.8, 2.75, 0);
    poleL.castShadow = true;
    signGroup.add(poleL);

    const poleR = new THREE.Mesh(poleGeo, this.materials.mcSignPole);
    poleR.position.set(1.8, 2.75, 0);
    poleR.castShadow = true;
    signGroup.add(poleR);

    // 紅色大招牌底板
    const boardGeo = new THREE.BoxGeometry(3.6, 3.2, 0.3);
    const board = new THREE.Mesh(boardGeo, this.materials.mcDonaldsRed);
    board.position.set(0, 3.6, 0);
    board.castShadow = true;
    signGroup.add(board);

    // 金黃色方塊拼出的巨型「M」字 (5x5 方塊字形)
    const mBlockGeo = new THREE.BoxGeometry(0.48, 0.48, 0.38);
    const mCoords = [
      // 左側直立桿
      [-1.0, 4.4], [-1.0, 3.9], [-1.0, 3.4], [-1.0, 2.9],
      // 右側直立桿
      [1.0, 4.4], [1.0, 3.9], [1.0, 3.4], [1.0, 2.9],
      // 中間內折 V 字
      [-0.5, 4.0], [0.5, 4.0], [0.0, 3.5]
    ];
    mCoords.forEach(([mx, my]) => {
      const mBlock = new THREE.Mesh(mBlockGeo, this.materials.mcDonaldsGold);
      mBlock.position.set(mx, my, 0.05);
      mBlock.castShadow = true;
      signGroup.add(mBlock);
    });

    group.add(signGroup);
  }

  /**
   * 01 山仔后派出所
   */
  buildPoliceStation(group) {
    // 白牆主體
    const wallGeo = new THREE.BoxGeometry(8, 4, 6.5);
    const wall = new THREE.Mesh(wallGeo, this.materials.policeWhite);
    wall.position.set(0, 2, 0);
    wall.castShadow = true;
    group.add(wall);

    // 警政深藍橫飾帶
    const stripeGeo = new THREE.BoxGeometry(8.1, 0.6, 6.6);
    const stripe = new THREE.Mesh(stripeGeo, this.materials.policeBlue);
    stripe.position.set(0, 3.4, 0);
    group.add(stripe);

    // 門口門廊雨遮
    const canopyGeo = new THREE.BoxGeometry(3.2, 0.3, 2);
    const canopy = new THREE.Mesh(canopyGeo, this.materials.policeBlue);
    canopy.position.set(0, 2.8, 4.2);
    group.add(canopy);

    // 柱子
    const pillarGeo = new THREE.BoxGeometry(0.3, 2.8, 0.3);
    const p1 = new THREE.Mesh(pillarGeo, this.materials.policeWhite);
    p1.position.set(-1.4, 1.4, 4.8);
    group.add(p1);
    const p2 = new THREE.Mesh(pillarGeo, this.materials.policeWhite);
    p2.position.set(1.4, 1.4, 4.8);
    group.add(p2);

    // 屋頂警燈 (紅藍雙色小方塊)
    const redLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), this.materials.policeRedLight);
    redLight.position.set(-0.6, 4.3, 0);
    group.add(redLight);

    const blueLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), this.materials.policeBlueLight);
    blueLight.position.set(0.6, 4.3, 0);
    group.add(blueLight);
  }

  /**
   * 03 7-ELEVEN 陽明山門市
   */
  buildConvenienceStore(group) {
    // 牆體
    const wallGeo = new THREE.BoxGeometry(7.5, 3.8, 6);
    const wall = new THREE.Mesh(wallGeo, this.materials.policeWhite);
    wall.position.set(0, 1.9, 0);
    wall.castShadow = true;
    group.add(wall);

    // 7-11 經典招牌 (綠紅白條紋)
    const signGeo = new THREE.BoxGeometry(7.8, 1, 6.2);
    const sign = new THREE.Mesh(signGeo, this.materials.sevenGreen);
    sign.position.set(0, 3.6, 0);
    group.add(sign);

    const orangeStripe = new THREE.Mesh(new THREE.BoxGeometry(7.9, 0.3, 6.3), this.materials.sevenOrange);
    orangeStripe.position.set(0, 3.6, 0);
    group.add(orangeStripe);

    const redStripe = new THREE.Mesh(new THREE.BoxGeometry(7.9, 0.2, 6.3), this.materials.sevenRed);
    redStripe.position.set(0, 3.3, 0);
    group.add(redStripe);

    // 大落地窗
    const winGeo = new THREE.BoxGeometry(4.8, 2.2, 0.2);
    const win = new THREE.Mesh(winGeo, this.materials.glassWindow);
    win.position.set(0, 1.6, 3.1);
    group.add(win);
  }

  /**
   * 04 山仔后公園 (涼亭與綠意)
   */
  buildParkGazebo(group) {
    // 圓形/八角形石板地基
    const baseGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.4, 8);
    const base = new THREE.Mesh(baseGeo, this.materials.concrete);
    base.position.y = 0.2;
    group.add(base);

    // 四根原木柱
    const pillarGeo = new THREE.BoxGeometry(0.35, 3, 0.35);
    const pCoords = [[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]];
    pCoords.forEach(([px, pz]) => {
      const p = new THREE.Mesh(pillarGeo, this.materials.woodBench);
      p.position.set(px, 1.7, pz);
      p.castShadow = true;
      group.add(p);
    });

    // 涼亭斜頂
    const roofGeo = new THREE.ConeGeometry(4.2, 1.8, 4);
    const roof = new THREE.Mesh(roofGeo, this.materials.usWoodRoof);
    roof.position.y = 4;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // 公園長椅
    const benchGeo = new THREE.BoxGeometry(1.6, 0.4, 0.6);
    const bench = new THREE.Mesh(benchGeo, this.materials.woodBench);
    bench.position.set(0, 0.5, 0);
    group.add(bench);
  }

  /**
   * 05 陽明里辦公處 (區民活動中心)
   */
  buildCommunityCenter(group) {
    const wallGeo = new THREE.BoxGeometry(8, 4, 7);
    const wall = new THREE.Mesh(wallGeo, this.materials.policeWhite);
    wall.position.set(0, 2, 0);
    wall.castShadow = true;
    group.add(wall);

    const roofGeo = new THREE.BoxGeometry(8.6, 0.8, 7.6);
    const roof = new THREE.Mesh(roofGeo, this.materials.usDarkRoof);
    roof.position.set(0, 4.2, 0);
    group.add(roof);

    // 里辦公處大門告示板
    const boardGeo = new THREE.BoxGeometry(2.4, 0.8, 0.2);
    const board = new THREE.Mesh(boardGeo, this.materials.mcDonaldsRed);
    board.position.set(0, 2.8, 3.6);
    group.add(board);
  }

  /**
   * 06 中油陽明山加油站
   */
  buildGasStation(group) {
    // 加油站大頂棚 (Canopy)
    const canopyGeo = new THREE.BoxGeometry(9, 0.6, 6);
    const canopy = new THREE.Mesh(canopyGeo, this.materials.policeBlue);
    canopy.position.set(0, 4.2, 0);
    canopy.castShadow = true;
    group.add(canopy);

    // 兩根大承重立柱
    const colGeo = new THREE.BoxGeometry(0.8, 4, 0.8);
    const col1 = new THREE.Mesh(colGeo, this.materials.policeWhite);
    col1.position.set(-2.5, 2, 0);
    group.add(col1);
    const col2 = new THREE.Mesh(colGeo, this.materials.policeWhite);
    col2.position.set(2.5, 2, 0);
    group.add(col2);

    // 加油機台
    const pumpGeo = new THREE.BoxGeometry(0.9, 1.6, 0.9);
    const pump1 = new THREE.Mesh(pumpGeo, this.materials.mcDonaldsRed);
    pump1.position.set(-2.5, 0.8, 1.2);
    group.add(pump1);
    const pump2 = new THREE.Mesh(pumpGeo, this.materials.sevenGreen);
    pump2.position.set(2.5, 0.8, 1.2);
    group.add(pump2);
  }

  /**
   * 美軍眷舍平房 (如白房子、豆留森林、亞尼克、想陽明山等)
   */
  buildUSMilitaryHouse(group, code) {
    const isWhite = (code === '08' || code === '16');
    const wallMat = isWhite ? this.materials.usWhiteWall : this.materials.usBrickWall;
    const roofMat = code === '07' ? this.materials.usDarkRoof : this.materials.usWoodRoof;

    // 平房主體
    const houseGeo = new THREE.BoxGeometry(8.5, 3.2, 6.5);
    const house = new THREE.Mesh(houseGeo, wallMat);
    house.position.set(0, 1.6, 0);
    house.castShadow = true;
    house.receiveShadow = true;
    group.add(house);

    // 斜屋頂 (三角雙坡斜頂)
    const roofGeo = new THREE.ConeGeometry(6.2, 2.2, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 4.2, 0);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.1, 0.9, 1.3);
    roof.castShadow = true;
    group.add(roof);

    // 美軍宿舍標誌性「白色大煙囪」 (Chimney)
    const chimneyGeo = new THREE.BoxGeometry(1.1, 4.8, 1.1);
    const chimney = new THREE.Mesh(chimneyGeo, this.materials.usChimney);
    chimney.position.set(2.8, 2.8, -1.8);
    chimney.castShadow = true;
    group.add(chimney);

    // 前院白木柵欄
    const fenceGeo = new THREE.BoxGeometry(9, 0.7, 0.15);
    const fence = new THREE.Mesh(fenceGeo, this.materials.policeWhite);
    fence.position.set(0, 0.35, 4.2);
    group.add(fence);
  }

  /**
   * 文化大學大恩館/大孝館 (中式歇山頂/大禮堂風格)
   */
  buildPCCUHall(group) {
    const baseGeo = new THREE.BoxGeometry(10, 5.5, 8);
    const base = new THREE.Mesh(baseGeo, this.materials.policeWhite);
    base.position.set(0, 2.75, 0);
    base.castShadow = true;
    group.add(base);

    // 宮殿式綠色大屋頂
    const roofGeo = new THREE.BoxGeometry(11.2, 1.4, 9.2);
    const roof = new THREE.Mesh(roofGeo, this.materials.sevenGreen);
    roof.position.set(0, 6, 0);
    roof.castShadow = true;
    group.add(roof);
  }

  /**
   * 花卉試驗中心
   */
  buildFlowerCenter(group) {
    // 綠色拱門造景
    const archGeo = new THREE.BoxGeometry(6, 0.8, 1);
    const arch = new THREE.Mesh(archGeo, this.materials.sevenGreen);
    arch.position.set(0, 4, 0);
    group.add(arch);

    const postGeo = new THREE.BoxGeometry(0.8, 4, 0.8);
    const post1 = new THREE.Mesh(postGeo, this.materials.usWoodRoof);
    post1.position.set(-2.5, 2, 0);
    group.add(post1);
    const post2 = new THREE.Mesh(postGeo, this.materials.usWoodRoof);
    post2.position.set(2.5, 2, 0);
    group.add(post2);

    // 花壇
    const bedGeo = new THREE.BoxGeometry(8, 0.4, 4);
    const bed = new THREE.Mesh(bedGeo, this.materials.usBrickWall);
    bed.position.set(0, 0.2, 2.5);
    group.add(bed);
  }

  /**
   * 通用文史老屋
   */
  buildHistoricCottage(group, code) {
    const wallGeo = new THREE.BoxGeometry(7, 3, 5.5);
    const wall = new THREE.Mesh(wallGeo, this.materials.usWhiteWall);
    wall.position.set(0, 1.5, 0);
    wall.castShadow = true;
    group.add(wall);

    const roofGeo = new THREE.BoxGeometry(7.8, 0.8, 6.2);
    const roof = new THREE.Mesh(roofGeo, this.materials.usDarkRoof);
    roof.position.set(0, 3.3, 0);
    group.add(roof);
  }

  /**
   * 每個地標的光環與浮動引導晶石
   */
  createLandmarkMarker(x, z) {
    const markerGroup = new THREE.Group();
    markerGroup.position.set(x, 0, z);

    // 1. 地面光圈
    const ringGeo = new THREE.RingGeometry(2.2, 2.8, 32);
    const ring = new THREE.Mesh(ringGeo, this.materials.beaconRing.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.08;
    markerGroup.add(ring);

    // 2. 懸浮晶石 (Diamond Voxel)
    const gemGeo = new THREE.OctahedronGeometry(0.65, 0);
    const beacon = new THREE.Mesh(gemGeo, this.materials.beaconGem.clone());
    beacon.position.y = 5.2;
    beacon.castShadow = true;
    markerGroup.add(beacon);

    return { group: markerGroup, beacon: beacon, ring: ring };
  }

  update(delta, time) {
    // 讓所有地標的引導晶石緩慢旋轉並上下浮動
    this.landmarksWith3D.forEach((item, idx) => {
      if (item.beaconMesh) {
        item.beaconMesh.rotation.y += delta * 1.5;
        item.beaconMesh.position.y = 5.0 + Math.sin(time * 2.5 + idx) * 0.35;
      }
      if (item.ringMesh) {
        item.ringMesh.rotation.z += delta * 0.4;
      }
    });
  }
}
