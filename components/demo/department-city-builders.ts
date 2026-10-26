import type * as THREE from "three";

/**
 * Procedural department cities and the animated AIOS emblem for the demo landscape.
 *
 * Every city shares one family look (chamfered circular plinth, concentric roads,
 * a curved flyover and animated traffic) while the palette and architecture express
 * the department: Sales (orange skyline), Marketing (river island), Customer Success
 * (emerald eco-city), Finance (obsidian and gold), Operations (slate industrial) and
 * Product (sky-blue solarpunk).
 */

type ThreeModule = typeof import("three");
type Animator = (seconds: number) => void;

const GROUND = 0.43;

function createKit(THREE: ThreeModule, city: THREE.Group) {
  const animators: Animator[] = [];
  let speedScale = 0.45;
  // Default palette is restrained; the selected city is lifted through emissive emphasis at runtime.
  const material = (color: number, options: THREE.MeshStandardMaterialParameters = {}) => {
    const muted = new THREE.Color(color);
    const hsl = { h: 0, s: 0, l: 0 };
    muted.getHSL(hsl);
    muted.setHSL(hsl.h, hsl.s * 0.78, Math.min(hsl.l, 0.86) * 0.94);
    return new THREE.MeshStandardMaterial({ roughness: 0.5, ...options, color: muted });
  };

  const add = (geometry: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    city.add(mesh);
    return mesh;
  };
  const box = (mat: THREE.Material, x: number, z: number, w: number, h: number, d: number, y = GROUND) =>
    add(new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z);
  const cylinder = (mat: THREE.Material, x: number, z: number, top: number, bottom: number, h: number, y = GROUND, segments = 20) =>
    add(new THREE.CylinderGeometry(top, bottom, h, segments), mat, x, y + h / 2, z);
  const ring = (mat: THREE.Material, inner: number, outer: number, y: number) => {
    const mesh = add(new THREE.RingGeometry(inner, outer, 48), mat, 0, y, 0);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  };
  const dome = (mat: THREE.Material, x: number, y: number, z: number, radius: number) =>
    add(new THREE.SphereGeometry(radius, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat, x, y, z);
  const flyover = (mat: THREE.Material, from: [number, number, number], mid: [number, number, number], to: [number, number, number]) => {
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(...from), new THREE.Vector3(...mid), new THREE.Vector3(...to));
    const mesh = add(new THREE.TubeGeometry(curve, 24, 0.085, 4, false), mat, 0, 0, 0);
    mesh.scale.y = 0.3;
    mesh.position.y = from[1] * 0.7;
  };
  const base = (rim: number, deck: number, metalness = 0.15) => {
    add(new THREE.CylinderGeometry(2.3, 2.45, 0.3, 40), material(rim, { roughness: 0.35, metalness }), 0, 0.15, 0);
    add(new THREE.CylinderGeometry(2.18, 2.22, 0.18, 40), material(deck, { roughness: 0.45 }), 0, 0.34, 0);
  };
  const traffic = (color: number, radius: number, y: number, count: number, speed: number, size: [number, number, number] = [0.2, 0.07, 0.1]) => {
    const mat = material(color, { emissive: color, emissiveIntensity: 0.35 });
    const pods = Array.from({ length: count }, (_, index) => ({
      mesh: add(new THREE.BoxGeometry(...size), mat, 0, y, 0),
      offset: (index / count) * Math.PI * 2,
    }));
    animators.push((seconds) => {
      pods.forEach(({ mesh, offset }) => {
        const angle = offset + seconds * speed * speedScale;
        mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        mesh.rotation.y = -angle;
      });
    });
  };
  const trees = (color: number, radius: number, count: number, size = 0.1) => {
    const mat = material(color, { roughness: 0.85 });
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2 + 0.2;
      add(new THREE.SphereGeometry(size, 7, 6), mat, Math.cos(angle) * radius, GROUND + size, Math.sin(angle) * radius);
    }
  };

  return { THREE, city, animators, setSpeed: (scale: number) => { speedScale = scale; }, material, add, box, cylinder, ring, dome, flyover, base, traffic, trees };
}

type Kit = ReturnType<typeof createKit>;

