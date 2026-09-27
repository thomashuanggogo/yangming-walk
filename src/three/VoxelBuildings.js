/**
 * 地標位置與互動標記。建築模型由 LandmarkArchitecture 共用建造。
 */
import * as THREE from '../../assets/three.module.js';
import { LANDMARKS } from '../world/landmarks.js';
import { LandmarkArchitecture } from './LandmarkArchitecture.js';

export class VoxelBuildings {
  constructor(scene, roadNetwork) {
    this.roadNetwork = roadNetwork;
    this.scene = scene;
    this.landmarks = LANDMARKS;
    this.landmarksWith3D = [];
    this.materials = this.initMaterials();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.scaleFactor = 0.28;
    this.originX = 320;
    this.originY = 440;

    this.architecture = new LandmarkArchitecture();
    this.buildAllLandmarks();
    this.steamParticles = [];
    this.group.traverse(obj => { if(obj.userData.steam) this.steamParticles.push(obj); });
  }

  initMaterials() {
    return {
      beaconGem: new THREE.MeshBasicMaterial({ color: 0xffb703 }),
      beaconRing: new THREE.MeshBasicMaterial({ color: 0x2a9d8f, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    };
  }

  buildAllLandmarks() {
    this.landmarks.forEach((data) => {
      const placement = this.roadNetwork.placements.get(data.id);
      const worldX = placement.x;
      const worldZ = placement.z;

      const landmarkObj = {
        data: data,
        worldX: worldX,
        worldZ: worldZ,
        position: new THREE.Vector3(...[placement.entrance[0], 0, placement.entrance[1]]),
        entrance: placement.entrance,
        yaw: placement.yaw,
        radius: 8.5,
        beaconMesh: null,
        ringMesh: null
      };

      const buildingGroup = this.createLandmarkStructure(data.code, worldX, worldZ, data.name);
      buildingGroup.rotation.y = placement.yaw;
      this.group.add(buildingGroup);

      const marker = this.createLandmarkMarker(placement.entrance[0], placement.entrance[1]);
      landmarkObj.beaconMesh = marker.beacon;
      landmarkObj.ringMesh = marker.ring;
      this.group.add(marker.group);

      this.landmarksWith3D.push(landmarkObj);
    });
  }

  createLandmarkStructure(code, x, z, name) {
    const group = this.architecture.build(code, name);
    group.position.set(x, 0, z);
    return group;
  }

  /** 地標專屬懸浮導引晶石與地面發光光圈 */
  createLandmarkMarker(x, z) {
    const markerGroup = new THREE.Group();
    markerGroup.position.set(x, 0, z);

    const ring = new THREE.Mesh(new THREE.RingGeometry(2.4, 3.0, 32), this.materials.beaconRing.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.08;
    markerGroup.add(ring);

    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), this.materials.beaconGem.clone());
    gem.position.y = 5.5;
    gem.castShadow = true;
    markerGroup.add(gem);

    return { group: markerGroup, beacon: gem, ring: ring };
  }

  update(delta, time) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (const cloud of this.steamParticles) {
      const data = cloud.userData.steam;
      const phase = reduced ? data.phase % 1 : (time * .12 + data.phase) % 1;
      cloud.position.set(data.x + Math.sin(phase * Math.PI) * .35, .55 + phase * 2.5, data.z);
      cloud.scale.set(.45 + phase * .55, .3 + phase * .4, .4 + phase * .5);
    }
    this.landmarksWith3D.forEach((item, idx) => {
      if (item.beaconMesh) {
        item.beaconMesh.rotation.y += delta * 1.5;
        item.beaconMesh.position.y = 5.2 + Math.sin(time * 2.5 + idx) * 0.4;
      }
      if (item.ringMesh) {
        item.ringMesh.rotation.z += delta * 0.4;
      }
    });
  }
}
