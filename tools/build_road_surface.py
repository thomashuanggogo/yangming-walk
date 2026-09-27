"""Rebuild vector road polygons after editing real_roads.js.
Run from project root: python tools/build_road_surface.py
Build-time dependency: shapely 2.x. Then run node build_bundle_3d.js.
"""
from pathlib import Path
import json
from shapely.geometry import LineString
from shapely.ops import unary_union

root = Path(__file__).resolve().parents[1]
raw = (root / 'src/world/real_roads.js').read_text(encoding='utf-8')
data = json.loads(raw[raw.index('{'):].strip().rstrip(';'))
paths = {'footway', 'path', 'steps', 'pedestrian', 'track'}
asphalt = unary_union([LineString(r['points']).buffer(r['width']/2, quad_segs=4)
                      for r in data['roads'] if len(r['points']) > 1 and r['kind'] not in paths])
walking = unary_union([LineString(r['points']).buffer(r['width']/2, quad_segs=4)
                      for r in data['roads'] if len(r['points']) > 1 and r['kind'] in paths]).difference(asphalt)
shapes=[]
for surface,color in [(asphalt,0x2d3136),(walking,0xb6a68b)]:
    polygons = list(surface.geoms) if surface.geom_type == 'MultiPolygon' else [surface]
    shapes.extend({'outer':list(p.exterior.coords),'holes':[list(h.coords) for h in p.interiors], 'color':color}
                  for p in polygons if not p.is_empty)
(root / 'src/world/road_surface.js').write_text(
    'export const ROAD_SURFACE = ' + json.dumps(shapes, separators=(',', ':')) + ';\n', encoding='utf-8')
