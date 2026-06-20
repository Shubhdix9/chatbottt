import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════
    //  HERO → CHAT TRANSITION
    // ═══════════════════════════════════════
    const heroSection = document.getElementById('hero-section');
    const chatLayer   = document.getElementById('chat-layer');
    const heroForm    = document.getElementById('hero-form');
    const heroInput   = document.getElementById('hero-input');

    // Typing placeholder effect
    const base = "Make me a";
    const words = [" fitness app"," recipe generator"," marketing landing page"," travel planner"," blog engine"," chatbot"," finance dashboard"];
    let wi = 0, ci = 0, del = false;

    function tick() {
        if (!heroInput || heroInput.value !== "") return;
        const w = words[wi % words.length];
        if (!del) {
            ci++;
            heroInput.setAttribute('placeholder', base + w.slice(0, ci));
            if (ci >= w.length) { del = true; setTimeout(tick, 1200); return; }
            setTimeout(tick, 70);
        } else {
            ci--;
            heroInput.setAttribute('placeholder', base + w.slice(0, ci));
            if (ci <= 0) { del = false; wi = (wi + 1) % words.length; setTimeout(tick, 400); return; }
            setTimeout(tick, 40);
        }
    }
    setTimeout(tick, 500);

    // Submit → smooth transition
    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const prompt = heroInput.value.trim();

            // Fade out hero
            heroSection.classList.add('hero--hidden');

            // Fade in chat after a beat
            setTimeout(() => {
                chatLayer.classList.remove('chat-layer--hidden');

                // Auto-submit the prompt to the chatbot
                if (prompt) {
                    const chatInput = document.getElementById('user-input');
                    const sendBtn   = document.getElementById('send-btn');
                    if (chatInput && sendBtn) {
                        chatInput.value = prompt;
                        sendBtn.click();
                    }
                }
            }, 350);
        });
    }

    // ═══════════════════════════════════════
    //  THREE.JS WAVE — FULL SCREEN
    // ═══════════════════════════════════════
    const FilmGrainShader = {
        uniforms: {
            tDiffuse:   { value: null },
            time:       { value: 0 },
            intensity:  { value: 1.1 },
            grainScale: { value: 0.5 },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision mediump float;
            uniform sampler2D tDiffuse;
            uniform float time, intensity, grainScale;
            varying vec2 vUv;
            float sparkle(vec2 p) {
                vec2 j = p + vec2(37.0,17.0)*fract(time*0.07);
                vec3 p3 = fract(vec3(j.xyx)*vec3(.1031,.1030,.0973)+time*0.1);
                p3 += dot(p3, p3.yxz+19.19);
                return fract((p3.x+p3.y)*p3.z);
            }
            void main() {
                vec4 c = texture2D(tDiffuse, vUv);
                float n = sparkle(gl_FragCoord.xy*0.5*grainScale)*2.0-1.0;
                gl_FragColor = vec4(c.rgb + n*intensity*0.1, c.a);
            }
        `,
    };

    function createGrainPass(i,s) {
        const p = new ShaderPass(FilmGrainShader);
        p.uniforms.intensity.value = i||0.9;
        p.uniforms.grainScale.value = s||0.3;
        return p;
    }

    const wave1 = {gain:10,frequency:0,waveLength:0.5,currentAngle:0};
    const wave2 = {gain:0,frequency:0,waveLength:0.5,currentAngle:0};

    const kf1 = [
        {time:0,gain:10,frequency:0,waveLength:0.5},
        {time:4,gain:300,frequency:1,waveLength:0.5},
        {time:6,gain:300,frequency:4,waveLength:Math.PI*1.5},
        {time:8,gain:225,frequency:4,waveLength:Math.PI*1.5},
        {time:10,gain:500,frequency:1,waveLength:Math.PI*1.5},
        {time:14,gain:225,frequency:3,waveLength:Math.PI*1.5},
        {time:22,gain:100,frequency:6,waveLength:Math.PI*1.5},
        {time:28,gain:0,frequency:0.9,waveLength:0.5},
        {time:30,gain:128,frequency:0.9,waveLength:0.5},
        {time:32,gain:190,frequency:1.42,waveLength:0.5},
        {time:39,gain:499,frequency:4,waveLength:Math.PI*1.5},
        {time:40,gain:500,frequency:4,waveLength:Math.PI*1.5},
        {time:42,gain:400,frequency:2.82,waveLength:Math.PI*1.5},
        {time:44,gain:327,frequency:2.56,waveLength:Math.PI*1.5},
        {time:48,gain:188,frequency:5.4,waveLength:0.5},
        {time:52,gain:32,frequency:0.1,waveLength:0.5},
        {time:55,gain:10,frequency:0,waveLength:0.5},
    ];
    const kf2 = [
        {time:0,gain:0,frequency:0,waveLength:0.5},
        {time:9,gain:0,frequency:0,waveLength:0.5},
        {time:10,gain:400,frequency:1,waveLength:0.5},
        {time:13,gain:300,frequency:4,waveLength:Math.PI*1.5},
        {time:24,gain:96,frequency:2,waveLength:0.5},
        {time:28,gain:0,frequency:0.9,waveLength:0.5},
        {time:30,gain:142,frequency:0.9,waveLength:0.5},
        {time:36,gain:374,frequency:4,waveLength:Math.PI*1.5},
        {time:38,gain:375,frequency:4,waveLength:Math.PI*1.5},
        {time:40,gain:300,frequency:2.26,waveLength:Math.PI*1.5},
        {time:44,gain:245,frequency:2.05,waveLength:Math.PI*1.5},
        {time:48,gain:141,frequency:5.12,waveLength:0.5},
        {time:52,gain:24,frequency:0.08,waveLength:0.5},
        {time:55,gain:8,frequency:0,waveLength:0.5},
    ];

    const mouse = {x:0,y:0,active:false};
    let proxyX=0,proxyY=0,proxyInit=false;

    const gCfg = {maxGlowDist:690,speedScale:0.52,glowFalloff:0.6,mouseSmoothing:30};
    const gDyn = {decay:3.3,max:40,accumEase:1.5,speedEase:8.5};

    let DPR = Math.min(window.devicePixelRatio, window.matchMedia("(max-resolution:180dpi)").matches?1.5:2)*0.5;

    const container = document.getElementById('waveCanvas');
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({antialias:false,alpha:true});
    renderer.setPixelRatio(DPR);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff,0.2));

    let cam, composer, bloomPass, grain;
    let camW=0, camH=0, ready=false;
    let setNDC, setSpeed, setPh1, setPh2;

    const MAX_BARS=256, BAR_W=14, BAR_GAP=10, EXT=320;
    let mesh=null, barN=0, barMat, barCX=null;

    function updateGlowDist() {
        if(!barMat)return;
        const s = barN*(BAR_W+BAR_GAP)-BAR_GAP;
        gCfg.maxGlowDist = s*0.3;
        barMat.uniforms.uMaxGlowDist.value = s*0.3;
    }

    function makeMat() {
        return new THREE.ShaderMaterial({
            defines:{USE_INSTANCING:""},
            uniforms:{
                uMouseClipX:{value:0},uHalfW:{value:0},
                uMaxGlowDist:{value:gCfg.maxGlowDist},uGlowFalloff:{value:gCfg.glowFalloff},
                uSmoothSpeed:{value:0},uGainMul:{value:1},uBaseY:{value:0},
                w1Gain:{value:wave1.gain},w1Len:{value:wave1.waveLength},w1Phase:{value:0},
                w2Gain:{value:wave2.gain},w2Len:{value:wave2.waveLength},w2Phase:{value:0},
                uFixedTipPx:{value:10},uMinBottomWidthPx:{value:0},
                uColor:{value:new THREE.Color("hsl(220,100%,50%)")},
                uEmissive:{value:new THREE.Color("#1f3dbc")},
                uBaseEmissive:{value:0.05},
                uRotationAngle:{value:THREE.MathUtils.degToRad(23.4)},
            },
            vertexShader:`
                attribute float aXPos,aPosNorm,aGroup,aGlow;
                uniform float uMouseClipX,uHalfW,uMaxGlowDist,uGlowFalloff;
                uniform float uGainMul,uBaseY;
                uniform float w1Gain,w1Len,w1Phase,w2Gain,w2Len,w2Phase;
                uniform float uRotationAngle;
                varying float vGlow,vPulse,vHeight;
                varying vec2 vUv;
                float sH(float g,float l,float p,float t){return max(20.0,(sin(p+t*l)*0.5+0.6)*g*uGainMul);}
                void main(){
                    vUv=uv;
                    float h1=sH(w1Gain,w1Len,w1Phase,aPosNorm);
                    float h2=sH(w2Gain,w2Len,w2Phase,aPosNorm);
                    vHeight=mix(h1,h2,aGroup);
                    vec3 pos=position;pos.x+=aXPos;pos.y=0.0;
                    float h=vHeight*uv.y;
                    pos.x+=h*tan(uRotationAngle);pos.y+=h;pos.y+=uBaseY;
                    vec4 clip=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
                    float dx=abs(uMouseClipX-clip.x/clip.w)*uHalfW;
                    vPulse=clamp(1.0-pow(dx/uMaxGlowDist,uGlowFalloff),0.0,1.0);
                    vGlow=aGlow;gl_Position=clip;
                }`,
            fragmentShader:`
                precision mediump float;
                uniform vec3 uColor,uEmissive;
                uniform float uBaseEmissive,uFixedTipPx,uMinBottomWidthPx;
                varying float vGlow,vPulse,vHeight;
                varying vec2 vUv;
                void main(){
                    float tip=clamp(uFixedTipPx/vHeight,0.0,0.95);
                    float tY=1.0-tip;
                    float xC=abs(vUv.x-0.5)*2.0;
                    float px=fwidth(vUv.x);
                    float w;
                    if(vUv.y>=tY){float t=(vUv.y-tY)/tip;w=1.0-pow(t,0.9);}
                    else{float b=vUv.y/tY;w=max(uMinBottomWidthPx*px*10.0,pow(b,0.5));}
                    float a=smoothstep(-px,px,w-xC);
                    if(a<0.01)discard;
                    float em=uBaseEmissive+vGlow*0.9+vPulse*0.15;
                    gl_FragColor=vec4(uColor+uEmissive*em,0.35*a);
                }`,
            side:THREE.FrontSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
        });
    }

    function setQuick(){
        const u=mesh.material.uniforms;
        setNDC=gsap.quickSetter(u.uMouseClipX,"value");
        setSpeed=gsap.quickSetter(u.uSmoothSpeed,"value");
        setPh1=gsap.quickSetter(u.w1Phase,"value");
        setPh2=gsap.quickSetter(u.w2Phase,"value");
    }

    const MKG=500,SC=0.6;
    function updateGain(){if(!barMat)return;barMat.uniforms.uGainMul.value=camH*SC/MKG;}

    function setupPtr(){
        const el=renderer.domElement;
        const rc=e=>"clientX"in e?{x:e.clientX,y:e.clientY}:(e.touches?.[0]||e.changedTouches?.[0]||{x:mouse.x,y:mouse.y});
        const up=(e,a)=>{const{x,y}=rc(e);const r=rect;mouse.x=x-r.left;mouse.y=y-r.top;mouse.active=a;if(!proxyInit){proxyX=mouse.x;proxyY=mouse.y;proxyInit=true;}};
        const on=e=>up(e,true), off=()=>{mouse.active=false;};
        el.addEventListener("pointerdown",on,{passive:true});
        el.addEventListener("pointermove",on,{passive:true});
        window.addEventListener("pointerup",off,{passive:true});
        el.addEventListener("pointerleave",off,{passive:true});
        el.addEventListener("touchstart",on,{passive:true});
        el.addEventListener("touchmove",on,{passive:true});
        window.addEventListener("touchend",off,{passive:true});
    }

    function glowTick(dt){
        if(!mesh)return;
        const at=mesh.geometry.getAttribute("aGlow");
        const a=at.array;
        const mx=proxyX-camW*0.5;
        const dL=1-Math.exp(-gDyn.decay*dt);
        const aE=1-Math.exp(-gDyn.accumEase*dt);
        for(let i=0;i<barN;i++){
            const dx=Math.abs(mx-barCX[i]);
            const hit=dx<gCfg.maxGlowDist?1-Math.pow(dx/gCfg.maxGlowDist,gCfg.glowFalloff):0;
            let g=a[i]+hit*smoothV*aE-a[i]*dL;
            if(g>gDyn.max)g=gDyn.max;
            a[i]=a[i+barN]=g;
        }
        at.needsUpdate=true;
    }

    function buildBars(){
        if(mesh){scene.remove(mesh);mesh.geometry.dispose();mesh.material.dispose();mesh=null;}
        const span=camW+EXT;
        barN=Math.min(MAX_BARS,Math.max(1,Math.floor((span+BAR_GAP)/(BAR_W+BAR_GAP))));
        const gap=barN>1?(span-barN*BAR_W)/(barN-1):0;
        const sx=-camW/2-EXT;
        const cnt=barN*2;
        barCX=new Float32Array(barN);
        const aX=new Float32Array(cnt),aT=new Float32Array(cnt),aG=new Float32Array(cnt),aGl=new Float32Array(cnt).fill(0);
        for(let i=0;i<barN;i++){
            const x=sx+BAR_W/2+i*(BAR_W+gap);
            barCX[i]=x;const t=barN>1?i/(barN-1):0;
            aX[i]=aX[i+barN]=x;aT[i]=aT[i+barN]=t;aG[i]=0;aG[i+barN]=1;
        }
        const geo=new THREE.PlaneGeometry(BAR_W,1,1,1);geo.translate(0,0.5,0);
        geo.setAttribute("aXPos",new THREE.InstancedBufferAttribute(aX,1));
        geo.setAttribute("aPosNorm",new THREE.InstancedBufferAttribute(aT,1));
        geo.setAttribute("aGroup",new THREE.InstancedBufferAttribute(aG,1));
        geo.setAttribute("aGlow",new THREE.InstancedBufferAttribute(aGl,1).setUsage(THREE.DynamicDrawUsage));
        barMat=makeMat();
        mesh=new THREE.InstancedMesh(geo,barMat,cnt);
        mesh.frustumCulled=false;
        scene.add(mesh);
        setQuick();updateGlowDist();
    }

    function buildTL(t,kf){
        const tl=gsap.timeline();
        for(let i=0;i<kf.length-1;i++){
            const c=kf[i],n=kf[i+1];
            tl.to(t,{gain:n.gain,frequency:n.frequency,waveLength:n.waveLength,duration:n.time-c.time,ease:"power2.inOut"},c.time);
        }
        return tl;
    }

    function init(){
        camW=container.clientWidth;camH=container.clientHeight;
        cam=new THREE.OrthographicCamera(-camW/2,camW/2,camH/2,-camH/2,-1000,1000);
        cam.position.z=10;cam.lookAt(0,0,0);
        renderer.setSize(camW,camH);
        composer=new EffectComposer(renderer);composer.setPixelRatio(DPR);
        composer.addPass(new RenderPass(scene,cam));
        bloomPass=new UnrealBloomPass(new THREE.Vector2(camW,camH),1,0.68,0);
        bloomPass.resolution.set(camW*0.5,camH*0.5);
        composer.addPass(bloomPass);
        grain=createGrainPass();composer.addPass(grain);
        buildBars();setupPtr();updateGain();ready=true;
    }

    let pW=0,pH=0,resizeT=null;
    function onResize(w,h){
        if(!ready)return;pW=w;pH=h;camW=w;camH=h;
        cam.left=-camW/2;cam.right=camW/2;cam.top=camH/2;cam.bottom=-camH/2;
        cam.updateProjectionMatrix();
        const span=camW+EXT;
        const n=Math.min(MAX_BARS,Math.max(1,Math.floor((span+BAR_GAP)/(BAR_W+BAR_GAP))));
        if(n!==barN){barN=n;buildBars();}
        else{
            const gap=barN>1?(span-barN*BAR_W)/(barN-1):0;
            const sx=-camW/2-EXT;
            const aX=mesh.geometry.getAttribute("aXPos"),aT=mesh.geometry.getAttribute("aPosNorm");
            for(let i=0;i<barN;i++){
                const x=sx+BAR_W/2+i*(BAR_W+gap),t=barN>1?i/(barN-1):0;
                aX.array[i]=aX.array[i+barN]=x;aT.array[i]=aT.array[i+barN]=t;
            }
            aX.needsUpdate=aT.needsUpdate=true;
        }
        barMat.uniforms.uHalfW.value=camW*0.5;updateGain();updateGlowDist();
        clearTimeout(resizeT);resizeT=setTimeout(()=>{
            renderer.setPixelRatio(DPR);renderer.setSize(pW,pH);
            composer.setSize(pW,pH);bloomPass?.setSize(pW,pH);
            grain?.setSize(pW,pH);grain.uniforms.grainScale.value=0.5;
        },10);
        rect=renderer.domElement.getBoundingClientRect();
    }

    let smoothV=0, rect;
    const loop=()=>{
        if(!ready||!mesh)return;
        const dt=gsap.ticker.deltaRatio()*(1/60);
        wave1.currentAngle=(wave1.currentAngle+wave1.frequency*dt)%(Math.PI*2);
        wave2.currentAngle=(wave2.currentAngle+wave2.frequency*dt)%(Math.PI*2);
        setPh1(wave1.currentAngle);setPh2(wave2.currentAngle);
        const km=1-Math.exp(-gCfg.mouseSmoothing*dt);
        proxyX+=(mouse.x-proxyX)*km;proxyY+=(mouse.y-proxyY)*km;
        const dx=mouse.active?mouse.x-proxyX:0,dy=mouse.active?mouse.y-proxyY:0;
        const raw=Math.hypot(dx,dy*0.1)*gCfg.speedScale;
        smoothV+=(raw-smoothV)*(1-Math.exp(-gDyn.speedEase*dt));
        setSpeed(smoothV);
        const u=mesh.material.uniforms;
        u.w1Gain.value=wave1.gain;u.w1Len.value=wave1.waveLength;
        u.w2Gain.value=wave2.gain;u.w2Len.value=wave2.waveLength;
        setNDC((proxyX/camW)*2-1);
        u.uBaseY.value=-camH*0.5+(window.innerWidth<768?20:40);
        grain.uniforms.time.value+=dt*0.2;
        glowTick(dt);composer.render();
    };

    const ro=new ResizeObserver(e=>{for(const x of e)if(x.target===container)onResize(x.contentRect.width,x.contentRect.height);});
    init();rect=renderer.domElement.getBoundingClientRect();
    const tl=gsap.timeline({repeat:-1});
    tl.add(buildTL(wave1,kf1),0);tl.add(buildTL(wave2,kf2),0);tl.play(0);
    gsap.ticker.add(loop);ro.observe(container);
});
