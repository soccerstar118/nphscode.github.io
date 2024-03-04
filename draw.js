const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let color = [34, 139, 34]; // Green color for the fractals
let width = 2;

function getColor(x, y, mult = 1) {
  // Adjust these values to control the color gradient
  const r = Math.floor(110 + 110 * Math.sin((x ** 1.25 / 205) * mult));
  const g = Math.floor(110 + 110 * Math.sin((y / 25) * mult));
  const b = Math.floor(110 + 110 * Math.sin(((x * y) / 20005) * mult));

  return [r, g, b];
}

function setColor(r, g, b) {
  color = [r, g, b];
}

function line(ax, ay, bx, by, do_rainbow=false, mult=1) {
  if (do_rainbow)
  {
    color = getColor(ax, ay, mult);
  setColor(color[0],color[1],color[2]);
  }
  
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.closePath();
  ctx.stroke();
}

function circle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.stroke();
}

function arc(x, y, radius, startAngle, endAngle, counterclockwise = false) {
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.stroke();
}

function rect(x_low, x_high, y_low, y_high) {
  ctx.beginPath();
  ctx.rect(x_low, y_low, x_high - x_low, y_high - y_low);
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.stroke();
}

function regularPolygon(center_x, center_y, sides = 6, radius = 50, angle_offset = 0) {
  // let angle_offset = Math.random() * 2 * Math.PI;
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
      let angle = angle_offset + i * 2 * Math.PI / sides;
      let x = center_x + radius * Math.cos(angle);
      let y = center_y + radius * Math.sin(angle);
      if (i === 0) {
          ctx.moveTo(x, y);
      } else {
          ctx.lineTo(x, y);
      }
  }
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.stroke();
}

function polygon(x_array, y_array) {
  ctx.beginPath();
  for (let i = 0; i < x_array.length; i++) {
      if (i === 0) {
          ctx.moveTo(x_array[i], y_array[i]);
      } else {
          ctx.lineTo(x_array[i], y_array[i]);
      }
  }
  ctx.closePath();
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.stroke();
}


function blendColors(blend_mult, x, y, r) {
  // Get the image data for the circle
  let imageData = ctx.getImageData(x - r, y - r, r * 2, r * 2);
  let data = imageData.data;

  // Calculate the average color
  let avg_color = [0, 0, 0];
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
      if (data[i] == 255 && data[i+1] == 255 && data[i+2] == 255) {
          continue;
      }
      let px_x = (i / 4) % (r * 2) - r;
      let px_y = Math.floor(i / 4 / (r * 2)) - r;
      if (px_x * px_x + px_y * px_y <= r * r) {
          avg_color[0] += data[i];
          avg_color[1] += data[i + 1];
          avg_color[2] += data[i + 2];
          count++;
      }
  }
  avg_color = avg_color.map(v => v / count);

  // Apply the blend
  for (let i = 0; i < data.length; i += 4) {
      let px_x = (i / 4) % (r * 2) - r;
      let px_y = Math.floor(i / 4 / (r * 2)) - r;
      if (px_x * px_x + px_y * px_y <= r * r) {
          data[i] = data[i] * (1 - blend_mult) + avg_color[0] * blend_mult;
          data[i + 1] = data[i + 1] * (1 - blend_mult) + avg_color[1] * blend_mult;
          data[i + 2] = data[i + 2] * (1 - blend_mult) + avg_color[2] * blend_mult;
      }
  }

  // Put the image data back
  ctx.putImageData(imageData, x - r, y - r);
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function setRandomColor() {
  color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
}

function drawSierpinskiTriangle(x1, y1, x2, y2, x3, y3, depth) {
  if (depth === 0) {
    line(x1, y1, x2, y2);
    line(x2, y2, x3, y3);
    line(x3, y3, x1, y1);
    return;
  }

  const mid1x = (x1 + x2) / 2;
  const mid1y = (y1 + y2) / 2;
  const mid2x = (x2 + x3) / 2;
  const mid2y = (y2 + y3) / 2;
  const mid3x = (x3 + x1) / 2;
  const mid3y = (y3 + y1) / 2;

  drawSierpinskiTriangle(x1, y1, mid1x, mid1y, mid3x, mid3y, depth - 1);
  drawSierpinskiTriangle(mid1x, mid1y, x2, y2, mid2x, mid2y, depth - 1);
  drawSierpinskiTriangle(mid3x, mid3y, mid2x, mid2y, x3, y3, depth - 1);
}


