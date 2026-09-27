from pathlib import Path
import json,math,heapq,collections
p=Path(__file__).resolve().parents[1];f=p/'src/world/real_roads.js';raw=f.read_text(encoding='utf-8');d=json.loads(raw[raw.index('{'):].strip().rstrip(';'))
source=p/'assets/roads-source-network.json'
if not source.exists():source.write_text(json.dumps(d['roads'],ensure_ascii=False,separators=(',',':')),encoding='utf-8')
roads=json.loads(source.read_text(encoding='utf-8'))
def key(pt):return tuple(round(v,3) for v in pt)
graph=collections.defaultdict(list);edges=[]
for ri,r in enumerate(roads):
 for si,(a,b) in enumerate(zip(r['points'],r['points'][1:])):
  u,v=key(a),key(b);length=math.dist(a,b)
  if length<.001:continue
  ei=len(edges);edges.append((ri,si,u,v));cost=length*(1.3 if r['kind'] in ['footway','path','steps','pedestrian','track'] else 1)
  graph[u].append((v,cost,ei));graph[v].append((u,cost,ei))
# Keep only real connected geometry, never draw invented straight-line connectors.
components={};sizes=[]
for start in graph:
 if start in components:continue
 n=len(sizes);stack=[start];components[start]=n;count=0
 while stack:
  u=stack.pop();count+=1
  for v,_,_ in graph[u]:
   if v not in components:components[v]=n;stack.append(v)
 sizes.append(count)
largest=max(range(len(sizes)),key=lambda i:sizes[i])
names={'陽明路一段','陽明路二段','仰德大道三段','仰德大道四段','愛富二街','愛富一街','愛富三街','菁山路','格致路','建業路','華岡路','凱旋路','國泰街','長春街','新園街','中庸一路','光華路','湖山路一段','湖山路二段','中興路','紗帽路','泉源路'}
backbone={i for i,r in enumerate(roads) if r['name'] in names and any(components.get(key(p))==largest for p in r['points'])}
selected={ei for ei,(ri,si,u,v) in enumerate(edges) if ri in backbone and components[u]==largest}
dist={};prev={};queue=[]
for ei in selected:
 for u in edges[ei][2:]:
  if u not in dist:dist[u]=0;heapq.heappush(queue,(0,u))
while queue:
 cost,u=heapq.heappop(queue)
 if cost!=dist[u]:continue
 for v,weight,ei in graph[u]:
  nxt=cost+weight
  if nxt<dist.get(v,math.inf):dist[v]=nxt;prev[v]=(u,ei);heapq.heappush(queue,(nxt,v))
access=[]
for place in d['placements']:
 px,pz=place['entrance'];best=None
 for ei,(ri,si,u,v) in enumerate(edges):
  if u not in dist or v not in dist:continue
  dx,dz=v[0]-u[0],v[1]-u[1];den=dx*dx+dz*dz;t=max(0,min(1,((px-u[0])*dx+(pz-u[1])*dz)/den));gap=math.hypot(px-u[0]-t*dx,pz-u[1]-t*dz)
  # Prefer a visible arterial if almost as close; otherwise keep the short approach.
  score=gap+(0 if ri in backbone else 1.5)
  if best is None or score<best[0]:best=(score,ei,gap)
 _,ei,gap=best;selected.add(ei);ri,si,u,v=edges[ei];node=min((u,v),key=lambda n:dist[n])
 while node in prev:
  node,pathEdge=prev[node];selected.add(pathEdge)
 access.append({'code':place['code'],'name':place['name'],'approachRoad':roads[ri]['name'] or '地標連接步道','entranceDistanceUnits':round(gap,2),'connectedToMainRoad':True})
# Keep the retained streets mutually connected through the few real junction links
# that may be unnamed or classified as a lane in OSM.
connectorEdges=set()
while True:
 view=collections.defaultdict(set)
 for ei in selected:
  _,_,u,v=edges[ei];view[u].add(v);view[v].add(u)
 groups=[];seen=set()
 for start in view:
  if start in seen:continue
  group={start};seen.add(start);stack=[start]
  while stack:
   u=stack.pop()
   for v in view[u]:
    if v not in seen:seen.add(v);group.add(v);stack.append(v)
  groups.append(group)
 if len(groups)==1:break
 base=max(groups,key=len);targets=set(view)-base;costs={u:0 for u in base};parents={};queue=[(0,u) for u in base];heapq.heapify(queue);found=None
 while queue:
  cost,u=heapq.heappop(queue)
  if cost!=costs[u]:continue
  if u in targets:found=u;break
  for v,w,ei in graph[u]:
   nxt=cost+w
   if nxt<costs.get(v,math.inf):costs[v]=nxt;parents[v]=(u,ei);heapq.heappush(queue,(nxt,v))
 if found is None:raise RuntimeError('Cannot connect retained roads using real mapped segments')
 while found in parents:
  found,ei=parents[found];selected.add(ei);connectorEdges.add(ei)
byRoad=collections.defaultdict(set)
for ei in selected:
 ri,si,_,_=edges[ei];byRoad[ri].add(si)
visible=[]
for ri,indices in byRoad.items():
 r=roads[ri];start=None
 for i in range(len(r['points'])):
  if i in indices:
   if start is None:start=i
  elif start is not None:
   visible.append({**r,'id':f"{r['id']}-view-{start}",'points':r['points'][start:i+1],'displayRole':'main' if ri in backbone else 'landmark-access'});start=None
d['roads']=visible;d['roadSelection']={'policy':'Named main streets plus shortest existing mapped approaches to landmarks and necessary junction links; other lanes and trails hidden.','sourceRoadParts':len(roads),'displayRoadParts':len(visible),'connectedComponents':1,'landmarkConnections':access,'mainStreetNames':sorted(names)}
d.pop('roadAudit',None)
f.write_text('/** OpenStreetMap contributors, ODbL 1.0. Selected main streets and landmark approaches. */\nwindow.REAL_ROADS = '+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
(p/'ROAD_SELECTION_AUDIT.json').write_text(json.dumps(d['roadSelection'],ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'source':len(roads),'visible':len(visible),'landmarksConnected':len(access),'maxEntranceOffset':max(a['entranceDistanceUnits'] for a in access),'requiredNames':{n:any(r['name']==n for r in visible) for n in ['陽明路一段','仰德大道四段','愛富二街','菁山路']}},ensure_ascii=False))
