type Stop = () => void;

type Ink = "light" | "ink";

type Tone = 0 | 1 | 2;

type Point = {
  u: number;
  v: number;
  bx: number;
  by: number;
  bz: number;
  delay: number;
  size: number;
  tone: Tone;
};

type Mark = {
  plate: HTMLCanvasElement;
  points: Point[];
};

const INK_RGB: Record<Ink, [number, number, number]> = {
  light: [247, 252, 255],
  ink: [20, 36, 92],
};

function smooth(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

function loadMark(url: string, ink: Ink): Promise<Mark> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const longest = Math.max(image.naturalWidth, image.naturalHeight);
      const scale = image.naturalWidth < 520 ? 2 : Math.min(1, 1100 / longest);
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const source = document.createElement("canvas");
      source.width = width;
      source.height = height;
      const context = source.getContext("2d", { willReadFrequently: true });
      if (!context) {
        reject(new Error("No se pudo leer el logo"));
        return;
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, width, height);
      const pixels = context.getImageData(0, 0, width, height);
      const data = pixels.data;
      const [red, green, blue] = INK_RGB[ink];
      let minX = width;
      let minY = height;
      let maxX = 0;
      let maxY = 0;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3] ?? 0;
          data[index] = red;
          data[index + 1] = green;
          data[index + 2] = blue;
          data[index + 3] = alpha;
          if (alpha > 28) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }

      const pad = 8;
      const cropX = Math.max(0, minX - pad);
      const cropY = Math.max(0, minY - pad);
      const cropW = Math.max(1, Math.min(width - cropX, maxX - minX + pad * 2));
      const cropH = Math.max(1, Math.min(height - cropY, maxY - minY + pad * 2));
      const plate = document.createElement("canvas");
      plate.width = cropW;
      plate.height = cropH;
      const plateContext = plate.getContext("2d");
      if (!plateContext) {
        reject(new Error("No se pudo preparar el logo"));
        return;
      }
      context.putImageData(pixels, 0, 0);
      plateContext.drawImage(source, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      const samples: { u: number; v: number }[] = [];
      const stride = 4;
      for (let y = cropY; y < cropY + cropH; y += stride) {
        for (let x = cropX; x < cropX + cropW; x += stride) {
          const index = (y * width + x) * 4;
          if ((data[index + 3] ?? 0) < 140) continue;
          const jx = (Math.random() - 0.5) * stride * 0.35;
          const jy = (Math.random() - 0.5) * stride * 0.35;
          samples.push({
            u: (x - cropX + jx) / cropW,
            v: (y - cropY + jy) / cropH,
          });
        }
      }

      const points = samples.map((sample, index) => {
        const tone: Tone = index % 13 === 0 ? 2 : sample.u < 0.48 ? 0 : 1;
        return {
          u: sample.u,
          v: sample.v,
          bx: sample.u - 0.5,
          by: sample.v - 0.5,
          bz: ((index * 47) % 100) / 100 - 0.5,
          delay: ((index % 19) / 19) * 0.16,
          size: 1.05 + ((index * 7) % 6) / 10,
          tone,
        };
      });
      resolve({ plate, points });
    };
    image.onerror = () => reject(new Error("No se pudo cargar el logo"));
    image.src = url;
  });
}

