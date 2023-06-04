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
function vector_grid(xcount, ycount, zcount) {
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

const pole_height = 0.04
const fog_amount = 0.4

const centered_vectors = vector_grid(11, 11, 11) // cube of vectors centered around origin
Object.freeze(centered_vectors)

let transformed_vectors = vector_grid(11, 11, 11).map(({x: x, y: y, z: z}) => ({x: x, y: y, z: z + 2.2})) // cube of vectors that will be updated every time user moves world

// return pole object from 3d vector
function get_pole(v, color) {
    if (v.z > 0) {
        const pole_x = v.x / v.z
        const pole_y = v.y / v.z
        const pole_y_bottom = (v.y + pole_height) / v.z
        return {x: pole_x, y: pole_y, h: pole_y - pole_y_bottom, bright: get_brightness(v), color: color}
    }
    return null
}

function vector_distance(x, y, z) {
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2)
}

const max_distance = Math.sqrt(3)

// how bright should the pole at v be?
// based on distance to pole midpoint
function get_brightness(v) {
    const distance = vector_distance(v.x, v.y + pole_height, v.z)
    return mix(1, 1 - distance / max_distance, fog_amount)
}

// take centered vector and time and output hue (between 0 and 1)
function get_hue(v, time) {
    return vector_distance(v.x, v.y, v.z) / max_distance
}

const offset_mag_x = 0.001
const offset_mag_z = 0.002
const angle_mag = 0.003

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
    transformed_vectors = transformed_vectors.map(v => ({
        // rotation
        x: v.x * Math.cos(angle) + v.z * Math.sin(angle),
        y: v.y, 
        z: v.x * -Math.sin(angle) + v.z * Math.cos(angle)
    })).map(v => ({
        // translation
        x: v.x + offset_x, 
        y: v.y, 
        z: v.z + offset_z
    }))

    canvas_blackscreen()
    transformed_vectors.forEach((v, i) => {
        pole = get_pole(
            v, 
            {h: get_hue(centered_vectors[i], time), s: 1, v: 1}
        )
        if (pole) {
            canvas_drawpole(pole)
        }
    })

    time += tick;
}, tick)
