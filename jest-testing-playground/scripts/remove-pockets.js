// Remove specific enclosed white pockets by flood-filling transparency from
// seed points known to sit inside background (not on the character).
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const file = path.join(__dirname, "..", "public", "mascot.png");
const png = PNG.sync.read(fs.readFileSync(file));
const { width, height, data } = png;

// Seeds inside leftover background pockets (x, y in full-res coords).
const seeds = [[1059, 357]];

// Looser white test to also catch the soft fringe around the pocket.
const isWhite = (p) => {
  const i = p * 4;
  if (data[i + 3] === 0) return false;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return min >= 226 && max - min <= 20;
};

let cleared = 0;
for (const [sx, sy] of seeds) {
  const start = sy * width + sx;
  if (!isWhite(start)) {
    console.warn(`seed (${sx},${sy}) is not white — skipping`);
    continue;
  }
  const stack = [start];
  while (stack.length) {
    const p = stack.pop();
    if (data[p * 4 + 3] === 0) continue;
    if (!isWhite(p)) continue;
    data[p * 4 + 3] = 0;
    cleared++;
    const x = p % width;
    const y = (p / width) | 0;
    if (x + 1 < width) stack.push(p + 1);
    if (x - 1 >= 0) stack.push(p - 1);
    if (y + 1 < height) stack.push(p + width);
    if (y - 1 >= 0) stack.push(p - width);
  }
}

fs.writeFileSync(file, PNG.sync.write(png));
console.log(`Cleared ${cleared} pocket pixels.`);