function dragonCurve(x1, y1, x2, y2, depth) {
  if (depth === 0) {
    line(x1, y1, x2, y2);
    return;
  }

  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  const x3 = 0.5 * (x1 + x2) - 0.5 * deltaY;
  const y3 = 0.5 * (y1 + y2) + 0.5 * deltaX;

  dragonCurve(x1, y1, x3, y3, depth - 1);
  dragonCurve(x3, y3, x2, y2, depth - 1);
}

function drawNGonFractal(
  centerX,
  centerY,
  sides,
  size,
  depth,
  angle_0 = 0,
  mult = 1
) {
  const vertices = [];

  // Calculate the vertices of the regular n-gon
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides + angle_0;
    const x = centerX + size * Math.cos(angle);
    const y = centerY + size * Math.sin(angle);
    vertices.push({ x, y });
  }

  // Draw the initial n-gon
  for (let i = 0; i < sides; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % sides];

    line(p1.x, p1.y, p2.x, p2.y, true,mult);
  }

  // Recursively draw fractals between each pair of vertices
  if (depth > 0) {
    for (let i = 0; i < sides; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % sides];
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      const deltaX = p2.x - p1.x;
      const deltaY = p2.y - p1.y;

      const newX = midX + (deltaY / 2) * Math.sqrt(3);
      const newY = midY - (deltaX / 2) * Math.sqrt(3);

      drawNGonFractal(newX, newY, sides, size / 2, depth - 1, angle_0, mult);
    }
  }
}

