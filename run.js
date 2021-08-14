let canvas, ctx, data;
let idx = 0;
let scale = 1;
let clips = [];

window.onload = () => {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  data = document.querySelector('textarea');
  parseClips(data.value.trim());
  redraw();
}

window.addEventListener('keydown', (e) => {
  if (e.keyCode == 37) {
    /* left arrow */
    if (idx > 0) idx--;
    redraw();
  } else if (e.keyCode == 39) {
    /* right arrow */
    if (idx < clips.length - 1) idx++;
    redraw();
  }
});

window.addEventListener('input', (e) => {
  parseClips(data.value.trim());
  redraw();
});

function redraw() {
  let frames = clips[idx];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let [x, y, r, color] of frames) {
    console.log(x);
    ctx.strokeStyle = color;
    ctx.fillStyle = hexToRGB(color, '0.5');
    console.log(ctx.fillStyle);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}

let hexToRGB = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return `rgba(${r}, ${g}, ${b})`;
  }
}

const dimensions_pat = /dimensions (\d+) (\d+)/;
const settings_pat = /settings (\w{2})/;
const scale_pat = /scale (.+)/;
const newframe_pat = /newframe/;
const shape_pat = /circle (\d+),(\d+) (\d+) (.+)/;

function parseClips(text) {
  clips = [];
  for (let line of text.split('\n')) {
    dimensions_match = line.match(dimensions_pat);
    settings_match = line.match(settings_pat);
    newframe_match = line.match(newframe_pat);
    shape_match = line.match(shape_pat);
    scale_match = line.match(scale_pat);

    if (dimensions_match) {
      canvas.width = dimensions_match[1];
      canvas.height = dimensions_match[2];
    } else if (scale_match) {
      console.log('scaling by', +scale_match[1]);
      scale = +scale_match[1];
      canvas.width = Math.round(canvas.width * scale);
      canvas.height = Math.round(canvas.height * scale);
    } else if (newframe_match) {
      clips.push([]);
    } else if (shape_match) {
      let [full, x, y, r, color] = shape_match;
      clips[clips.length - 1].push([+x, +y, +r, color]);
    }
  }
}
