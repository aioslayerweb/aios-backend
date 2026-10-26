"use client";

import * as React from "react";
import type * as THREE from "three";
import { buildDepartmentCity, createAiosEmblem } from "./department-city-builders";
import { Building2, RotateCcw, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CityDepartment = {
  id: string;
  label: string;
  signal: string;
  health: string;
  accent: string;
  tone: string;
  edge: string;
  Icon: LucideIcon;
};

type DepartmentConnection = {
  from: string;
  to: string;
  relationship: string;
};

type ThreeModule = typeof import("three");

type CitySceneRuntime = {
  canvas: HTMLCanvasElement;
  setSelectedDepartment: (id: string) => void;
  setSynapsesVisible: (visible: boolean) => void;
  reset: () => void;
  dispose: () => void;
};

const departmentPositions: Record<string, [number, number]> = {
  sales: [0, -8.8],
  marketing: [-8, -4.4],
  customers: [8, -4.4],
  finance: [-8, 4.4],
  operations: [8, 4.4],
  product: [0, 8.8],
};

function createCityScene(
  THREE: ThreeModule,
  mount: HTMLDivElement,
  departments: CityDepartment[],
  connections: DepartmentConnection[],
  onSelect: (id: string) => void,
): CitySceneRuntime {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });

  try {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-12, 12, 12, -12, 0.1, 100);
    camera.position.set(0, 20, 31);
    camera.lookAt(0, 0.8, 0);

    scene.add(new THREE.HemisphereLight(0xf2f8ff, 0x58705e, 2));
    const keyLight = new THREE.DirectionalLight(0xfff2d8, 2.3);
    keyLight.position.set(-12, 22, 12);
    scene.add(keyLight);

    const world = new THREE.Group();
    scene.add(world);

    const hitMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      colorWrite: false,
      depthWrite: false,
    });
    const cityAnimators: Array<(seconds: number) => void> = [];
    const interactionTargets: THREE.Mesh[] = [];
    const selectionRings = new Map<string, THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>>();
    const cityGroups = new Map<string, THREE.Group>();
    const synapseGroup = new THREE.Group();
    const pulseMarkers: Array<{ curve: THREE.QuadraticBezierCurve3; marker: THREE.Mesh; offset: number }> = [];
    world.add(synapseGroup);

    departments.forEach((department, index) => {
      const position = departmentPositions[department.id];
      if (!position) return;

      const city = new THREE.Group();
      city.position.set(position[0], 0, position[1]);
      city.userData = {
        baseY: 0,
        floatPhase: index * 1.1,
        hoverScale: 1,
        targetScale: 1,
      };
      world.add(city);

      const ringMaterial = new THREE.MeshBasicMaterial({
        color: department.accent,
        transparent: true,
        opacity: 0.38,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.38, 0.055, 7, 40), ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.29;
      city.add(ring);
      selectionRings.set(department.id, ring);
      cityGroups.set(department.id, city);

      cityAnimators.push(buildDepartmentCity(THREE, city, department.id));

      const badgeCanvas = document.createElement("canvas");
      badgeCanvas.width = 420;
      badgeCanvas.height = 128;
      const badgeContext = badgeCanvas.getContext("2d");
      if (!badgeContext) throw new Error("Unable to create department city label.");
      badgeContext.fillStyle = "rgba(255, 255, 255, 0.94)";
      badgeContext.beginPath();
      badgeContext.roundRect(8, 8, 404, 112, 24);
      badgeContext.fill();
      badgeContext.strokeStyle = department.accent;
      badgeContext.lineWidth = 4;
      badgeContext.stroke();
      badgeContext.fillStyle = department.accent;
      badgeContext.beginPath();
      badgeContext.arc(40, 49, 10, 0, Math.PI * 2);
      badgeContext.fill();
      badgeContext.fillStyle = "#0f172a";
      badgeContext.font = "700 28px system-ui, sans-serif";
      badgeContext.fillText(department.label.toUpperCase(), 66, 55, 325);
      badgeContext.fillStyle = "#475569";
      badgeContext.font = "500 21px system-ui, sans-serif";
      badgeContext.fillText(department.health, 66, 91, 325);
      const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
      badgeTexture.colorSpace = THREE.SRGBColorSpace;
      const badge = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: badgeTexture,
          transparent: true,
          depthTest: false,
        }),
      );
      badge.scale.set(4.6, 1.4, 1);
      badge.position.set(0, 4.5, 0);
      city.add(badge);

      const hitTarget = new THREE.Mesh(new THREE.SphereGeometry(2.15, 12, 8), hitMaterial);
      hitTarget.position.y = 1.25;
      hitTarget.userData.targetId = department.id;
      city.add(hitTarget);
      interactionTargets.push(hitTarget);
    });

    const core = new THREE.Group();
    world.add(core);
    const coreBase = new THREE.Mesh(
      new THREE.CylinderGeometry(2.05, 2.3, 0.42, 36),
      new THREE.MeshStandardMaterial({ color: 0xe3edf6, roughness: 0.45, metalness: 0.08 }),
    );
    coreBase.position.y = 0.34;
    core.add(coreBase);

    const corePlatform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.42, 1.58, 0.3, 32),
      new THREE.MeshStandardMaterial({ color: 0x203c59, roughness: 0.36, metalness: 0.25 }),
    );
    corePlatform.position.y = 0.68;
    core.add(corePlatform);

    const emblem = createAiosEmblem(THREE);
    core.add(emblem.group);

    const coreTarget = new THREE.Mesh(new THREE.SphereGeometry(1.38, 16, 10), hitMaterial);
    coreTarget.position.y = 1.12;
    coreTarget.userData.targetId = "__core";
    core.add(coreTarget);
    interactionTargets.push(coreTarget);

    const cityById = new Map(departments.map((department) => [department.id, department]));
    const addConnection = (from: THREE.Vector3, to: THREE.Vector3, color: string, offset: number) => {
      const midpoint = from.clone().lerp(to, 0.5);
      midpoint.y += 1.5 + offset;
      const curve = new THREE.QuadraticBezierCurve3(from, midpoint, to);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(28)),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.36 }),
      );
      synapseGroup.add(line);
      return curve;
    };

    departments.forEach((department, index) => {
      const position = departmentPositions[department.id];
      if (!position) return;
      const curve = addConnection(
        new THREE.Vector3(0, 1.05, 0),
        new THREE.Vector3(position[0] * 0.84, 0.8, position[1] * 0.84),
        department.accent,
        0.45,
      );
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 7, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      );
      synapseGroup.add(marker);
      pulseMarkers.push({ curve, marker, offset: index / departments.length });
    });

    connections.forEach(({ from, to }) => {
      const source = cityById.get(from);
      const target = cityById.get(to);
      const sourcePosition = departmentPositions[from];
      const targetPosition = departmentPositions[to];
      if (!source || !target || !sourcePosition || !targetPosition) return;
      addConnection(
        new THREE.Vector3(sourcePosition[0] * 0.82, 0.55, sourcePosition[1] * 0.82),
        new THREE.Vector3(targetPosition[0] * 0.82, 0.55, targetPosition[1] * 0.82),
        source.accent,
        0.1,
      );
    });

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = mediaQuery.matches;
    let isInViewport = true;
    let frameId: number | null = null;
    let selectedId = departments[0]?.id ?? "";
    let hoveredId: string | null = null;
    let targetRotationX = 0.16;
    let targetRotationY = 0;
    let drag: { pointerId: number; x: number; y: number; moved: boolean } | null = null;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "pan-y";

    const render = () => renderer.render(scene, camera);
    const setHighlight = () => {
      selectionRings.forEach((ring, id) => {
        ring.material.opacity = id === selectedId ? 0.95 : id === hoveredId ? 0.72 : 0.38;
      });
    };
    const startAnimation = () => {
      if (!isInViewport || document.hidden || reducedMotion || frameId !== null) return;
      frameId = window.requestAnimationFrame(animate);
    };
    const stopAnimation = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
    };
    const animate = (time: number) => {
      frameId = null;
      if (!isInViewport || document.hidden || reducedMotion) return;
      const seconds = time / 1000;
      world.rotation.y += (targetRotationY - world.rotation.y) * 0.07;
      world.rotation.x += (targetRotationX - world.rotation.x) * 0.07;
      if (!drag) targetRotationY += 0.00035;
      emblem.update(seconds);
      cityAnimators.forEach((animateCity) => animateCity(seconds));
      cityGroups.forEach((city) => {
        const { baseY, floatPhase } = city.userData as { baseY: number; floatPhase: number; hoverScale: number; targetScale: number };
        city.position.y = baseY + Math.sin(seconds * 0.8 + floatPhase) * 0.045;
        city.rotation.y = Math.sin(seconds * 0.24 + floatPhase) * 0.045;
        city.userData.targetScale = city === cityGroups.get(hoveredId ?? "") ? 1.07 : city === cityGroups.get(selectedId) ? 1.025 : 1;
        city.userData.hoverScale += (city.userData.targetScale - city.userData.hoverScale) * 0.1;
        city.scale.setScalar(city.userData.hoverScale);
      });
      pulseMarkers.forEach(({ curve, marker, offset }) => {
        marker.position.copy(curve.getPoint((seconds * 0.12 + offset) % 1));
      });
      render();
      frameId = window.requestAnimationFrame(animate);
    };

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      const aspect = width / height;
      const viewHeight = Math.max(20, 25 / aspect);
      camera.left = -(viewHeight * aspect) / 2;
      camera.right = (viewHeight * aspect) / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      render();
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
      world.updateMatrixWorld(true);
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(interactionTargets, false)[0]?.object;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (drag?.pointerId === event.pointerId) {
        const deltaX = event.clientX - drag.x;
        const deltaY = event.clientY - drag.y;
        drag.moved ||= Math.abs(event.clientX - drag.x) + Math.abs(event.clientY - drag.y) > 5;
        targetRotationY += deltaX * 0.008;
        targetRotationX = Math.max(-0.12, Math.min(0.78, targetRotationX - deltaY * 0.004));
        drag.x = event.clientX;
        drag.y = event.clientY;
        if (reducedMotion) {
          world.rotation.set(targetRotationX, targetRotationY, 0);
          render();
        }
        return;
      }

      const hit = updatePointer(event);
      hoveredId = typeof hit?.userData.targetId === "string" ? hit.userData.targetId : null;
      setHighlight();
      canvas.style.cursor = hoveredId ? "pointer" : "grab";
      if (reducedMotion) render();
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const wasClick = !drag.moved;
      drag = null;
      canvas.style.cursor = "grab";
      if (wasClick) {
        const targetId = updatePointer(event)?.userData.targetId;
        if (typeof targetId === "string") onSelect(targetId);
      }
    };
    const onPointerCancel = () => {
      drag = null;
      canvas.style.cursor = "grab";
    };
    const onVisibilityChange = () => {
      if (document.hidden) stopAnimation();
      else startAnimation();
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        stopAnimation();
        render();
      } else {
        startAnimation();
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("lostpointercapture", onPointerCancel);
    document.addEventListener("visibilitychange", onVisibilityChange);
    mediaQuery.addEventListener("change", onMotionChange);
    window.addEventListener("resize", resize);

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    resizeObserver?.observe(mount);
    const intersectionObserver = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          isInViewport = entry?.isIntersecting ?? true;
          if (isInViewport) startAnimation();
          else stopAnimation();
        });
    intersectionObserver?.observe(mount);

    resize();
    setHighlight();
    startAnimation();

    return {
      canvas,
      setSelectedDepartment: (id: string) => {
        selectedId = id;
        setHighlight();
        if (reducedMotion) render();
      },
      setSynapsesVisible: (visible: boolean) => {
        synapseGroup.visible = visible;
        if (reducedMotion) render();
      },
      reset: () => {
        targetRotationX = 0.16;
        targetRotationY = 0;
        if (reducedMotion) {
          world.rotation.set(targetRotationX, targetRotationY, 0);
          render();
        }
      },
      dispose: () => {
        stopAnimation();
        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerCancel);
        canvas.removeEventListener("lostpointercapture", onPointerCancel);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        mediaQuery.removeEventListener("change", onMotionChange);
        window.removeEventListener("resize", resize);
        scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Sprite || object instanceof THREE.Points)) return;
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value instanceof THREE.Texture) value.dispose();
            });
            material.dispose();
          });
        });
        renderer.dispose();
        canvas.remove();
      },
    };
  } catch (error) {
    renderer.dispose();
    throw error;
  }
}