function dist(x1,y1,x2,y2) {
  return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function convert(x1,y1,x2,y2,mult=0.5) {
  let midX = (x1+x2)/2;
  let midY = (y1+y2)/2;
  
  lenS = dist(x1,y1,x2,y2);
  
  let unitPerp = [(y1-y2)/lenS,(x2-x1)/lenS]
  // algebraically let d - dist from line
  
  let angle = Math.abs(mult)*Math.PI/2;
  let d = lenS / (2*Math.tan(angle));
  
  let offX = unitPerp[0]*d;
  let offY = unitPerp[1]*d;
  
  let cx = offX+midX;
  let cy = offY+midY;

  if (mult<0) {
    cx = -offX + midX;
    cy = -offY + midY;
  }

  let radius = d / Math.cos(angle);
  
  // angle is half the full angle
  
  let start_angle = Math.atan2(y1-cy,x1-cx);
  let end_angle = Math.atan2(y2-cy,x2-cx);
  
  if (mult < 0) {
    let temp = end_angle;
    end_angle = start_angle;
    start_angle = temp;
  }

  return [cx,cy,radius,start_angle,end_angle];
}

function curvedLine(x1,y1,x2,y2,mult,flip=false) {
  let k = 0;
  if (flip)
  {
    k = convert(x1,y1,x2,y2,mult);
  }
  else
  {
    k = convert(x2,y2,x1,y1,mult);
  }
  arc(k[0],k[1],k[2],k[3],k[4]);
}

function fractalTree(x, y, length, angle, depth, k=0.7) {
  if (depth === 0) {
    return;
  }

  const x2 = x + length * Math.cos(angle);
  const y2 = y + length * Math.sin(angle);

  // Draw the current branch
  line(x,y,x2,y2,true)

  // Recursively draw two sub-branches
  fractalTree(x2, y2, length * k, angle - Math.PI / 4, depth - 1,k);
  fractalTree(x2, y2, length * k, angle + Math.PI / 4, depth - 1,k);
}

function kochSnowflakeSegment(x1, y1, x2, y2, depth) {
  if (depth === 0) {
    line(x1, y1, x2, y2,true);
    return;
  }

  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  const x3 = x1 + deltaX / 3;
  const y3 = y1 + deltaY / 3;

  const x4 = (x1 + x2) / 2 + (Math.sqrt(3) / 6) * (y1 - y2);
  const y4 = (y1 + y2) / 2 + (Math.sqrt(3) / 6) * (x2 - x1);

  const x5 = x1 + 2 * deltaX / 3;
  const y5 = y1 + 2 * deltaY / 3;

  kochSnowflakeSegment(x1, y1, x3, y3, depth - 1);
  kochSnowflakeSegment(x3, y3, x4, y4, depth - 1);
  kochSnowflakeSegment(x4, y4, x5, y5, depth - 1);
  kochSnowflakeSegment(x5, y5, x2, y2, depth - 1);
}

// Glorious circle
function example1() {
  for (i = 0; i < 17; i++) {
    drawNGonFractal(400, 300, 7, 50, 2, 0.2 * i, 0.3);
  }
}

// Helm
function example2() {
  for (i = 0; i < 17; i++) {
    drawNGonFractal(400, 300, 2, 50, 5, 0.2 * i, 0.2);
  }
}

// Triangle but Circle
function example3() {
  for (i = 0; i < 17; i++) {
    drawNGonFractal(400, 300, 3, 100, 3, 0.2 * i, 0.2);
  }
}

// IDK
function example4() {
  for (i = 0; i < 17; i++) {
    drawNGonFractal(400 - 10 * i, 20 * i + 150, 2, 70, 4, 0.2 * i, 0.7);
  }
}

// why
function example5() {
    let reduc = .3;
    for (i = 0; i < 74*reduc; i=i+reduc) {
        drawNGonFractal(400, 10 * i + 200, 3, 150*reduc*1.5, 2, 0.1 * i, 0.7);
    }
}

// Gradient Serpinski's Triangle
function example6() {
    for (i = 0; i < 1; i++) {
        drawNGonFractal(400, 400, 3, 100, 7, 0.2 * i+180*3.14/360, 0.7);
    }
}

// Nice fractal square grid
// Set loop to not be 1, to rotate onto itself
function example7() {
  for (i = 0; i < 1; i++) {
      drawNGonFractal(400, 300, 4, 75, 5, 3.14/360 * i*37+180*3.14/360, 0.2);
    }
}

// antenna...?
function example8(x=400,y=300,d=75) {
  for (i = 0; i < 75; i++) {
      drawNGonFractal(x, y, 2, d, 0.5*Math.floor(d*0.053)+3, 3.14/360 * i*1+180*3.14/360, 0.2);
    }
}

// jittery triangle fractal
function example9() {
    for (i = 0; i < 20; i++) {
        drawNGonFractal(400, 300, 3, 75, 5, 3.14/360 * i*1+180*3.14/360, 0.2);
    }
}


// fractal tree!
// Try with n=19
function example10(n=13) {
    fractalTree(400, 600, 200, -Math.PI / 2, n);
}

// flower ... hexagon?
function example11() {
  for (i=0; i<75; i++) {
    col = getColor(i*3,i*2);
    setColor(col[0],col[1],col[2]);
    regularPolygon(center_x=400+i, center_y=300, sides = 6, radius = 50+i*3, angle_offset = 0+3*i*6.28/360)
  }
}

// cone
function example12() {
    for (i=0; i<35; i=i+0.3) {
        color = getColor(400, 500-20*i, mult = 0.25);
        regularPolygon(center_x=200, center_y=500-10*i, sides = 14, radius = i*4, angle_offset = 0+6*i*6.28/360);
    }
}

// shard
function example13(x=400,y=300) {
    for (i=0; i<35; i=i+0.1) {
        let temp = 128+Math.round(126*Math.sin(-i*2*Math.PI/35));
        setColor(temp*0.32,temp*0.89,temp+60);
        regularPolygon(center_x=x, center_y=y-10*i+230, sides = 2, radius = i*3, angle_offset = 0+2.*i*6.28/360);
    }
}



function clear() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.lineWidth = width;
}