function mote(rgb: [number, number, number]) {
  const sprite = document.createElement("canvas");
  sprite.width = 32;
  sprite.height = 32;
  const context = sprite.getContext("2d");
  if (!context) return sprite;
  const [red, green, blue] = rgb;
  const glow = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  glow.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 1)`);
  glow.addColorStop(0.42, `rgba(${red}, ${green}, ${blue}, 0.9)`);
  glow.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
  context.fillStyle = glow;
  context.fillRect(0, 0, 32, 32);
  return sprite;
}

/** El logo de puntos da vueltas completas. Con el cursor, las partículas se unen y forman la marca. */
export async function mountParticleStage(
  canvas: HTMLCanvasElement,
  stage: HTMLElement,
  url: string,
  ink: Ink,
): Promise<Stop> {
  const { animate, motionValue } = await import("motion");
  const mark = await loadMark(url, ink);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas no disponible");
  const sprites =
    ink === "light"
      ? [mote([62, 243, 255]), mote([30, 250, 93]), mote([247, 252, 255])]
      : [mote([20, 36, 92]), mote([14, 116, 176]), mote([32, 49, 95])];

  const progress = motionValue(0);
  let hold = 0;
  let holding = false;
  let alive = true;
  let running = false;
  let frameId = 0;
  let playback: { stop: () => void } | null = null;
  let width = 0;
  let height = 0;
  let ratio = 1;

  const fit = () => {
    const nextWidth = Math.max(stage.clientWidth, 1);
    const nextHeight = Math.max(stage.clientHeight, 1);
    const nextRatio = Math.min(devicePixelRatio || 1, 2);
    if (nextWidth === width && nextHeight === height && nextRatio === ratio) return false;
    width = nextWidth;
    height = nextHeight;
    ratio = nextRatio;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    return true;
  };

  const paint = () => {
    if (!alive) return;
    fit();
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const formed = progress.get();
    const aspect = mark.plate.width / mark.plate.height;
    const boxHeight = Math.min(height * 0.92, (width * 0.86) / aspect);
    const boxWidth = boxHeight * aspect;
    const left = (width - boxWidth) / 2;
    const top = (height - boxHeight) / 2;
    const centerX = left + boxWidth / 2;
    const centerY = top + boxHeight / 2;
    const spin = performance.now() / 1000 * 0.7;
    if (formed < 0.02) {
      holding = false;
    } else if (!holding) {
      holding = true;
      hold = spin;
    }
    const wrapped = Math.atan2(Math.sin(hold), Math.cos(hold));
    const front = hold - wrapped;
    const yaw = holding ? front + (spin - front) * (1 - formed) : spin;
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);
    const thickness = boxWidth * 0.22;

    const points = mark.points;
    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      if (!point) continue;
      const gather = smooth((formed - point.delay) / 0.84);
      const x = point.bx * boxWidth;
      const y = point.by * boxHeight;
      const z = point.bz * thickness * (1 - gather);
      const xr = x * cos + z * sin;
      const zr = -x * sin + z * cos;
      const near = Math.min(1, Math.max(0, zr / thickness + 0.5));
      const drawX = centerX + xr;
      const drawY = centerY + y;
      const dust = 0.7 + gather * 0.3;
      const diameter = point.size * (1.15 + (1 - gather) * 0.55 + near * 0.15);
      const sprite = gather > 0.82 ? sprites[2] : sprites[point.tone];
      context.globalAlpha = dust;
      context.drawImage(sprite ?? sprites[0], drawX - diameter, drawY - diameter, diameter * 2, diameter * 2);
    }
    context.globalAlpha = 1;
  };

  const loop = () => {
    if (!alive || !running) return;
    paint();
    frameId = requestAnimationFrame(loop);
  };

  const play = () => {
    if (running) return;
    running = true;
    loop();
  };

  const pause = () => {
    running = false;
    cancelAnimationFrame(frameId);
  };

  const seek = (target: number) => {
    playback?.stop();
    playback = animate(progress, target, {
      duration: target === 1 ? 3.2 : 2.6,
      ease: [0.4, 0, 0.2, 1],
    });
  };

  const onEnter = () => seek(1);
  const onLeave = () => seek(0);
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canHover) {
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) play();
      else pause();
    },
    { threshold: 0.15 },
  );
  observer.observe(stage);

  const resize = new ResizeObserver(() => {
    fit();
  });
  resize.observe(stage);

  return () => {
    alive = false;
    pause();
    playback?.stop();
    stage.removeEventListener("pointerenter", onEnter);
    stage.removeEventListener("pointerleave", onLeave);
    observer.disconnect();
    resize.disconnect();
  };
}
