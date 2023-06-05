// --------- Keep track of what keys are pressed ------------ //
const keyboard_pressed = new Map([['w', false], ['s', false], ['d', false], ['a', false], ['e', false], ['q', false]])

document.addEventListener('keydown', (ev) => {
    if (keyboard_pressed.has(ev.key)) {
        keyboard_pressed.set(ev.key, true)
    }
})

document.addEventListener('keyup', (ev) => {
    if (keyboard_pressed.has(ev.key)) {
        keyboard_pressed.set(ev.key, false)
    }
})
// ---------------------------------------------------------- //

function mix(a, b, w) {
    return a + (b - a) * w    
}

function rand_range(min, max) {
    return mix(min, max, Math.random())
}

// spawn vectors from which poles eminate
function vector_grid({x: xcount, y: ycount, z: zcount}) {
    const vectors = Array(xcount * ycount )
    const xinc = 2 / (xcount - 1)
    const yinc = 2 / (ycount - 1)
    const zinc = 2 / (zcount - 1)
    for (let i = 0; i < xcount; i++) {
        for (let j = 0; j < ycount; j++) {
            for (let k = 0; k < zcount; k++) {
                vectors[k * ycount * xcount + (ycount * j + i)] = {
                    x: -1 + xinc * i, 
                    y: -1 + yinc * j, 
                    z: -1 + zinc * k
                }
            }
        }
    }
    return vectors
}

const rect_height = 0.04
const rect_width = 0.04
const fog_amount = 0.4

const grid_res = {x: 11, y: 11, z: 11} // good value 11, 11, 11
const centered_vectors = vector_grid(grid_res) // cube of vectors centered around origin
Object.freeze(centered_vectors)

let transformed_vectors = vector_grid(grid_res).map(({x: x, y: y, z: z}) => ({x: x, y: y, z: z + 2.2})) // cube of vectors that will be updated every time user moves world

// return rect object from 3d vector
// rect object coordinates are not canvas-size-specific
function get_rect(v) {
    if (v.z > 0) {
        const rect_x = v.x / v.z
        const rect_y = v.y / v.z
        const rect_x_right = (v.x + rect_width) / v.z
        const rect_y_bottom = (v.y + rect_height) / v.z
        return {
            left: rect_x, 
            top: rect_y, 
            width: rect_x_right - rect_x,
            height: rect_y_bottom - rect_y,
            z: v.z, // used by z-buffer
        }
    }
    return null
}

function vector_distance(x, y, z) {
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2)
}

const max_distance = Math.sqrt(3)

// how bright should the rect at v be?
// based on distance to rect midpoint
function get_hsv_value(vector) {
    const distance = vector_distance(vector.x, vector.y + rect_height, vector.z)
    return mix(1, 1 - distance / max_distance, fog_amount)
}

// take centered vector and time and output hue (between 0 and 360)
function get_hsv_hue(vector, time) {
    const dist_frac = vector_distance(vector.x, vector.y, vector.z) / max_distance
    const hue = 360 * ((Math.sin(time / 5000) + dist_frac) / 2) ** 2
    return hue
}

const offset_mag_x = 0.01
const offset_mag_z = 0.02
const angle_mag = 0.03

let time = 0
const tick = 10

setInterval(() => {
    let offset_x = 0
    let offset_z = 0
    let angle = 0

    if (keyboard_pressed.get('w')) {
        offset_z -= offset_mag_z
    } 
    if (keyboard_pressed.get('s')) {
        offset_z += offset_mag_z
    }
    if (keyboard_pressed.get('d')) {
        offset_x -= offset_mag_x
    }
    if (keyboard_pressed.get('a')) {
        offset_x += offset_mag_x
    }
    if (keyboard_pressed.get('q')) {
        angle += angle_mag
    }
    if (keyboard_pressed.get('e')) {
        angle -= angle_mag
    }
    
    // transformations
    transformed_vectors = transformed_vectors.map(vector => ({
        // rotation
        x: vector.x * Math.cos(angle) + vector.z * Math.sin(angle),
        y: vector.y, 
        z: vector.x * -Math.sin(angle) + vector.z * Math.cos(angle)
    })).map(vector => ({
        // translation
        x: vector.x + offset_x, 
        y: vector.y, 
        z: vector.z + offset_z
    }))

    canvas_clear()
    transformed_vectors.forEach((vector, i) => {
        const color = {h: get_hsv_hue(centered_vectors[i], time), s: 1, v: get_hsv_value(vector)}
        rect = get_rect(vector)
        if (rect) {
            canvas_drawrect(rect, color)
        }
    })
    canvas_update()
    time += tick;
}, tick)
