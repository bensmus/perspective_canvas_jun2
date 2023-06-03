const canvas = document.getElementById('my_canvas')
const ctx = canvas.getContext('2d')
canvas.height = window.innerHeight
canvas.width = window.innerWidth

function canvas_blackscreen() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function screen_x(x) {
    return canvas.width * (x / 2 + 0.5)
}

function screen_y(y) {
    return canvas.height * (y / 2 + 0.5)
}

function screen_h(h) {
    return canvas.height * (h / 2)
}

// copied from: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately/54024653#54024653 (Kamil Kiełczewski)
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
function hsv2rgb(h,s,v) 
{                              
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];       
}   

function canvas_drawpole({x: x, y: y, h: h, bright: bright, color: color}) {
    const sx = screen_x(x)
    const sy = screen_y(y)
    const sh = screen_h(h)
    const [r, g, b] = hsv2rgb(color.h, color.s, color.v * bright)
    ctx.fillStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`
    ctx.fillRect(sx, sy, 2, sh)
}
