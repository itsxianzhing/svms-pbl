import * as THREE from 'three';

export interface VenueSceneRig {
  root: THREE.Group;
  courtGroup: THREE.Group;
  beaconGroup: THREE.Group;
  beacons: THREE.Mesh[];
  shuttleGroup: THREE.Group;
  nodeMarkers: THREE.InstancedMesh;
  themeMaterials: {
    plinthMat: THREE.MeshStandardMaterial;
    trimMat: THREE.MeshStandardMaterial;
    archMat: THREE.MeshStandardMaterial | null;
    nodeMat: THREE.MeshStandardMaterial;
    shadowMat: THREE.MeshBasicMaterial;
  };
  disposables: {
    geometries: THREE.BufferGeometry[];
    materials: THREE.Material[];
    textures: THREE.Texture[];
  };
}

function createCourtSurfaceTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Outer arena apron (deep indigo-slate)
    ctx.fillStyle = '#312E81';
    ctx.fillRect(0, 0, width, height);

    // Subtle mat grain
    for (let i = 0; i < 4000; i++) {
      const gx = (i * 73) % width;
      const gy = (i * 197) % height;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'rgba(15,23,42,0.03)';
      ctx.fillRect(gx, gy, 2, 2);
    }

    // Playing court boundary (regulation 6.1m x 13.4m proportion inside apron)
    const padX = 112;
    const padY = 148;
    const courtW = width - padX * 2; // 800px
    const courtH = height - padY * 2; // 1752px

    // Inner playing floor (SVMS Indigo 600/700 gradient)
    const grad = ctx.createLinearGradient(0, padY, 0, padY + courtH);
    grad.addColorStop(0, '#4338CA');
    grad.addColorStop(0.5, '#4F46E5');
    grad.addColorStop(1, '#4338CA');
    ctx.fillStyle = grad;
    ctx.fillRect(padX, padY, courtW, courtH);

    // Subtle center radial sheen
    const sheen = ctx.createRadialGradient(
      width / 2,
      height / 2,
      40,
      width / 2,
      height / 2,
      courtH * 0.48
    );
    sheen.addColorStop(0, 'rgba(255,255,255,0.08)');
    sheen.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(padX, padY, courtW, courtH);

    // Crisp white regulation court lines
    ctx.strokeStyle = '#F8FAFC';
    ctx.lineWidth = 10;

    // Outer doubles boundary
    ctx.strokeRect(padX, padY, courtW, courtH);

    // Singles sidelines (inset ~7.5% on each side)
    const singlesInset = Math.round(courtW * 0.075);
    ctx.beginPath();
    ctx.moveTo(padX + singlesInset, padY);
    ctx.lineTo(padX + singlesInset, padY + courtH);
    ctx.moveTo(padX + courtW - singlesInset, padY);
    ctx.lineTo(padX + courtW - singlesInset, padY + courtH);
    ctx.stroke();

    // Doubles back service lines (inset ~5.7% from each baseline)
    const backServiceInset = Math.round(courtH * 0.057);
    ctx.beginPath();
    ctx.moveTo(padX, padY + backServiceInset);
    ctx.lineTo(padX + courtW, padY + backServiceInset);
    ctx.moveTo(padX, padY + courtH - backServiceInset);
    ctx.lineTo(padX + courtW, padY + courtH - backServiceInset);
    ctx.stroke();

    // Net center line
    const midY = padY + courtH / 2;
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.45)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(padX, midY);
    ctx.lineTo(padX + courtW, midY);
    ctx.stroke();

    // Short service lines (~14.8% of court length from net on each side)
    ctx.strokeStyle = '#F8FAFC';
    ctx.lineWidth = 10;
    const shortOffset = Math.round(courtH * 0.148);
    ctx.beginPath();
    ctx.moveTo(padX, midY - shortOffset);
    ctx.lineTo(padX + courtW, midY - shortOffset);
    ctx.moveTo(padX, midY + shortOffset);
    ctx.lineTo(padX + courtW, midY + shortOffset);
    ctx.stroke();

    // Center service lines (from short service line to back boundary)
    const midX = padX + courtW / 2;
    ctx.beginPath();
    ctx.moveTo(midX, padY);
    ctx.lineTo(midX, midY - shortOffset);
    ctx.moveTo(midX, midY + shortOffset);
    ctx.lineTo(midX, padY + courtH);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createNetMeshTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.85)';
    ctx.lineWidth = 2;
    const step = 16;
    for (let x = 0; x <= size; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    for (let y = 0; y <= size; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 4);
  texture.needsUpdate = true;
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.08,
      size / 2,
      size / 2,
      size * 0.48
    );
    grad.addColorStop(0, 'rgba(30, 27, 75, 0.24)');
    grad.addColorStop(0.55, 'rgba(79, 70, 229, 0.09)');
    grad.addColorStop(1, 'rgba(246, 247, 251, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function buildDigitalVenueScene(maxAnisotropy: number, simplified: boolean): VenueSceneRig {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    textures.push(t);
    return t;
  };

  const root = new THREE.Group();
  const courtGroup = new THREE.Group();
  root.add(courtGroup);

  // 1. Floating Architectural Plinth (composite 3-layer pedestal)
  const plinthShape = new THREE.Shape();
  const pw = 4.5;
  const pd = 8.9;
  const pr = 0.45;
  plinthShape.moveTo(-pw / 2 + pr, -pd / 2);
  plinthShape.lineTo(pw / 2 - pr, -pd / 2);
  plinthShape.quadraticCurveTo(pw / 2, -pd / 2, pw / 2, -pd / 2 + pr);
  plinthShape.lineTo(pw / 2, pd / 2 - pr);
  plinthShape.quadraticCurveTo(pw / 2, pd / 2, pw / 2 - pr, pd / 2);
  plinthShape.lineTo(-pw / 2 + pr, pd / 2);
  plinthShape.quadraticCurveTo(-pw / 2, pd / 2, -pw / 2, pd / 2 - pr);
  plinthShape.lineTo(-pw / 2, -pd / 2 + pr);
  plinthShape.quadraticCurveTo(-pw / 2, -pd / 2, -pw / 2 + pr, -pd / 2);

  const plinthGeo = trackGeo(
    new THREE.ExtrudeGeometry(plinthShape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: simplified ? 2 : 4,
    })
  );
  plinthGeo.rotateX(Math.PI / 2);

  const plinthMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.08,
    })
  );
  const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
  plinthMesh.position.y = 0;
  plinthMesh.castShadow = true;
  plinthMesh.receiveShadow = true;
  courtGroup.add(plinthMesh);

  // Subtle indigo under-trim band around plinth
  const trimGeo = trackGeo(new THREE.BoxGeometry(pw + 0.04, 0.07, pd + 0.04));
  const trimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      roughness: 0.3,
      metalness: 0.45,
      emissive: 0x312e81,
      emissiveIntensity: 0.18,
    })
  );
  const trimMesh = new THREE.Mesh(trimGeo, trimMat);
  trimMesh.position.y = -0.15;
  courtGroup.add(trimMesh);

  // 2. Regulation Court Surface (offset cleanly above plinth to prevent z-fighting)
  const courtTex = trackTex(createCourtSurfaceTexture());
  courtTex.anisotropy = Math.min(maxAnisotropy, 8);
  const surfaceGeo = trackGeo(new THREE.PlaneGeometry(4.15, 8.45));
  surfaceGeo.rotateX(-Math.PI / 2);
  const surfaceMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: courtTex,
      roughness: 0.62,
      metalness: 0.04,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
  );
  const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
  surfaceMesh.position.y = 0.06;
  surfaceMesh.receiveShadow = true;
  courtGroup.add(surfaceMesh);

  // 3. Composite Net Assembly (Posts, Weighted Bases, Caps, Top Tape, Mesh Net)
  const netGroup = new THREE.Group();
  netGroup.position.y = 0.06;
  courtGroup.add(netGroup);

  const postMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.85,
    })
  );
  const accentRingMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.25,
      metalness: 0.6,
    })
  );

  const postGeo = trackGeo(new THREE.CylinderGeometry(0.036, 0.038, 0.86, 16));
  const baseGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.13, 0.06, 18));
  const capGeo = trackGeo(new THREE.TorusGeometry(0.045, 0.012, 8, 16));

  [-1.82, 1.82].forEach((xPos) => {
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(xPos, 0.43, 0);
    post.castShadow = true;
    netGroup.add(post);

    const base = new THREE.Mesh(baseGeo, postMat);
    base.position.set(xPos, 0.03, 0);
    base.castShadow = true;
    netGroup.add(base);

    const cap = new THREE.Mesh(capGeo, accentRingMat);
    cap.rotation.x = Math.PI / 2;
    cap.position.set(xPos, 0.85, 0);
    netGroup.add(cap);
  });

  // White Net Top Tape
  const tapeGeo = trackGeo(new THREE.BoxGeometry(3.6, 0.055, 0.028));
  const tapeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.45,
      metalness: 0.05,
    })
  );
  const tapeMesh = new THREE.Mesh(tapeGeo, tapeMat);
  tapeMesh.position.set(0, 0.82, 0);
  tapeMesh.castShadow = true;
  netGroup.add(tapeMesh);

  // Translucent Net Grid Plane
  const netTex = trackTex(createNetMeshTexture());
  const netPlaneGeo = trackGeo(new THREE.PlaneGeometry(3.56, 0.42));
  const netPlaneMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: netTex,
      transparent: true,
      alphaTest: 0.15,
      side: THREE.DoubleSide,
      roughness: 0.6,
      metalness: 0.05,
    })
  );
  const netPlane = new THREE.Mesh(netPlaneGeo, netPlaneMat);
  netPlane.position.set(0, 0.59, 0);
  netGroup.add(netPlane);

  // 4. Subtle Architectural Venue Ribs (minimalist stadium roof framing)
  let archMat: THREE.MeshStandardMaterial | null = null;
  if (!simplified) {
    archMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.3,
        metalness: 0.4,
      })
    );
    [-2.4, 2.4].forEach((zOffset) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.18, 0.04, zOffset),
        new THREE.Vector3(-1.95, 1.42, zOffset),
        new THREE.Vector3(0, 1.88, zOffset),
        new THREE.Vector3(1.95, 1.42, zOffset),
        new THREE.Vector3(2.18, 0.04, zOffset),
      ]);
      const archGeo = trackGeo(new THREE.TubeGeometry(curve, 36, 0.026, 8, false));
      const archMesh = new THREE.Mesh(archGeo, archMat!);
      archMesh.castShadow = false;
      courtGroup.add(archMesh);
    });
  }

  // 5. Procedural Shuttlecock Accent hovering above net
  const shuttleGroup = new THREE.Group();
  shuttleGroup.position.set(0.45, 1.48, -0.35);
  shuttleGroup.rotation.z = -0.38;
  shuttleGroup.rotation.x = 0.25;
  courtGroup.add(shuttleGroup);

  const corkGeo = trackGeo(new THREE.SphereGeometry(0.085, 18, 14));
  const corkMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      metalness: 0.05,
    })
  );
  const cork = new THREE.Mesh(corkGeo, corkMat);
  cork.position.y = -0.06;
  cork.castShadow = true;
  shuttleGroup.add(cork);

  const bandGeo = trackGeo(new THREE.CylinderGeometry(0.088, 0.085, 0.032, 18));
  const bandMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      roughness: 0.3,
      metalness: 0.4,
    })
  );
  const band = new THREE.Mesh(bandGeo, bandMat);
  band.position.y = -0.01;
  shuttleGroup.add(band);

  const skirtGeo = trackGeo(new THREE.CylinderGeometry(0.18, 0.086, 0.22, 18, 1, true));
  const skirtMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe0e7ff,
      roughness: 0.5,
      metalness: 0.08,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
    })
  );
  const skirt = new THREE.Mesh(skirtGeo, skirtMat);
  skirt.position.y = 0.11;
  skirt.castShadow = true;
  shuttleGroup.add(skirt);

  // 6. Digital Booking Quadrant Beacons (elevate subtly on scroll)
  const beaconGroup = new THREE.Group();
  courtGroup.add(beaconGroup);

  const beaconGeo = trackGeo(new THREE.BoxGeometry(0.44, 0.12, 0.28));
  const beaconColors = [0x4f46e5, 0x7c3aed, 0x0ea5e9, 0x10b981];
  const beaconCoords: Array<[number, number, number]> = [
    [-1.45, 0.48, -2.55],
    [1.45, 0.58, -1.35],
    [-1.45, 0.54, 1.55],
    [1.45, 0.64, 2.55],
  ];

  const beacons: THREE.Mesh[] = beaconCoords.map((pos, idx) => {
    const bMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: beaconColors[idx],
        roughness: 0.18,
        metalness: 0.15,
        clearcoat: 0.9,
        clearcoatRoughness: 0.15,
        transparent: true,
        opacity: 0.88,
      })
    );
    const mesh = new THREE.Mesh(beaconGeo, bMat);
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.userData.baseY = pos[1];
    mesh.castShadow = !simplified;
    beaconGroup.add(mesh);
    return mesh;
  });

  // 7. Instanced Perimeter Status Nodes (represents active time-slot telemetry)
  const nodeCount = simplified ? 12 : 24;
  const nodeGeo = trackGeo(new THREE.CylinderGeometry(0.032, 0.032, 0.05, 10));
  const nodeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.25,
      metalness: 0.5,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.25,
    })
  );
  const nodeMarkers = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < nodeCount; i++) {
    const side = i < nodeCount / 2 ? -1 : 1;
    const stepIdx = i % (nodeCount / 2);
    const t = stepIdx / (nodeCount / 2 - 1);
    dummy.position.set(side * 2.08, 0.08, -3.7 + t * 7.4);
    dummy.updateMatrix();
    nodeMarkers.setMatrixAt(i, dummy.matrix);
  }
  nodeMarkers.instanceMatrix.needsUpdate = true;
  nodeMarkers.computeBoundingSphere();
  courtGroup.add(nodeMarkers);

  // 8. Soft Contact Shadow Plane underneath floating court
  const shadowTex = trackTex(createContactShadowTexture());
  const shadowGeo = trackGeo(new THREE.PlaneGeometry(7.2, 11.4));
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    })
  );
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.position.y = -0.82;
  root.add(shadowPlane);

  return {
    root,
    courtGroup,
    beaconGroup,
    beacons,
    shuttleGroup,
    nodeMarkers,
    themeMaterials: {
      plinthMat,
      trimMat,
      archMat,
      nodeMat,
      shadowMat,
    },
    disposables: {
      geometries,
      materials,
      textures,
    },
  };
}

export function disposeVenueScene(rig: VenueSceneRig): void {
  rig.disposables.geometries.forEach((g) => g.dispose());
  rig.disposables.materials.forEach((m) => m.dispose());
  rig.disposables.textures.forEach((t) => t.dispose());
}