const builders: Record<string, (kit: Kit) => void> = {
  // Sales: warm orange and cream skyline with an arch landmark and a gherkin tower.
  sales: (k) => {
    const { THREE } = k;
    const terracotta = k.material(0xe06a3b);
    const cream = k.material(0xf8fafc, { roughness: 0.35 });
    const glass = k.material(0x7dd3fc, { roughness: 0.15, metalness: 0.4, transparent: true, opacity: 0.85 });
    const steel = k.material(0x1e293b, { metalness: 0.4 });
    k.base(0xeb6b2c, 0xf8fafc);
    k.ring(k.material(0x334155), 1.7, 2.05, GROUND + 0.01);
    k.cylinder(cream, 0, 0, 0.3, 0.38, 2.5).castShadow = true;
    k.cylinder(terracotta, 0, 0, 0.42, 0.5, 0.2, GROUND + 2.5);
    k.cylinder(steel, 0, 0, 0.012, 0.025, 0.7, GROUND + 2.7, 6);
    const arch = k.add(new THREE.TorusGeometry(0.45, 0.07, 8, 20, Math.PI), terracotta, -1.05, GROUND + 1.0, -0.2);
    arch.rotation.y = 0.4;
    k.box(terracotta, -1.05, -0.2, 0.2, 1.0, 0.2).position.x -= 0.4;
    k.box(terracotta, -0.55, -0.4, 0.2, 1.0, 0.2);
    k.add(new THREE.SphereGeometry(0.3, 14, 10), glass, 1.0, GROUND + 0.95, -0.4).scale.y = 2;
    k.add(new THREE.ConeGeometry(0.2, 0.4, 14), glass, 1.0, GROUND + 1.9, -0.4);
    k.box(cream, 0.9, 0.8, 0.5, 1.5, 0.45);
    k.box(terracotta, -0.8, 0.9, 0.55, 1.0, 0.5);
    k.box(steel, -0.2, 1.3, 0.4, 0.6, 0.35);
    k.trees(0x2e7d32, 1.95, 8);
    k.flyover(cream, [-1.5, 0.75, 1.1], [0, 1.7, 0.5], [1.5, 0.75, 1.1]);
    k.traffic(0xeb6b2c, 1.88, GROUND + 0.06, 5, 0.55);
    k.traffic(0xfacc15, 1.78, GROUND + 0.06, 3, -0.4);
  },

  // Marketing: creative river island with coral blocks, a turquoise river and a white obelisk.
  marketing: (k) => {
    const { THREE } = k;
    k.setSpeed(0.2);
    k.base(0x7dd3fc, 0xfef08a);
    k.cylinder(k.material(0x4ade80, { roughness: 0.85 }), 0, 0, 2.05, 2.1, 0.08, GROUND - 0.08);
    const river = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, 0, -2.1),
      new THREE.Vector3(0.6, 0, -1.0),
      new THREE.Vector3(-0.3, 0, 0.1),
      new THREE.Vector3(-0.7, 0, 1.0),
      new THREE.Vector3(0.4, 0, 2.1),
    ]);
    const water = k.material(0x06b6d4, { roughness: 0.15, metalness: 0.2 });
    const riverMesh = k.add(new THREE.TubeGeometry(river, 40, 0.22, 4, false), water, 0, GROUND + 0.02, 0);
    riverMesh.scale.y = 0.2;
    const coral = k.material(0xf87171);
    const terracotta = k.material(0xe06a3b);
    const yellow = k.material(0xfacc15);
    const white = k.material(0xf8fafc, { roughness: 0.3 });
    k.box(white, 1.1, -1.0, 0.36, 2.3, 0.36).castShadow = true;
    k.add(new THREE.ConeGeometry(0.12, 0.7, 6), white, 1.1, GROUND + 2.65, -1.0);
    k.box(coral, 1.25, 0.2, 0.55, 1.0, 0.5);
    k.box(terracotta, 0.95, 1.1, 0.5, 0.7, 0.45);
    k.box(yellow, -1.3, -0.7, 0.5, 0.8, 0.45);
    k.box(coral, -1.35, 0.5, 0.45, 1.2, 0.4);
    k.dome(k.material(0x0ea5e9, { roughness: 0.3 }), -1.2, GROUND + 0.5, 1.2, 0.35);
    k.trees(0x16a34a, 1.9, 10, 0.12);
    k.flyover(white, [-1.0, 0.5, -0.1], [0.0, 1.1, 0.0], [1.0, 0.5, 0.1]);
    k.traffic(0xf87171, 1.92, GROUND + 0.06, 4, 0.5);
    k.traffic(0xfacc15, 1.78, GROUND + 0.06, 3, -0.42);
  },

  // Customer Success: emerald eco-city with a helix biosphere spire and a monorail loop.
  customers: (k) => {
    const { THREE } = k;
    const jade = k.material(0x059669, { metalness: 0.2 });
    const white = k.material(0xf8fafc, { roughness: 0.4 });
    const glass = k.material(0x10b981, { roughness: 0.2, metalness: 0.4, transparent: true, opacity: 0.85 });
    const mint = k.material(0x34d399);
    k.base(0x059669, 0xf8fafc);
    k.ring(k.material(0x06b6d4, { roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0.88 }), 1.55, 1.85, GROUND + 0.01);
    k.ring(white, 1.12, 1.18, GROUND + 0.7);
    k.cylinder(white, 0, 0, 0.3, 0.42, 2.4).castShadow = true;
    k.dome(glass, 0, GROUND + 2.4, 0, 0.36);
    for (let level = 0; level < 5; level += 1) {
      const helix = k.add(new THREE.TorusGeometry(0.5, 0.04, 8, 20), mint, 0, GROUND + 0.4 + level * 0.45, 0);
      helix.rotation.x = Math.PI / 2;
    }
    [0.2, 1.8, 3.4, 4.9].forEach((angle, index) => {
      const x = Math.cos(angle) * 1.3;
      const z = Math.sin(angle) * 1.3;
      const height = 1.0 + (index % 2) * 0.5;
      k.box(white, x, z, 0.62, height, 0.52);
      k.box(glass, x, z, 0.5, height * 0.7, 0.54);
      k.box(jade, x, z, 0.4, 0.12, 0.35, GROUND + height);
    });
    for (let pillar = 0; pillar < 8; pillar += 1) {
      const angle = (pillar / 8) * Math.PI * 2;
      k.cylinder(white, Math.cos(angle) * 1.15, Math.sin(angle) * 1.15, 0.03, 0.04, 0.3);
    }
    k.flyover(glass, [-1.1, 0.7, -0.6], [0, 1.4, 0], [1.1, 0.7, 0.6]);
    k.trees(0x065f46, 1.95, 12, 0.1);
    k.traffic(0x059669, 1.15, GROUND + 0.78, 4, 0.7, [0.26, 0.08, 0.12]);
  },

  // Finance: obsidian and gold with neon rings, cantilevered skyboxes and hexagonal towers.
  finance: (k) => {
    const { THREE } = k;
    const obsidian = k.material(0x3b4a63, { roughness: 0.42, metalness: 0.3 });
    const gold = k.material(0xd9a441, { roughness: 0.35, metalness: 0.4 });
    const amber = k.material(0xfbbf24, { emissive: 0xd97706, emissiveIntensity: 0.4, roughness: 0.3 });
    k.base(0x334155, 0x64748b, 0.3);
    [2.0, 1.55, 1.05].forEach((radius, index) => k.ring(gold, radius - 0.02, radius + 0.02, GROUND + 0.01 + index * 0.005));
    k.box(obsidian, 0, 0, 0.5, 2.8, 0.5).castShadow = true;
    for (let fin = -2; fin <= 2; fin += 1) k.box(gold, fin * 0.1, 0.26, 0.016, 2.8, 0.03);
    k.box(amber, 0.15, 0, 0.7, 0.2, 0.4, GROUND + 1.9);
    k.box(amber, 0, 0.1, 0.4, 0.2, 0.65, GROUND + 1.2);
    [[-1.3, -1.2, 1.9], [1.35, -1.0, 1.6], [-1.4, 1.0, 1.4], [1.4, 1.1, 1.75], [0, -1.6, 2.1]].forEach(([x, z, height]) => {
      k.cylinder(obsidian, x!, z!, 0.28, 0.35, height!, GROUND, 6);
      k.add(new THREE.ConeGeometry(0.29, 0.5, 6), gold, x!, GROUND + height! + 0.25, z!);
    });
    k.flyover(k.material(0x64748b), [-1.4, 0.55, -0.9], [0, 1.2, -0.2], [1.4, 0.55, 0.8]);
    k.traffic(0xf59e0b, 1.9, GROUND + 0.07, 5, 0.65, [0.2, 0.05, 0.09]);
    k.traffic(0xfbbf24, 1.35, GROUND + 0.07, 4, -0.5, [0.2, 0.05, 0.09]);
    const glow = new THREE.PointLight(0xf59e0b, 1.0, 5, 2);
    glow.position.set(0, 1.4, 0);
    k.city.add(glow);
  },

  // Operations: slate industrial park with silos, chimneys, warehouses and a gantry crane.
  operations: (k) => {
    const { THREE } = k;
    const slate = k.material(0x475569, { metalness: 0.3 });
    const concrete = k.material(0xcbd5e1, { roughness: 0.6 });
    const orange = k.material(0xeb6b2c);
    const steel = k.material(0x1e293b, { metalness: 0.5 });
    k.base(0x475569, 0x94a3b8, 0.3);
    k.ring(k.material(0x334155), 1.7, 2.05, GROUND + 0.01);
    [-0.35, 0, 0.35].forEach((x) => k.cylinder(concrete, x - 0.7, -0.9, 0.17, 0.17, 1.4 + x));
    k.cylinder(orange, -0.7, -0.9, 0.04, 0.04, 0.001, GROUND + 1.0);
    [0.7, 1.1].forEach((x, index) => {
      k.cylinder(slate, x, -0.9, 0.09, 0.13, 1.9 + index * 0.4, GROUND, 10);
      k.cylinder(orange, x, -0.9, 0.095, 0.095, 0.12, GROUND + 1.6 + index * 0.4, 10);
    });
    k.box(concrete, 0.2, 0.7, 1.4, 0.55, 0.7);
    k.box(orange, 0.2, 0.7, 1.45, 0.07, 0.75, GROUND + 0.55);
    k.box(slate, -1.2, 0.5, 0.6, 0.8, 0.9);
    k.box(steel, 1.3, 0.5, 0.5, 0.5, 0.5);
    [-0.5, 0.5].forEach((x) => k.box(orange, x, 0, 0.06, 1.2, 0.06));
    k.box(orange, 0, 0, 1.2, 0.07, 0.07, GROUND + 1.2);
    k.flyover(concrete, [-1.5, 0.7, 1.2], [0, 1.4, 1.1], [1.5, 0.7, 1.2]);
    k.traffic(0xeb6b2c, 1.88, GROUND + 0.07, 5, 0.45, [0.26, 0.1, 0.12]);
    k.traffic(0xf8fafc, 1.78, GROUND + 0.07, 3, -0.35, [0.2, 0.07, 0.1]);
    const smoke = k.add(new THREE.SphereGeometry(0.12, 8, 6), k.material(0xe2e8f0, { transparent: true, opacity: 0.6 }), -0.7, GROUND + 1.8, -0.9);
    k.animators.push((seconds) => {
      const phase = (seconds * 0.25) % 1;
      smoke.position.y = GROUND + 1.6 + phase * 0.8;
      smoke.scale.setScalar(0.6 + phase);
      (smoke.material as THREE.MeshStandardMaterial).opacity = 0.6 * (1 - phase);
    });
  },

  // Product: sky-blue solarpunk with a needle spire, glass arches and satellite towers.
  product: (k) => {
    const { THREE } = k;
    const white = k.material(0xffffff, { roughness: 0.25 });
    const blue = k.material(0x0284c7, { metalness: 0.2 });
    const glass = k.material(0x38bdf8, { roughness: 0.15, metalness: 0.4, transparent: true, opacity: 0.88 });
    k.base(0x0284c7, 0xe0f2fe);
    k.ring(k.material(0x1e3a8a), 1.65, 2.05, GROUND + 0.01);
    [1.75, 1.85, 1.95].forEach((radius) => k.ring(white, radius - 0.01, radius + 0.01, GROUND + 0.02));
    k.cylinder(white, 0, 0, 0.17, 0.32, 2.5).castShadow = true;
    k.cylinder(blue, 0, 0, 0.012, 0.03, 0.8, GROUND + 2.5, 10);
    for (let arch = 0; arch < 3; arch += 1) {
      const mesh = k.add(new THREE.TorusGeometry(0.7, 0.03, 8, 24, Math.PI), glass, 0, GROUND + 0.1, 0);
      mesh.rotation.y = (arch / 3) * Math.PI;
    }
    for (let tower = 0; tower < 8; tower += 1) {
      const angle = (tower / 8) * Math.PI * 2;
      const height = 0.9 + (tower % 3) * 0.4;
      const x = Math.cos(angle) * 1.3;
      const z = Math.sin(angle) * 1.3;
      k.cylinder(white, x, z, 0.1, 0.14, height);
      k.dome(glass, x, GROUND + height, z, 0.12);
    }
    k.flyover(white, [-1.5, 0.6, -0.5], [0, 1.5, 0.2], [1.5, 0.6, 0.7]);
    k.traffic(0x38bdf8, 1.85, GROUND + 0.07, 6, 0.6, [0.2, 0.07, 0.1]);
    k.traffic(0xffffff, 1.65, GROUND + 0.07, 3, -0.4, [0.2, 0.07, 0.1]);
  },
};

