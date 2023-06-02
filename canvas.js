const canvas = document.getElementById('my_canvas')
const ctx = canvas.getContext('2d')
canvas.height = window.innerHeight
canvas.width = window.innerWidth

function canvas_whitescreen() {
    ctx.fillStyle = 'white'
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

function canvas_drawpole({x: x, y: y, h: h, b: b}) {
    b *= 255
    const sx = screen_x(x)
    const sy = screen_y(y)
    const sh = screen_h(h)
    console.log(x, y, sx, sy)
    ctx.fillStyle = `rgb(${b}, ${b}, ${b})`
    ctx.fillRect(sx, sy, 2, sh)
}
