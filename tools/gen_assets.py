# Membuat 2 model GLB orisinal (topi toga + kacamata) beranimasi. Jalankan: python tools/gen_assets.py
import struct, json, math
def box(w,h,d,c=(0,0,0)):
    hh=(w/2,h/2,d/2);P=[];N=[];I=[]
    F=[((1,0,0),(0,1,0),(0,0,1)),((-1,0,0),(0,1,0),(0,0,-1)),((0,1,0),(0,0,1),(1,0,0)),((0,-1,0),(0,0,1),(-1,0,0)),((0,0,1),(1,0,0),(0,1,0)),((0,0,-1),(-1,0,0),(0,1,0))]
    for n,u,v in F:
        hn=sum(abs(n[i])*hh[i] for i in range(3));hu=sum(abs(u[i])*hh[i] for i in range(3));hv=sum(abs(v[i])*hh[i] for i in range(3))
        b=len(P)//3
        for a,bb in((-1,-1),(1,-1),(1,1),(-1,1)):
            P+=[c[i]+n[i]*hn+a*u[i]*hu+bb*v[i]*hv for i in range(3)];N+=list(n)
        I+=[b,b+1,b+2,b,b+2,b+3]
    return P,N,I
def cyl(r,h,c=(0,0,0),n=24):
    P=[];N=[];I=[];y0=c[1]-h/2;y1=c[1]+h/2
    for i in range(n+1):
        a=2*math.pi*i/n;x=math.cos(a);z=math.sin(a)
        P+=[c[0]+r*x,y0,c[2]+r*z,c[0]+r*x,y1,c[2]+r*z];N+=[x,0,z,x,0,z]
    for i in range(n):
        b=2*i;I+=[b,b+2,b+1,b+1,b+2,b+3]
    for y,ny in((y0,-1),(y1,1)):
        b=len(P)//3;P+=[c[0],y,c[2]];N+=[0,ny,0]
        for i in range(n+1):
            a=2*math.pi*i/n;P+=[c[0]+r*math.cos(a),y,c[2]+r*math.sin(a)];N+=[0,ny,0]
        for i in range(n):I+=[b,b+1+i,b+2+i]
    return P,N,I
