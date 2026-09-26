/**
 * 陽明里漫步 3D 方塊版 - 體素角色模組 (VoxelCharacter.js)
 * 包含玩家方塊小人 (Steve 風格) 與里長 NPC
 */
import * as THREE from '../../assets/three.module.js';

export class VoxelCharacter {
  constructor(options = {}) {
    this.isNpc = options.isNpc || false;
    this.name = options.name || (this.isNpc ? '里長' : '小人');
    this.shirtColor = options.shirtColor || (this.isNpc ? 0x6b4226 : 0x2a9d8f);
    this.pantsColor = options.pantsColor || (this.isNpc ? 0x333333 : 0x264653);
    this.skinColor = options.skinColor || 0xe0aa86;
    this.hairColor = options.hairColor || (this.isNpc ? 0x222222 : 0x4a3018);

    this.group = new THREE.Group();
    this.speed = 7.5;
    this.targetPos = null;
    this.isMoving = false;
    this.walkAnimTime = 0;

    this.initMesh();
  }

  initMesh() {
    // 材品質感 (使用平滑或霧面 Phong/Lambert 展現溫潤方塊感)
    const skinMat = new THREE.MeshLambertMaterial({ color: this.skinColor });
    const hairMat = new THREE.MeshLambertMaterial({ color: this.hairColor });
    const shirtMat = new THREE.MeshLambertMaterial({ color: this.shirtColor });
    const pantsMat = new THREE.MeshLambertMaterial({ color: this.pantsColor });

    // 1. 軀幹 (Body)
    const bodyGeo = new THREE.BoxGeometry(0.9, 1.1, 0.5);
    this.bodyMesh = new THREE.Mesh(bodyGeo, shirtMat);
    this.bodyMesh.position.y = 1.35;
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.group.add(this.bodyMesh);

    // 2. 頭部 (Head)
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 2.3;

    const headGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // 頭髮 (Hair / Cap)
    const hairGeo = new THREE.BoxGeometry(0.78, 0.35, 0.78);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.y = 0.25;
    hairMesh.castShadow = true;
    this.headGroup.add(hairMesh);

    // 眼睛
    const eyeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.05);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.2, 0.02, 0.39);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.2, 0.02, 0.39);
    this.headGroup.add(leftEye, rightEye);

    this.group.add(this.headGroup);

    // 3. 左手臂 (Left Arm)
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(-0.65, 1.8, 0);
    const leftArmGeo = new THREE.BoxGeometry(0.35, 0.95, 0.35);
    const leftArmMesh = new THREE.Mesh(leftArmGeo, shirtMat);
    leftArmMesh.position.y = -0.45;
    leftArmMesh.castShadow = true;
    this.leftArmPivot.add(leftArmMesh);
    this.group.add(this.leftArmPivot);

    // 4. 右手臂 (Right Arm)
    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(0.65, 1.8, 0);
    const rightArmGeo = new THREE.BoxGeometry(0.35, 0.95, 0.35);
    const rightArmMesh = new THREE.Mesh(rightArmGeo, shirtMat);
    rightArmMesh.position.y = -0.45;
    rightArmMesh.castShadow = true;
    this.rightArmPivot.add(rightArmMesh);
    this.group.add(this.rightArmPivot);

    // 5. 左腿 (Left Leg)
    this.leftLegPivot = new THREE.Group();
    this.leftLegPivot.position.set(-0.24, 0.8, 0);
    const legGeo = new THREE.BoxGeometry(0.4, 0.8, 0.45);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.y = -0.4;
    leftLegMesh.castShadow = true;
    this.leftLegPivot.add(leftLegMesh);
    this.group.add(this.leftLegPivot);

    // 6. 右腿 (Right Leg)
    this.rightLegPivot = new THREE.Group();
    this.rightLegPivot.position.set(0.24, 0.8, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.y = -0.4;
    rightLegMesh.castShadow = true;
    this.rightLegPivot.add(rightLegMesh);
    this.group.add(this.rightLegPivot);

    // 7. 腳下陰影圓形
    const shadowGeo = new THREE.CircleGeometry(0.55, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.02;
    this.group.add(shadowMesh);
  }

  moveTo(targetX, targetZ) {
    this.targetPos = new THREE.Vector3(targetX, this.group.position.y, targetZ);
    this.isMoving = true;
  }

  stop() {
    this.targetPos = null;
    this.isMoving = false;
  }

  update(delta) {
    if (this.isMoving && this.targetPos) {
      const curPos = this.group.position;
      const dir = new THREE.Vector3().subVectors(this.targetPos, curPos);
      dir.y = 0;
      const dist = dir.length();

      if (dist < 0.15) {
        curPos.x = this.targetPos.x;
        curPos.z = this.targetPos.z;
        this.stop();
      } else {
        dir.normalize();
        const moveDist = Math.min(dist, this.speed * delta);
        curPos.addScaledVector(dir, moveDist);

        // 旋轉平滑朝向移動方向
        const targetAngle = Math.atan2(dir.x, dir.z);
        // 短弧插值旋轉
        let diff = targetAngle - this.group.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.group.rotation.y += diff * Math.min(1, delta * 12);
      }
    }

    // 行走 / 待機動畫更新
    if (this.isMoving) {
      this.walkAnimTime += delta * 12;
      const angle = Math.sin(this.walkAnimTime) * 0.6;
      this.leftLegPivot.rotation.x = angle;
      this.rightLegPivot.rotation.x = -angle;
      this.leftArmPivot.rotation.x = -angle * 0.9;
      this.rightArmPivot.rotation.x = angle * 0.9;

      // 走路微幅起伏
      this.bodyMesh.position.y = 1.35 + Math.abs(Math.sin(this.walkAnimTime * 2)) * 0.08;
      this.headGroup.position.y = 2.3 + Math.abs(Math.sin(this.walkAnimTime * 2)) * 0.08;
    } else {
      // 緩慢呼吸待機動畫
      this.walkAnimTime += delta * 2;
      const idleArm = Math.sin(this.walkAnimTime) * 0.05;
      this.leftLegPivot.rotation.x *= 0.85;
      this.rightLegPivot.rotation.x *= 0.85;
      this.leftArmPivot.rotation.x = idleArm;
      this.rightArmPivot.rotation.x = -idleArm;
      this.bodyMesh.position.y = 1.35;
      this.headGroup.position.y = 2.3 + Math.sin(this.walkAnimTime) * 0.02;
    }
  }
}