export function DepartmentCities({
  departments,
  connections,
  selectedDepartmentId,
  onDepartmentSelect,
  onCoreSelect,
  coreOverviewOpen,
}: {
  departments: CityDepartment[];
  connections: DepartmentConnection[];
  selectedDepartmentId: string;
  onDepartmentSelect: (id: string) => void;
  onCoreSelect: () => void;
  coreOverviewOpen: boolean;
}) {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const runtimeRef = React.useRef<CitySceneRuntime | null>(null);
  const onSelectRef = React.useRef(onDepartmentSelect);
  const onCoreSelectRef = React.useRef(onCoreSelect);
  const [sceneState, setSceneState] = React.useState<"loading" | "ready" | "fallback">("loading");
  const [synapsesVisible, setSynapsesVisible] = React.useState(true);
  const selectedDepartmentIdRef = React.useRef(selectedDepartmentId);
  const synapsesVisibleRef = React.useRef(synapsesVisible);

  onSelectRef.current = onDepartmentSelect;
  onCoreSelectRef.current = onCoreSelect;
  selectedDepartmentIdRef.current = selectedDepartmentId;
  synapsesVisibleRef.current = synapsesVisible;

  React.useEffect(() => {
    let disposed = false;
    let runtime: CitySceneRuntime | null = null;
    setSceneState("loading");

    void import("three")
      .then((THREE) => {
        if (disposed || !mountRef.current) return;
        runtime = createCityScene(THREE, mountRef.current, departments, connections, (id) => {
          if (id === "__core") onCoreSelectRef.current();
          else onSelectRef.current(id);
        });
        if (disposed) {
          runtime.dispose();
          return;
        }
        runtimeRef.current = runtime;
        runtime.setSelectedDepartment(selectedDepartmentIdRef.current);
        runtime.setSynapsesVisible(synapsesVisibleRef.current);
        mountRef.current.appendChild(runtime.canvas);
        setSceneState("ready");
      })
      .catch((error: unknown) => {
        if (disposed) return;
        console.warn("The 3D Cities scene could not initialize; using the accessible department selector.", error);
        setSceneState("fallback");
      });

    return () => {
      disposed = true;
      runtimeRef.current = null;
      runtime?.dispose();
    };
  }, [connections, departments]);

  React.useEffect(() => {
    runtimeRef.current?.setSelectedDepartment(selectedDepartmentId);
  }, [selectedDepartmentId]);

  React.useEffect(() => {
    runtimeRef.current?.setSynapsesVisible(synapsesVisible);
  }, [synapsesVisible]);

  return (
    <div className="aios-demo-city-controls mt-3 min-w-0">
      <div className="aios-demo-city-toolbar mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] text-slate-600">Drag to rotate · select a city to inspect · motion adapts to your device preference.</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={synapsesVisible}
            onClick={() => setSynapsesVisible((visible) => !visible)}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold ${synapsesVisible ? "border-blue-200 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700`}
          >
            <Waves aria-hidden="true" className="h-3.5 w-3.5" />
            Synapses <span className="sr-only">{synapsesVisible ? "on" : "off"}</span>
          </button>
          <button
            type="button"
            onClick={() => runtimeRef.current?.reset()}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            Reset view
          </button>
        </div>
      </div>

      <div
        className="aios-demo-city-scene relative h-[20rem] min-w-0 overflow-hidden rounded-2xl border border-blue-100 bg-[radial-gradient(ellipse_at_50%_45%,#ffffff_0%,#e8f2fb_55%,#dceaf2_100%)] sm:h-[24rem] xl:h-[30rem] 2xl:h-[34rem]"
        role="group"
        aria-label="Interactive synthetic 3D city scene with six departments connected to the central AIOS core. Use the department buttons below to select a city."
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[url('/images/aios-waterfall-backdrop.jpeg')] bg-cover bg-center opacity-20"
        />
        <div ref={mountRef} aria-hidden="true" className="absolute inset-0" />
        {sceneState === "loading" ? (
          <div className="absolute inset-x-3 bottom-3 rounded-lg bg-white/90 px-3 py-2 text-center text-xs text-slate-600" role="status">
            Preparing the synthetic city scene…
          </div>
        ) : null}
        {sceneState === "fallback" ? (
          <div className="absolute inset-0 grid place-items-center p-4">
            <p className="max-w-xs rounded-xl border border-blue-100 bg-white/90 p-4 text-center text-sm leading-6 text-slate-700">
              3D rendering is unavailable in this browser. Select a department below to inspect its synthetic information.
            </p>
          </div>
        ) : null}
        <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-full border border-white/80 bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
          {sceneState === "ready" ? "Synthetic 3D landscape" : "Synthetic landscape"}
        </div>
        <button
          type="button"
          onClick={onCoreSelect}
          aria-expanded={coreOverviewOpen}
          aria-controls="company-wide-intelligence"
          className="aios-demo-city-core-action absolute bottom-3 right-3 z-20 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-blue-200 bg-white/90 px-3 text-xs font-semibold text-blue-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <Building2 aria-hidden="true" className="h-3.5 w-3.5" />
          AIOS overview
        </button>
      </div>

      <div className="aios-demo-city-selector mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Select a synthetic business department">
        {departments.map(({ id, label, Icon, tone, edge, signal, health }) => {
          const selected = selectedDepartmentId === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onDepartmentSelect(id)}
              className={`flex min-h-11 min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-xs ${edge} ${selected ? "ring-2 ring-blue-500 ring-offset-1" : "hover:bg-white"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700`}
              aria-label={`${label}: ${signal}; ${health}${selected ? "; selected" : ""}`}
            >
              <Icon aria-hidden="true" className={`h-4 w-4 shrink-0 ${tone}`} />
              <span className="min-w-0 break-words font-semibold leading-tight text-slate-800">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
