const canvas = document.getElementById('my_canvas')
const ctx = canvas.getContext('2d')
canvas.height = window.innerHeight
canvas.width = window.innerWidth

// sorted array of rect objects (sorted by z, largest z first)
let rects = []

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

function insert(ar, index, elem) {
    ar.splice(index, 0, elem)
}

function queuerect(rect) {
    for (let i = 0; i < rects.length; i++) {
        if (rect.z > rects[i].z) {
            insert(rects, i, rect)
            return
        }
    }
    rects.push(rect) // smallest z
}

export function canvas_clear() {
    rects = []
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

export function canvas_drawrect(rect) {
    const sx = screen_x(rect.left)
    const sy = screen_y(rect.top)
    const sw = screen_h(rect.width)
    const sh = screen_w(rect.height)
    queuerect({...rect, left: sx, top: sy, width: sw, height: sh})
}

export function canvas_update() {
    rects.forEach(rect => {
        ctx.fillStyle = `rgb(${rect.rgb.r}, ${rect.rgb.g}, ${rect.rgb.b})`
        ctx.fillRect(rect.left, rect.top, rect.width, rect.height)
    })
}