/** Builds one department city into `city` and returns its per-frame animator. */
export function buildDepartmentCity(THREE: ThreeModule, city: THREE.Group, departmentId: string): Animator {
  const kit = createKit(THREE, city);
  (builders[departmentId] ?? builders.sales!)(kit);
  return (seconds) => kit.animators.forEach((animate) => animate(seconds));
}

/** Ports the animated AIOS favicon (orbital arcs, chevron, prism, glow rings, particles) into the scene. */
export function createAiosEmblem(THREE: ThreeModule): { group: THREE.Group; update: Animator } {
  const group = new THREE.Group();
  const spin = new THREE.Group();
  group.add(spin);

  const arcs: THREE.Mesh[] = [];
  [
    [0x00b4d8, 0.24, 1.33, 2.45],
    [0x0077b6, 1.81, 2.9, 2.55],
    [0x2563eb, 3.38, 4.47, 2.65],
    [0x0284c7, 4.95, 6.04, 2.75],
  ].forEach(([color, start, end, inner]) => {
    const outer = inner! + 0.5;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outer, start!, end!, false);
    shape.absarc(0, 0, inner!, end!, start!, true);
    shape.closePath();
    const arc = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, { depth: 0.35, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 }),
      new THREE.MeshStandardMaterial({ color: color!, emissive: color!, emissiveIntensity: 0.3, roughness: 0.3, metalness: 0.4 }),
    );
    arc.position.z = -0.17;
    spin.add(arc);
    arcs.push(arc);
  });

  const chevronShape = new THREE.Shape();
  [[-1.25, -1.15], [0, 1.25], [1.25, -1.15], [0.8, -1.15], [0, 0.35], [-0.8, -1.15]].forEach(([x, y], index) => {
    if (index === 0) chevronShape.moveTo(x!, y!);
    else chevronShape.lineTo(x!, y!);
  });
  chevronShape.closePath();
  const chevron = new THREE.Mesh(
    new THREE.ExtrudeGeometry(chevronShape, { depth: 0.4, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 }),
    new THREE.MeshStandardMaterial({ color: 0x1d3a6b, emissive: 0x0a192f, emissiveIntensity: 0.6, roughness: 0.35, metalness: 0.5 }),
  );
  chevron.position.z = -0.2;
  spin.add(chevron);

  const prismMaterial = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1, roughness: 0.2 });
  const prism = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.7, 3), prismMaterial);
  prism.position.set(0, -0.2, 0.1);
  spin.add(prism);
  const prismLight = new THREE.PointLight(0x00f0ff, 6, 8, 2);
  prismLight.position.set(0, -0.2, 0.8);
  spin.add(prismLight);

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.025, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.7 }),
  );
  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.45, 0.02, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 }),
  );
  spin.add(innerRing, outerRing);

  const particleCount = 75;
  const positions = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2.2 + Math.random() * 1.8;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle) * radius;
    positions[index * 3 + 2] = (Math.random() - 0.5) * 1.6;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.1, transparent: true, opacity: 0.85 }),
  );
  spin.add(particles);

  group.scale.setScalar(0.4);
  group.position.y = 1.9;

  return {
    group,
    update: (seconds) => {
      spin.rotation.y = seconds * 0.5;
      group.position.y = 1.9 + Math.sin(seconds * 1.5) * 0.07;
      arcs.forEach((arc, index) => {
        arc.rotation.z = Math.sin(seconds * 0.9 + index) * 0.05;
      });
      innerRing.rotation.z = -seconds * 0.25;
      outerRing.rotation.z = seconds * 0.18;
      chevron.scale.setScalar(1 + Math.sin(seconds * 2) * 0.025);
      prismMaterial.emissiveIntensity = 0.8 + Math.sin(seconds * 3.2) * 0.3;
      particles.rotation.z = seconds * 0.12;
    },
  };
}
