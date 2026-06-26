// One-off utility: remove the baked white background from the mascot PNG by
// flood-filling transparency inward from the image edges. Edge-flood (rather
// than "delete all white") preserves any white highlights inside the artwork.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const file = path.join(__dirname, "..", "public", "mascot.png");
const png = PNG.sync.read(fs.readFileSync(file));
const { width, height, data } = png;

// A pixel counts as "background" only if it's near-white AND nearly neutral
// (low saturation). The saturation check protects light-green/teal highlights
// inside the artwork from being mistaken for the white backdrop.
const WHITE = 234;
const isBG = (p) => {
  const i = p * 4;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return min >= WHITE && max - min <= 12;
};

const visited = new Uint8Array(width * height);
const stack = [];

const seed = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p] || !isBG(p)) return;
  visited[p] = 1;
  stack.push(p);
};

for (let x = 0; x < width; x++) {
  seed(x, 0);
  seed(x, height - 1);
}
for (let y = 0; y < height; y++) {
  seed(0, y);
  seed(width - 1, y);
}

let cleared = 0;
while (stack.length) {
  const p = stack.pop();
  data[p * 4 + 3] = 0; // make transparent
  cleared++;
  const x = p % width;
  const y = (p / width) | 0;
  seed(x + 1, y);
  seed(x - 1, y);
  seed(x, y + 1);
  seed(x, y - 1);
}

// Soften any remaining light fringe: pixels bordering transparency that are
// still fairly light get their alpha scaled down to kill the white halo.
const copyAlpha = Buffer.from(data);
const lightness = (p) => {
  const i = p * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
};
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = y * width + x;
    if (copyAlpha[p * 4 + 3] === 0) continue;
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    const touchesTransparent = neighbors.some(([nx, ny]) => {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) return false;
      return copyAlpha[(ny * width + nx) * 4 + 3] === 0;
    });
    if (touchesTransparent && lightness(p) > 200) {
      data[p * 4 + 3] = 60;
    }
  }
}

fs.writeFileSync(file, PNG.sync.write(png));
console.log(
  `Done. Cleared ${cleared} background pixels of ${width * height}. Output has alpha.`
);
