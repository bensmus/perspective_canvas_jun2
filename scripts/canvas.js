const canvas = document.getElementById('my_canvas')
const ctx = canvas.getContext('2d')
canvas.height = window.innerHeight
canvas.width = window.innerWidth

// sorted array of square objects (sorted by z, largest z first)
let squares = []

function screen_x(x) {
    return canvas.width * (x / 2 + 0.5)
}

function screen_y(y) {
    return canvas.height * (y / 2 + 0.5)
}

function screen_edge(edge) {
    return canvas.height * (edge / 2)
}

function insert(ar, index, elem) {
    ar.splice(index, 0, elem)
}

function queuesquare(square) {
    for (let i = 0; i < squares.length; i++) {
        if (square.z > squares[i].z) {
            insert(squares, i, square)
            return
        }
    }
    squares.push(square) // smallest z
}

export function canvas_clear() {
    squares = []
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

export function canvas_drawsquare(square) {
    const sx = screen_x(square.left)
    const sy = screen_y(square.top)
    const se = screen_edge(square.edge)
    queuesquare({...square, left: sx, top: sy, edge: se})
}

export function canvas_update() {
    squares.forEach(square => {
        ctx.fillStyle = `rgb(${square.rgb.r}, ${square.rgb.g}, ${square.rgb.b})`
        ctx.fillRect(square.left, square.top, square.edge, square.edge)
    })
}
