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

function canvas_drawpole({x: x, y: y, h: h, bright: bright, color: color}) {
    bright *= 255
    const sx = screen_x(x)
    const sy = screen_y(y)
    const sh = screen_h(h)
    ctx.fillStyle = `rgb(${color.r * bright}, ${color.g * bright}, ${color.b * bright})`
    ctx.fillRect(sx, sy, 2, sh)
}
