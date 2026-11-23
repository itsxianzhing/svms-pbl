import {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  buildDigitalVenueScene,
  disposeVenueScene,
  type VenueSceneRig,
} from '../../three/venueSceneBuilder';
import {VenueSceneFallback} from './VenueSceneFallback';
import {useTheme} from '../../context/ThemeContext';

interface DigitalVenueCanvasProps {
  className?: string;
}

const _camTarget = new THREE.Vector3(0, 0.25, 0);

function applyThreeTheme(
  isDark: boolean,
  rig: VenueSceneRig,
  hemiLight: THREE.HemisphereLight,
  keyLight: THREE.DirectionalLight,
  rimLight: THREE.DirectionalLight
) {
  if (isDark) {
    hemiLight.color.setHex(0x6366f1);
    hemiLight.groundColor.setHex(0x0b1020);
    hemiLight.intensity = 0.78;

    keyLight.color.setHex(0xe0e7ff);
    keyLight.intensity = 1.5;

    rimLight.color.setHex(0x818cf8);
    rimLight.intensity = 1.35;

    rig.themeMaterials.plinthMat.color.setHex(0x1e293b);
    rig.themeMaterials.plinthMat.roughness = 0.42;
    rig.themeMaterials.plinthMat.metalness = 0.22;

    rig.themeMaterials.trimMat.color.setHex(0x6366f1);
    rig.themeMaterials.trimMat.emissive.setHex(0x4f46e5);
    rig.themeMaterials.trimMat.emissiveIntensity = 0.34;

    if (rig.themeMaterials.archMat) {
      rig.themeMaterials.archMat.color.setHex(0x334155);
      rig.themeMaterials.archMat.roughness = 0.36;
      rig.themeMaterials.archMat.metalness = 0.55;
    }

    rig.themeMaterials.nodeMat.emissiveIntensity = 0.42;
    rig.themeMaterials.shadowMat.opacity = 0.45;
  } else {
    hemiLight.color.setHex(0xeef2ff);
    hemiLight.groundColor.setHex(0xcbd5e1);
    hemiLight.intensity = 0.95;

    keyLight.color.setHex(0xfffbeb);
    keyLight.intensity = 1.75;

    rimLight.color.setHex(0x818cf8);
    rimLight.intensity = 0.85;

    rig.themeMaterials.plinthMat.color.setHex(0xffffff);
    rig.themeMaterials.plinthMat.roughness = 0.35;
    rig.themeMaterials.plinthMat.metalness = 0.08;

    rig.themeMaterials.trimMat.color.setHex(0x4f46e5);
    rig.themeMaterials.trimMat.emissive.setHex(0x312e81);
    rig.themeMaterials.trimMat.emissiveIntensity = 0.18;

    if (rig.themeMaterials.archMat) {
      rig.themeMaterials.archMat.color.setHex(0xe2e8f0);
      rig.themeMaterials.archMat.roughness = 0.3;
      rig.themeMaterials.archMat.metalness = 0.4;
    }

    rig.themeMaterials.nodeMat.emissiveIntensity = 0.25;
    rig.themeMaterials.shadowMat.opacity = 0.85;
  }
}

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function DigitalVenueCanvas({className = ''}: DigitalVenueCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const {resolvedTheme} = useTheme();
  const isDarkRef = useRef(resolvedTheme === 'dark');
  const themeSyncRef = useRef<((isDark: boolean) => void) | null>(null);

  isDarkRef.current = resolvedTheme === 'dark';

  useEffect(() => {
    themeSyncRef.current?.(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!container || !mount) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isMobileViewport = window.innerWidth < 640;
    const isTabletViewport = window.innerWidth >= 640 && window.innerWidth < 1024;
    const isSoftwareGl = detectSoftwareWebGL();
    const simplified = isMobileViewport || isTabletViewport;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && !isMobileViewport,
        alpha: true,
        powerPreference: isMobileViewport ? 'default' : 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(
      isSoftwareGl
        ? 1
        : isMobileViewport
          ? Math.min(window.devicePixelRatio, 1.25)
          : Math.min(window.devicePixelRatio, 2)
    );
    renderer.shadowMap.enabled = !isSoftwareGl && !isMobileViewport;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Procedural studio reflection environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const width = Math.max(mount.clientWidth, 1);
    const height = Math.max(mount.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 60);
    camera.position.set(7.4, 5.4, 8.6);
    camera.lookAt(_camTarget);

    // Three-point studio lighting rig
    const hemiLight = new THREE.HemisphereLight(0xeef2ff, 0xcbd5e1, 0.95);
    hemiLight.position.set(0, 12, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.75);
    keyLight.position.set(6, 10, 5);
    keyLight.castShadow = !isSoftwareGl && !isMobileViewport;
    keyLight.shadow.mapSize.width = isTabletViewport ? 512 : 1024;
    keyLight.shadow.mapSize.height = isTabletViewport ? 512 : 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 26;
    const d = 6.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 0.85);
    rimLight.position.set(-7, 4.5, -6);
    scene.add(rimLight);

    const rig = buildDigitalVenueScene(
      renderer.capabilities.getMaxAnisotropy(),
      simplified
    );
    // Controlled entrance initial state
    rig.root.scale.setScalar(prefersReducedMotion ? 1 : 0.88);
    rig.root.position.y = prefersReducedMotion ? 0 : -0.35;
    rig.courtGroup.rotation.y = -0.45;
    scene.add(rig.root);

    applyThreeTheme(isDarkRef.current, rig, hemiLight, keyLight, rimLight);

    renderer.setSize(width, height, false);
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Mutable animation state (no React re-renders)
    let pointerX = 0;
    let pointerY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;
    let scrollProgress = 0;
    let smoothScroll = 0;
    let entranceScale = prefersReducedMotion ? 1 : 0.88;
    let entranceY = prefersReducedMotion ? 0 : -0.35;
    let contextLost = false;
    let disposed = false;
    let frameId = 0;

    const updateScrollProgress = () => {
      const showcaseEl = document.getElementById('product-showcase');
      if (!showcaseEl) {
        scrollProgress = Math.min(Math.max(window.scrollY / 1400, 0), 1);
        return;
      }
      const showcaseTop = showcaseEl.getBoundingClientRect().top + window.scrollY;
      const maxRange = Math.max(showcaseTop - window.innerHeight * 0.25, 600);
      scrollProgress = Math.min(Math.max(window.scrollY / maxRange, 0), 1);
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!isFinePointer || isMobileViewport || prefersReducedMotion) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointerX = THREE.MathUtils.clamp(nx, -1, 1);
      pointerY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const handleResize = () => {
      if (!mount || disposed) return;
      const w = Math.max(mount.clientWidth, 1);
      const h = Math.max(mount.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      setWebglFailed(true);
    };

    const handleContextRestored = () => {
      contextLost = false;
      setWebglFailed(false);
    };

    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);
    window.addEventListener('scroll', updateScrollProgress, {passive: true});
    window.addEventListener('mousemove', handlePointerMove, {passive: true});
    window.addEventListener('resize', handleResize);
    updateScrollProgress();

    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed || contextLost) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // Smoothly damp entrance, pointer parallax, and scroll progress
      entranceScale = THREE.MathUtils.damp(entranceScale, 1, 5.5, delta);
      entranceY = THREE.MathUtils.damp(entranceY, 0, 5.5, delta);
      smoothPointerX = THREE.MathUtils.damp(smoothPointerX, pointerX, 4, delta);
      smoothPointerY = THREE.MathUtils.damp(smoothPointerY, pointerY, 4, delta);
      smoothScroll = THREE.MathUtils.damp(smoothScroll, scrollProgress, 5, delta);

      rig.root.scale.setScalar(entranceScale);

      // Slow vertical-axis rotation + scroll perspective sweep
      const autoSpin = prefersReducedMotion || isMobileViewport ? 0 : elapsed * 0.14;
      rig.courtGroup.rotation.y = -0.45 + autoSpin + smoothScroll * 0.65 + smoothPointerX * 0.12;
      rig.courtGroup.rotation.x = smoothPointerY * 0.04;

      // Subtle floating levitation
      const floatOffset = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.4) * 0.09;
      rig.root.position.y = entranceY + floatOffset;

      // Elevate booking quadrant beacons subtly as user scrolls toward Problem & Solution
      const scrollLift = Math.sin(Math.min(smoothScroll * 1.4, 1) * Math.PI) * 0.35;
      rig.beacons.forEach((beacon, idx) => {
        const baseY = Number(beacon.userData.baseY ?? 0.5);
        const bob = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.8 + idx * 1.3) * 0.06;
        beacon.position.y = baseY + bob + scrollLift;
        beacon.rotation.y = elapsed * (prefersReducedMotion ? 0 : 0.45) + idx * 0.5;
      });

      // Shuttlecock subtle hover arc above the net
      if (!prefersReducedMotion) {
        rig.shuttleGroup.position.y = 1.48 + Math.sin(elapsed * 2.1) * 0.08;
        rig.shuttleGroup.rotation.y = elapsed * 0.6;
      }

      // Camera perspective shift with scroll & desktop mouse parallax
      const targetCamX = 7.4 - smoothScroll * 1.6 + smoothPointerX * 0.65;
      const targetCamY = 5.4 + smoothScroll * 1.9 - smoothPointerY * 0.42;
      const targetCamZ = 8.6 + smoothScroll * 1.8;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 5, delta);
      camera.lookAt(_camTarget);

      // Gradually transition out near Product Showcase so it never competes with live iframe
      if (container) {
        const fadeOut = smoothScroll > 0.72 ? Math.max(0.18, 1 - (smoothScroll - 0.72) * 2.8) : 1;
        container.style.opacity = String(fadeOut);
      }

      renderer.render(scene, camera);

      if (prefersReducedMotion) {
        // Render once on entrance settle / scroll / resize without continuous spin loop
        if (Math.abs(entranceScale - 1) > 0.002 || Math.abs(smoothScroll - scrollProgress) > 0.002) {
          if (isSoftwareGl) afterDraw(tick);
          else frameId = requestAnimationFrame(tick);
        }
        return;
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    themeSyncRef.current = (dark: boolean) => {
      if (disposed) return;
      applyThreeTheme(dark, rig, hemiLight, keyLight, rimLight);
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    };

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    const handleReducedMotionTrigger = () => {
      if (prefersReducedMotion && !disposed) {
        updateScrollProgress();
        frameId = requestAnimationFrame(tick);
      }
    };
    window.addEventListener('scroll', handleReducedMotionTrigger, {passive: true});

    return () => {
      disposed = true;
      themeSyncRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('scroll', handleReducedMotionTrigger);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      disposeVenueScene(rig);
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  if (webglFailed) {
    return <VenueSceneFallback reason="unavailable" />;
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full transition-opacity duration-150 ${className}`}
    >
      <div
        ref={mountRef}
        className="h-full w-full"
        aria-label="Visualisasi 3D lapangan olahraga digital SVMS"
      />
    </div>
  );
}
