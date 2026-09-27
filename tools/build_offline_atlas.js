const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const raw=fs.readFileSync(path.join(root,'src/world/landmarks.js'),'utf8');const landmarks=JSON.parse(raw.split('export const LANDMARKS =')[1].trim().replace(/;$/,''));
const images=JSON.parse(fs.readFileSync(path.join(root,'assets/atlas-thumbnails.json'),'utf8'));
for(const item of landmarks){if(!images[item.id])throw Error('Missing model image: '+item.id);}
const data=landmarks.map(item=>({...item,image:images[item.id]}));
const html=fs.readFileSync(path.join(root,'src/preview/offline-atlas.html'),'utf8').replace('/* ATLAS_DATA */ []',JSON.stringify(data).replace(/</g,'\\u003c'));
fs.writeFileSync(path.join(root,'陽明山散步圖鑑.html'),html);
fs.writeFileSync(path.join(root,'assets/atlas-export.js'),'window.YANGMING_ATLAS_HTML = '+JSON.stringify(html)+';');
console.log('Offline atlas: '+data.length+' places, '+Math.round(Buffer.byteLength(html)/1024)+' KB');