class G:
    def __init__(s):s.b=bytearray();s.bv=[];s.ac=[];s.me=[];s.ma=[];s.no=[];s.an=[]
    def acc(s,data,fmt,ct,typ,target=None):
        k={"SCALAR":1,"VEC3":3,"VEC4":4}[typ];off=len(s.b);raw=struct.pack("<%d%s"%(len(data),fmt),*data);s.b+=raw
        while len(s.b)%4:s.b.append(0)
        v={"buffer":0,"byteOffset":off,"byteLength":len(raw)}
        if target:v["target"]=target
        s.bv.append(v);a={"bufferView":len(s.bv)-1,"componentType":ct,"count":len(data)//k,"type":typ}
        if fmt=="f":a["min"]=[min(data[i::k]) for i in range(k)];a["max"]=[max(data[i::k]) for i in range(k)]
        s.ac.append(a);return len(s.ac)-1
    def mat(s,rgb,m=0.1,r=0.6,a=1.0,em=None):
        d={"pbrMetallicRoughness":{"baseColorFactor":[*rgb,a],"metallicFactor":m,"roughnessFactor":r},"doubleSided":True}
        if a<1:d["alphaMode"]="BLEND"
        if em:d["emissiveFactor"]=list(em)
        s.ma.append(d);return len(s.ma)-1
    def mesh(s,parts,mat):
        P=[];N=[];I=[]
        for p,n,i in parts:
            b=len(P)//3;P+=p;N+=n;I+=[b+x for x in i]
        pa=s.acc(P,"f",5126,"VEC3",34962);na=s.acc(N,"f",5126,"VEC3",34962);ia=s.acc(I,"H",5123,"SCALAR",34963)
        s.me.append({"primitives":[{"attributes":{"POSITION":pa,"NORMAL":na},"indices":ia,"material":mat}]});return len(s.me)-1
    def node(s,name,mesh=None,t=None,r=None,ch=None):
        d={"name":name}
        if mesh is not None:d["mesh"]=mesh
        if t:d["translation"]=list(t)
        if r:d["rotation"]=list(r)
        if ch:d["children"]=ch
        s.no.append(d);return len(s.no)-1
    def anim(s,name,chs):
        sm=[];cs=[]
        for nodes,path,times,vals in chs:
            ti=s.acc(times,"f",5126,"SCALAR");vi=s.acc(vals,"f",5126,"VEC4" if path=="rotation" else "VEC3")
            sm.append({"input":ti,"output":vi,"interpolation":"LINEAR"})
            for n in nodes:cs.append({"sampler":len(sm)-1,"target":{"node":n,"path":path}})
        s.an.append({"name":name,"samplers":sm,"channels":cs})
    def save(s,path,roots):
        j={"asset":{"version":"2.0","generator":"gen_assets.py"},"scene":0,"scenes":[{"nodes":roots}],"nodes":s.no,"meshes":s.me,"materials":s.ma,"accessors":s.ac,"bufferViews":s.bv,"buffers":[{"byteLength":len(s.b)}]}
        if s.an:j["animations"]=s.an
        js=json.dumps(j,separators=(",",":")).encode();js+=b" "*((4-len(js)%4)%4);bn=bytes(s.b)
        out=struct.pack("<III",0x46546C67,2,12+8+len(js)+8+len(bn))+struct.pack("<II",len(js),0x4E4F534A)+js+struct.pack("<II",len(bn),0x004E4942)+bn
        open(path,"wb").write(out);print(path,len(out),"bytes")
def qz(deg):a=math.radians(deg)/2;return [0,0,math.sin(a),math.cos(a)]
# ---- Topi toga: tassel berayun ----
g=G();navy=g.mat((0.03,0.06,0.2),0.1,0.7);gold=g.mat((1,0.7,0.1),0.8,0.3)
cap=g.node("Cap",g.mesh([cyl(0.42,0.3,(0,0.15,0))],navy));bd=g.node("Board",g.mesh([box(1.3,0.05,1.3,(0,0.32,0))],navy))
bt=g.node("Button",g.mesh([cyl(0.05,0.04,(0,0.355,0))],gold));cd=g.node("Cord",g.mesh([box(0.55,0.02,0.02,(0.275,0.36,0))],gold))
tb=g.node("TasselBody",g.mesh([box(0.05,0.3,0.05,(0,-0.15,0)),box(0.09,0.06,0.09,(0,-0.02,0))],gold))
ts=g.node("Tassel",t=(0.55,0.36,0),ch=[tb]);root=g.node("Toga",ch=[cap,bd,bt,cd,ts])
ang=[0,25,0,-25,0];g.anim("TasselSwing",[([ts],"rotation",[0,.6,1.2,1.8,2.4],sum([qz(a) for a in ang],[]))])
g.save("assets/toga.glb",[root])
# ---- Kacamata berkilau: bintang berputar ----
g=G();blk=g.mat((0.04,0.04,0.06),0.5,0.3);ln=g.mat((0.4,0.7,1),0,0.1,0.35);sp=g.mat((1,1,0.8),0,0.2,1,em=(1,0.9,0.4))
fr=[];ls=[]
for sx in(-1,1):
    cx=sx*0.36;fr+=[box(0.52,0.05,0.04,(cx,0.17,0)),box(0.52,0.05,0.04,(cx,-0.17,0)),box(0.05,0.34,0.04,(cx-0.26,0,0)),box(0.05,0.34,0.04,(cx+0.26,0,0)),box(0.04,0.04,0.7,(sx*0.64,0.1,-0.35))];ls.append(box(0.5,0.34,0.01,(cx,0,0)))
fr.append(box(0.2,0.05,0.04,(0,0.12,0)))
fn=g.node("Frame",g.mesh(fr,blk));lns=g.node("Lens",g.mesh(ls,ln))
bm=g.mesh([box(0.3,0.05,0.02),box(0.05,0.3,0.02)],sp)
s1=g.node("Sparkle1",bm,t=(0.55,0.22,0.05));s2=g.node("Sparkle2",bm,t=(-0.5,-0.12,0.05))
root=g.node("Glasses",ch=[fn,lns,s1,s2])
g.anim("Sparkle",[([s1,s2],"rotation",[0,.5,1,1.5,2],sum([qz(a) for a in(0,90,180,270,360)],[])),([s1,s2],"scale",[0,1,2],[1,1,1,1.6,1.6,1.6,1,1,1])])
g.save("assets/kacamata.glb",[root])
