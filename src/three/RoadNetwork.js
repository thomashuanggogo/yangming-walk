import { ROAD_SURFACE } from '../world/road_surface.js';
import * as THREE from '../../assets/three.module.js';
import { REAL_ROADS } from '../world/real_roads.js';

/** One road surface avoids coplanar triangles at intersections. */
export class RoadNetwork {
  constructor() {
    this.data = REAL_ROADS;
    this.halfSize = REAL_ROADS.projection.halfSize;
    this.size = this.halfSize * 2;
    this.placements = new Map(REAL_ROADS.placements.map(p => [p.id,p]));
    this.segments = [];
    for (const road of REAL_ROADS.roads) {
      for (let i=1;i<road.points.length;i++) this.segments.push({a:road.points[i-1],b:road.points[i],road});
    }
  }

  worldToMap(x,z) {
    return {x:(x+this.halfSize)/this.size*1024,y:(z+this.halfSize)/this.size*1024};
  }

  worldToGeo(x,z) {
    const p=this.data.projection;
    return {lon:p.lon+x/p.unitsPerMeter/p.metersPerLongitudeDegree,lat:p.lat-z/p.unitsPerMeter/p.metersPerLatitudeDegree};
  }

  nearest(x,z) {
    let best={distance:Infinity,clearance:Infinity};
    for (const {a,b,road} of this.segments) {
      const dx=b[0]-a[0],dz=b[1]-a[1],len=dx*dx+dz*dz;
      const t=len ? Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/len)) : 0;
      const px=a[0]+t*dx,pz=a[1]+t*dz,distance=Math.hypot(x-px,z-pz);
      if(distance<best.distance) best={x:px,z:pz,distance,clearance:distance-road.width/2,road};
    }
    return best;
  }

  contains(x,z) {
    const ring=this.data.boundary;let inside=false;
    for(let i=0,j=ring.length-1;i<ring.length;j=i++) {
      const a=ring[i],b=ring[j];
      if((a[1]>z)!==(b[1]>z) && x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
    }
    return inside;
  }

  draw(canvas,overview=false) {
    const ctx=canvas.getContext('2d'),s=canvas.width/this.size;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const trace=points=>{ctx.beginPath();points.forEach((p,i)=>{const x=(p[0]+this.halfSize)*s,y=(p[1]+this.halfSize)*s;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});};
    if(overview) {
      ctx.fillStyle='#edeedc';ctx.fillRect(0,0,canvas.width,canvas.height);
      trace(this.data.boundary);ctx.closePath();ctx.fillStyle='#cbd9b6';ctx.fill();
      for(const park of this.data.parks||[]) {trace(park.outer);ctx.closePath();ctx.fillStyle='#bdd5a9';ctx.fill();}
      for(const lake of this.data.waters||[]) {trace(lake.outer);ctx.closePath();ctx.fillStyle='#77b6c2';ctx.fill();}
    }
    const order={steps:0,path:0,footway:0,track:1,pedestrian:1,service:2,living_street:2,residential:3,unclassified:3,tertiary:4,secondary:5,primary:6};
    const roads=[...this.data.roads].sort((a,b)=>order[a.kind]-order[b.kind]);
    ctx.lineCap='round';ctx.lineJoin='round';
    for(const road of roads) {
      trace(road.points);
      // 地面道路只留下純淨平整的柏油路面 (Dark Asphalt)
      // 小徑巷弄與主要幹道皆統一採用質感深黑灰柏油，乾淨俐落
      ctx.strokeStyle = overview ? '#faf8ed' : '#2d3136';
      // 依道路等級給予適度厚實的柏油路面寬度
      const baseW = road.width || 1.6;
      ctx.lineWidth = Math.max(overview ? 1.1 : 0.8, baseW * s);
      ctx.stroke();
    }
    if (overview) {
      trace(this.data.boundary);ctx.closePath();ctx.strokeStyle='#768e69';ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);
      const names=['格致路','菁山路','建業路','華岡路','仰德大道四段','中庸一路','新園街','陽明路一段','光華路','凱旋路','湖山路一段','湖山路二段','陽明路二段','中興路'];
      ctx.font='15px "Microsoft JhengHei",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      const labels=[];
      for(const name of names) {
        const longest=roads.filter(r=>r.name===name).sort((a,b)=>b.points.length-a.points.length)[0];if(!longest)continue;
        const p=longest.points[Math.floor(longest.points.length/2)],x=(p[0]+this.halfSize)*s,y=(p[1]+this.halfSize)*s;
        if(labels.some(q=>Math.hypot(q.x-x,q.y-y)<35))continue;
        ctx.lineWidth=4;ctx.strokeStyle='#f9f8ec';ctx.strokeText(name,x,y);ctx.fillStyle='#405c48';ctx.fillText(name,x,y);labels.push({x,y});
      }
      ctx.textAlign='left';ctx.fillStyle='#405c48';ctx.font='bold 22px "Microsoft JhengHei",sans-serif';ctx.fillText('北 ↑',30,40);
    }
  }

  createSurface() {
    // Unioned vector polygons keep junctions flat and edges sharp at every zoom.
    const group = new THREE.Group();
    for(const color of [0x2d3136,0xb6a68b]) {
    const shapes = ROAD_SURFACE.filter(p => (p.color || 0x2d3136) === color).map(polygon => {
      const shape = new THREE.Shape(polygon.outer.map(([x,z]) => new THREE.Vector2(x,-z)));
      shape.holes = polygon.holes.map(ring => new THREE.Path(ring.map(([x,z]) => new THREE.Vector2(x,-z))));
      return shape;
    });
    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shapes), new THREE.MeshLambertMaterial({color}));
    mesh.name = 'real-road-network';
    mesh.rotation.x = -Math.PI/2;
    mesh.position.y = .055;
    mesh.receiveShadow = true;
    group.add(mesh);
    }
    return group;
  }

  minimapImage() {
    if(!this.mapImage) {
      const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;
      this.draw(canvas,true);this.mapImage=canvas.toDataURL('image/png');
    }
    return this.mapImage;
  }
}
