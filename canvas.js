const canvas = document.getElementById('my_canvas')
const ctx = canvas.getContext('2d')
canvas.height = window.innerHeight
canvas.width = window.innerWidth

let zbuffer = new_zbuffer()

function canvas_clear() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    zbuffer = new_zbuffer()
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

function screen_w(w) {
    return canvas.width * (w / 2)
}

// copied from: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately/54024653#54024653 (Kamil Kiełczewski)
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
function hsv2rgb({h: h, s: s, v: v}) {                              
    let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
    return {r: f(5), g: f(3), b: f(1)};       
}   

function canvas_drawrect(rect, hsv) {
    const sx = screen_x(rect.left)
    const sy = screen_y(rect.top)
    const sw = screen_h(rect.width)
    const sh = screen_w(rect.height)
    const rgb = hsv2rgb(hsv)
    // ctx.fillStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`
    // ctx.fillRect(sx, sy, 10, sh)
    
    // draw_rect({left: sx, top: sy, width: 10, height: h}, {r: r * 255, g: g * 255, b: b * 255}, zbuffer, ctx)
    draw_rect({left: sx, top: sy, width: sw, height: sh, z: rect.z}, rgb, zbuffer, ctx)
}

function new_zbuffer() {
    const zbuffer = []
    for (let j = 0; j < canvas.height; j++) {
        zbuffer.push(Array(canvas.width))
        for (let i = 0; i < canvas.width; i++) {
            zbuffer[j][i] = Infinity
        }
    }
    return zbuffer
}

// update canvas and zbuffer with rectangle
function draw_rect(rect, rgb, zbuffer, ctx) {
    const img_data = ctx.getImageData(rect.left, rect.top, rect.width, rect.height) // same size as rectangle
    // loop through all rectangle pixels
    for (let i = 0; i < rect.width; i++) {
        for (let j = 0; j < rect.height; j++) {
            // array index must be integer
            const zbuffer_x = Math.round(rect.left + i)
            const zbuffer_y = Math.round(rect.top + j)
            if (zbuffer_x > 0 && zbuffer_x < canvas.width && zbuffer_y > 0 && zbuffer_y < canvas.height) { // rectangle pixel exists on screen
                const zbuffer_val = zbuffer[zbuffer_y][zbuffer_x]
                // selectively draw rectangle's pixels if they pass depth check
                if (rect.z <= zbuffer_val) {
                    zbuffer[zbuffer_y][zbuffer_x] = rect.z
                    img_data_pxset(img_data, i, j, rgb)
                }
            }
        }
    }
    ctx.putImageData(img_data, rect.left, rect.top)
}

function img_data_pxset(img_data, i, j, rgb) {
    const r_index = (j * img_data.width + i) * 4
    img_data.data[r_index] = rgb.r * 255
    img_data.data[r_index + 1] = rgb.g * 255
    img_data.data[r_index + 2] = rgb.b * 255
    img_data.data[r_index + 3] = 255
}
