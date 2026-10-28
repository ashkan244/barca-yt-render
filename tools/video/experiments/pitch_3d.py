"""Optional Blender 4.3+ still experiment: original schematic, not match reconstruction.
blender --background --factory-startup --python-exit-code 1 --python tools/video/experiments/pitch_3d.py -- --output /tmp/pitch.png
"""
import argparse, math, sys
from pathlib import Path
import bpy
from mathutils import Vector

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output',type=Path,required=True)
parser.add_argument('--view',choices=['oblique','top'],default='oblique')
parser.add_argument('--samples',type=int,default=24)
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
if args.samples<1:parser.error('--samples must be positive')
if args.output.suffix.lower()!='.png':parser.error('--output must end in .png')
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=args.samples
# This managed Blender build has no OpenImageDenoise backend.
scene.cycles.use_denoising=False
scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False
scene.world.color=(.025,.035,.06)
scene.view_settings.view_transform='AgX'
scene.view_settings.look='AgX - Medium High Contrast'

def material(name,color,roughness=.6,emission=False):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 bsdf=m.node_tree.nodes.get('Principled BSDF');bsdf.inputs['Base Color'].default_value=(*color,1);bsdf.inputs['Roughness'].default_value=roughness
 if emission:bsdf.inputs['Emission Color'].default_value=(*color,1);bsdf.inputs['Emission Strength'].default_value=.8
 return m
navy=material('Midnight',(0.015,.025,.05));pitch=material('Pitch',(.025,.14,.13));stripe=material('Stripe',(.03,.17,.15));line=material('Markings',(.38,.63,.57));red=material('Barca',(.49,.025,.10),.35);white=material('Madrid',(.86,.89,.91),.35);gold=material('Accent',(.95,.61,.06),.4);zone=material('Illustrated space',(.26,.21,.055));text=material('Overlay',(0.9,.94,1),emission=True);gold_text=material('Gold text',(1,.7,.08),emission=True)

def cube(name,loc,size,mat,bevel=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat)
 if bevel:
  b=o.modifiers.new('Soft edges','BEVEL');b.width=bevel;b.segments=3;o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return o

def tube(name,points,mat,r=.13):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=r;c.bevel_resolution=3;s=c.splines.new('POLY');s.points.add(len(points)-1)
 for p,v in zip(s.points,points):p.co=(*v,1)
 o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);o.data.materials.append(mat);return o

cube('Stage',(0,0,-3.3),(240,200,2),navy)
cube('Pitch plinth',(0,0,-1.3),(88,58,2),navy,1)
cube('Pitch',(0,0,-.2),(84,54,.3),pitch)
for i in range(8):
 if i%2==0:cube('Mowing stripe',(-36.75+i*10.5,0,-.035),(10.5,54,.025),stripe)
tube('Touchline',[(-41,-26,.04),(41,-26,.04),(41,26,.04),(-41,26,.04),(-41,-26,.04)],line)
tube('Halfway',[(0,-26,.04),(0,26,.04)],line)
ring=[(7.32*math.cos(i*2*math.pi/96),7.32*math.sin(i*2*math.pi/96),.04) for i in range(97)];tube('Centre circle',ring,line)
for side in [-1,1]:
 x=side*41;inner=side*28
 tube('Penalty area',[(x,-16,.04),(inner,-16,.04),(inner,16,.04),(x,16,.04)],line)
 tube('Goal',[(side*42,-3.7,0),(side*42,-3.7,2.4),(side*42,3.7,2.4),(side*42,3.7,0)],white,.18)
cube('Schematic open zone',(-23,0,.06),(22,43,.07),zone)
for y in [-18,-6,6,18]:
 tube('Illustrative line segment',[(-6,y-3.5,.16),(-6,y+3.5,.16)],gold,.16)

def player(name,xy,mat):
 x,y=xy
 bpy.ops.mesh.primitive_cylinder_add(vertices=32,radius=1.18,depth=1.25,location=(x,y,.8));o=bpy.context.object;o.name=name;o.data.materials.append(mat)
 bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,radius=.9,location=(x,y,2.05));bpy.context.object.data.materials.append(mat)
 bpy.ops.object.shade_smooth()
for i,y in enumerate([-18,-6,6,18]):player('Schematic Barca defender '+str(i),(-6,y),red)
for i,xy in enumerate([(5,-12),(11,11)]):player('Schematic runner '+str(i),xy,white)
# One original illustrative run. Neither start/end nor dimensions come from tracking.
tube('Illustrative run',[(5,-12,1.1),(-28,-12,1.1)],gold,.27)
tube('Arrowhead',[(-23,-15,1.1),(-28,-12,1.1),(-23,-9,1.1)],gold,.27)
bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=.65,location=(7,-14,.7));bpy.context.object.data.materials.append(white)

bpy.ops.object.light_add(type='AREA',location=(8,-20,65));bpy.context.object.data.energy=125000;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=55
bpy.ops.object.light_add(type='AREA',location=(-45,35,35));bpy.context.object.data.energy=55000;bpy.context.object.data.size=35;bpy.context.object.data.color=(.4,.6,1)
bpy.ops.object.camera_add(location=(65,-75,72) if args.view=='oblique' else (0,0,120));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,0))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=118 if args.view=='oblique' else 112;scene.camera=cam
fontpath=Path(__file__).resolve().parents[3]/'studio/public/fonts/anton/Anton-Regular.ttf'
font=bpy.data.fonts.load(str(fontpath)) if fontpath.exists() else None

def overlay(body,x,y,size,mat):
 c=bpy.data.curves.new('Overlay text','FONT');c.body=body;c.size=size;c.extrude=0;c.space_character=1.05
 if font:c.font=font
 o=bpy.data.objects.new(body,c);bpy.context.collection.objects.link(o);o.parent=cam;o.location=(x,y,-2);o.data.materials.append(mat)
overlay('BARCA RADAR / TACTICAL LAB',-53,27,2.1,gold_text)
overlay('THE SPACE BEHIND',-53,20.2,5.7,text)
overlay('3D CONCEPT STUDY / ORIGINAL SCHEMATIC / NOT MATCH TRACKING',-53,-29,2.0,text)
args.output.parent.mkdir(parents=True,exist_ok=True);scene.render.filepath=str(args.output.resolve());bpy.ops.render.render(write_still=True)
