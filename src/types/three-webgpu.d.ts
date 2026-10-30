declare module "three/webgpu" {
  export * from "three";
  export class WebGPURenderer {
    constructor(parameters?: { canvas?: HTMLCanvasElement; antialias?: boolean });
    init(): Promise<void>;
    setPixelRatio(value: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    outputColorSpace: string;
    render(scene: import("three").Scene, camera: import("three").Camera): void;
    dispose(): void;
  }
  export class MeshBasicNodeMaterial extends import("three").Material {
    constructor(parameters?: { toneMapped?: boolean });
    toneMapped: boolean;
    colorNode: unknown;
    positionNode: unknown;
    map: import("three").Texture | null;
    transparent: boolean;
    opacity: number;
  }
}

declare module "three/tsl" {
  export function attribute(name: string): TslNode;
  export function cos(value: TslNode): TslNode;
  export function sin(value: TslNode): TslNode;
  export function mix(a: TslNode, b: TslNode, t: TslNode): TslNode;
  export function uniform(value: number): TslNode;
  export function vec3(...values: unknown[]): TslNode;
  export const positionLocal: TslNode;
  export const time: TslNode;
}

interface TslNode {
  mul(value: unknown): TslNode;
  add(value: unknown): TslNode;
  xy: TslNode;
  value: number;
}
